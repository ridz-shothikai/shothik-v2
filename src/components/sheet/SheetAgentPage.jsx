"use client";

import { CheckCircle, Person } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRegisterUserToBetaListMutation } from "../../redux/api/auth/authApi";
import EmailModal from "../home/EmailCollectModal";
import SheetChatArea from "./SheetChatArea";
import SheetDataArea from "./SheetDataArea";

export default function SheetAgentPage({ specificAgent, sheetId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const initialPrompt = sessionStorage.getItem("initialPrompt");
    if (initialPrompt) {
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        message: initialPrompt,
        timestamp: new Date().toISOString(),
        isOptimistic: true,
      };
      setOptimisticMessages((prev) => [...prev, optimisticMessage]);
      setIsLoading(true);
      sessionStorage.removeItem("initialPrompt");
    }
  }, []);

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

  return (
    <Box
      sx={{
        height: {
          xs: "90dvh",
          lg: "calc(100dvh - 70px)",
        },
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {isMobile ? (
          <>
            <Box
              sx={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SheetChatArea
                currentAgentType={specificAgent}
                // isLoading={isLoading}
                theme={theme}
                // for mobile preview panel
                handlePreviewOpen={handlePreviewOpen}
              />
            </Box>
            <Dialog
              open={previewOpen}
              onClose={handlePreviewClose}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  height: "80vh",
                  maxHeight: "80vh",
                  position: "relative",
                  bgcolor: theme.palette.background.default,
                },
              }}
            >
              <DialogContent sx={{ p: 0, overflow: "hidden" }}>
                <SheetDataArea
                  isLoadings={isLoading}
                  sheetId={sheetId}
                  theme={theme}
                  isMobile={isMobile}
                />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gridTemplateRows: "1fr",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                borderRight: `1px solid ${theme.palette.divider}`,
              }}
            >
              <SheetChatArea
                currentAgentType={specificAgent}
                isLoading={isLoading}
                theme={theme}
              />
            </Box>
            <Box
              sx={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <SheetDataArea
                isLoadings={isLoading}
                sheetId={sheetId}
                theme={theme}
                isMobile={isMobile}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export const FooterCta = ({ isMobile, showModal, setShowModal }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });

  const [
    registerUserForBetaList,
    { isLoading: registerUserProcessing, isError: registerUserError },
  ] = useRegisterUserToBetaListMutation();

  const handleEmailSubmit = async (email) => {
    try {
      const result = await registerUserForBetaList({ email }).unwrap();

      console.log(result, "result");

      // Success toast
      setToast({
        open: true,
        message: "Successfully registered for beta! We'll be in touch soon.",
        severity: "success",
      });

      // Close the modal
      setShowModal(false);
    } catch (error) {
      // Error toast
      setToast({
        open: true,
        message:
          error?.data?.message || "Registration failed. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#0D1F0F",
          color: "white",
          py: 1.5,
          px: 2,
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="space-between"
            flexWrap={"wrap"}
            gap={isMobile ? 1 : 2}
            spacing={isMobile ? 2 : 1}
            sx={{ width: "100%" }}
          >
            {/* Left side - Icon and text */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ flex: 1 }}
            >
              <CheckCircle
                sx={{
                  color: "#00AB55",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Shothik task replay completed.
              </Typography>
            </Stack>
            {/* Right side - Action buttons */}
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                flexShrink: 0,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Button
                data-umami-event="Modal: Join the waitlist"
                variant="contained"
                startIcon={<Person sx={{ fontSize: 18 }} />}
                onClick={() => {
                  setShowModal(true);
                }}
                sx={{
                  backgroundColor: "#00AB55",
                  color: "white",
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.75,
                  fontSize: "14px",
                  fontWeight: 500,
                  minHeight: "36px",
                  flex: isMobile ? 1 : "none",
                  "&:hover": {
                    backgroundColor: "#008F47",
                  },
                }}
              >
                Join the waitlist
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* email modal */}
      <EmailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleEmailSubmit}
      />

      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};
