"use client";
import { Box } from "@mui/material";
import Main from "../../components/layout/Main";
import MainHeader from "../../components/navigation/MainHeader";
import NavMini from "../../components/navigation/NavMini";
import NavVertical from "../../components/navigation/NavVertical";
import { useSettingsContext } from "../../hooks/SettingsContext";
import useResponsive from "../../hooks/useResponsive";

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  const { themeLayout, open, handleClose, handleOpen } = useSettingsContext();
  const isMobile = useResponsive("down", "sm");
  const isNavMini = themeLayout === "mini";

  return (
    <>
      <MainHeader onOpenNav={handleOpen} />
      <Box
        sx={{
          bgcolor: "background.neutral",
          display: { sm: "flex" },
          minHeight: { sm: 1 },
          overflow: "hidden",
        }}
      >
        {!isMobile && isNavMini ? (
          <NavMini />
        ) : (
          <NavVertical openNav={open} onCloseNav={handleClose} />
        )}
        <Main>
          {/* <UserActionAlert /> */}
          {children}
        </Main>
      </Box>

      {/* login modal */}
      {/* <LoginModal />
      <RegisterModal /> */}
    </>
  );
}
