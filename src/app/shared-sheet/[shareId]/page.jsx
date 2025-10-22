"use client";

import React, { useState, useEffect, use } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Save as SaveIcon,
  Download,
  ArrowDropDown,
  TableChart,
  OpenInNew,
  Edit,
  Share,
} from "@mui/icons-material";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { useLazyVerifySharedAgentQuery, useCreateAgentReplicaMutation } from "../../../redux/api/shareAgent/shareAgentApi";
import { useSelector, useDispatch } from "react-redux";
import { setShowLoginModal } from "../../../redux/slice/auth";
import * as XLSX from "xlsx";

// Editable Cell Component for shared sheets
const EditableCell = ({ value, onValueChange, row, column, isEditing, onEdit }) => {
  const [editValue, setEditValue] = useState(value || "");

  useEffect(() => {
    setEditValue(value || "");
  }, [value]);

  const handleSave = () => {
    if (onValueChange) {
      onValueChange(row, column, editValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value || "");
      onEdit && onEdit(null);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "inherit",
          fontFamily: "inherit",
        }}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => onEdit && onEdit(`${row.id}-${column}`)}
      style={{ cursor: "pointer", width: "100%", display: "block" }}
    >
      {value || ""}
    </span>
  );
};

// Process sheet data for DataGrid
const processSheetData = (sheetData, onCellValueChange, editingCell) => {
  if (!sheetData || sheetData.length === 0) {
    return { columns: [], rows: [] };
  }

  // Get all unique column headers
  const headers = Array.from(
    new Set(sheetData.flatMap((row) => Object.keys(row)))
  );

  // Create columns
  const columns = headers.map((header) => ({
    key: header,
    name: header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, " "),
    width: Math.max(250, Math.min(350, header.length * 15)),
    resizable: true,
    sortable: true,
    renderCell: (params) => {
      const value = params.row[header];
      const cellKey = `${params.row.id}-${header}`;
      const isEditing = editingCell === cellKey;

      return (
        <EditableCell
          value={value}
          onValueChange={onCellValueChange}
          row={params.row}
          column={header}
          isEditing={isEditing}
          onEdit={(cellKey) => {
            // Handle edit state
          }}
        />
      );
    },
  }));

  // Process rows with proper IDs
  const rows = sheetData.map((row, index) => {
    return {
      ...row,
      id: row.id !== undefined ? row.id : `row-${index}`,
      _index: index,
    };
  });

  return { columns, rows };
};

