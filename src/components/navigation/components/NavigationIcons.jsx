"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HelpCircle, Home, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NavigationBar = () => {
  const [selectedItem, setSelectedItem] = useState("home");
  const router = useRouter();

  const navigationItems = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    { id: "help", icon: HelpCircle, label: "Help", href: "/" },
    {
      id: "Settings",
      icon: Settings2,
      label: "Info",
      href: "/account/settings",
    },
  ];

  const handleItemClick = (itemId, href) => {
    setSelectedItem(itemId);
    router.push(href);
  };

  return (
    <div className="bg-inherit">
      <div className="flex min-h-[56px] w-full items-center justify-between gap-1">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selectedItem === item.id;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleItemClick(item.id, item.href)}
                  aria-label={item.label}
                  className={cn(
                    "h-12 w-12 transition-all duration-200",
                    isSelected
                      ? "text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground"
                      : "text-muted-foreground hover:bg-primary hover:text-primary-foreground",
                  )}
                >
                  <IconComponent className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.id}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;
