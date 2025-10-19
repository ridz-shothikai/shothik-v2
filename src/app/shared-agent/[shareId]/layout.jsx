"use client";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthSuccessPopup from "../../../components/auth/AuthSuccessPopoup";
import VerifyEmailAlert from "../../../components/auth/VerifyEmailAlert";
import Main from "../../../components/layout/Main";
import MainHeader from "../../../components/navigation/MainHeader";
import NavMini from "../../../components/navigation/NavMini";
import NavVertical from "../../../components/navigation/NavVertical";
import AlertDialog from "../../../components/tools/common/AlertDialog";
import useResponsive from "../../../hooks/useResponsive";
import {
  useGetUserLimitQuery,
  useGetUserQuery,
} from "../../../redux/api/auth/authApi";
import { setOpen } from "../../../redux/slice/settings";
import LoadingScreen from "../../../resource/LoadingScreen";

export default function SharedAgentLayout({ children }) {
  const { open, themeLayout } = useSelector((state) => state.settings);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const isMobile = useResponsive("down", "sm");
  const isNavMini = themeLayout === "mini";
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const { isLoading } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  useGetUserLimitQuery();

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) return <LoadingScreen />;

  return (
    <ProgressProvider
      height="3px"
      color={"#00AB55"}
      options={{ showSpinner: false }}
      shallowRouting
    >
      <Box>
        <MainHeader />
        <Box
          sx={{
            bgcolor: isDarkMode ? "#212121" : "background.neutral",
            display: { sm: "flex" },
            minHeight: { sm: 1 },
            overflow: "hidden",
          }}
        >
          {!isMobile && isNavMini ? (
            <NavMini isDarkMode={isDarkMode} />
          ) : (
            <NavVertical
              openNav={open}
              onCloseNav={() => dispatch(setOpen(false))}
            />
          )}
          <Main>
            <VerifyEmailAlert />
            {children}
            <AuthSuccessPopup />
            <AlertDialog />
          </Main>
        </Box>
      </Box>
    </ProgressProvider>
  );
}
