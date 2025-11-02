"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetUserQuery } from "@/redux/api/auth/authApi";
import { setOpen } from "@/redux/slices/settings-slice";
import Logo from "@/resource/assets/Logo";
import { Gem, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import AccountPopover from "./components/AccountProper";

export default function MainHeader() {
  const { accessToken, user } = useSelector((state) => state.auth);
  const { sidebar } = useSelector((state) => state.settings);
  const isCompact = sidebar === "compact";
  const { isLoading } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  const pathname = usePathname();
  const dispatch = useDispatch();

  return (
    <header
      className={cn(
        "bg-background/80 sticky top-0 z-50 w-full backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "h-14 w-full px-0 lg:px-3",
          pathname === "/" ? "border-border border-b" : "",
        )}
      >
        <div className="flex h-full w-full items-center px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(setOpen(true))}
              className="mr-1 sm:ml-1"
              aria-label="Open navigation"
            >
              <Menu className="text-primary h-5 w-5" />
            </Button>
            {/* <Logo /> */}
          </div>

          <div className={cn("flex w-full items-center justify-between gap-4")}>
            {isCompact && <Logo className="hidden lg:block" />}

            {/* <div className="flex grow justify-center">
              <h5 className="text-muted-foreground text-base font-medium">
                {title()}
              </h5>
            </div> */}

            <div className="flex items-center gap-2 md:gap-3">
              {isLoading ? (
                <div className="flex items-center gap-1">
                  <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                  <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                  <span className="bg-primary h-2 w-2 animate-bounce rounded-full" />
                </div>
              ) : (
                user?.package !== "unlimited" && (
                  <Link href={"/pricing?redirect=" + pathname}>
                    <Button
                      data-umami-event="Nav: Upgrade To Premium"
                      className={cn("h-9 px-3 text-xs md:text-sm")}
                    >
                      <Gem className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                      {user?.email ? "Upgrade" : "Upgrade Plan"}
                    </Button>
                  </Link>
                )
              )}

              {!isLoading && (
                <AccountPopover accessToken={accessToken} user={user} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
