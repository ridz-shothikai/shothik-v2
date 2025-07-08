"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  useFetchSharedSlidesQuery,
  useTrackViewMutation,
} from "../../../../redux/api/share/shareApi";
import SlidePreviewNavbar from "../../../../components/slide/SlidePreviewNavbar";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { PresentationMode } from "../../slides/page";
import { SlideCard } from "../../slides/page";
import { usePresentation } from "../../../../components/slide/context/SlideContext";

export default function SharedSlidesPage() {
  const { shareLink } = useParams();
  const { isPresentationOpen, closePresentation } = usePresentation();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [authError, setAuthError] = useState("");

  // Fetch shared presentation data
  const {
    data: sharedData,
    isLoading: sharedLoading,
    error: sharedError,
    refetch,
  } = useFetchSharedSlidesQuery(
    { shareLink, password },
    {
      skip: !shareLink,
    }
  );

  // console.log(sharedData, "Shared Data");

  // Mutation to track view
  const [trackView] = useTrackViewMutation();

  // Handle password dialog and share settings
  useEffect(() => {
    if (sharedData?.settings?.password && !passwordDialogOpen && !password) {
      setPasswordDialogOpen(true);
    }

    // Track view if enabled
    if (sharedData?.trackViews && sharedData?.shareId) {
      trackView({ shareId: sharedData.shareId }).catch((err) => {
        console.error("Failed to track view:", err);
      });
    }
  }, [sharedData, trackView, passwordDialogOpen, password]);

  // Handle errors
  useEffect(() => {
    if (sharedError?.data?.error) {
      if (
        sharedError.data.error ===
        "Sign-in required to access this presentation"
      ) {
        setAuthError("Please sign in to view this presentation.");
      } else if (sharedError.data.error === "Invalid password") {
        setPasswordError("Invalid password");
      } else if (sharedError.data.error === "Share link has expired") {
        setAuthError("This share link has expired.");
      } else {
        setAuthError(
          sharedError.data.error || "Error loading shared presentation"
        );
      }
    }
  }, [sharedError]);

  // Handle password submission
  const handlePasswordSubmit = async () => {
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    setPasswordError("");
    refetch(); // Re-fetch with the provided password
  };

  if (sharedLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Loading shared presentation...</Typography>
      </Box>
    );
  }

  if (authError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Alert severity="error">{authError}</Alert>
        {authError.includes("sign in") && (
          <Button
            variant="contained"
            href="/login" // Adjust based on your auth flow
            sx={{ textTransform: "none" }}
          >
            Sign In
          </Button>
        )}
      </Box>
    );
  }

  if (
    !sharedData?.presentation?.slides ||
    sharedData.presentation.slides.length === 0
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography>
          No slides available for this shared presentation
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Navbar */}
      <SlidePreviewNavbar
        slidesData={sharedData.presentation.slides}
        PresentationTitle={sharedData.presentation.title}
        shareSettings={sharedData.settings}
      />

      {/* Presentation Mode */}
      <PresentationMode
        slides={sharedData.presentation.slides.map((slide) => ({
          ...slide,
          htmlContent: slide.body, // Pass HTML content for rendering
        }))}
        open={
          isPresentationOpen && sharedData?.presentation?.slides?.length > 0
        }
        onClose={closePresentation}
      />

      {/* Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            error={!!passwordError}
            helperText={passwordError}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPasswordDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            sx={{ textTransform: "none" }}
            disabled={!password}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          py: 4,
          px: 2,
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: { xs: "90vw", sm: "60vw" }, mb: 3 }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            {sharedData.presentation.title || "Shared Presentation"}
          </Typography>
          {sharedData.presentation.slides.map((slide, index) => (
            <SlideCard
              key={slide.slide_index || index}
              slide={{
                ...slide,
                htmlContent: slide.body, // Pass HTML content for rendering
              }}
              index={index}
              totalSlides={sharedData.presentation.slides.length}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}
