"use client";

import { Tabs, Tab, Box, Badge, styled } from "@mui/material";
import Image from "next/image";

// Custom styled tabs container
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

// Tab with icon + text
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

export default function TabsPanel({ selectedTab, sources, images, onTabChange }) {
  const handleChange = (event, newValue) => {
    onTabChange(newValue);
  };

  // Count unique sources
  const uniqueSourcesCount = sources
    ? sources.filter(
        (source, index, self) =>
          index === self.findIndex((s) => s.url === source.url)
      ).length
    : 0;

  const imagesCount = images ? images.length : 0;

  return (
    <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
      <StyledTabs
        value={selectedTab}
        onChange={handleChange}
        aria-label="navigation tabs"
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
                badgeContent={imagesCount > 0 ? imagesCount : null}
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
                badgeContent={
                  uniqueSourcesCount > 0 ? uniqueSourcesCount : null
                }
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
  );
}
