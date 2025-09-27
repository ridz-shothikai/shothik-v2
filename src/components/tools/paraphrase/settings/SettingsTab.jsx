// SettingsTab.jsx
import { Info as InfoIcon } from "@mui/icons-material";
import { Box, Checkbox, Divider, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleInterfaceOption,
  toggleParaphraseOption,
} from "../../../../redux/slice/settings";

const SettingsTab = () => {
  const dispatch = useDispatch();
  const { paraphraseOptions, interfaceOptions } = useSelector(
    (state) => state.settings,
  );
  const paraphraseOptionsMeta = [
    {
      key: "paraphraseQuotations",
      label: "Paraphrase quotations",
      info: false,
    },
    { key: "avoidContractions", label: "Avoid contractions", info: true },
    //  { key: "preferActiveVoice",        label: "Prefer active voice",         info: true  },
    {
      key: "automaticStartParaphrasing",
      label: "Automatic start paraphrasing",
      info: false,
    },
  ];

  const interfaceOptionsMeta = [
    { key: "useYellowHighlight", label: "Use yellow highlight", info: false },
    { key: "showTooltips", label: "Show tooltips", info: false },
    // { key: "showLegend", label: "Show legend", info: false },
    {
      key: "showChangedWords",
      label: "Show changed words",
      highlight: "warning.main",
      info: false,
    },
    {
      key: "showStructuralChanges",
      label: "Show Structural changes",
      info: false,
    },
    {
      key: "showLongestUnchangedWords",
      label: "Show longest unchanged words",
      highlight: "info.main",
      info: false,
    },
  ];

  return (
    <Box id="settings_tab">
      <Typography variant="h6" fontWeight="bold">
        Settings
      </Typography>

      {/* Paraphrase Section */}
      <Typography variant="subtitle2" gutterBottom>
        Paraphrase
      </Typography>
      {paraphraseOptionsMeta.map(({ key, label, info }) => (
        <Box key={key} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Checkbox
            size="small"
            checked={paraphraseOptions[key]}
            onChange={() => dispatch(toggleParaphraseOption(key))}
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

      {/* Interface Section */}
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
};

export default SettingsTab;
