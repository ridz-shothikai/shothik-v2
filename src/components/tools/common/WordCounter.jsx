import { DeleteRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useResponsive from "../../../hooks/useResponsive";
import useWordLimit from "../../../hooks/useWordLimit";
import WordIcon from "../../../resource/assets/WordIcon";

const WordCounter = ({
  userInput,
  isLoading,
  toolName,
  handleClearInput,
  children,
  userPackage,
  handleSubmit,
  btnText,
  ExtraBtn = null,
  ExtraCounter = null,
}) => {
  const [wordCount, setWordCount] = useState(0);
  const isMobile = useResponsive("down", "sm");
  const { wordLimit } = useWordLimit(toolName);

  useEffect(() => {
    const words = userInput.trim() ? String(userInput).split(" ").length : 0;
    setWordCount(words);
  }, [userInput]);
  if (!userInput) return <Box sx={{ height: 48 }} />;
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        py: 1,
      }}
      bgcolor='background.paper'
    >
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        justifyContent={{ xs: "center", md: "space-between" }}
        height={48}
      >
        {userInput && (
          <Stack direction='row' spacing={1} alignItems='center'>
            <WordIcon />
            <Typography
              variant='subtitle2'
              sx={{
                color: `${wordCount > wordLimit ? "error.main" : ""}`,
                whiteSpace: "nowrap",
              }}
            >
              <b>{wordCount}</b> /{" "}
              {wordLimit === 9999 ? (
                <Typography component='span' sx={{ color: "primary.main" }}>
                  Unlimited
                </Typography>
              ) : (
                wordLimit
              )}
            </Typography>

            <Tooltip title='Clear text' placement='top' arrow>
              <IconButton
                aria-label='delete'
                size={isMobile ? "small" : "large"}
                variant={"outlined"}
                color='inherit'
                disabled={isLoading}
                onClick={handleClearInput}
                style={{ marginLeft: "-4px" }}
                disableRipple
              >
                <DeleteRounded sx={{ color: "text.secondary" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
        {ExtraCounter}
      </Stack>

      <Stack sx={{ flexDirection: "row", gap: 2 }}>
        {wordCount > wordLimit && userPackage !== "premium" && (
          <Link href='/pricing'>
            <Button variant='contained' size={isMobile ? "small" : "large"}>
              Upgrade
            </Button>
          </Link>
        )}
        <Button
          onClick={() => handleSubmit()}
          color='success'
          size={isMobile ? "small" : "large"}
          variant='contained'
          loading={isLoading}
          disabled={wordCount > wordLimit}
          sx={{ py: { md: 0 }, px: { md: 2 }, height: { md: 40 } }}
        >
          {btnText}
        </Button>
        {ExtraBtn}
      </Stack>
      {children}
    </Stack>
  );
};

export default WordCounter;
