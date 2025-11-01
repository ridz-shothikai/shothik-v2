"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ----------------------------------------------------------------------

export default function NavList({ data, layout, onCloseNav }) {
  const pathname = usePathname();
  const isActive = pathname === data.path;
  const { title, path, icon, iconColor } = data;
  const isCompact = layout === "compact";

  return (
    <Link
      data-umami-event={`Nav: ${title}`}
      href={path}
      id={data?.id}
      onClick={() => {
        if (onCloseNav) onCloseNav();
        else return;
      }}
      className={cn(
        "relative mb-0.5 flex items-center rounded-md capitalize transition-colors",
        isCompact
          ? "w-[72px] min-w-[72px] flex-col justify-center px-2"
          : "w-full flex-row justify-start px-4",
        isActive
          ? "text-primary bg-primary/10 hover:bg-primary/10 hover:text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center",
            isCompact ? "mb-0" : "mr-4",
          )}
          style={{ color: iconColor }}
        >
          {icon}
        </div>
      )}

      <span
        className={cn(
          "flex-grow",
          isCompact
            ? "whitespace-wrap text-center text-xs"
            : "text-start text-base whitespace-nowrap",
        )}
      >
        {title === "AI Detector" ? (
          <>
            AI
            <br className={isCompact ? "block" : "hidden"} /> Detector
          </>
        ) : (
          title
        )}
      </span>
    </Link>
  );
}
