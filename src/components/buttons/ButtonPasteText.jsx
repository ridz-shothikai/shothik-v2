"use client";

import { cn } from "@/lib/utils";
import { ContentPaste } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";

const ButtonPasteText = ({
  className,
  onApply,
  onClick,
  isTooltip = true,
  children,
  ...props
}) => {
  const handlePaste = async (e) => {
    try {
      const text = await navigator.clipboard.readText();
      onApply?.(text);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  return (
    <Tooltip className={cn(className)} title="Paste text" arrow placement="top">
      <Button
        className="shrink-0 whitespace-nowrap"
        color="primary"
        variant="outlined"
        size="small"
        onClick={(e) => {
          handlePaste(e);
          onClick?.(e);
        }}
        startIcon={<ContentPaste />}
        {...props}
      >
        Paste Text
      </Button>
    </Tooltip>
  );
};

export default ButtonPasteText;
