"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoginModal, RegisterModal } from "../../../components/auth/AuthModal";
import { Login } from "../../../components/auth/components/Login";
import { Register } from "../../../components/auth/components/Register";

// Create a theme for shared pages
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#07B37A",
    },
    secondary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default function SharedSheetLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        {/* Auth Modals */}
        <LoginModal>
          <Login />
        </LoginModal>
        <RegisterModal>
          <Register />
        </RegisterModal>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
