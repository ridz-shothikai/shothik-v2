"use client";
import { HEADER, NAV } from "@/config/config/nav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FooterServerComponent from "../navigation/components/FooterServerComponent";
import MobileNavigation from "../navigation/MobileNavigation";

const SPACING = 8;

export default function Main({ children }) {
  const { sidebar } = useSelector((state) => state.settings);
  const isNavMini = sidebar === "compact";
  const pathName = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const containerWidth = [
    "/",
    "/paraphrase",
    "/grammar-checker",
    "/humanize-gpt",
    "/ai-detector",
    "/plagiarism-checker",
    "/summarize",
  ].includes(pathName)
    ? "w-full"
    : "max-w-screen-xl";

  const ptMobile = `${HEADER.H_MOBILE + SPACING}px`;
  const ptDesktop = `${HEADER.H_DASHBOARD_DESKTOP + SPACING}px`;
  const widthDesktop = `calc(100% - ${NAV.W_DASHBOARD}px)`;
  const widthMini = `calc(100% - ${NAV.W_DASHBOARD_MINI}px)`;

  return (
    <main
      className={cn(
        "relative flex-1",
        pathName === "/" ? "bg-background" : "bg-muted/30",
      )}
      style={{
        paddingTop: isDesktop ? ptDesktop : ptMobile,
        ...(isDesktop && {
          width: isNavMini ? widthMini : widthDesktop,
          ...(isNavMini && {
            marginLeft: "95px",
          }),
        }),
      }}
    >
      <div
        className={cn(
          containerWidth,
          "min-h-[calc(100vh-70px)] overflow-hidden",
        )}
      >
        {!pathName.startsWith("/account") ? <MobileNavigation /> : null}
        {pathName.startsWith("/paraphrase") ? (
          <div className="relative flex justify-evenly">
            <div className="flex w-full flex-col">{children}</div>
            {/* <VerticalMenu/> */}
          </div>
        ) : (
          children
        )}
      </div>
      {pathName !== "/research" &&
      !pathName.startsWith("/agents") &&
      !pathName.startsWith("/slide") ? (
        <FooterServerComponent />
      ) : null}
    </main>
  );
}
