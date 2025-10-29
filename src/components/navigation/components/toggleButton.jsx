import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import useResponsive from "../../../hooks/useResponsive";
import { toggleThemeLayout } from "../../../redux/slice/settings";
import { setIsNavVertical } from "../../../redux/slice/tools";

// ----------------------------------------------------------------------

export default function NavToggleButton({ className, ...other }) {
  const { themeLayout } = useSelector((state) => state.settings);
  const isDesktop = useResponsive("up", "sm");
  const dispatch = useDispatch();
  const isVerticalNav = useSelector((state) => state.tools.isNavVertical);

  if (!isDesktop) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => {
        dispatch(toggleThemeLayout());
        dispatch(setIsNavVertical(!isVerticalNav));
      }}
      className={cn("bg-card rounded-full border border-dashed", className)}
      {...other}
    >
      {themeLayout === "vertical" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
}
