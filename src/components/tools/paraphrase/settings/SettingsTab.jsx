// SettingsTab.jsx
import useResponsive from "@/hooks/useResponsive";
import { Info as InfoIcon } from "@mui/icons-material";
import { Box, Checkbox, Divider, IconButton, Typography } from "@mui/material";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleInterfaceOption,
  toggleParaphraseOption,
} from "../../../../redux/slice/settings";

const SettingsTab = () => {
  const dispatch = useDispatch();
  const isMobile = useResponsive("down", "md");

  const { paraphraseOptions, interfaceOptions } = useSelector(
    (state) => state.settings,
  );

  const paraphraseOptionsMeta = useMemo(
    () => [
      {
        key: "paraphraseQuotations",
        label: "Paraphrase quotations",
        info: false,
        showOnDesktop: true,
      },
      {
        key: "avoidContractions",
        label: "Avoid contractions",
        info: true,
        showOnDesktop: true,
      },
      {
        key: "automaticStartParaphrasing",
        label: "Automatic paraphrase",
        info: false,
        showOnDesktop: false,
      },
      {
        key: "autoFreeze",
        label: "Auto freeze",
        info: false,
        showOnDesktop: false,
      },
    ],
    [],
  );

  const interfaceOptionsMeta = useMemo(
    () => [
      { key: "useYellowHighlight", label: "Use yellow highlight", info: false },
      { key: "showTooltips", label: "Show tooltips", info: false },
      {
        key: "showChangedWords",
        label: "Show ",
        highlightText: "changed words",
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
        label: "Show ",
        highlightText: "longest unchanged words",
        highlight: "info.main",
        info: false,
      },
    ],
    [],
  );

  const visibleParaphraseOptions = useMemo(() => {
    if (!isMobile) {
      return paraphraseOptionsMeta.filter((option) => option.showOnDesktop);
    }
    return paraphraseOptionsMeta;
  }, [isMobile, paraphraseOptionsMeta]);

  return (
    <Box id="settings_tab">
      <Typography variant="h6" fontWeight="bold">
        Settings
      </Typography>

      {/* Paraphrase Section - Only show if there are visible options */}
      {visibleParaphraseOptions.length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Paraphrase
          </Typography>
          {visibleParaphraseOptions.map(({ key, label, info }) => (
            <Box
              key={key}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
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
        </>
      )}

      {/* Interface Section */}
      <Typography variant="subtitle2" gutterBottom>
        Interface
      </Typography>
      {interfaceOptionsMeta.map(
        ({ key, label, info, highlight, highlightText }) => (
          <Box key={key} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Checkbox
              size="small"
              checked={interfaceOptions[key] || false}
              onChange={() => dispatch(toggleInterfaceOption(key))}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {label}
              {highlightText && (
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: highlight }}
                >
                  {highlightText}
                </Typography>
              )}
            </Typography>
            {info && (
              <IconButton size="small" sx={{ ml: "auto" }}>
                <InfoIcon fontSize="small" color="action" />
              </IconButton>
            )}
          </Box>
        ),
      )}
    </Box>
  );
};

export default SettingsTab;
