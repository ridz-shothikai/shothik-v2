// src/components/tools/paraphrase/ModeNavigation.jsx
import { Diamond, ExpandMore, Lock } from "@mui/icons-material";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { modes } from "../../../_mock/tools/paraphrase";
import useSnackbar from "../../../hooks/useSnackbar";

const ModeNavigation = ({
  selectedMode,
  setSelectedMode,
  userPackage,
  selectedSynonyms,
  setSelectedSynonyms,
  SYNONYMS,
  setShowMessage,
  isLoading,
  accessToken,
  dispatch,
  setShowLoginModal,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600–900px
  const enqueueSnackbar = useSnackbar();

  // Determine max allowed synonym value based on user package
  const maxAllowedSynonymValue = React.useMemo(() => {
    if (userPackage === "free") return 40; // Intermediate
    if (userPackage === "value_plan") return 60; // Advance
    return 80; // Pro or Unlimited (Expert)
  }, [userPackage]);

  // Adjust selectedSynonyms if it exceeds the allowed limit
  React.useEffect(() => {
    const currentSynonymValue = Object.keys(SYNONYMS).find(
      (k) => SYNONYMS[k] === selectedSynonyms,
    );
    if (currentSynonymValue > maxAllowedSynonymValue) {
      setSelectedSynonyms(SYNONYMS[maxAllowedSynonymValue]);
    }
  }, [maxAllowedSynonymValue, selectedSynonyms, setSelectedSynonyms, SYNONYMS]);

  // determine how many tabs to show before collapsing
  const visibleCount = isXs ? 2 : isSm ? 4 : 7;

  const initialModes = modes.slice(0, visibleCount);
  const extraModes = modes.slice(visibleCount);

  // handle the “extra” selected mode
  const [extraMode, setExtraMode] = React.useState(() =>
    initialModes.some((m) => m.value === selectedMode) ? null : selectedMode,
  );

  // menu state for “More”
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMoreClick = (e) => setAnchorEl(e.currentTarget);
  const handleMoreClose = () => setAnchorEl(null);

  // unified mode-change logic
  const changeMode = (value) => {
    if (isLoading) {
      enqueueSnackbar("Wait until the current process is complete", {
        variant: "info",
      });
      return;
    } // Disable if loading
    const modeObj = modes.find((m) => m.value === value);
    const isValid = modeObj.package.includes(userPackage || "free");
    if (isValid) {
      setSelectedMode(value);
      setShowMessage({ show: false, Component: null });
    } else {
      // If not valid, check if the user is not logged in
      setShowMessage({ show: true, Component: value });
    }
    if (extraModes.some((m) => m.value === value)) {
      setExtraMode(value);
    }
    handleMoreClose();
  };

  // build list of tabs
  const displayedModes = extraMode
    ? [...initialModes, modes.find((m) => m.value === extraMode)]
    : initialModes;

  // ensure extraMode stays in sync with selectedMode
  React.useEffect(() => {
    if (
      !initialModes.some((m) => m.value === selectedMode) &&
      extraModes.some((m) => m.value === selectedMode)
    ) {
      setExtraMode(selectedMode);
    } else if (initialModes.some((m) => m.value === selectedMode)) {
      setExtraMode(null);
    }
  }, [selectedMode, initialModes, extraModes]);

  // guard Tabs value
  const tabHasSelectedMode = displayedModes.some(
    (m) => m.value === selectedMode,
  );
  const tabsValue = tabHasSelectedMode
    ? selectedMode
    : displayedModes[0]?.value || false;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ pr: 2, pt: 1 }}
      spacing={2}
    >
      {/* Modes */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1600,
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          overflowX: { xs: "auto", sm: "auto", md: "hidden" },
          overflowY: "hidden",
          whiteSpace: "nowrap",
          // optional: show a thin scrollbar on WebKit
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 2,
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
      >
        <Tabs
          value={tabsValue}
          onChange={(_, v) => changeMode(v)}
          variant="scrollable"
          scrollButtons={false}
          disabled={isLoading}
          sx={{
            flexWrap: "nowrap",
            overflowX: "auto", // allow horizontal scroll inside Tabs
            "& .MuiTabs-flexContainer": {
              gap: 0,
            },
            "& .MuiButtonBase-root": {
              minWidth: 0,
            },
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root:not(:last-of-type)": {
              mr: "0px !important",
            },
          }}
          textColor="primary"
        >
          {displayedModes.map((mode, idx) => (
            <Tab
              key={idx}
              value={mode.value}
              sx={{
                px: { xs: 1.5, md: 2, xl: 2.5 },
              }}
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {!mode.package.includes(userPackage || "free") && (
                    <Lock sx={{ width: 12, height: 12 }} />
                  )}
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {mode.value}
                  </Typography>
                </Stack>
              }
            />
          ))}
        </Tabs>

        {/* “More” button with matching gap */}
        <Box id="mode_more_section" sx={{ flexShrink: 0 }}>
          {/* <Button
            id="mode_x_button"
            onClick={() => {
              handleMoreClose();
            }}
            sx={{ opacity: 0, zIndex: -99, width: 0, height: 0 }}
          ></Button> */}

          <Button
            id="mode_more"
            aria-controls={open ? "mode-more-menu" : undefined}
            aria-haspopup="true"
            onClick={handleMoreClick}
            sx={{ textTransform: "none", color: "text.secondary" }}
            endIcon={<ExpandMore />}
            disabled={isLoading}
          >
            More
          </Button>
          <Menu
            id="mode-more-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMoreClose}
            MenuListProps={{ "aria-labelledby": "mode_more" }}
          >
            {extraModes.map((mode) => (
              <MenuItem key={mode.value} onClick={() => changeMode(mode.value)}>
                {!mode.package.includes(userPackage || "free") && (
                  <Lock sx={{ width: 12, height: 12, mr: 0.5 }} />
                )}
                {mode.value}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Synonyms slider */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ width: "150px", position: "relative", zIndex: 1600 }}
      >
        <Slider
          aria-label="Synonyms"
          getAriaValueText={(v) => SYNONYMS[v]}
          value={Math.min(
            Object.keys(SYNONYMS).find(
              (k) => SYNONYMS[k] === selectedSynonyms,
            ) || maxAllowedSynonymValue,
            maxAllowedSynonymValue,
          )}
          marks
          step={20}
          min={20}
          max={80} // Show all options
          valueLabelDisplay="auto"
          valueLabelFormat={selectedSynonyms}
          onChange={(_, v) => {
            const newValue = Number(v);
            if (newValue <= maxAllowedSynonymValue) {
              setSelectedSynonyms(SYNONYMS[newValue]);
            } else {
              enqueueSnackbar(
                "Upgrade your plan to access higher synonym levels.",
                {
                  variant: "warning",
                },
              );
              // Snap back to max allowed value if user tries to select a locked level
              setSelectedSynonyms(SYNONYMS[maxAllowedSynonymValue]);
            }
          }}
          sx={{
            mt: { xs: 2, sm: 1 },
            width: "100%",
            // "& .MuiSlider-rail": {
            //   background: `linear-gradient(to right,
            //     ${theme.palette.primary.main} 0%,
            //     ${theme.palette.primary.main} ${(maxAllowedSynonymValue / 80) * 100}%,
            //     ${theme.palette.action.disabledBackground} ${(maxAllowedSynonymValue / 80) * 100}%,
            //     ${theme.palette.action.disabledBackground} 100%)`,
            //   opacity: 0.38,
            // },
            // "& .MuiSlider-track": {
            //   background: theme.palette.primary.main,
            // },
            "& .MuiSlider-mark": {
              backgroundColor: (theme) => {
                return theme.palette.background.paper;
              },
              "&[data-index]": {
                "&:nth-of-type(n+5)": {
                  backgroundColor:
                    maxAllowedSynonymValue < 60
                      ? theme.palette.action.disabled
                      : theme.palette.background.paper,
                },
                "&:nth-of-type(n+6)": {
                  backgroundColor:
                    maxAllowedSynonymValue < 80
                      ? theme.palette.action.disabled
                      : theme.palette.background.paper,
                },
              },
            },
            "& .MuiSlider-valueLabel": {
              zIndex: 1500,
              fontSize: "12px",
              borderRadius: "4px",
              backgroundColor: "#212B36",
              padding: "2px 6px",
              top: "100%",
              transform: "translateY(8px)",
              "&.MuiSlider-valueLabelOpen": {
                transform: "translateY(8px)",
              },
              "&:before": {
                width: "6px",
                height: "6px",
                top: "-3px",
                bottom: "auto",
                left: "calc(50% - 3px)",
                transform: "rotate(45deg)",
              },
            },
          }}
        />
        {userPackage !== "unlimited" && userPackage !== "pro_plan" && (
          <Diamond sx={{ color: "primary.main", width: 24, height: 24 }} />
        )}
      </Stack>
    </Stack>
  );
};

export default ModeNavigation;
