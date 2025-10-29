import React, { useState, useMemo, useEffect, forwardRef, useCallback } from "react";
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
  TextField,
  InputAdornment,
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
  Edit,
  OpenInNew,
  Share,
} from "@mui/icons-material";
import { DataGrid, useRowSelection } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSheetState,
  selectActiveSavePoint,
  selectSheet,
  selectSheetStatus,
  setSheetStatus,
  switchToGeneration,
  switchToSavePoint,
  setSheetData,
} from "../../redux/slice/sheetSlice";
import { useSaveEditedSheetDataMutation } from "../../redux/api/sheet/sheetApi";
import ShareSheetModal from "../share/ShareSheetModal";
import SavePointsDropdown from "./SavePointsDropDown";
import * as XLSX from "xlsx";

// Editable Cell Component
const EditableCell = ({ value, onValueChange, row, column, isEditing, onEdit }) => {
  const [editValue, setEditValue] = useState(value || '');
  const [isLocalEditing, setIsLocalEditing] = useState(false);

  const handleSave = () => {
    onValueChange(row, column, editValue);
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsLocalEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleDoubleClick = () => {
    setIsLocalEditing(true);
    setEditValue(value || '');
  };

  useEffect(() => {
    setEditValue(value || '');
  }, [value]);

  if (isLocalEditing || isEditing) {
    return (
      <TextField
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        size="small"
        variant="outlined"
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            padding: '4px 8px',
            fontSize: '14px',
            '& fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Typography
        variant="body2"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        {value || '—'}
      </Typography>
      <IconButton
        size="small"
        sx={{
          opacity: 0,
          ml: 1,
          transition: 'opacity 0.2s',
          '&:hover': {
            opacity: 1,
          },
        }}
        onClick={handleDoubleClick}
      >
        <Edit sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
};

// Removed DragHandle component - no longer needed for reordering

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

// Custom Row Component with proper styling
const CustomRow = forwardRef(function CustomRow(props, ref) {
  const {
    className,
    row,
    viewportColumns,
    selectedCellIdx,
    isRowSelected,
    onRowClick,
    style,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      className={`${className} ${isRowSelected ? "rdg-row-selected" : ""}`}
      style={{
        ...style,
        position: "relative",
        backgroundColor: isRowSelected ? "rgba(25, 118, 210, 0.08)" : undefined,
        outline: isRowSelected ? "2px solid #1976d2" : undefined,
        outlineOffset: "-2px",
      }}
      onClick={onRowClick}
      {...rest}
    >
      {/* Render cells */}
      {viewportColumns.map((column, cellIdx) => {
        const { key, renderCell } = column;
        const value = row[key];

        return (
          <div
            key={key}
            className={`rdg-cell ${
              cellIdx === selectedCellIdx ? "rdg-cell-selected" : ""
            }`}
            style={{
              gridColumnStart: cellIdx + 1,
              position: "relative",
            }}
          >
            {renderCell ? renderCell({ row, column }) : value}
          </div>
        );
      })}

      {/* Action button overlay for selected rows */}
      {isRowSelected && (
        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Action clicked for row ${row.id}`);
          }}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            zIndex: 1001,
            minWidth: "auto",
            px: 1,
            py: 0.5,
            fontSize: "0.75rem",
            boxShadow: 2,
            pointerEvents: "auto",
          }}
        >
          Action
        </Button>
      )}
    </div>
  );
});

// Data processing utilities
const processSheetData = (sheetData, onCellValueChange, editingCell) => {
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
        allKeys.add(key);
      }
    });
  });

  const headers = Array.from(allKeys);

  // Create columns without drag handle
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
        />
      );
    },
  }));

  // Process rows with proper IDs - ensure IDs match the original data
  const rows = sheetData.map((row, index) => {
    // Preserve the original row structure and ensure ID consistency
    return {
      ...row,
      id: row.id !== undefined ? row.id : `row-${index}`,
      _index: index, // Add index for easier row finding
    };
  });

  return { columns, rows };
};

export default function SheetDataArea() {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const theme = useTheme();

  // REDUX
  const sheetState = useSelector(selectSheet);
  const sheetStatus = useSelector(selectSheetStatus);
  const currentSavePoint = useSelector(selectActiveSavePoint);

  console.log(sheetStatus, "sheet status");

  const dispatch = useDispatch();

  // API mutation for saving edited sheet data
  const [saveEditedSheetData, { isLoading: isSavingData }] = useSaveEditedSheetDataMutation();

  // Handle cell value changes
  const handleCellValueChange = useCallback(async (rowObj, column, newValue) => {
    // Try multiple approaches to find the row
    let rowIndex = -1;
    
    // First try: Find by ID
    rowIndex = sheetState.sheet.findIndex(r => r.id === rowObj.id);
    
    // Second try: Find by matching all properties (fallback)
    if (rowIndex === -1) {
      rowIndex = sheetState.sheet.findIndex(r => {
        // Compare all properties except the one being edited
        const keys = Object.keys(r).filter(key => key !== column);
        return keys.every(key => r[key] === rowObj[key]);
      });
    }
    
    // Third try: Find by position if we have an index in the rowObj
    if (rowIndex === -1 && rowObj._index !== undefined) {
      rowIndex = rowObj._index;
    }
    
    if (rowIndex === -1) {
      console.error("Row not found in sheet data");
      return;
    }

    const oldValue = sheetState.sheet[rowIndex]?.[column];
    
    const updatedRows = sheetState.sheet.map((r, index) => {
      if (index === rowIndex) {
        return { ...r, [column]: newValue };
      }
      return r;
    });
    
    // Update Redux store immediately for UI responsiveness
    dispatch(setSheetData(updatedRows));
    setEditingCell(null);

    // Save to API in the background (optional - UI updates immediately)
    try {
      const currentSavePoint = sheetState.savePoints?.find(sp => sp.id === sheetState.activeSavePointId);
      if (currentSavePoint && currentSavePoint.generations?.length > 0) {
        const activeGeneration = currentSavePoint.generations.find(g => g.id === currentSavePoint.activeGenerationId);
        const conversationId = currentSavePoint.id.replace('savepoint-', '');
        const chatId = sessionStorage.getItem("activeChatId") || window.location.search.match(/id=([^&]+)/)?.[1];

        if (conversationId && chatId) {
          // Get column order from the current sheet data
          const columnOrder = Object.keys(sheetState.sheet[0] || {});
          
          await saveEditedSheetData({
            chatId,
            conversationId,
            sheetData: updatedRows,
            columnOrder,
            rowOrder: updatedRows.map(row => row.id),
            metadata: {
              ...activeGeneration?.metadata,
              lastEdited: new Date().toISOString(),
              editedBy: 'user',
              editType: 'cell_edit',
              editedCell: { row: rowIndex, column, oldValue, newValue }
            },
            timestamp: new Date().toISOString()
          }).unwrap();
          
          console.log("Sheet data saved successfully to API");
        }
      }
    } catch (error) {
      console.warn("API endpoint not available yet - changes saved locally only:", error);
      // The UI has already been updated, so the user experience is not affected
      // This is just a warning that the backend API endpoint needs to be implemented
    }
  }, [sheetState.sheet, sheetState.savePoints, sheetState.activeSavePointId, dispatch, saveEditedSheetData]);

  // Removed reorder functions - no longer needed

  // Process sheet data for DataGrid
  const { columns, rows } = useMemo(() => {
    return processSheetData(sheetState.sheet, handleCellValueChange, editingCell);
  }, [sheetState.sheet, handleCellValueChange, editingCell]);

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
      }),
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
          .join(","),
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
          ...dataRows.map((row) => String(row[index] || "").length),
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

  // Handle View in New Window
  const handleViewInNewWindow = () => {
    if (!hasData) return;
    
    // Get current sheet data
    const exportData = prepareExportData();
    if (!exportData) return;
    
    // Create HTML content for the new window
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Sheet - ${currentSavePoint?.title || 'Sheet Data'}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #1976d2, #1565c0);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .header p {
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .content {
            padding: 20px;
          }
          .metadata {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
          }
          .metadata-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .metadata-item:last-child {
            margin-bottom: 0;
          }
          .metadata-label {
            font-weight: 600;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          th {
            background: #f8f9fa;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e9ecef;
            font-size: 14px;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
          }
          tr:hover {
            background-color: #f8f9fa;
          }
          tr:last-child td {
            border-bottom: none;
          }
          .footer {
            background: #f8f9fa;
            padding: 15px 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e9ecef;
          }
          @media print {
            body { background: white; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${currentSavePoint?.title || 'Generated Sheet Data'}</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="content">
            <div class="metadata">
              <div class="metadata-item">
                <span class="metadata-label">Total Rows:</span>
                <span>${exportData.dataRows.length}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Total Columns:</span>
                <span>${exportData.headers.length}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Generated By:</span>
                <span>Shothik AI Sheet Generator</span>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  ${exportData.headers.map(header => 
                    `<th>${header}</th>`
                  ).join('')}
                </tr>
              </thead>
              <tbody>
                ${exportData.dataRows.map(row => `
                  <tr>
                    ${row.map(value => 
                      `<td>${value || '—'}</td>`
                    ).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>This sheet was generated by Shothik AI • View in New Window Feature</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Open new window with the HTML content
    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      
      // Focus the new window
      newWindow.focus();
      
      console.log("Opened sheet data in new window");
    } else {
      // Fallback if popup is blocked
      alert("Please allow popups for this site to view the sheet in a new window.");
    }
  };

  // Handle refresh - could trigger a re-generation
  const handleRefresh = () => {
    console.log("Refresh sheet data");

    if (!currentSavePoint) return;

    const activeGen = currentSavePoint.generations.find(
      (g) => g.id === currentSavePoint.activeGenerationId,
    );

    console.log(activeGen, "activeGen");

    if (sheetStatus === "error") {
      if (activeGen) {
        dispatch(
          switchToGeneration({
            savePointId: currentSavePoint.id,
            generationId: currentSavePoint.activeGenerationId,
          }),
        );
      } else {
        // No generation found, just mark it as idle to allow retry
        dispatch(setSheetStatus("idle"));
      }
    } else {
      dispatch(switchToSavePoint({ savePointId: currentSavePoint.id }));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetSheetState());
      console.log(sheetState, "from return");
    };
  }, []);

  // Grid configuration with edit functionality
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
      // Removed reorder functionality
      enableColumnReordering: false,
      enableRowReordering: false,
      // Use proper components prop instead of renderers
      components: {
        Row: CustomRow,
      },
    }),
    [columns, rows, selectedRows, theme.palette],
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
          {sheetState.savePoints?.length > 0 &&
            sheetState.activeSavePointId && (
              <SavePointsDropdown
                savePoints={sheetState.savePoints || []}
                activeSavePointId={sheetState.activeSavePointId}
                onSavePointChange={(savePoint) => {
                  dispatch(switchToSavePoint({ savePointId: savePoint.id }));
                }}
                currentSheetData={sheetState.sheet}
                theme={theme}
              />
            )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* Edit Mode Toggle */}
          <Tooltip title="Toggle edit mode - Double-click cells to edit">
            <Button
              variant="outlined"
              startIcon={<Edit />}
              size="small"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Edit Mode
            </Button>
          </Tooltip>

          {/* Removed reorder button - no longer needed */}

          {/* View in New Window Button */}
          <Tooltip title="View generated sheet in new window">
            <span>
              <Button
                variant="outlined"
                startIcon={<OpenInNew />}
                onClick={handleViewInNewWindow}
                disabled={!hasData}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: { xs: 1, sm: 2 },
                  py: 1,
                  borderWidth: 2,
                  minWidth: { xs: 44, sm: "auto" },
                  mr: 1,
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
                  View in New Window
                </Box>
              </Button>
            </span>
          </Tooltip>

          {/* Export Button with Dropdown */}
          <Tooltip title="Export data">
            <span>
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
            </span>
          </Tooltip>

          {/* Share Button */}
          <Tooltip title="Share sheet data">
            <span>
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={() => setShareModalOpen(true)}
                disabled={!hasData}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: { xs: 1, sm: 2 },
                  py: 1,
                  borderWidth: 2,
                  minWidth: { xs: 44, sm: "auto" },
                  ml: 1,
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
                  Share
                </Box>
              </Button>
            </span>
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
        {!hasData ? null : <DataGrid {...gridProps} />}
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated:{" "}
            {new Date().toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Edit sx={{ fontSize: 12 }} />
              Double-click to edit cells
            </Typography>
            {isSavingData && (
              <Typography variant="caption" color="primary.main" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CircularProgress size={12} />
                Saving changes...
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Share Sheet Modal */}
      <ShareSheetModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        sheetId={currentSavePoint?.id || 'sheet-' + Date.now()}
        sheetData={sheetState.sheet}
        chatId={sessionStorage.getItem("activeChatId") || window.location.search.match(/id=([^&]+)/)?.[1] || null}
      />
    </Box>
  );
}
