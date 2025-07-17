"use client";

import { Box, Button, Typography } from "@mui/material";
import AppLink from "../../../components/common/AppLink";
import { useSearchParams } from "next/navigation";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { useMemo, useState } from "react";

const demoData = {
  columns: [
    { key: "id", name: "ID", width: 80 },
    { key: "name", name: "Product Name", width: 200, resizable: true },
    { key: "category", name: "Category", width: 150, resizable: true },
    { key: "price", name: "Price", width: 100, resizable: true },
    { key: "stock", name: "Stock", width: 100, resizable: true },
    { key: "status", name: "Status", width: 120, resizable: true },
    { key: "lastUpdated", name: "Last Updated", width: 180, resizable: true },
  ],
  rows: [
    {
      id: 1,
      name: "Laptop Pro",
      category: "Electronics",
      price: "$1,299",
      stock: 45,
      status: "Active",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Wireless Mouse",
      category: "Electronics",
      price: "$29",
      stock: 120,
      status: "Active",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      name: "Office Chair",
      category: "Furniture",
      price: "$199",
      stock: 30,
      status: "Low Stock",
      lastUpdated: "2024-01-13",
    },
    {
      id: 4,
      name: "Desk Lamp",
      category: "Furniture",
      price: "$49",
      stock: 0,
      status: "Out of Stock",
      lastUpdated: "2024-01-12",
    },
    {
      id: 5,
      name: "Coffee Maker",
      category: "Appliances",
      price: "$89",
      stock: 25,
      status: "Active",
      lastUpdated: "2024-01-11",
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      category: "Electronics",
      price: "$79",
      stock: 60,
      status: "Active",
      lastUpdated: "2024-01-10",
    },
    {
      id: 7,
      name: "Standing Desk",
      category: "Furniture",
      price: "$399",
      stock: 15,
      status: "Low Stock",
      lastUpdated: "2024-01-09",
    },
    {
      id: 8,
      name: "Tablet",
      category: "Electronics",
      price: "$329",
      stock: 80,
      status: "Active",
      lastUpdated: "2024-01-08",
    },
    {
      id: 9,
      name: "Microwave",
      category: "Appliances",
      price: "$159",
      stock: 40,
      status: "Active",
      lastUpdated: "2024-01-07",
    },
    {
      id: 10,
      name: "Bookshelf",
      category: "Furniture",
      price: "$129",
      stock: 20,
      status: "Active",
      lastUpdated: "2024-01-06",
    },
  ],
};

const alternativeDemoData = {
  columns: [
    { key: "userId", name: "User ID", width: 100 },
    { key: "username", name: "Username", width: 150, resizable: true },
    { key: "email", name: "Email", width: 250, resizable: true },
    { key: "role", name: "Role", width: 120, resizable: true },
    { key: "joinDate", name: "Join Date", width: 150, resizable: true },
    { key: "lastLogin", name: "Last Login", width: 180, resizable: true },
  ],
  rows: [
    {
      userId: 1,
      username: "john_doe",
      email: "john@example.com",
      role: "Admin",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-16 09:30",
    },
    {
      userId: 2,
      username: "jane_smith",
      email: "jane@example.com",
      role: "User",
      joinDate: "2023-02-20",
      lastLogin: "2024-01-15 14:22",
    },
    {
      userId: 3,
      username: "bob_wilson",
      email: "bob@example.com",
      role: "Manager",
      joinDate: "2023-03-10",
      lastLogin: "2024-01-14 11:45",
    },
    {
      userId: 4,
      username: "alice_brown",
      email: "alice@example.com",
      role: "User",
      joinDate: "2023-04-05",
      lastLogin: "2024-01-13 16:18",
    },
    {
      userId: 5,
      username: "charlie_davis",
      email: "charlie@example.com",
      role: "User",
      joinDate: "2023-05-12",
      lastLogin: "2024-01-12 08:55",
    },
  ],
};

export default function SheetPreviewPage() {
  const [gridData, setGridData] = useState(demoData);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const gridProps = useMemo(
    () => ({
      columns: gridData.columns,
      rows: gridData.rows,
      //  selectedRows,
      //  onSelectedRowsChange: setSelectedRows,
      enableVirtualization: true,
      rowHeight: 35,
      headerRowHeight: 40,
      className: "rdg-light",
    }),
    [gridData]
  );

  const handleCSVExport = (data) => {
    if (!data || !data.rows || data.rows.length === 0) {
      console.log("No data to export.");
      return;
    }

    // Helper function to escape CSV fields
    const escapeCSV = (value) => {
      if (value == null) {
        return "";
      }
      const stringValue = String(value);
      // If the value contains a comma, a double quote, or a newline, wrap it in double quotes
      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        // Escape any double quotes inside the string by doubling them
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // 1. Create CSV Header
    const headers = data.columns.map((col) => escapeCSV(col.name)).join(",");

    // 2. Create CSV Rows
    const csvRows = data.rows.map((row) => {
      // Map columns to ensure order is correct and get the corresponding row value
      return data.columns.map((col) => escapeCSV(row[col.key])).join(",");
    });

    // 3. Combine header and rows with a newline character
    const csvString = [headers, ...csvRows].join("\n");

    // 4. Create a Blob and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "exported_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(url);
  };

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
      {/* Grid Info */}
      <Box
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {/* Showing {gridData.rows.length} records
          {selectedRows.size > 0 && ` (${selectedRows.size} selected)`} */}
          showing {gridData.rows.length} rows
        </Typography>
        <Button onClick={() => handleCSVExport(gridData)}>Export to CSV</Button>
      </Box>

      {/* Data Grid */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGrid {...gridProps} style={{ height: "100%" }} />
      </Box>
    </Box>
  );
}
