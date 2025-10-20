import React, { useState } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { History, CheckCircle, Error, Schedule } from "@mui/icons-material";

const SavePointsDropdown = ({
  savePoints,
  activeSavePointId,
  onSavePointChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === "dark";

  const [selectedValue, setSelectedValue] = useState(
    activeSavePointId || "current",
  );

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (value === "current") return;

    const selectedSavePoint = savePoints.find((sp) => sp.id === value);
    if (selectedSavePoint && onSavePointChange) {
      onSavePointChange(selectedSavePoint);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle sx={{ fontSize: 18, color: "success.main" }} />;
      case "error":
        return <Error sx={{ fontSize: 18, color: "error.main" }} />;
      case "generating":
        return <Schedule sx={{ fontSize: 18, color: "warning.main" }} />;
      default:
        return <History sx={{ fontSize: 18, color: "text.secondary" }} />;
    }
  };

  const getDisplayText = (value) => {
    if (value === "current") return "Current Data";
    const savePoint = savePoints.find((sp) => sp.id === value);
    return savePoint ? savePoint.title : "Unknown";
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: isMobile ? 160 : 200,
        maxWidth: 240,
        "& .MuiOutlinedInput-root": {
          height: 36,
          paddingRight: "8px !important",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          gap: 1,
          paddingY: "4px !important",
          paddingX: "8px !important",
        },
      }}
    >
      <Select
        value={selectedValue}
        onChange={handleChange}
        renderValue={(value) => {
          const savePoint =
            value === "current"
              ? null
              : savePoints.find((sp) => sp.id === value);
          const status = savePoint?.generations.find(
            (g) => g.id === savePoint.activeGenerationId,
          )?.status;

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                overflow: "hidden",
              }}
            >
              {getStatusIcon(value === "current" ? "completed" : status)}
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontWeight: 500,
                  flexShrink: 1,
                  color: theme.palette.text.primary,
                }}
              >
                {getDisplayText(value)}
              </Typography>
            </Box>
          );
        }}
      >
        <MenuItem value="current">
          <Typography variant="body2" color="text.primary">
            Current Data
          </Typography>
        </MenuItem>

        {savePoints.map((sp) => {
          const activeGen = sp.generations.find(
            (g) => g.id === sp.activeGenerationId,
          );
          return (
            <MenuItem key={sp.id} value={sp.id}>
              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 180,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: theme.palette.text.primary,
                  }}
                >
                  {sp.title}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SavePointsDropdown;
