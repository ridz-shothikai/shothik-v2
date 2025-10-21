"use client";
import useSnackbar from "@/hooks/useSnackbar";
import { IconButton } from "@mui/material";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

const ButtonCopy = ({ text }) => {
  const enqueueSnackbar = useSnackbar();
  const [showCopy, setShowCopy] = useState(true);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    enqueueSnackbar("Copied URL");
    setShowCopy(false);
    setTimeout(() => {
      setShowCopy(true);
    }, 3000);
  }

  return (
    <IconButton onClick={handleCopy}>
      {showCopy ? <Copy /> : <Check />}
    </IconButton>
  );
};

export default ButtonCopy;
