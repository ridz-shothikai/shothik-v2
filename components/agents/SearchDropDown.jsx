"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { KeyboardArrowDown, Search } from "@mui/icons-material";
import SvgColor from "../../src/resource/SvgColor";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const SearchDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("Level 1-3");
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth);
  console.log(user?.package, "user");

  // Check if user has premium access
  const userPackage = user?.package || "free";
  const isPremiumUser = ["value_plan", "pro_plan", "unlimited"].includes(
    userPackage
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (level, isPremium = false) => {
    // If it's a premium feature and user doesn't have premium access
    if (isPremium && !isPremiumUser) {
      // Close the menu first
      setAnchorEl(null);

      // Redirect to pricing page
      const redirectUrl = `/pricing?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
      return;
    }

    // For free features or premium users with premium features
    setSelectedLevel(level);
    setAnchorEl(null);
  };

  const handleUpgradeClick = (event) => {
    // Prevent event bubbling to avoid triggering the menu item click
    event.stopPropagation();

    // Close the menu
    setAnchorEl(null);

    // Navigate to pricing page
    const redirectUrl = `/pricing?redirect=${encodeURIComponent(pathname)}`;
    router.push(redirectUrl);
  };

  const searchLevels = [
    {
      level: "Level 1-3",
      title: "Quick Research",
      description:
        "Fast, essential points only - from brief summary to Level 1 to a brief paragraph with key facts at Level 3",
      icon: "/agents/quick-research.svg",
      isPremium: false,
    },
    {
      level: "Level 4-7",
      title: "Standard Research",
      description:
        "Balanced detail - from concise 7 insights at Level 4 to a comprehensive written-up with examples and context at Level 7",
      icon: "/agents/standard-research.svg",
      isPremium: true,
    },
    {
      level: "Level 8-10",
      title: "Deep Dive",
      description:
        "Maximum depth - from detailed analysis at Level 8 to a full executive-style report with exhaustive references at Level 10",
      icon: "/agents/deep-dive.svg",
      isPremium: true,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <Box
          sx={{
            "&:focus-within": {
              borderColor: "#00c851",
            },
          }}
        >
          {/* Dropdown Button */}
          <Button
            onClick={handleClick}
            endIcon={<KeyboardArrowDown />}
            sx={{
              borderRadius: "6px",
              backgroundColor: "#00A76F29",
              color: "#637381",
              fontWeight: 600,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              textTransform: "none",
              "& .MuiButton-endIcon": {
                marginLeft: "4px",
              },
            }}
          >
            {isMobile ? selectedLevel.replace("Level ", "Lv ") : selectedLevel}
          </Button>
        </Box>
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: isMobile ? 200 : 320,
              maxWidth: isMobile ? 300 : 400,
              border: "1px solid #e9ecef",
              "& .MuiMenuItem-root": {
                whiteSpace: "normal",
                wordBreak: "break-word",
              },
            },
          },
        }}
      >
        {searchLevels.map((item, index) => {
          const isPremiumFeature = item.isPremium && !isPremiumUser;

          return (
            <MenuItem
              key={index}
              onClick={() => handleMenuItemClick(item.level, item.isPremium)}
              selected={selectedLevel === item.level}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                py: 2,
                px: 3,
                borderBottom:
                  index < searchLevels.length - 1
                    ? "1px solid #f0f0f0"
                    : "none",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
                "&.Mui-selected": {
                  backgroundColor: "#e8f5e8",
                  "&:hover": {
                    backgroundColor: "#d4edda",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 0.5,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <SvgColor
                      src={item.icon}
                      sx={{
                        width: { xs: 18, md: 20 },
                        height: { xs: 18, md: 20 },
                        color:
                          selectedLevel === item.level ? "#00c851" : "#333",
                      }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color:
                          selectedLevel === item.level ? "#00c851" : "#333",
                        mr: 1,
                      }}
                    >
                      {item.level}
                    </Typography>
                    {item.isPremium && (
                      <Typography
                        variant="caption"
                        sx={{
                          backgroundColor: "#07B37A",
                          color: "white",
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        {isPremiumUser ? "PRO" : "PRO"}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color:
                        selectedLevel === item.level ? "#00c851" : "#00c851",
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>

                {/* Show upgrade button only for premium features when user is not premium */}
                {isPremiumFeature && (
                  <Button
                    onClick={handleUpgradeClick}
                    color="primary"
                    size={isMd ? "medium" : "small"}
                    variant="contained"
                    rel="noopener"
                    startIcon={
                      <SvgColor
                        src="/navbar/diamond.svg"
                        sx={{
                          width: { xs: 18, md: 20 },
                          height: { xs: 18, md: 20 },
                        }}
                      />
                    }
                    sx={{
                      backgroundColor: "#07B37A",
                    }}
                  >
                    upgrade
                  </Button>
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.8rem",
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default SearchDropdown;
