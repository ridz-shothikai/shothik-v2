import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  Refresh,
  Download,
  Error,
  CheckCircle,
  Info,
  PlayArrow,
  ArrowDropDown,
  TableChart,
  Description,
} from "@mui/icons-material";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveSavePoint,
  selectSheet,
  selectSheetStatus,
  setSheetStatus,
  switchToGeneration,
  switchToSavePoint,
} from "../../redux/slice/sheetSlice";
import SavePointsDropdown from "./SavePointsDropDown";
import * as XLSX from "xlsx"; // Import SheetJS

// Status indicator component
const StatusChip = ({ status, title, rowCount = 0 }) => {
  const getStatusProps = () => {
    switch (status) {
      case "generating":
        return {
          color: "warning",
          icon: <CircularProgress size={16} />,
          label: "Generating",
        };
      case "completed":
        return {
          color: "success",
          icon: <CheckCircle />,
          label: `Complete (${rowCount} rows)`,
        };
      case "error":
        return {
          color: "error",
          icon: <Error />,
          label: "Error",
        };
      case "cancelled":
        return {
          color: "default",
          icon: <Error />,
          label: "Cancelled",
        };
      default:
        return {
          color: "default",
          icon: <PlayArrow />,
          label: "Ready",
        };
    }
  };

  const statusProps = getStatusProps();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Chip
        {...statusProps}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
      {title && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 300,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

// Data processing utilities
const processSheetData = (sheetData) => {
  if (!sheetData || !Array.isArray(sheetData)) {
    return { columns: [], rows: [] };
  }

  if (sheetData.length === 0) {
    return { columns: [], rows: [] };
  }

  // Get all possible keys from the data
  const allKeys = new Set();
  sheetData.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "id") {
        // Exclude the id field from display
        allKeys.add(key);
      }
    });
  });

  const headers = Array.from(allKeys);

  // Create columns configuration
  const columns = headers.map((header) => ({
    key: header,
    name: header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, " "),
    width: Math.max(250, Math.min(350, header.length * 15)),
    resizable: true,
    sortable: true,
    renderCell: (params) => {
      const value = params.row[header];

      // Handle different data types
      if (value === null || value === undefined || value === "") {
        return (
          <Tooltip title="Empty value" arrow>
            <span style={{ color: "#999", fontStyle: "italic" }}>—</span>
          </Tooltip>
        );
      }

      if (typeof value === "number") {
        return (
          <Tooltip title={`Number: ${value.toLocaleString()}`} arrow>
            <span style={{ fontFamily: "monospace" }}>
              {value.toLocaleString()}
            </span>
          </Tooltip>
        );
      }

      if (typeof value === "boolean") {
        return (
          <Tooltip title={`Boolean: ${value}`} arrow>
            <Chip
              label={value ? "Yes" : "No"}
              color={value ? "success" : "default"}
              size="small"
              variant="outlined"
            />
          </Tooltip>
        );
      }

      // Handle dates
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return (
              <Tooltip title={`Date: ${value}`} arrow>
                <span>{date.toLocaleDateString()}</span>
              </Tooltip>
            );
          }
        } catch (e) {
          // Fall through to string handling
        }
      }

      // Handle all text values with tooltip
      const stringValue = String(value);
      return (
        <Tooltip title={stringValue} arrow>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              width: "100%",
            }}
          >
            {stringValue}
          </span>
        </Tooltip>
      );
    },
  }));

  // Process rows with proper IDs
  const rows = sheetData.map((row, index) => ({
    id: row.id !== undefined ? row.id : `row-${index}`,
    ...row,
  }));

  return { columns, rows };
};

