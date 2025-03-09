"use client";
import { Box } from "@mui/material";
import FooterServerComponent from "../../components/navigation/components/FooterServerComponent";
import SecondaryHeader from "../../components/navigation/SecondaryHeader";
import { useGetUserLimitQuery, useGetUserQuery } from "../../redux/api/authApi";

export default function SecondaryLayout({ children }) {
  useGetUserQuery();
  useGetUserLimitQuery();

  return (
    <>
      <SecondaryHeader />

      <Box component='main' sx={{ minHeight: "calc(100vh - 100px)" }}>
        {children}
      </Box>

      <FooterServerComponent />
    </>
  );
}
