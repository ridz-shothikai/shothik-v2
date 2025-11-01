"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useThemeMode } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
  const { mode, preference, setPreference, nextTransition, mounted } =
    useThemeMode();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Theme toggle"
        disabled
        className="opacity-50"
        data-testid="button-theme-toggle"
      >
        <Monitor className="h-5 w-5" />
      </Button>
    );
  }

  const ThemeIcon = mode === "dark" ? Moon : Sun;

  const formatNextTransition = () => {
    if (!nextTransition) return "";

    const { nextTheme, hoursUntil } = nextTransition;
    const NextIcon = nextTheme === "dark" ? Moon : Sun;

    if (hoursUntil === 0) {
      return (
        <span className="flex items-center gap-1">
          Switches soon <NextIcon className="h-3 w-3" />
        </span>
      );
    } else if (hoursUntil === 1) {
      return (
        <span className="flex items-center gap-1">
          Switches in 1 hour <NextIcon className="h-3 w-3" />
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1">
          Switches in {hoursUntil} hours <NextIcon className="h-3 w-3" />
        </span>
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Theme toggle"
          data-testid="button-theme-toggle"
        >
          <ThemeIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem
          onClick={() => setPreference("auto")}
          data-testid="menu-theme-auto"
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <div>
              <div className="text-body2">Auto (Time-based)</div>
              {preference === "auto" && nextTransition && (
                <div className="text-caption text-muted-foreground">
                  {formatNextTransition()}
                </div>
              )}
            </div>
          </div>
          {preference === "auto" && <Check className="text-primary h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setPreference("light")}
          data-testid="menu-theme-light"
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <div className="text-body2">Light</div>
          </div>
          {preference === "light" && <Check className="text-primary h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setPreference("dark")}
          data-testid="menu-theme-dark"
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <div className="text-body2">Dark</div>
          </div>
          {preference === "dark" && <Check className="text-primary h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
