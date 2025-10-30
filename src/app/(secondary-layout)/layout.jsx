"use client";
import FooterServerComponent from "@/components/navigation/components/FooterServerComponent";
import SecondaryHeader from "@/components/navigation/SecondaryHeader";
import {
  useGetUserLimitQuery,
  useGetUserQuery,
} from "@/redux/api/auth/authApi";
import LoadingScreen from "@/resource/LoadingScreen";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export default function SecondaryLayout({ children }) {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const { accessToken } = useSelector((state) => state.auth);
  useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  useGetUserLimitQuery();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) return <LoadingScreen />;

  return (
    <ProgressProvider
      height="3px"
      color="#00AB55"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <SecondaryHeader />

      <main>{children}</main>

      <FooterServerComponent />
    </ProgressProvider>
  );
}
