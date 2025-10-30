"use client";

import Main from "@/components/layout/Main";
import MainHeader from "@/components/navigation/MainHeader";
import NavMini from "@/components/navigation/NavMini";
import NavVertical from "@/components/navigation/NavVertical";
import useResponsive from "@/hooks/useResponsive";
import {
  useCreateAgentReplicaMutation,
  useLazyVerifySharedAgentQuery,
} from "@/redux/api/shareAgent/shareAgentApi";
import { setShowLoginModal } from "@/redux/slice/auth";
import { setOpen } from "@/redux/slice/settings";
import {
  ArrowDropDown,
  Download,
  Edit,
  OpenInNew,
  Save as SaveIcon,
  Share,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { use, useEffect, useState } from "react";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";

// Editable Cell Component for shared sheets
const EditableCell = ({
  value,
  onValueChange,
  row,
  column,
  isEditing,
  onEdit,
}) => {
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
    new Set(sheetData.flatMap((row) => Object.keys(row))),
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pendingSaveAction, setPendingSaveAction] = useState(false);

  // All hooks must be at the top before any conditional returns
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { open, themeLayout } = useSelector((state) => state.settings);
  const isMobile = useResponsive("down", "sm");
  const isNavMini = themeLayout === "mini";
  const isDarkMode = theme.palette.mode === "dark";

  // Fallback: try to get user from localStorage if Redux state is not available
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    // Try to get user info from multiple possible locations in localStorage
    const possibleUserKeys = [
      "user",
      "userData",
      "authUser",
      "currentUser",
      "userInfo",
    ];

    for (const key of possibleUserKeys) {
      const userFromStorage = localStorage.getItem(key);
      if (userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage);
          console.log(`Found user in localStorage key '${key}':`, parsedUser);
          setLocalUser(parsedUser);
          break; // Use the first valid user found
        } catch (e) {
          console.error(
            `Error parsing user from localStorage key '${key}':`,
            e,
          );
        }
      }
    }

    // Also try to get user ID directly from access token or other sources
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !localUser) {
      try {
        // Try to decode JWT token to get user info
        const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
        if (tokenPayload && tokenPayload.userId) {
          console.log("Found user ID from access token:", tokenPayload);
          setLocalUser({ id: tokenPayload.userId, ...tokenPayload });
        }
      } catch (e) {
        console.log("Could not decode access token:", e);
      }
    }
  }, []);
  const dispatch = useDispatch();
  const [verifySharedAgent, { isLoading: isVerifying }] =
    useLazyVerifySharedAgentQuery();
  const [createAgentReplica, { isLoading: isReplicating }] =
    useCreateAgentReplicaMutation();

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
    console.log("🚀 handleSaveAndCopy function called!");

    // Check if user is authenticated
    const currentUser = user || localUser;
    const accessToken = localStorage.getItem("accessToken");

    // More robust authentication check - user must have either user data OR accessToken
    if (
      !currentUser ||
      (Object.keys(currentUser).length === 0 && !accessToken)
    ) {
      console.log("❌ User not authenticated, opening login modal");
      console.log("   currentUser:", currentUser);
      console.log("   accessToken:", accessToken ? "exists" : "missing");

      // Set pending flag so we can retry after login
      setPendingSaveAction(true);

      // Show login modal
      dispatch(setShowLoginModal(true));

      // Show info message
      showSnackbar("Please log in to save this sheet to your account", "info");
      return;
    }

    console.log("✅ User authenticated:", currentUser);

    try {
      // Extract chat ObjectId from shared data
      // The correct path is: sharedData.agent.metadata.chatId (or originalChatId)
      let chatId =
        sharedData?.agent?.metadata?.chatId ||
        sharedData?.agent?.metadata?.originalChatId;

      console.log("🔍 Extracted chat ID from agent.metadata:", chatId);

      // Validate that we have a valid MongoDB ObjectId
      const isValidObjectId = chatId && /^[0-9a-fA-F]{24}$/.test(chatId);

      if (!chatId || !isValidObjectId) {
        console.error("❌ Invalid or missing chat ID");
        console.error(
          "sharedData.agent.metadata:",
          sharedData?.agent?.metadata,
        );
        showSnackbar(
          "Unable to find the original chat ID. This link may be invalid.",
          "error",
        );
        return;
      }

      console.log("✅ Using valid Chat ID:", chatId);

      // Get user ID
      let userId =
        currentUser?.id ||
        currentUser?.userId ||
        currentUser?._id ||
        currentUser?.user_id;

      // Try to get user ID from access token if not found
      if (!userId) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          try {
            const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
            userId = tokenPayload.userId || tokenPayload.id || tokenPayload.sub;
          } catch (e) {
            console.error("Could not decode access token:", e);
          }
        }
      }

      if (!userId) {
        console.error("User ID is missing");
        showSnackbar("User ID is missing. Please log in again.", "error");
        return;
      }

      console.log("Replicating chat:", { chatId, userId });

      // Get base URL from environment
      const baseUrl = process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX;
      console.log("🌐 Environment base URL:", baseUrl);

      if (!baseUrl) {
        console.error(
          "API base URL not configured - NEXT_PUBLIC_API_URI_WITHOUT_PREFIX is missing",
        );
        showSnackbar("Configuration error. Please contact support.", "error");
        return;
      }

      // Construct the API URL
      // NEXT_PUBLIC_API_URI_WITHOUT_PREFIX = https://api-qa.shothik.ai
      // We need to add: /sheet/chat/replicate_chat
      // Remove trailing slash if present
      const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
      const apiUrl = `${cleanBaseUrl}/sheet/chat/replicate_chat`;

      console.log("🔗 Constructed API URL:", apiUrl);
      console.log(
        "✅ Expected URL:",
        "https://api-qa.shothik.ai/sheet/chat/replicate_chat",
      );

      // Prepare the request payload
      const requestPayload = {
        chat: chatId,
        replicate_to: userId,
      };

      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📡 COMPLETE API REQUEST DETAILS");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔗 URL:", apiUrl);
      console.log("📍 Method: POST");
      console.log("");
      console.log("📦 Headers:");
      Object.entries(headers).forEach(([key, value]) => {
        if (key === "Authorization") {
          console.log(
            `   ${key}: Bearer ${value.split(" ")[1]?.substring(0, 30)}...`,
          );
        } else {
          console.log(`   ${key}: ${value}`);
        }
      });
      console.log("");
      console.log("📝 Request Body:");
      console.log("   Raw Object:", requestPayload);
      console.log("   JSON String:", JSON.stringify(requestPayload));
      console.log("   Formatted:");
      console.log(JSON.stringify(requestPayload, null, 2));
      console.log("");
      console.log("🔍 Payload Validation:");
      console.log("   chat ID:", chatId);
      console.log("   chat ID type:", typeof chatId);
      console.log("   chat ID length:", chatId?.length);
      console.log(
        "   chat ID is valid ObjectId:",
        /^[0-9a-fA-F]{24}$/.test(chatId),
      );
      console.log("   replicate_to ID:", userId);
      console.log("   replicate_to ID type:", typeof userId);
      console.log("   replicate_to ID length:", userId?.length);
      console.log(
        "   replicate_to ID is valid ObjectId:",
        /^[0-9a-fA-F]{24}$/.test(userId),
      );
      console.log("");
      console.log("✅ POSTMAN EQUIVALENT (copy this to test):");
      console.log(`curl -X POST '${apiUrl}' \\`);
      console.log(`  -H 'Content-Type: application/json' \\`);
      console.log(
        `  -H 'Authorization: Bearer ${accessToken?.substring(0, 30)}...' \\`,
      );
      console.log(`  -d '${JSON.stringify(requestPayload)}'`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestPayload),
      });

      console.log("");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📨 RESPONSE DETAILS");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 Status:", response.status, response.statusText);
      console.log("🔗 URL:", response.url);
      console.log("✓ OK:", response.ok);
      console.log("📋 Type:", response.type);
      console.log("");
      console.log("📦 Response Headers:");
      response.headers.forEach((value, key) => {
        console.log(`   ${key}: ${value}`);
      });
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: await response.text() };
        }
        console.error("❌ API Error Response:", errorData);
        console.error("❌ Response Headers:", [...response.headers.entries()]);
        showSnackbar(
          errorData.message ||
            `Failed to save sheet (${response.status}). Please try again.`,
          "error",
        );
        return;
      }

      const result = await response.json();
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ REPLICA CREATED SUCCESSFULLY!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 Response:", result);
      console.log(
        "🆔 Replicated Chat ID:",
        result.data?.replicatedChatId || result.replicatedChatId || chatId,
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Show success message
      showSnackbar(
        "Sheet saved to your account successfully! Redirecting...",
        "success",
      );

      // Redirect to the replicated chat page after a short delay
      setTimeout(() => {
        const replicatedChatId =
          result.data?.replicatedChatId || result.replicatedChatId || chatId;

        // Redirect to the agents sheets page with the replicated chat ID
        const redirectUrl = `/agents/sheets?id=${replicatedChatId}`;

        console.log("🔗 Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
      }, 1500);
    } catch (err) {
      console.error("Error creating replica:", err);
      showSnackbar("Failed to create a copy. Please try again.", "error");
    }
  };

  // Watch for user login and retry save action if pending
  useEffect(() => {
    const currentUser = user || localUser;
    const accessToken = localStorage.getItem("accessToken");

    // If user just logged in and there's a pending save action
    if (pendingSaveAction && (currentUser || accessToken)) {
      console.log("✅ User logged in! Retrying save action...");
      setPendingSaveAction(false);
      // Retry the save action
      setTimeout(() => {
        handleSaveAndCopy();
      }, 500); // Small delay to ensure auth state is fully updated
    }
  }, [user, localUser, pendingSaveAction]);

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
      ...data.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(","),
      ),
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
      { Rank: 5, RestaurantName: "Il Posto", Rating: "4.6/5" },
    ];
  }

  const { columns, rows } = processSheetData(
    sheetData,
    handleCellValueChange,
    editingCell,
  );
  const hasData = rows.length > 0 && columns.length > 0;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Real Main Header */}
      <MainHeader />

      {/* Main Layout with Sidebar */}
      <Box
        sx={{
          bgcolor: isDarkMode ? "#212121" : "background.neutral",
          display: { sm: "flex" },
          minHeight: { sm: 1 },
          overflow: "hidden",
        }}
      >
        {/* Sidebar Navigation */}
        {!isMobile && isNavMini ? (
          <NavMini isDarkMode={isDarkMode} />
        ) : (
          <NavVertical
            openNav={open}
            onCloseNav={() => dispatch(setOpen(false))}
          />
        )}

        {/* Main Content Area */}
        <Main>
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
              startIcon={
                isReplicating ? <CircularProgress size={20} /> : <SaveIcon />
              }
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
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date().toLocaleTimeString()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Edit sx={{ fontSize: 12 }} />
              Double-click to edit cells
            </Typography>
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
        </Main>
      </Box>
    </Box>
  );
}
