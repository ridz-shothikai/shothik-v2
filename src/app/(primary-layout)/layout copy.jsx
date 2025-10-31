"use client";

import AuthSuccessPopup from "@/components/auth/AuthSuccessPopoup";
import VerifyEmailAlert from "@/components/auth/VerifyEmailAlert";
import MainHeader from "@/components/navigation/MainHeader";
import NavMini from "@/components/navigation/NavMini";
import NavVertical from "@/components/navigation/NavVertical";
import AlertDialog from "@/components/tools/common/AlertDialog";
import { useSidebar } from "@/hooks/ui/useSidebar";
import useResponsive from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import {
  useGetUserLimitQuery,
  useGetUserQuery,
  useLoginMutation,
} from "@/redux/api/auth/authApi";
import { setShowLoginModal, setShowRegisterModal } from "@/redux/slice/auth";
import { setOpen } from "@/redux/slice/settings";
import LoadingScreen from "@/resource/LoadingScreen";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PrimaryLayout({ children }) {
  const { open, sidebar } = useSelector((state) => state.settings);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const pathname = usePathname();
  const isSharedPage = pathname?.startsWith("/shared");
  const isMobile = useResponsive("down", "sm");
  const isCompact = sidebar === "compact";
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const { isLoading } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  useGetUserLimitQuery();

  const [login] = useLoginMutation();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  useGoogleOneTapLogin({
    onSuccess: async (res) => {
      try {
        const { email, name } = jwtDecode(res.credential);

        const response = await login({
          auth_type: "google",
          googleToken: res.credential,
          oneTapLogin: true,
          oneTapUser: {
            email,
            name,
          },
        });

        if (response?.data) {
          dispatch(setShowRegisterModal(false));
          dispatch(setShowLoginModal(false));
        }
      } catch (error) {
        console.error(error);
      }
    },
    flow: "auth-code",
    onError: (err) => {
      console.error(err);
    },
    scope: "email profile",
    disabled: isLoading || user?.email || isSharedPage, // Disable on shared pages
  });

  const { isMobileOpen, toggleMobile, closeMobile } = useSidebar();

  if (isLoadingPage) return <LoadingScreen />;

  return (
    <ProgressProvider
      color={"#00AB55"}
      options={{ showSpinner: false }}
      shallowRouting
    >
      <div>
        <MainHeader />
        <div
          className={cn(
            "bg-background min-h-screen w-full overflow-hidden sm:flex",
          )}
        >
          <div>
            {!isMobile && isCompact ? (
              <NavMini />
            ) : (
              <NavVertical
                openNav={open}
                onCloseNav={() => dispatch(setOpen(false))}
              />
            )}
          </div>
          <main className="flex-1 pt-20 sm:pt-24">
            <VerifyEmailAlert />
            {children}
            <AuthSuccessPopup />
            <AlertDialog />
          </main>
        </div>
      </div>
    </ProgressProvider>
  );
}
