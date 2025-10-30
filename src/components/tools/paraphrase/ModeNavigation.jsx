// src/components/tools/paraphrase/ModeNavigation.jsx
import { modes } from "@/_mock/tools/paraphrase";
import { useCustomModes } from "@/hooks/useCustomModes";
import useSnackbar from "@/hooks/useSnackbar";
import { Add, Diamond, Edit, ExpandMore, Lock } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import CustomModeModal from "./CustomModeModal";
import CustomModePopover from "./CustomModePopover";

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
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLg = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const enqueueSnackbar = useSnackbar();

  // Custom modes hook
  const {
    customModes,
    recentModes,
    recommendedModes,
    error: customModeError,
    canCreateCustomModes,
    addCustomMode,
    updateCustomMode,
    deleteCustomMode,
    trackModeUsage,
    clearError,
  } = useCustomModes();

  // Modal state
  const [customModeModalOpen, setCustomModeModalOpen] = React.useState(false);
  const [isCreatingMode, setIsCreatingMode] = React.useState(false);

  // Popover state for editing custom modes
  const [popoverAnchor, setPopoverAnchor] = React.useState(null);
  const [editingCustomMode, setEditingCustomMode] = React.useState(null);

  // Tooltip text for tabs
  const freezeTooltip =
    "Law, Medical, and Engineering keywords are auto-frozen by Shothik.ai. Click to unfreeze.";

  // Determine max allowed synonym value based on user package
  const maxAllowedSynonymValue = React.useMemo(() => {
    if (userPackage === "free") return 40;
    if (userPackage === "value_plan") return 60;
    return 80;
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

  // Combine default modes with custom modes
  const allModes = React.useMemo(() => {
    return [
      ...modes,
      ...customModes
        .filter((cm) => cm?.name) // Filter out invalid modes
        .map((cm) => ({
          value: cm?.name,
          package: ["value_plan", "pro_plan", "unlimited"],
          isCustom: true,
          id: cm._id || cm.id,
        })),
    ];
  }, [customModes]);

  // Determine how many tabs to show before collapsing
  const visibleCount = isXs ? 2 : isSm ? 3 : isLg ? 5 : 7;

  const initialModes = allModes.slice(0, visibleCount);
  const extraModes = allModes.slice(visibleCount);

  // Handle the "extra" selected mode
  const [extraMode, setExtraMode] = React.useState(() =>
    initialModes.some((m) => m.value === selectedMode) ? null : selectedMode,
  );

  // console.log(extraModes, "extraModes 2");

  // Menu state for "More"
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMoreClick = (e) => setAnchorEl(e.currentTarget);
  const handleMoreClose = () => setAnchorEl(null);

  // Unified mode-change logic
  const changeMode = (value, isCustomMode = false, customModeId = null) => {
    if (isLoading) {
      enqueueSnackbar("Wait until the current process is complete", {
        variant: "info",
      });
      return;
    }

    if (isCustomMode && value === selectedMode) {
      const customMode = customModes.find((cm) => cm._id === customModeId);
      if (customMode) {
        setEditingCustomMode(customMode);
      }
      return;
    }

    const modeObj = allModes.find((m) => m.value === value);

    // Add null check
    if (!modeObj) {
      console.error("Mode not found:", value);
      return;
    }

    const isValid = modeObj.package.includes(userPackage || "free");

    if (isValid) {
      setSelectedMode(value);
      setShowMessage({ show: false, Component: null });

      if (isCustomMode) {
        trackModeUsage(value);
      }
    } else {
      setShowMessage({ show: true, Component: value });
    }

    if (extraModes.some((m) => m?.value === value)) {
      // Add optional chaining
      setExtraMode(value);
    }
    handleMoreClose();
  };

  // Build list of tabs
  const displayedModes = extraMode
    ? [...initialModes, allModes.find((m) => m.value === extraMode)].filter(
        Boolean,
      ) // Remove undefined
    : initialModes;

  // Ensure extraMode stays in sync with selectedMode
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

  // Guard Tabs value
  const tabHasSelectedMode = displayedModes.some(
    (m) => m?.value === selectedMode,
  );
  const tabsValue = tabHasSelectedMode
    ? selectedMode
    : displayedModes[0]?.value || false;

  // Handle custom mode creation
  const handleCreateCustomMode = async (modeName) => {
    setIsCreatingMode(true);
    try {
      const newMode = await addCustomMode(modeName);
      if (newMode) {
        enqueueSnackbar(`Custom mode "${modeName}" created successfully!`, {
          variant: "success",
        });
        setCustomModeModalOpen(false);

        // Auto-select the newly created mode
        setSelectedMode(newMode.name);
        setShowMessage({ show: false, Component: null });
      }
    } catch (err) {
      enqueueSnackbar(customModeError || "Failed to create custom mode", {
        variant: "error",
      });
    } finally {
      setIsCreatingMode(false);
    }
  };

  // Handle custom mode update
  const handleUpdateCustomMode = async (newName) => {
    if (!editingCustomMode) return;

    // CRITICAL FIX: Close popover BEFORE updating
    // This prevents the "jump to top-left" visual glitch
    const modeId = editingCustomMode._id || editingCustomMode.id;
    const oldName = editingCustomMode.name || "Standard";

    // Clear popover state immediately
    setPopoverAnchor(null);
    setEditingCustomMode(null);

    try {
      const success = await updateCustomMode(modeId, newName);
      if (success) {
        enqueueSnackbar(`Mode updated to "${newName}"`, {
          variant: "success",
        });

        // Sync selectedMode state
        if (selectedMode === oldName) {
          setSelectedMode(newName);
        }

        // Sync extraMode state
        if (extraMode === oldName) {
          setExtraMode(newName);
        }
      }
    } catch (err) {
      enqueueSnackbar(customModeError || "Failed to update mode", {
        variant: "error",
      });
    }
  };

  // Handle custom mode deletion
  const handleDeleteCustomMode = async () => {
    if (!editingCustomMode) return;

    try {
      const modeId = editingCustomMode._id || editingCustomMode.id;
      const modeName = editingCustomMode.name;

      const success = await deleteCustomMode(modeId);
      if (success) {
        enqueueSnackbar(`Mode "${modeName}" deleted`, {
          variant: "success",
        });

        // CRITICAL: Switch to Standard BEFORE the mode is removed from state
        if (selectedMode === modeName) {
          setSelectedMode("Standard");
        }

        setEditingCustomMode(null);
        setPopoverAnchor(null);
      }
    } catch (err) {
      enqueueSnackbar("Failed to delete mode", {
        variant: "error",
      });
    }
  };

  // Handle tab click for custom modes
  const handleTabClick = (event, mode) => {
    console.log(mode, selectedMode, "tab clicked");

    if (mode.isCustom && mode.value === selectedMode) {
      setPopoverAnchor(event.currentTarget);
      setEditingCustomMode(customModes.find((cm) => cm._id === mode.id));
    }
  };

  // Open custom mode creation modal
  const handleOpenCustomModeModal = () => {
    if (!canCreateCustomModes) {
      enqueueSnackbar("Upgrade to Pro or Value plan to create custom modes", {
        variant: "warning",
      });
      return;
    }
    clearError();
    setCustomModeModalOpen(true);
    handleMoreClose(); // Close the More menu
  };

  // console.log(extraModes, "extraModes");

  console.log(editingCustomMode, "editingCustomMode");

  return (
    <>
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
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 2,
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
        >
          <Tabs
            value={tabsValue}
            onChange={(_, v) => {
              const mode = displayedModes.find((m) => m?.value === v);
              if (mode) {
                changeMode(v, mode?.isCustom, mode?.id);
              }
            }}
            variant="scrollable"
            scrollButtons={false}
            disabled={isLoading}
            sx={{
              flexWrap: "nowrap",
              overflowX: "auto",
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
                key={mode.id || idx}
                value={mode.value}
                onClick={(e) => handleTabClick(e, mode)}
                sx={{
                  px: { xs: 1.5, md: 2, xl: 2.5 },
                  position: "relative",
                }}
                label={
                  <Tooltip
                    title={
                      mode.isCustom
                        ? "Custom mode - Click to edit"
                        : freezeTooltip
                    }
                    arrow
                    enterDelay={300}
                    slotProps={{
                      tooltip: {
                        sx: {
                          maxWidth: 190,
                          width: 190,
                          minHeight: 40,
                          padding: "10px 12px",
                          fontSize: 13,
                          lineHeight: "1.2",
                          backgroundColor: "#222",
                        },
                      },
                      arrow: {
                        sx: {
                          color: "#222",
                        },
                      },
                    }}
                    placement="bottom"
                  >
                    <span>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {!mode.package.includes(userPackage || "free") && (
                          <Lock sx={{ width: 12, height: 12 }} />
                        )}
                        {mode.isCustom && (
                          <Badge
                            badgeContent={
                              <Edit sx={{ width: 10, height: 10 }} />
                            }
                            color="primary"
                            sx={{
                              "& .MuiBadge-badge": {
                                right: -8,
                                top: -4,
                                minWidth: 16,
                                height: 16,
                                padding: "0 2px",
                              },
                            }}
                          >
                            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                              {mode.value}
                            </Typography>
                          </Badge>
                        )}
                        {!mode.isCustom && (
                          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                            {mode.value}
                          </Typography>
                        )}
                      </Stack>
                    </span>
                  </Tooltip>
                }
              />
            ))}
          </Tabs>

          {/* "More" button - only show if there are extra modes OR always show for custom mode access */}
          <Box id="mode_more_section" sx={{ flexShrink: 0 }}>
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
                <MenuItem
                  key={mode.id || mode.value}
                  onClick={() => changeMode(mode.value, mode.isCustom, mode.id)}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {!mode.package.includes(userPackage || "free") && (
                      <Lock sx={{ width: 12, height: 12 }} />
                    )}
                    {mode.isCustom && (
                      <Edit
                        sx={{ width: 12, height: 12, color: "primary.main" }}
                      />
                    )}
                    <Typography>{mode.value}</Typography>
                  </Stack>
                </MenuItem>
              ))}

              {/* Custom mode creation item */}
              <MenuItem
                onClick={handleOpenCustomModeModal}
                sx={{
                  borderTop: extraModes.length > 0 ? "1px solid" : "none",
                  borderColor: "divider",
                  mt: extraModes.length > 0 ? 1 : 0,
                  pt: extraModes.length > 0 ? 1 : 0,
                  color: canCreateCustomModes
                    ? "primary.main"
                    : "text.disabled",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Add sx={{ width: 16, height: 16 }} />
                  <Typography>Create Custom Mode</Typography>
                  {!canCreateCustomModes && (
                    <Lock sx={{ width: 12, height: 12, ml: 0.5 }} />
                  )}
                </Stack>
              </MenuItem>
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
            max={80}
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
                setSelectedSynonyms(SYNONYMS[maxAllowedSynonymValue]);
              }
            }}
            sx={{
              mt: { xs: 2, sm: 1 },
              width: "100%",
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

      {/* Custom Mode Creation Modal */}
      <CustomModeModal
        open={customModeModalOpen}
        onClose={() => {
          setCustomModeModalOpen(false);
          clearError();
        }}
        recentModes={recentModes}
        recommendedModes={recommendedModes}
        onSubmit={handleCreateCustomMode}
        error={customModeError}
        isLoading={isCreatingMode}
      />

      {/* Custom Mode Edit Popover */}
      <CustomModePopover
        anchorEl={popoverAnchor}
        open={Boolean(popoverAnchor) && Boolean(editingCustomMode)}
        onClose={() => {
          setPopoverAnchor(null);
          setEditingCustomMode(null);
          clearError();
        }}
        modeName={editingCustomMode?.name || ""}
        recentModes={recentModes}
        recommendedModes={recommendedModes}
        onUpdate={handleUpdateCustomMode}
        onDelete={handleDeleteCustomMode}
        error={customModeError}
        isLoading={false}
      />
    </>
  );
};

export default ModeNavigation;
