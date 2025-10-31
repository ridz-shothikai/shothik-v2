/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NAV } from "@/config/config/nav";
import Logo from "@/resource/assets/Logo";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

export default function SecondaryNavForMobile({ data }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      handleClose();
    }
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleOpen}>
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[var(--nav-width)] p-0"
          style={{
            // provide runtime nav width
            ["--nav-width"]: `${NAV.W_BASE}px`,
          }}
        >
          <div className="px-4 py-3">
            <Logo />
          </div>

          <nav className="flex flex-col">
            {data.map((link) => {
              const isActive = pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={
                    isActive
                      ? "text-primary inline-flex items-center gap-2 px-4 py-2"
                      : "text-muted-foreground inline-flex items-center gap-2 px-4 py-2"
                  }
                  onClick={handleClose}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{link.title}</span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
