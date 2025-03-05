"use client";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import VerifyEmailAlert from "../../components/auth/VerifyEmailAlert";
import Main from "../../components/layout/Main";
import MainHeader from "../../components/navigation/MainHeader";
import NavMini from "../../components/navigation/NavMini";
import NavVertical from "../../components/navigation/NavVertical";
import useResponsive from "../../hooks/useResponsive";
import { useGetUserLimitQuery, useGetUserQuery } from "../../redux/api/authApi";
import { setOpen } from "../../redux/slice/settings";

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  const { open, themeLayout } = useSelector((state) => state.settings);
  const isMobile = useResponsive("down", "sm");
  const isNavMini = themeLayout === "mini";
  const dispatch = useDispatch();
  useGetUserQuery();
  useGetUserLimitQuery();

  return (
    <>
      <MainHeader />
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
          <NavVertical
            openNav={open}
            onCloseNav={() => dispatch(setOpen(false))}
          />
        )}
        <Main>
          <VerifyEmailAlert />
          {children}
        </Main>
      </Box>
    </>
  );
}
