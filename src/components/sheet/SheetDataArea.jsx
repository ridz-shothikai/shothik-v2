import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import {
  Refresh,
  Download,
  Error,
  CheckCircle,
  Info,
  PlayArrow,
} from "@mui/icons-material";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { useSelector } from "react-redux";
import { selectSheet } from "../../redux/slice/sheetSlice";

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
    width: Math.max(250, Math.min(350, header.length * 15)), // Changed minimum width to 300px
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
  const sheetState = useSelector(selectSheet);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Process sheet data for DataGrid
  const { columns, rows } = useMemo(() => {
    return processSheetData(sheetState.sheet);
  }, [sheetState.sheet]);

  // Check if we have data
  const hasData = rows.length > 0 && columns.length > 0;

  // Handle export to CSV
  const handleExport = () => {
    if (!hasData) return;

    try {
      // Create CSV headers
      const csvHeaders = columns.map((col) => `"${col.name}"`).join(",");

      // Create CSV rows
      const csvRows = rows.map((row) =>
        columns
          .map((col) => {
            const value = row[col.key];
            if (value === null || value === undefined) return '""';

            // Handle different data types
            if (typeof value === "string") {
              // Escape quotes and wrap in quotes
              return `"${value.replace(/"/g, '""')}"`;
            }

            if (typeof value === "number" || typeof value === "boolean") {
              return `"${value}"`;
            }

            return `"${String(value)}"`;
          })
          .join(",")
      );

      const csvContent = [csvHeaders, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `sheet-data-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Handle refresh - could trigger a re-generation
  const handleRefresh = () => {
    console.log("Refresh sheet data");
    // This could dispatch an action to refresh the data
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
      className: "rdg-light",
      style: {
        height: "100%",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        fontSize: "14px",
      },
      rowKeyGetter: (row) => row.id,
      // Add default sorting
      defaultSortColumns: [],
      onSortColumnsChange: (sortColumns) => {
        // Handle sorting if needed
        console.log("Sort columns changed:", sortColumns);
      },
    }),
    [columns, rows, selectedRows]
  );

  // Render generating state
  if (sheetState.status === "generating") {
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
  if (sheetState.status === "error") {
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

  // Render empty/ready state
  if (!hasData) {
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
        <PlayArrow sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Ready to Generate
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the chat area to describe your spreadsheet and generate data
        </Typography>
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
          gap: 1,
        }}
      >
        <StatusChip
          status={sheetState.status}
          title={sheetState.title}
          rowCount={rows.length}
        />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {rows.length} rows × {columns.length} columns
            {selectedRows.size > 0 && ` (${selectedRows.size} selected)`}
          </Typography>

          <Tooltip title="Export as CSV">
            <IconButton size="small" onClick={handleExport} disabled={!hasData}>
              <Download />
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton size="small" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Data Grid */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGrid {...gridProps} />
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