export default function SheetDataArea() {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);

  const theme = useTheme();

  // REDUX
  const sheetState = useSelector(selectSheet);
  const sheetStatus = useSelector(selectSheetStatus);
  const currentSavePoint = useSelector(selectActiveSavePoint);

  // console.log(currentSavePoint, "currentSavePoint");

  const dispatch = useDispatch();

  // Process sheet data for DataGrid
  const { columns, rows } = useMemo(() => {
    return processSheetData(sheetState.sheet);
  }, [sheetState.sheet]);

  // Check if we have data
  const hasData = rows.length > 0 && columns.length > 0;

  // Prepare data for export (common function)
  const prepareExportData = () => {
    if (!hasData) return null;

    // Create headers
    const headers = columns.map((col) => col.name);

    // Create data rows
    const dataRows = rows.map((row) =>
      columns.map((col) => {
        const value = row[col.key];

        // Handle null/undefined values
        if (value === null || value === undefined) return "";

        // Handle different data types
        if (typeof value === "number" || typeof value === "boolean") {
          return value;
        }

        return String(value);
      })
    );

    return { headers, dataRows };
  };

  // Handle CSV export
  const handleCSVExport = () => {
    const exportData = prepareExportData();
    if (!exportData) return;

    try {
      const { headers, dataRows } = exportData;

      // Create CSV headers
      const csvHeaders = headers.map((header) => `"${header}"`).join(",");

      // Create CSV rows
      const csvRows = dataRows.map((row) =>
        row
          .map((value) => {
            if (typeof value === "string") {
              // Escape quotes and wrap in quotes
              return `"${value.replace(/"/g, '""')}"`;
            }
            return `"${value}"`;
          })
          .join(",")
      );

      const csvContent = [csvHeaders, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, "csv");
    } catch (error) {
      console.error("CSV export failed:", error);
    }
  };

  // Handle XLS export
  const handleXLSExport = () => {
    const exportData = prepareExportData();
    if (!exportData) return;

    try {
      const { headers, dataRows } = exportData;

      // Create worksheet data with headers
      const wsData = [headers, ...dataRows];

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Set column widths based on content
      const colWidths = headers.map((header, index) => {
        const maxLength = Math.max(
          header.length,
          ...dataRows.map((row) => String(row[index] || "").length)
        );
        return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
      });
      ws["!cols"] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet Data");

      // Generate Excel file and download
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      downloadFile(blob, "xlsx");
    } catch (error) {
      console.error("XLS export failed:", error);
    }
  };

  // Common download function
  const downloadFile = (blob, extension) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sheet-data-${
      new Date().toISOString().split("T")[0]
    }.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle export menu
  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportOption = (type) => {
    handleExportMenuClose();
    if (type === "csv") {
      handleCSVExport();
    } else if (type === "xlsx") {
      handleXLSExport();
    }
  };

  // Handle refresh - could trigger a re-generation
  const handleRefresh = () => {
    console.log("Refresh sheet data");

    if (!currentSavePoint) return;

    const activeGen = currentSavePoint.generations.find(
      (g) => g.id === currentSavePoint.activeGenerationId
    );

    console.log(activeGen, "activeGen");

    if (sheetStatus === "error") {
      if (activeGen) {
        dispatch(
          switchToGeneration({
            savePointId: currentSavePoint.id,
            generationId: currentSavePoint.activeGenerationId,
          })
        );
      } else {
        // No generation found, just mark it as idle to allow retry
        dispatch(setSheetStatus("idle"));
      }
    } else {
      dispatch(switchToSavePoint({ savePointId: currentSavePoint.id }));
    }
  };

  // Grid configuration
  const gridProps = useMemo(
    () => ({
      columns,
      rows,
      selectedRows,
      onSelectedRowsChange: setSelectedRows,
      enableVirtualization: rows.length > 100,
      rowHeight: 40,
      headerRowHeight: 45,
      className: theme.palette.mode === "dark" ? "rdg-dark" : "rdg-light",
      // style: {
      //   height: "100%",
      //   border: "1px solid #e0e0e0",
      //   borderRadius: "4px",
      //   fontSize: "14px",
      // },
      style: {
        height: "100%",
        border: "1px solid",
        borderColor: theme.palette.divider,
        borderRadius: "4px",
        fontSize: "14px",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
      rowKeyGetter: (row) => row.id,
      defaultSortColumns: [],
      onSortColumnsChange: (sortColumns) => {
        console.log("Sort columns changed:", sortColumns);
      },
    }),
    [columns, rows, selectedRows, theme.palette.mode]
  );

  // Render generating state
  if (sheetStatus === "generating") {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: 3,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <CircularProgress size={48} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Generating Your Sheet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please wait while we process your request...
        </Typography>
        <LinearProgress sx={{ width: "100%", maxWidth: 400 }} />
      </Box>
    );
  }

  // Render error state
  if (sheetStatus === "error") {
    return (
      <Box
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
          <Error sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Generation Failed
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Something went wrong while generating your sheet. Please try again.
          </Typography>
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </Paper>
      </Box>
    );
  }

  // Render data view
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <SavePointsDropdown
            savePoints={sheetState.savePoints || []}
            activeSavePointId={sheetState.activeSavePointId}
            onSavePointChange={(savePoint) => {
              dispatch(switchToSavePoint({ savePointId: savePoint.id }));
            }}
            currentSheetData={sheetState.sheet}
            theme={theme}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* Export Button with Dropdown */}
          <Tooltip title="Export data">
            <Button
              variant="outlined"
              startIcon={<Download />}
              endIcon={<ArrowDropDown />}
              onClick={handleExportMenuOpen}
              disabled={!hasData}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: { xs: 1, sm: 2 },
                py: 1,
                borderWidth: 2,
                minWidth: { xs: 44, sm: "auto" },
                "& .MuiButton-startIcon": {
                  marginRight: { xs: -0.5, sm: 1 },
                },
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Export
              </Box>
            </Button>
          </Tooltip>

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
            <MenuItem onClick={() => handleExportOption("csv")}>
              <ListItemIcon>
                <Description fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                Export as CSV
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  Normal CSV format
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleExportOption("xlsx")}>
              <ListItemIcon>
                <TableChart fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                Export as Excel
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  Microsoft Excel format
                </Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Data Grid */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {!hasData ? (
          <Typography variant="body2" color="text.secondary">
            No data found. Use the chat area to describe your spreadsheet and
            generate data
          </Typography>
        ) : (
          <DataGrid {...gridProps} />
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
}
