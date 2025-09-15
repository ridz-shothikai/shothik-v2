"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  Tabs,
  Tab,
  Badge,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import ResearchProcessLogs from "./ResearchProcessLogs";
import { useSelector } from "react-redux";
import { researchCoreState } from "../../../redux/slice/researchCoreSlice";

// Styled components matching the real components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    minHeight: "46px",
  },
  [theme.breakpoints.up("md")]: {
    minHeight: "56px",
  },
  "& .MuiTabs-flexContainer": {
    height: "46px",
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#07B37A",
    height: "3px",
    bottom: 0,
  },
  "& .MuiTab-root": {
    textTransform: "none",
    minWidth: "auto",
    fontWeight: 400,
    color: "#929CA7",
    [theme.breakpoints.up("xs")]: {
      padding: "0px 12px",
      fontSize: "10px",
    },
    [theme.breakpoints.up("md")]: {
      padding: "4px 16px",
      fontSize: "12px",
    },
    [theme.breakpoints.up("lg")]: {
      padding: "6px 14px",
      fontSize: "12px",
    },
    [theme.breakpoints.up("xl")]: {
      padding: "12px 20px",
      fontSize: "14px",
    },
    "&.Mui-selected": {
      color: "#07B37A",
      fontWeight: 500,
    },
    "&:hover": {
      color: "#07B37A",
      opacity: 0.8,
    },
  },
}));

const TabWithIcon = styled(Tab)(({ theme }) => ({
  minWidth: "0 !important",
  margin: 0,
  marginRight: "10px !important",
  "& .MuiTab-iconWrapper": {
    marginBottom: "4px",
    marginRight: "8px",
  },
  "& .tab-content": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  "& .tab-icon": {
    position: "relative",
    width: 20,
    height: 20,
    [theme.breakpoints.up("lg")]: {
      width: 22,
      height: 22,
    },
    [theme.breakpoints.up("xl")]: {
      width: 28,
      height: 28,
    },
  },
}));

const ResearchStreamingShell = ({
  streamEvents = [],
  isStreaming = false,
  userQuery = "",
}) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [titleCharCount, setTitleCharCount] = useState(100);
  const researchCoreData = useSelector(researchCoreState);

  // Get the query from session storage if not provided
  const displayQuery =
    userQuery ||
    sessionStorage.getItem("initialResearchPrompt") ||
    researchCoreData?.userPrompt ||
    "";

  // Truncate title to match HeaderTitle component behavior
  const getTruncatedTitle = (text, maxChars) => {
    if (!text) return "Research in Progress...";
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + "…";
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Calculate dynamic counts based on streaming events
  const getSourceCount = () => {
    let total = 0;
    streamEvents.forEach((event) => {
      if (event.data?.sources_gathered) {
        total += event.data.sources_gathered.length;
      }
      if (event.data?.sources_count) {
        total = Math.max(total, event.data.sources_count);
      }
    });
    return total;
  };

  const getImageCount = () => {
    const imageEvents = streamEvents.filter(
      (event) => event.step === "image_search" && event.data?.images_found > 0
    );
    return imageEvents.reduce(
      (total, event) => total + (event.data?.images_found || 0),
      0
    );
  };

  const sourceCount = getSourceCount();
  const imageCount = getImageCount();

  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: theme.palette.mode === "dark" ? "#161C24" : "#F4F6F8",
        }}
      >
        {/* Header Section - Matches HeaderTitle */}
        <Box
          sx={{
            mb: { xl: 1 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
            padding: 1,
            position: "relative",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "16px",
                sm: "16px",
                md: "20px",
                lg: "22px",
                xl: "30px",
              },
              fontWeight: "700",
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
          >
            {getTruncatedTitle(displayQuery, titleCharCount)}
          </Typography>

          {/* Download button placeholder - matches HeaderTitle */}
          <Button
            disabled
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[100],
              borderRadius: "6px",
              width: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
              height: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
              minWidth: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
              minHeight: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
              padding: { xs: "4px", lg: "8px", xl: "12px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              opacity: 0.5,
            }}
          >
            <Image
              src={"/agents/edit.svg"}
              alt={"Download"}
              width={24}
              height={24}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                filter:
                  theme.palette.mode === "dark"
                    ? "invert(1) brightness(0.9)"
                    : "none",
              }}
            />
          </Button>
        </Box>

        {/* Tab Panel - Matches TabsPanel */}
        <Box
          sx={{ width: "100%", borderBottom: 1, borderColor: "divider", mb: 2 }}
        >
          <StyledTabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="research tabs"
            scrollButtons="off"
          >
            <TabWithIcon
              label={
                <div className="tab-content">
                  <div className="tab-icon">
                    <Image
                      src={
                        selectedTab === 0
                          ? "/agents/ans-active.svg"
                          : "/agents/ans.svg"
                      }
                      alt="Research"
                      fill
                    />
                  </div>
                  <span>Research</span>
                </div>
              }
            />
            <TabWithIcon
              label={
                <div className="tab-content">
                  <div className="tab-icon">
                    <Image
                      src={
                        selectedTab === 1
                          ? "/agents/img-active.svg"
                          : "/agents/img.svg"
                      }
                      alt="Images"
                      fill
                    />
                  </div>
                  <Badge
                    badgeContent={imageCount > 0 ? imageCount : null}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.6rem",
                        minWidth: "16px",
                        height: "16px",
                      },
                    }}
                  >
                    <span>Images</span>
                  </Badge>
                </div>
              }
            />
            <TabWithIcon
              label={
                <div className="tab-content">
                  <div className="tab-icon">
                    <Image
                      src={
                        selectedTab === 2
                          ? "/agents/sources-active.svg"
                          : "/agents/sources.svg"
                      }
                      alt="Sources"
                      fill
                    />
                  </div>
                  <Badge
                    badgeContent={sourceCount > 0 ? sourceCount : null}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.6rem",
                        minWidth: "16px",
                        height: "16px",
                      },
                    }}
                  >
                    <span>Sources</span>
                  </Badge>
                </div>
              }
            />
          </StyledTabs>
        </Box>
      </Box>

      {/* Research Process Timeline */}
      {streamEvents.length > 0 && (
        <ResearchProcessLogs
          streamEvents={streamEvents}
          researches={[]}
          isStreaming={isStreaming}
        />
      )}
    </Box>
  );
};

export default ResearchStreamingShell;
