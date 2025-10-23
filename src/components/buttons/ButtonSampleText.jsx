"use client";

import { cn } from "@/lib/utils";
import { SaveAsOutlined } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";

const ButtonSampleText = ({
  className,
  sample = "",
  onApply,
  onClick,
  isTooltip = true,
  children,
  ...props
}) => {
  const handleSampleText = () => {
    try {
      if (!sample) return;

      onApply?.(sample);
    } catch (error) {
      console.error("Failed to apply sample text:", error);
    }
  };

  return (
    <Tooltip
      className={cn(className)}
      title="Try sample text"
      arrow
      placement="top"
    >
      <Button
        color="primary"
        variant="outlined"
        onClick={(e) => {
          handleSampleText();
          onClick?.(e);
        }}
        startIcon={<SaveAsOutlined />}
        {...props}
      >
        Try Sample
      </Button>
    </Tooltip>
  );
};

export default ButtonSampleText;
