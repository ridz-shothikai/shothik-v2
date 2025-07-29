"use client";

import React, { useState } from "react";
import { Toolbar, IconButton, Box, styled, Tooltip } from "@mui/material";
import { Home, HelpCircle, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";

const StyledAppBar = styled(Box)(({ theme }) => ({
  backgroundColor: "inherit",
  boxShadow: "none",
}));

const StyledIconButton = styled(IconButton)(({ theme, selected }) => ({
  color: selected ? "#00A76F" : "#888888",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#00A76F",
    color: "#ffffff",
  },
  "& svg": {
    width: 24,
    height: 24,
  },
}));

const NavigationBar = () => {
  const [selectedItem, setSelectedItem] = useState("home");
  const router = useRouter();

  const navigationItems = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    { id: "help", icon: HelpCircle, label: "Help", href: "/" },
    { id: "Settings", icon: Settings2, label: "Info", href: "/account/settings" },
  ];

  const handleItemClick = (itemId, href) => {
    setSelectedItem(itemId);
    router.push(href)
  };

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ minHeight: "56px !important" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            width: "100%",
          }}
        >
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Tooltip key={item.id} title={`${item.id}`} arrow>
                <StyledIconButton
                  selected={selectedItem === item.id}
                  onClick={() => handleItemClick(item.id, item.href)}
                  aria-label={item.label}
                >
                  <IconComponent />
                </StyledIconButton>
              </Tooltip>
            );
          })}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavigationBar;
