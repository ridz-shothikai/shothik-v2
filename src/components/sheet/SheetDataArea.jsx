import React, { useState, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import Spreadsheet from "react-spreadsheet";

// --- START: Custom Spreadsheet Components ---
// By creating custom components for cells and headers, we gain full control
// over their styling and dimensions, which is the recommended approach for
// deep customization with react-spreadsheet.

const CELL_MIN_WIDTH = 300; // The desired minimum width for each cell
const CELL_HEIGHT = 40; // A consistent height for all cells and headers

/**
 * Custom Cell Component
 * This component ensures every data cell has the correct dimensions.
 */
const CustomCell = ({ cell, DataEditor, ...props }) => {
  const theme = useTheme();
  return (
    <td
      {...props}
      // We still use className to get default library behaviors (like selection)
      className="Spreadsheet__cell"
      style={{
        ...props.style, // Important: Apply styles from the library first
        minWidth: `${CELL_MIN_WIDTH}px`,
        width: `${CELL_MIN_WIDTH}px`, // Set width for consistency
        height: `${CELL_HEIGHT}px`,
        // Example of adding theme-based styles directly
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* The library handles whether to show the editor or the cell value */}
      {DataEditor ? <DataEditor /> : cell?.value || ""}
    </td>
  );
};

/**
 * Custom Column Header Component
 * This ensures the column headers (A, B, C...) have the same width
 * as the cells, keeping the spreadsheet aligned.
 */
const CustomColumnIndicator = ({ label, ...props }) => {
  const theme = useTheme();
  return (
    <th
      {...props}
      className="Spreadsheet__column-indicator"
      style={{
        ...props.style,
        minWidth: `${CELL_MIN_WIDTH}px`,
        width: `${CELL_MIN_WIDTH}px`,
        height: `${CELL_HEIGHT}px`,
        // Example of adding theme-based styles directly
        backgroundColor: theme.palette.grey[100],
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {label}
    </th>
  );
};

/**
 * Custom Row Header Component
 * This ensures the row headers (1, 2, 3...) have the correct height.
 */
const CustomRowIndicator = ({ label, ...props }) => {
  const theme = useTheme();
  return (
    <th
      {...props}
      className="Spreadsheet__row-indicator"
      style={{
        ...props.style,
        height: `${CELL_HEIGHT}px`,
        // We can give row headers a smaller, fixed width
        width: "50px",
        backgroundColor: theme.palette.grey[100],
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {label}
    </th>
  );
};

// --- END: Custom Spreadsheet Components ---

export default function SheetDataArea({ isLoading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Initialize spreadsheet data with 20 rows and 20 columns
  const initialData = useMemo(() => {
    return Array(20)
      .fill(null)
      .map(() =>
        Array(20)
          .fill(null)
          .map(() => ({ value: "" }))
      );
  }, []);

  const [data, setData] = useState(initialData);

  // Generate column labels (A, B, C, ..., T)
  const columnLabels = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) =>
      String.fromCharCode(65 + index)
    );
  }, []);

  // Generate row labels (1, 2, 3, ..., 20)
  const rowLabels = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) => (index + 1).toString());
  }, []);

  const handleDataChange = (newData) => {
    setData(newData);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: 200,
        }}
      >
        <CircularProgress />
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Spreadsheet Data
      </Typography>

      <Paper
        elevation={1}
        sx={{
          flex: 1,
          overflow: "auto", // This single property enables both scrollbars
          p: 1,
          // We only define general theme and interaction styles here.
          // All DIMENSION styles are now handled by the custom components.
          "& .Spreadsheet": {
            borderRadius: "4px",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          },
          "& .Spreadsheet__table": {
            borderCollapse: "collapse",
          },
          "& .Spreadsheet__header, & .Spreadsheet__row-indicator, & .Spreadsheet__column-indicator":
            {
              fontWeight: "bold",
              textAlign: "center",
              padding: "4px 8px",
            },
          "& .Spreadsheet__cell": {
            padding: "4px 8px",
            textAlign: "left",
            verticalAlign: "middle",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          },
          "& .Spreadsheet__active-cell": {
            backgroundColor: `${theme.palette.primary.light} !important`,
            // The border is now applied by the custom component, but an outline
            // can show the active cell without affecting layout.
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: "-2px",
          },
          "& .Spreadsheet__selected-cell": {
            backgroundColor: `${theme.palette.success.light} !important`,
          },
          "& .Spreadsheet__data-editor": {
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            padding: 0,
            margin: 0,
            fontSize: "inherit",
            fontFamily: "inherit",
            backgroundColor: "transparent",
          },
        }}
      >
        <Spreadsheet
          data={data}
          onChange={handleDataChange}
          columnLabels={columnLabels}
          rowLabels={rowLabels}
          // --- Use Custom Components for Rendering ---
          Cell={CustomCell}
          ColumnIndicator={CustomColumnIndicator}
          RowIndicator={CustomRowIndicator}
        />
      </Paper>

      <Typography
        variant="caption"
        sx={{
          mt: 1,
          color: "text.secondary",
          textAlign: "center",
        }}
      >
        {isMobile && "Tap and drag to scroll. Double-tap cells to edit."}
        {isTablet &&
          !isMobile &&
          "Click cells to select, double-click to edit."}
        {!isTablet &&
          !isMobile &&
          "Click cells to select, double-click to edit. Use arrow keys to navigate."}
      </Typography>
    </Box>
  );
}
