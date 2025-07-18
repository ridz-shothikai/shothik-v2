// services/sheetAiStreamService.js
class SheetAiStreamService {
  constructor() {
    this.eventSource = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
    this.isManuallyDisconnected = false;
    this.conversationId = null;
    this.callbacks = {};
    this.abortController = null;
  }

  async startConversationStream(conversationId, chatId, prompt, userEmail, callbacks = {}) {
    this.conversationId = conversationId;
    this.callbacks = callbacks;
    this.isManuallyDisconnected = false;
    this.abortController = new AbortController();
    
    try {
      // Use fetch with streaming instead of EventSource
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/sheet/conversation/create-stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          chatId,
          prompt,
          userEmail
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle the streaming response
      await this.handleStreamingResponse(response);
      
      return { success: true };
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream was aborted');
        return { success: false, error: 'Stream aborted' };
      }
      
      console.error('Failed to start conversation stream:', error);
      this.callbacks.onError?.(error);
      return { success: false, error: error.message };
    }
  }

  async handleStreamingResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      // Signal connection opened
      this.callbacks.onOpen?.();
      this.reconnectAttempts = 0;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream completed');
          this.callbacks.onComplete?.({ type: 'stream_ended' });
          break;
        }

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === '') continue;

          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              this.callbacks.onComplete?.({ type: 'completion' });
              return;
            }
            
            if (data && data !== '') {
              try {
                const parsedData = JSON.parse(data);
                this.handleMessage(parsedData);
              } catch (parseError) {
                console.error('Failed to parse SSE data:', parseError);
                this.callbacks.onError?.({ 
                  type: 'parse_error', 
                  error: parseError.message 
                });
              }
            }
          } else if (line.startsWith('event: ')) {
            // Handle event type if needed
            const eventType = line.slice(7).trim();
            console.log('Event type:', eventType);
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream reading was aborted');
        return;
      }
      
      console.error('Error reading stream:', error);
      this.callbacks.onError?.(error);
      
      if (!this.isManuallyDisconnected) {
        this.handleReconnect();
      }
    } finally {
      reader.releaseLock();
    }
  }

  handleMessage(data) {
    const { type, ...payload } = data;

    switch (type) {
      case 'connection':
        console.log('Connection established:', payload);
        this.callbacks.onConnection?.(payload);
        break;
      case 'progress':
        this.callbacks.onProgress?.(payload);
        break;
      case 'data':
        this.callbacks.onData?.(payload);
        break;
      case 'logs':
        this.callbacks.onLogs?.(payload);
        break;
      case 'sheet_update':
        this.callbacks.onSheetUpdate?.(payload);
        break;
      case 'completion':
        this.callbacks.onComplete?.(payload);
        this.disconnect();
        break;
      case 'error':
        this.callbacks.onError?.(payload);
        break;
      default:
        console.log('Received message:', data);
        this.callbacks.onMessage?.(data);
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isManuallyDisconnected) {
      this.reconnectAttempts++;
      const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        if (!this.isManuallyDisconnected) {
          this.callbacks.onReconnecting?.();
          // You would need to store the original parameters to reconnect
          // This is a simplified version - you might want to store these params
          console.log('Reconnection would happen here');
        }
      }, delay);
    } else {
      console.log('Max reconnection attempts reached');
      this.callbacks.onMaxReconnectAttemptsReached?.();
    }
  }

  disconnect() {
    this.isManuallyDisconnected = true;
    
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    
    this.callbacks.onDisconnect?.();
  }

  // Method to stop/cancel a conversation
  async stopConversation(conversationId) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/sheet/conversation/stop/${conversationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.disconnect();
      return result;
    } catch (error) {
      console.error('Failed to stop conversation:', error);
      throw error;
    }
  }

  // Health check method
  async healthCheck() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/sheet/health`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get connection status
  getConnectionState() {
    if (!this.abortController) return 'disconnected';
    if (this.abortController.signal.aborted) return 'disconnected';
    return 'connected';
  }
}

// Singleton instance
const sheetAiStreamService = new SheetAiStreamService();

export default sheetAiStreamService;