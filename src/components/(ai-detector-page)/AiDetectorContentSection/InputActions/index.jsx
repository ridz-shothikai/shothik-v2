"use client";

import useWordLimit from "@/hooks/useWordLimit";
import { cn } from "@/lib/utils";
import SvgColor from "@/resource/SvgColor";
import { DeleteRounded } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const InputActions = ({
  className,
  isLoading,
  input,
  setInput,

  toolName,
  userPackage,

  label,
  icon,
  enabled = false,
  disabled = false,
  onClear,
  onSubmit,
}) => {
  const [wordCount, setWordCount] = useState(0);
  const { wordLimit } = useWordLimit(toolName);

  useEffect(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [input]);

  if (!input) return <div className="h-12" />;

  const exceedsLimit = wordCount > wordLimit && userPackage !== "unlimited";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-4 py-2",
        className,
      )}
    >
      <div
        className={`flex flex-1 items-center gap-2 ${
          label === "Fix Grammar" ? "w-full sm:w-auto" : ""
        }`}
      >
        <div
          className={`text-sm whitespace-nowrap ${
            wordCount > wordLimit ? "text-destructive" : ""
          }`}
        >
          <b>{wordCount}</b> /{" "}
          {wordLimit === 9999 ? (
            <span className="text-primary">Unlimited</span>
          ) : (
            wordLimit
          )}
        </div>

        {/* Clear text */}
        <Tooltip title="Clear text" arrow placement="top">
          <IconButton
            aria-label="delete"
            size="small"
            disabled={isLoading}
            onClick={onClear}
          >
            <DeleteRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      <div className={`flex flex-1 items-center justify-end gap-2`}>
        {exceedsLimit && (
          <Link href="/pricing">
            <Button
              variant="contained"
              startIcon={
                <SvgColor src="/navbar/diamond.svg" className="h-5 w-5" />
              }
              sx={{ py: { md: 0 }, px: { md: 2 }, height: { md: 40 } }}
            >
              Upgrade
            </Button>
          </Link>
        )}

        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!enabled ? wordCount > wordLimit : disabled || false}
          sx={{
            py: { md: 0 },
            px: { md: 2 },
            height: { md: 40 },
            whiteSpace: "nowrap",
          }}
          startIcon={icon}
        >
          {label}
        </Button>
      </div>
    </div>
  );
};

export default InputActions;
