"use client";

import { Box } from "@mui/material";
import HeaderTitle from "./ui/HeaderTitle";
import TabsPanel from "./ui/TabPanel";
import ResearchDataArea from "./ui/ResearchDataArea";
import { useState } from "react";

export default function ResearchAgentPage() {
  const [headerHeight, setHeaderHeight] = useState(20); // default
  return (
    <Box
      sx={{
        maxWidth: { xs: "1000px" },
        minHeight: "calc(100dvh - 70px)",
        marginInline: "auto",
        position: "relative",
        backgroundColor: "#F4F6F8",
        overflowY: "auto",
        px: {xs: 2, sm: 0}
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "#F4F6F8",
          width: "100%",
        }}
      >
        <HeaderTitle
          headerHeight={headerHeight}
          setHeaderHeight={setHeaderHeight}
        />
        <TabsPanel />
      </Box>

      {/* data area */}
      <ResearchDataArea headerHeight={headerHeight} />
    </Box>
  );
}
