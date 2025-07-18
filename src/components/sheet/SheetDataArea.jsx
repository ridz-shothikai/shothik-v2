import React, { useState, useEffect, useMemo } from "react";
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
  Visibility, 
  Error,
  CheckCircle,
  Info 
} from "@mui/icons-material";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { useSelector } from "react-redux";
import { selectSheet } from "../../redux/slice/sheetSlice";
import AppLink from "../common/AppLink";

// Status indicator component
const StatusChip = ({ status, title }) => {
  const getStatusProps = () => {
    switch (status) {
      case 'connecting':
        return { color: 'info', icon: <Info />, label: 'Connecting' };
      case 'connected':
        return { color: 'info', icon: <Info />, label: 'Connected' };
      case 'generating':
        return { color: 'warning', icon: <CircularProgress size={16} />, label: 'Generating' };
      case 'completed':
        return { color: 'success', icon: <CheckCircle />, label: 'Complete' };
      case 'error':
        return { color: 'error', icon: <Error />, label: 'Error' };
      case 'cancelled':
        return { color: 'default', icon: <Error />, label: 'Cancelled' };
      default:
        return { color: 'default', icon: <Info />, label: 'Ready' };
    }
  };

  const statusProps = getStatusProps();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        {...statusProps}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
      {title && (
        <Typography variant="body2" color="text.secondary">
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

  // If sheet is empty, return empty structure
  if (sheetData.length === 0) {
    return { columns: [], rows: [] };
  }

  // Extract headers from first row (assuming first row contains headers)
  const headers = Object.keys(sheetData[0] || {});
  
  // Create columns configuration
  const columns = headers.map((header, index) => ({
    key: header,
    name: header.charAt(0).toUpperCase() + header.slice(1), // Capitalize first letter
    width: Math.max(150, Math.min(250, header.length * 12)), // Dynamic width
    resizable: true,
    sortable: true,
    // Add custom rendering for specific data types
    renderCell: (params) => {
      const value = params.row[header];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return <span style={{ color: '#999', fontStyle: 'italic' }}>—</span>;
      }
      
      if (typeof value === 'number') {
        return <span style={{ fontFamily: 'monospace' }}>{value.toLocaleString()}</span>;
      }
      
      if (typeof value === 'boolean') {
        return (
          <Chip 
            label={value ? 'Yes' : 'No'} 
            color={value ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        );
      }
      
      // Handle dates
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        try {
          const date = new Date(value);
          return date.toLocaleDateString();
        } catch (e) {
          return value;
        }
      }
      
      return String(value);
    }
  }));

  // Process rows with proper IDs
  const rows = sheetData.map((row, index) => ({
    id: row.id || `row-${index}`,
    ...row
  }));

  return { columns, rows };
};

// Logs display component
const LogsDisplay = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Generation Logs
      </Typography>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          maxHeight: 200, 
          overflowY: 'auto',
          bgcolor: 'grey.50',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}
      >
        {logs.map((log, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {typeof log === 'string' ? log : JSON.stringify(log, null, 2)}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default function SheetDataArea({ sheetId }) {
  const sheetState = useSelector(selectSheet);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showLogs, setShowLogs] = useState(false);

  // Process sheet data for DataGrid
  const { columns, rows } = useMemo(() => {
    return processSheetData(sheetState.sheet);
  }, [sheetState.sheet]);

  // Check if we have data
  const hasData = rows.length > 0 && columns.length > 0;

  // Memoize grid props for performance
  const gridProps = useMemo(() => ({
    columns,
    rows,
    selectedRows,
    onSelectedRowsChange: setSelectedRows,
    enableVirtualization: true,
    rowHeight: 40,
    headerRowHeight: 45,
    className: "rdg-light",
    style: { 
      height: "100%",
      border: "1px solid #e0e0e0",
      borderRadius: "4px"
    },
    // Add sorting
    sortColumns: [],
    onSortColumnsChange: (sortColumns) => {
      // Handle sorting if needed
      console.log('Sort columns:', sortColumns);
    },
    // Add row selection
    rowKeyGetter: (row) => row.id,
  }), [columns, rows, selectedRows]);

  // Handle refresh
  const handleRefresh = () => {
    // Could trigger a refresh of the sheet data
    console.log('Refresh sheet data');
  };

  // Handle export
  const handleExport = () => {
    if (!hasData) return;
    
    // Convert data to CSV
    const csvHeaders = columns.map(col => col.name).join(',');
    const csvRows = rows.map(row => 
      columns.map(col => {
        const value = row[col.key];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sheet-data-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render loading state
  if (sheetState.status === 'connecting' || sheetState.status === 'generating') {
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
          {sheetState.title || 'Generating Sheet...'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please wait while we process your request
        </Typography>
        <LinearProgress sx={{ width: '100%', maxWidth: 300 }} />
      </Box>
    );
  }

  // Render error state
  if (sheetState.status === 'error') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <IconButton size="small" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          }
        >
          Failed to generate sheet data. Please try again.
        </Alert>
        
        {sheetState.logs && sheetState.logs.length > 0 && (
          <LogsDisplay logs={sheetState.logs} />
        )}
      </Box>
    );
  }

  // Render empty state
  if (!hasData && sheetState.status !== 'generating') {
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
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Data Available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Start a conversation to generate sheet data
        </Typography>
        {sheetState.logs && sheetState.logs.length > 0 && (
          <LogsDisplay logs={sheetState.logs} />
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        p: 1,
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
        <Box>
          <StatusChip status={sheetState.status} title={sheetState.title} />
        </Box>
        
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {rows.length} rows, {columns.length} columns
            {selectedRows.size > 0 && ` (${selectedRows.size} selected)`}
          </Typography>
          
          <Tooltip title="Export as CSV">
            <IconButton 
              size="small" 
              onClick={handleExport}
              disabled={!hasData}
            >
              <Download />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          {sheetId && (
            <AppLink
              href={`/sheets?project_id=${sheetId}`}
              newTab
              underline="hover"
              color="primary"
              fontSize="14px"
              whiteSpace="nowrap"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Visibility fontSize="small" />
                View Full
              </Box>
            </AppLink>
          )}
        </Box>
      </Box>

      {/* Data Grid */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGrid {...gridProps} />
      </Box>

      {/* Logs section (collapsible) */}
      {sheetState.logs && sheetState.logs.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            color="primary"
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => setShowLogs(!showLogs)}
          >
            {showLogs ? 'Hide' : 'Show'} Generation Logs ({sheetState.logs.length})
          </Typography>
          {showLogs && <LogsDisplay logs={sheetState.logs} />}
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary">
          Sheet data updated in real-time • Last update: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
}