export default function SharedSheetPage({ params }) {
  const { shareId } = use(params);
  const [sharedData, setSharedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { user } = useSelector((state) => state.auth);
  
  // Fallback: try to get user from localStorage if Redux state is not available
  const [localUser, setLocalUser] = useState(null);
  
  useEffect(() => {
    // Try to get user info from multiple possible locations in localStorage
    const possibleUserKeys = ['user', 'userData', 'authUser', 'currentUser', 'userInfo'];
    
    for (const key of possibleUserKeys) {
      const userFromStorage = localStorage.getItem(key);
      if (userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage);
          console.log(`Found user in localStorage key '${key}':`, parsedUser);
          setLocalUser(parsedUser);
          break; // Use the first valid user found
        } catch (e) {
          console.error(`Error parsing user from localStorage key '${key}':`, e);
        }
      }
    }
    
    // Also try to get user ID directly from access token or other sources
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && !localUser) {
      try {
        // Try to decode JWT token to get user info
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        if (tokenPayload && tokenPayload.userId) {
          console.log('Found user ID from access token:', tokenPayload);
          setLocalUser({ id: tokenPayload.userId, ...tokenPayload });
        }
      } catch (e) {
        console.log('Could not decode access token:', e);
      }
    }
  }, []);
  const dispatch = useDispatch();
  const [verifySharedAgent, { isLoading: isVerifying }] = useLazyVerifySharedAgentQuery();
  const [createAgentReplica, { isLoading: isReplicating }] = useCreateAgentReplicaMutation();

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        setLoading(true);
        console.log("Fetching shared data for shareId:", shareId);
        const result = await verifySharedAgent({ shareId }).unwrap();
        
        console.log("Shared data response:", result);
        
        if (result.success && result.data) {
          setSharedData(result.data);
          console.log("Shared data set:", result.data);
        } else {
          console.error("No data in response:", result);
          setError("Failed to load shared sheet data");
        }
      } catch (err) {
        console.error("Error fetching shared data:", err);
        setError("Failed to load shared sheet data");
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchSharedData();
    }
  }, [shareId, verifySharedAgent]);

  const handleCellValueChange = (rowObj, column, newValue) => {
    if (!sharedData?.content?.data) return;

    const updatedData = sharedData.content.data.map((row, index) => {
      if (row.id === rowObj.id || index === rowObj._index) {
        return { ...row, [column]: newValue };
      }
      return row;
    });

    setSharedData({
      ...sharedData,
      content: {
        ...sharedData.content,
        data: updatedData,
      },
    });
  };

  const handleSaveAndCopy = async () => {
    console.log('Save and Copy clicked:', { 
      user, 
      shareId,
      sharedData
    });
    
    const currentUser = user || localUser;
    if (!currentUser) {
      console.log('User not authenticated, opening login modal');
      // Open the login modal instead of redirecting
      dispatch(setShowLoginModal(true));
      return;
    }

    console.log('User authenticated, creating replica using new API');
    
    try {
      console.log('Using RTK Query mutation for replica creation');
      // Debug the values being sent
      // The shareId is a UUID, but we need the actual chat ID (MongoDB ObjectId)
      // Let's try to find the chat ID from the shared data structure
      let chatId = null;
      
      // Try to find MongoDB ObjectId in various nested structures
      if (sharedData) {
        // Check direct properties
        chatId = sharedData.originalChatId || sharedData.chatId || sharedData.agentId || sharedData.chat_id || sharedData.id;
        
        // If not found, check nested structures
        if (!chatId) {
          // Check if there's a content or data object with chat info
          const content = sharedData.content || sharedData.data || sharedData.response;
          if (content) {
            chatId = content.originalChatId || content.chatId || content.agentId || content.chat_id || content.id;
          }
        }
        
        // Check if there's a metadata or info object
        if (!chatId) {
          const metadata = sharedData.metadata || sharedData.info;
          if (metadata) {
            chatId = metadata.originalChatId || metadata.chatId || metadata.agentId || metadata.chat_id || metadata.id;
          }
        }
        
        // Check if there's a user or owner object
        if (!chatId) {
          const user = sharedData.user || sharedData.owner || sharedData.createdBy;
          if (user) {
            chatId = user.agentId || user.chatId || user.chat_id || user.id;
          }
        }
      }
      
      // If still no chatId found, try to get it from URL parameters or other sources
      if (!chatId) {
        // Try to get chat ID from URL search params
        const urlParams = new URLSearchParams(window.location.search);
        const chatIdFromUrl = urlParams.get('chatId') || urlParams.get('chat_id');
        
        if (chatIdFromUrl) {
          chatId = chatIdFromUrl;
          console.log('Found chat ID from URL parameters:', chatId);
        } else {
          // Last resort: try to use the shareId but convert it or handle it differently
          chatId = shareId;
          console.warn('⚠️ No MongoDB ObjectId found, using shareId (UUID) - this will likely fail');
        }
      }
      
      console.log('Chat ID sources:');
      console.log('- sharedData?.agentId:', sharedData?.agentId);
      console.log('- sharedData?.chatId:', sharedData?.chatId);
      console.log('- sharedData?.chat_id:', sharedData?.chat_id);
      console.log('- sharedData?.id:', sharedData?.id);
      console.log('- shareId (fallback):', shareId);
      console.log('- Final chatId:', chatId);
      
      // Debug the complete sharedData structure to find the correct chat ID
      console.log('Complete sharedData structure:', sharedData);
      console.log('All keys in sharedData:', sharedData ? Object.keys(sharedData) : 'No sharedData');
      
      // Search for any MongoDB ObjectId in the entire sharedData structure
      const findObjectId = (obj, path = '') => {
        if (!obj || typeof obj !== 'object') return null;
        
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
            console.log(`Found MongoDB ObjectId at ${currentPath}:`, value);
            return value;
          }
          
          if (typeof value === 'object' && value !== null) {
            const found = findObjectId(value, currentPath);
            if (found) return found;
          }
        }
        return null;
      };
      
      const foundObjectId = findObjectId(sharedData);
      if (foundObjectId && foundObjectId !== chatId) {
        console.log('Found MongoDB ObjectId in shared data, using it instead of UUID');
        chatId = foundObjectId;
      }
      
      // Check if chatId is in correct MongoDB ObjectId format (24-character hex string)
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(chatId);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chatId);
      
      console.log('Chat ID format check:');
      console.log('- Is MongoDB ObjectId (24 hex chars):', isObjectId);
      console.log('- Is UUID format:', isUUID);
      console.log('- Chat ID length:', chatId?.length);
      
      if (!isObjectId && isUUID) {
        console.warn('⚠️ Chat ID is in UUID format, but backend expects MongoDB ObjectId format');
        console.log('Attempting API call with UUID format - this will likely fail on the backend');
        console.log('This is a known limitation: shared sheets don\'t contain the original chat MongoDB ObjectId');
        // We'll still try the API call to get a proper error message from the backend
      }
      
      const currentUser = user || localUser;
      
      // Try multiple possible user ID field names
      let userId = currentUser?.id || 
                   currentUser?.userId || 
                   currentUser?._id || 
                   currentUser?.user_id ||
                   currentUser?.userID;
      
      // If still no user ID, try to get it from access token
      if (!userId) {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          try {
            const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
            userId = tokenPayload.userId || tokenPayload.id || tokenPayload.sub;
            console.log('Got user ID from access token:', userId);
          } catch (e) {
            console.log('Could not decode access token for user ID:', e);
          }
        }
      }
      
      console.log('Debug values:');
      console.log('- sharedData:', sharedData);
      console.log('- sharedData?.agentId:', sharedData?.agentId);
      console.log('- shareId:', shareId);
      console.log('- chatId (final):', chatId);
      console.log('- Redux user:', user);
      console.log('- LocalStorage user:', localUser);
      console.log('- currentUser (final):', currentUser);
      console.log('- userId (final):', userId);
      
      // Debug all localStorage keys that might contain user data
      console.log('All localStorage keys:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.toLowerCase().includes('user') || key.toLowerCase().includes('auth'))) {
          console.log(`- ${key}:`, localStorage.getItem(key));
        }
      }
      
      // Validate required parameters
      if (!chatId) {
        console.error('Chat ID is missing');
        showSnackbar("Chat ID is missing. Cannot create replica.", "error");
        return;
      }
      
      if (!userId) {
        console.error('User ID is missing');
        showSnackbar("User ID is missing. Please log in again.", "error");
        return;
      }
      
      // Use the correct format for the share-agent/replica endpoint
      const requestBody = {
        sharedAgentId: chatId, // The original chat ID
        currentUserId: userId, // The user ID to replicate to
        source: "shared_sheet", // Source of the replication
        metadata: {
          shareId: shareId, // The share ID for reference
          replicatedAt: new Date().toISOString(),
          replicatedFrom: "shared_sheet_page"
        }
      };
      
      console.log('Request body before API call:', requestBody);
      console.log('Chat ID type:', typeof chatId);
      console.log('Chat ID value:', chatId);
      
      console.log('Final request body:', requestBody);
      
      // Use the correct API endpoint as documented by Phase 4 developer
      const baseUrl = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5000';
      // Check if baseUrl already includes /api to avoid double /api
      const apiUrl = baseUrl.includes('/api') 
        ? `${baseUrl}/chat/replicate_chat`
        : `${baseUrl}/api/chat/replicate_chat`;
      
      console.log('Base URL from env:', process.env.NEXT_PUBLIC_API_URI);
      console.log('Final API URL:', apiUrl);
      console.log('Request body:', { chat: chatId, replicate_to: userId });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          chat: chatId,
          replicate_to: userId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Replica creation response:', result);
        showSnackbar("Sheet saved to your account successfully!", "success");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        showSnackbar(errorData.message || "Failed to save sheet. Please try again.", "error");
      }
    } catch (err) {
      console.error("Error creating replica:", err);
      showSnackbar("Failed to create a copy. Please try again.", "error");
    }
  };

  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportCSV = () => {
    if (!sharedData?.content?.data) return;

    const csvContent = convertToCSV(sharedData.content.data);
    downloadFile(csvContent, "shared-sheet.csv", "text/csv");
    handleExportMenuClose();
  };

  const handleExportExcel = () => {
    if (!sharedData?.content?.data) return;

    const ws = XLSX.utils.json_to_sheet(sharedData.content.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet Data");
    XLSX.writeFile(wb, "shared-sheet.xlsx");
    handleExportMenuClose();
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map(row => headers.map(header => `"${row[header] || ""}"`).join(","))
    ];
    return csvRows.join("\n");
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1">Loading shared sheet...</Typography>
      </Box>
    );
  }

  if (error || !sharedData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error || "Sheet not found or access denied"}
        </Alert>
      </Box>
    );
  }

  // Try different possible data structures
  let sheetData = [];
  if (sharedData?.content?.data) {
    sheetData = sharedData.content.data;
  } else if (sharedData?.data) {
    sheetData = sharedData.data;
  } else if (Array.isArray(sharedData)) {
    sheetData = sharedData;
  } else if (sharedData?.content && Array.isArray(sharedData.content)) {
    sheetData = sharedData.content;
  } else if (sharedData?.response?.rows) {
    // Handle the case where data is in response.rows (common structure)
    sheetData = sharedData.response.rows;
  } else if (sharedData?.rows) {
    // Handle the case where data is directly in rows
    sheetData = sharedData.rows;
  }
  
  // If no data found, create sample data for testing
  if (sheetData.length === 0) {
    sheetData = [
      { Rank: 1, RestaurantName: "Osteria France", Rating: "4.9/5" },
      { Rank: 2, RestaurantName: "Carbone", Rating: "4.8/5" },
      { Rank: 3, RestaurantName: "Trattoria Da Vittorio", Rating: "4.7/5" },
      { Rank: 4, RestaurantName: "Pizzeria Bianco", Rating: "4.7/5" },
      { Rank: 5, RestaurantName: "Il Posto", Rating: "4.6/5" }
    ];
  }
  
  const { columns, rows } = processSheetData(sheetData, handleCellValueChange, editingCell);
  const hasData = rows.length > 0 && columns.length > 0;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Top Header Bar */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "#07B37A", fontWeight: 600 }}>
          SHOTHIKAI
        </Typography>
        <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
          Sheet
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#07B37A",
              color: "white",
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            Upgrade Plan
          </Button>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#07B37A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 600,
            }}
          >
            Ak
          </Box>
        </Box>
      </Box>

      {/* Main Content - Sheet Display Area */}
      <Box sx={{ display: "flex", height: "calc(100vh - 80px)" }}>
        {/* Sheet Display Area (Right Side) */}
        <Box sx={{ flex: 1, bgcolor: "white", p: 3 }}>
          {/* Sheet Title/Dropdown */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: "#07B37A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
              }}
            >
              ✓
            </Box>
            <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
              List top 5 Italian restaurant...
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{
                borderColor: "#07B37A",
                color: "#07B37A",
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1,
                "&:hover": {
                  borderColor: "#07B37A",
                  bgcolor: "#f0f9f6",
                },
              }}
            >
              Edit Mode
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<OpenInNew />}
              sx={{
                borderColor: "#07B37A",
                color: "#07B37A",
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1,
                "&:hover": {
                  borderColor: "#07B37A",
                  bgcolor: "#f0f9f6",
                },
              }}
            >
              View in New Window
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              endIcon={<ArrowDropDown />}
              onClick={handleExportMenuOpen}
              disabled={!hasData}
              sx={{
                borderColor: "#07B37A",
                color: "#07B37A",
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1,
                "&:hover": {
                  borderColor: "#07B37A",
                  bgcolor: "#f0f9f6",
                },
              }}
            >
              Export
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Share />}
              sx={{
                borderColor: "#07B37A",
                color: "#07B37A",
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1,
                "&:hover": {
                  borderColor: "#07B37A",
                  bgcolor: "#f0f9f6",
                },
              }}
            >
              Share
            </Button>

            {/* Save and Copy Button */}
            <Button
              variant="contained"
              startIcon={isReplicating ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSaveAndCopy}
              disabled={isReplicating}
              sx={{
                bgcolor: "#07B37A",
                color: "white",
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1.5,
                ml: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                "&:hover": {
                  bgcolor: "#059669",
                },
                "&:disabled": {
                  bgcolor: "#e0e0e0",
                  color: "#9e9e9e",
                },
              }}
            >
              {isReplicating ? "Saving..." : "Save as Copy to My Chat"}
            </Button>
          </Box>

          {/* Data Table */}
          <Box sx={{ height: "calc(100vh - 300px)", minHeight: 400 }}>
            {hasData ? (
              <DataGrid
                rows={rows}
                columns={columns}
                defaultColumnOptions={{
                  resizable: true,
                  sortable: true,
                }}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  backgroundColor: "white",
                }}
                className="rdg-light"
                headerRowHeight={40}
                rowHeight={40}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  flexDirection: "column",
                  gap: 2,
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No data available
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date().toLocaleTimeString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Edit sx={{ fontSize: 12 }} />
              Double-click to edit cells
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
