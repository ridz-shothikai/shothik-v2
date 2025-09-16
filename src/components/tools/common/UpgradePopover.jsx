"use client";

import { Popover, Typography, Button } from "@mui/material";
import { Diamond } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function UpgradePopover({
  anchorEl,
  onClose,
  redirectPath = "/pricing?redirect=/humanize-gpt",
  message = "Unlock advanced features and enhance your humanize experience.",
}) {
  const router = useRouter();
  const open = Boolean(anchorEl);

  return (
    <Popover
      id="upgrade-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      disableRestoreFocus
      PaperProps={{
        sx: {
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          width: 300,
          textAlign: "center",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{ mt: 1, mb: 2, color: "text.secondary" }}
      >
        {message}
      </Typography>
      <Button
        variant="contained"
        color="success"
        size="small"
        startIcon={<Diamond />}
        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        onClick={() => {
          router.push(redirectPath);
          onClose();
        }}
      >
        Upgrade To Premium
      </Button>
    </Popover>
  );
}
