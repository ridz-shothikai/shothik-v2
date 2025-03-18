"use client";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import FooterServerComponent from "../../components/navigation/components/FooterServerComponent";
import SecondaryHeader from "../../components/navigation/SecondaryHeader";
import {
  useGetUserLimitQuery,
  useGetUserQuery,
} from "../../redux/api/auth/authApi";

export default function SecondaryLayout({ children }) {
  useGetUserQuery();
  useGetUserLimitQuery();

  return (
    <Box>
      <SecondaryHeader />

      <Box component='main' sx={{ minHeight: "calc(100vh - 100px)" }}>
        {children}
      </Box>

      <FooterServerComponent />
    </Box>
  );
}
