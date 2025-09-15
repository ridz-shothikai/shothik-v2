"use client";

import React from "react";
import {
  Box,
  Container,
  Skeleton,
  Paper,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const TabSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: "#fafafa",
}));

const BulletPoint = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(2),
}));

const ResearchPageSkeletonLoader = () => {
  return (
    <StyledContainer maxWidth="lg">
      {/* Header Section */}
      <HeaderSection>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </HeaderSection>

      {/* Tab Navigation */}
      <TabSection>
        <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={80} height={24} />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="rectangular" width={20} height={20} />
            <Skeleton variant="text" width={60} height={24} />
            <Skeleton variant="circular" width={20} height={20} />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={70} height={24} />
            <Skeleton variant="circular" width={20} height={20} />
          </Stack>
        </Stack>
      </TabSection>

      {/* Main Content */}
      <ContentCard
        elevation={0}
        sx={{
          bgcolor: (theme) => theme.palette.mode === "dark" && "#161C24",
        }}
      >
        {/* Title */}
        <Skeleton
          variant="text"
          width="60%"
          height={45}
          sx={{ mb: 3 }}
          animation="wave"
        />

        {/* Introduction Section */}
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width={120}
            height={28}
            sx={{ mb: 2 }}
            animation="wave"
          />

          {/* Paragraph skeletons */}
          <Stack spacing={1}>
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="95%" animation="wave" />
            <Skeleton variant="text" width="88%" animation="wave" />
            <Skeleton variant="text" width="92%" animation="wave" />
            <Skeleton variant="text" width="85%" animation="wave" />
            <Skeleton variant="text" width="90%" animation="wave" />
            <Skeleton variant="text" width="75%" animation="wave" />
          </Stack>
        </Box>

        {/* Section 1 */}
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width="70%"
            height={32}
            sx={{ mb: 2 }}
            animation="wave"
          />

          {/* Section content */}
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="93%" animation="wave" />
            <Skeleton variant="text" width="88%" animation="wave" />
            <Skeleton variant="text" width="45%" animation="wave" />
          </Stack>
        </Box>
      </ContentCard>
    </StyledContainer>
  );
};

export default ResearchPageSkeletonLoader;
