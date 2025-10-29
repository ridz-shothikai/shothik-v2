"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import navConfig from "../../config/config/navConfig";
import useResponsive from "../../hooks/useResponsive";
import Logo from "../../resource/assets/Logo";
import NavigantionIcons from "./components/NavigationIcons";
import NavSectionVertical from "./components/NavSectionVertical";
import NavToggleButton from "./components/toggleButton";
import UserInfo from "./components/UserInfo";

export default function NavVertical({ openNav, onCloseNav }) {
  const { user, accessToken } = useSelector((state) => state.auth);
  const isDesktop = useResponsive("up", "sm");

  return (
    <nav className={cn("bg-background relative", "flex-shrink-0", "sm:w-60")}>
      <NavToggleButton className="absolute top-12 -right-4" />

      {isDesktop ? (
        <div
          className={cn(
            "fixed top-0 left-0 z-40 h-full",
            "w-60",
            "bg-background border-border border-r border-dashed",
          )}
        >
          <NavContent
            accessToken={accessToken}
            onCloseNav={onCloseNav}
            user={user}
          />
        </div>
      ) : (
        // Sheet for mobile
        <Sheet open={openNav} onOpenChange={onCloseNav}>
          <SheetContent
            side="left"
            className={cn(
              "w-60 p-0",
              "bg-background border-border border-r border-dashed",
            )}
          >
            <NavContent
              accessToken={accessToken}
              onCloseNav={onCloseNav}
              user={user}
            />
          </SheetContent>
        </Sheet>
      )}
    </nav>
  );
}

// Separate component for shared navigation content
function NavContent({ accessToken, onCloseNav, user }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="bg-background h-full">
        <div
          className={cn(
            "flex flex-col gap-6",
            "pt-2 pr-5 pl-8",
            "flex-shrink-0",
          )}
        >
          <Logo />
        </div>

        <NavSectionVertical
          onCloseNav={onCloseNav}
          data={navConfig}
          user={user}
        />

        <div className="flex-grow" />
      </div>
      <div className="mt-32">
        {!accessToken ? <UserInfo /> : <NavigantionIcons />}
      </div>
    </div>
  );
}
