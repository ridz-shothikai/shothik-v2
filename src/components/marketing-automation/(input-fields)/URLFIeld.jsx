"use client";

import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
} from "@mui/material";

// URL Input Component (similar to LocationSelect)
const UrlField = ({
  value,
  onChange,
  placeholder = "http://yourstore/product/service",
}) => {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);

  // Allowed prefixes & suffixes for suggestion
  const URL_PREFIXES = ["http://", "https://", "http://www.", "https://www."];

  // Regex: valid URL chars (no spaces)
  const URL_REGEX = /^[a-zA-Z0-9.:/_-]*$/;

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

    onChange(newValue);

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
      onChange(newValue);
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
    <div className="bg-card shadow rounded-full border">
      <Autocomplete
        className="px-4"
        freeSolo
        options={options}
        inputValue={value}
        onInputChange={handleInputChange}
        onChange={handleOptionSelect}
        onKeyDown={handleKeyDown}
        open={open}
        onOpen={() => options.length > 0 && setOpen(true)}
        onClose={() => setOpen(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              className: "px-4 !py-2",
            }}
          />
        )}
        filterOptions={(x) => x}
      />
    </div>
  );
};

export default UrlField;