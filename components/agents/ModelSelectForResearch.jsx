"use client";

import { useState } from "react";
import { Select, MenuItem, FormControl, Box, styled } from "@mui/material";
import { Bolt as BoltIcon, Memory as CpuIcon } from "@mui/icons-material";

// Custom styled Select component
const StyledSelect = styled(Select)(({ theme }) => ({
//   width: "150px",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  minHeight: "auto",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  // Remove padding from the input field - THIS IS THE KEY FIX
  "& .MuiOutlinedInput-input": {
    padding: "0px !important",
  },
  "& .MuiSelect-select": {
    color: "#d4d4d8", // neutral-300 equivalent
    cursor: "pointer",
    padding: "0px !important", // Remove all padding
    paddingRight: "24px !important", // Keep space for dropdown arrow
  },
  "& .MuiSvgIcon-root": {
    color: "#d4d4d8",
    right: "0px",
  },
}));

// Custom styled MenuItem
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: "#404040", // neutral-700 equivalent
  color: "#d4d4d8", // neutral-300 equivalent
  cursor: "pointer",
  padding: "8px 16px", // Give items reasonable padding
  margin: "0px",
  "&:hover": {
    backgroundColor: "#525252", // neutral-600 equivalent
  },
  "&.Mui-selected": {
    backgroundColor: "#525252",
    "&:hover": {
      backgroundColor: "#525252",
    },
  },
  "&.Mui-focused": {
    backgroundColor: "#525252",
  },
}));

function ModelSelectForResearch() {
  const [model, setModel] = useState("gemini-2.0-flash");

  const handleChange = (event) => {
    setModel(event.target.value);
  };

  return (
    <Box>
      <FormControl sx={{ margin: 0, padding: 0 }}>
        <StyledSelect
          value={model}
          onChange={handleChange}
          displayEmpty
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: "#404040", // neutral-700
                border: "1px solid #525252", // neutral-600
                borderRadius: "6px",
                padding: "0px",
              },
            },
            MenuListProps: {
              style: {
                paddingTop: "0px",
                paddingBottom: "0px",
              },
            },
            sx: {
              "& .MuiList-root": {
                padding: "0px",
              },
            },
          }}
        >
          <StyledMenuItem value="gemini-2.0-flash">
            <Box display="flex" alignItems="center">
              <BoltIcon
                sx={{
                  height: "16px",
                  width: "16px",
                  marginRight: "8px",
                  color: "#facc15", // yellow-400
                }}
              />
              2.0 Flash
            </Box>
          </StyledMenuItem>

          <StyledMenuItem value="gemini-2.5-flash-preview-04-17">
            <Box display="flex" alignItems="center">
              <BoltIcon
                sx={{
                  height: "16px",
                  width: "16px",
                  marginRight: "8px",
                  color: "#fb923c", // orange-400
                }}
              />
              2.5 Flash
            </Box>
          </StyledMenuItem>

          <StyledMenuItem value="gemini-2.5-pro-preview-05-06">
            <Box display="flex" alignItems="center">
              <CpuIcon
                sx={{
                  height: "16px",
                  width: "16px",
                  marginRight: "8px",
                  color: "#a855f7", // purple-400
                }}
              />
              2.5 Pro
            </Box>
          </StyledMenuItem>
        </StyledSelect>
      </FormControl>
    </Box>
  );
}

export default ModelSelectForResearch;
