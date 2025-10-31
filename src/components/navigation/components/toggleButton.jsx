"use client";

import { Button } from "@/components/ui/button";
import useResponsive from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { toggleSidebar } from "@/redux/slice/settings";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

// ----------------------------------------------------------------------

export default function NavToggleButton({ className, ...other }) {
  const { sidebar } = useSelector((state) => state.settings);
  const isDesktop = useResponsive("up", "sm");
  const dispatch = useDispatch();

  if (!isDesktop) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => {
        dispatch(toggleSidebar());
      }}
      className={cn("bg-card rounded-full border border-dashed", className)}
      {...other}
    >
      {sidebar === "vertical" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
}
