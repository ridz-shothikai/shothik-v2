"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useSelector } from "react-redux";
import useResponsive from "../../hooks/useResponsive";
import SendIcon from "@mui/icons-material/Send";

const PRIMARY_GREEN = "#07B37A";

// Allowed prefixes & suffixes for suggestion
const URL_PREFIXES = ["http://", "https://", "http://www.", "https://www."];

// Regex: valid URL chars (no spaces)
const URL_REGEX = /^[a-zA-Z0-9.:/_-]*$/;

const MarketingRootPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useResponsive("down", "sm");
  const user = useSelector((state) => state.auth.user);

  const [url, setUrl] = useState("");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);

  const generateSuggestions = (inputValue) => {
    if (!inputValue.trim()) return [];

    let suggestions = [];
    const lowerValue = inputValue.toLowerCase();

    // Check if input already has a protocol
    const hasProtocol = URL_PREFIXES.some((prefix) =>
      lowerValue.startsWith(prefix.toLowerCase())
    );

    // Generate prefix suggestions if no protocol
    if (!hasProtocol) {
      URL_PREFIXES.forEach((prefix) => {
        suggestions.push(prefix + inputValue);
      });
    }

    // Add common variations
    if (hasProtocol) {
      // Suggest www version if not present
      if (!lowerValue.includes("www.") && lowerValue.startsWith("http://")) {
        suggestions.push(inputValue.replace("http://", "http://www."));
      }
      if (!lowerValue.includes("www.") && lowerValue.startsWith("https://")) {
        suggestions.push(inputValue.replace("https://", "https://www."));
      }
    }

    return suggestions.slice(0, 6);
  };

  const handleInputChange = (event, newValue) => {
    if (newValue && !URL_REGEX.test(newValue)) return;

    setUrl(newValue);

    if (newValue.trim().length > 0) {
      const newOptions = generateSuggestions(newValue);
      setOptions(newOptions);
      setOpen(newOptions.length > 0);
    } else {
      setOptions([]);
      setOpen(false);
    }
  };

  const handleOptionSelect = (event, newValue) => {
    if (newValue) {
      setUrl(newValue);
      setOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    // Close suggestions on Escape
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        color: isDarkMode ? "#eee" : "#333",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, my: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(45deg, ${PRIMARY_GREEN}, #00ff88)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Which page do you want to advertise?
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#666" }}>
              Send Shothik the URL to your service or product—it does not have
              to be a homepage—and it'll make you an ad that shines!
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            maxWidth: 800,
            display: "flex",
            gap: 2,
            alignItems: "center",
            mx: "auto",
            bgcolor: isDarkMode ? "#161C24" : "#f8f9fa",
            borderRadius: 4,
            px: 1,
            py: 1,
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Autocomplete
            freeSolo
            options={options}
            inputValue={url}
            onInputChange={handleInputChange}
            onChange={handleOptionSelect}
            onKeyDown={handleKeyDown}
            open={open}
            onOpen={() => options.length > 0 && setOpen(true)}
            onClose={() => setOpen(false)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter your website URL here..."
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  style: {
                    padding: "10px 12px",
                  },
                }}
              />
            )}
            sx={{
              flexGrow: 1,
              "& .MuiAutocomplete-popper": {
                zIndex: 1300, // Ensure dropdown appears above other elements
              },
            }}
            filterOptions={(x) => x} // Disable built-in filtering since we generate our own
          />
          <IconButton
            sx={{
              bgcolor: PRIMARY_GREEN,
              color: "white",
              width: 40,
              height: 40,
              "&:hover": {
                bgcolor: "#06A36D",
              },
              "&.Mui-disabled": {
                bgcolor: "#ddd",
                color: "#999",
              },
            }}
            disabled={!url}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default MarketingRootPage;
