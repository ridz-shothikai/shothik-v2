// api/sheetApiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sheetApiSlice = createApi({
  reducerPath: "sheetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sheetai.pixigenai.com/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("sheetai-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["ChatHistory", "MyChats"],
  endpoints: (builder) => ({
    getChatHistory: builder.query({
      query: (chatId) => `/conversation/get_chat_conversations/${chatId}`,
      providesTags: ["ChatHistory"],
      // Transform the response to include completion status and proper state detection
      transformResponse: (response) => {
        if (!response || response.length === 0) {
          return {
            conversations: [],
            isIncomplete: false,
            lastConversationId: null,
            shouldSetGenerating: false,
            recommendedStatus: "idle",
          };
        }

        const lastConversation = response[response.length - 1];
        let isIncomplete = false;
        let shouldSetGenerating = false;
        let recommendedStatus = "idle";

        if (lastConversation) {
          const hasResponse = Boolean(lastConversation.response?.rows);
          const events = lastConversation.events || [];

          // Check for completion indicators
          const isCompleted = events.some(
            (event) =>
              event.step === "completed" ||
              event.message?.toLowerCase().includes("completed successfully")
          );

          // Check for failure indicators
          const isFailed = events.some(
            (event) =>
              event.step === "failed" ||
              event.step === "error" ||
              event.step === "validation_error" ||
              event.message?.toLowerCase().includes("failed") ||
              event.message?.toLowerCase().includes("error")
          );

          // Check for cancellation indicators
          const isCancelled = events.some(
            (event) =>
              event.step === "cancelled" ||
              event.message?.toLowerCase().includes("cancelled")
          );

          // Determine if generation is incomplete/in-progress
          if (!isCompleted && !isFailed && !isCancelled) {
            // If we have events but no completion markers, it's likely in progress
            if (events.length > 0 && !hasResponse) {
              isIncomplete = true;
              shouldSetGenerating = true;
              recommendedStatus = "generating";
            }
            // If no events and no response, it might be a new/pending conversation
            else if (events.length === 0 && !hasResponse) {
              isIncomplete = true;
              shouldSetGenerating = true;
              recommendedStatus = "generating";
            }
          } else if (isCompleted && hasResponse) {
            recommendedStatus = "completed";
          } else if (isFailed) {
            recommendedStatus = "error";
          } else if (isCancelled) {
            recommendedStatus = "cancelled";
          }
        }

        return {
          conversations: response,
          isIncomplete,
          shouldSetGenerating,
          recommendedStatus,
          lastConversationId: lastConversation?._id,
          lastConversation: {
            id: lastConversation?._id,
            hasResponse: Boolean(lastConversation?.response?.rows),
            eventsCount: lastConversation?.events?.length || 0,
            isCompleted:
              lastConversation?.events?.some((e) => e.step === "completed") ||
              false,
          },
        };
      },
    }),
    getMyChats: builder.query({
      query: () => "/chat/get_my_chats",
      providesTags: ["MyChats"],
    }),
  }),
});

export const { useGetChatHistoryQuery, useGetMyChatsQuery } = sheetApiSlice;
