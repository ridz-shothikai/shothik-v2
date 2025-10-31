import { HEADER } from "@/config/config/nav";
import { PATH_PAGE } from "@/config/config/route";
import useResponsive from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import Logo from "@/resource/assets/Logo";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AccountPopover from "./components/AccountProper";
import SecondaryNavForMobile from "./SecondaryNavForMobile";

const navConfig = [
  {
    title: "Home",
    icon: Home,
    path: "/?utm_source=internal",
  },
  {
    title: "Pricing",
    icon: MonetizationOn,
    path: PATH_PAGE.pricing,
  },
];

export default function SecondaryHeader() {
  const { accessToken, user } = useSelector((state) => state.auth);
  const [showShadow, setShowShadow] = useState(false);
  const isDesktop = useResponsive("up", "md");
  const router = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowShadow(true);
      } else {
        setShowShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "bg-background/80 sticky top-0 z-40 w-full backdrop-blur-sm",
        showShadow ? "shadow-sm" : "",
      )}
      style={{
        height: isDesktop ? HEADER.H_MAIN_DESKTOP - 16 : HEADER.H_MOBILE,
      }}
    >
      <div className="flex h-full w-full items-center px-4">
        <div className="flex w-full items-center justify-between">
          <Logo />

          <nav className="flex items-center gap-2">
            {isDesktop ? (
              <div className="flex items-center gap-2">
                {navConfig?.map((link) => {
                  const isActive = router === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.title}</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <SecondaryNavForMobile data={navConfig} />
            )}

            <AccountPopover accessToken={accessToken} user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
}
