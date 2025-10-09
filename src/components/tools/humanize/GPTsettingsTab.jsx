"use client";

import { Info as InfoIcon } from "@mui/icons-material";
import { Box, Checkbox, Divider, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleHumanizeOption } from "../../../redux/slice/settings";

export default function GPTsettingsSidebar() {
  const dispatch = useDispatch();
  const { humanizeOptions, interfaceOptions } = useSelector(
    (state) => state.settings,
  );
  const humanizeOptionsMeta = [
    // {
    //   key: "humanizeQuotations",
    //   label: "Humanize quotations",
    //   info: false,
    // },
    { key: "avoidContractions", label: "Avoid contractions", info: true },
    {
      key: "automaticStartHumanize",
      label: "Automatic start humanize",
      info: false,
    },
  ];
  const interfaceOptionsMeta = [
    { key: "useYellowHighlight", label: "Use yellow highlight", info: false },
    // { key: "showTooltips", label: "Show tooltips", info: false },
    // {
    //   key: "showChangedWords",
    //   label: "Show changed words",
    //   highlight: "warning.main",
    //   info: false,
    // },
    // {
    //   key: "showStructuralChanges",
    //   label: "Show Structural changes",
    //   info: false,
    // },
    // {
    //   key: "showLongestUnchangedWords",
    //   label: "Show longest unchanged words",
    //   highlight: "info.main",
    //   info: false,
    // },
  ];
  return (
    <Box id="settings_tab">
      <Typography variant="h6" fontWeight="bold">
        Settings
      </Typography>

      {/* Humanize Section */}
      <Typography variant="subtitle2" gutterBottom>
        Humanize
      </Typography>
      {humanizeOptionsMeta.map(({ key, label, info }) => (
        <Box key={key} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Checkbox
            size="small"
            checked={humanizeOptions[key]}
            onChange={() => dispatch(toggleHumanizeOption(key))}
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {label}
          </Typography>
          {info && (
            <IconButton size="small" sx={{ ml: "auto" }}>
              <InfoIcon fontSize="small" color="action" />
            </IconButton>
          )}
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Interface
      </Typography>
      {interfaceOptionsMeta.map(({ key, label, info, highlight }) => (
        <Box key={key} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Checkbox
            size="small"
            checked={interfaceOptions[key] || false}
            onChange={() => dispatch(toggleInterfaceOption(key))}
          />
          <Typography
            variant="body2"
            sx={highlight ? { color: highlight, ml: 1 } : { ml: 1 }}
          >
            {label}
          </Typography>
          {info && (
            <IconButton size="small" sx={{ ml: "auto" }}>
              <InfoIcon fontSize="small" color="action" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
}
