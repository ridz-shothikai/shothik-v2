"use client";
import { ContentPaste, SaveAsOutlined } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import FileUpload from "./FileUpload";
const supportedFileFormats = ["pdf", "docx"];

const UserActionInput = ({
  isMobile,
  handleSampleText,
  setUserInput,
  extraAction,
  disableTrySample = false,
}) => {
  async function handlePaste() {
    const clipboardText = await navigator.clipboard.readText();
    setUserInput(clipboardText);
    if (extraAction) extraAction();
  }

  const handleFileData = (htmlValue) => {
    const plainText = htmlValue
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ");
    const removeBreakTags = plainText
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
    setUserInput(removeBreakTags.trim());
    if (extraAction) extraAction();
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        bottom: { md: 80, xs: 30 },
        left: "0px",
        right: "0px",
      }}
    >
      <Stack
        direction='row'
        alignItems='start'
        justifyContent='center'
        flexWrap='wrap'
        rowGap={1.5}
        columnGap={2}
        sx={{ width: "80%", mx: "auto" }}
      >
        {!disableTrySample ? (
          <Button
            color='warning'
            size={isMobile ? "small" : "large"}
            variant='soft'
            onClick={handleSampleText}
            startIcon={<SaveAsOutlined />}
            sx={{
              border: { sm: "none", xs: "2px solid" },
              borderColor: "primary.warning",
              borderRadius: "5px",
              "&:hover": {
                borderColor: "primary.dark",
              },
            }}
          >
            {!isMobile ? "Try Sample Text" : "Try Sample"}
          </Button>
        ) : null}

        <Button
          size={isMobile ? "small" : "large"}
          variant='soft'
          color='secondary'
          onClick={handlePaste}
          sx={{
            border: { sm: "none", xs: "2px solid" },
            borderColor: "primary.secondary",
            borderRadius: "5px",
            "&:hover": {
              borderColor: "primary.dark",
            },
          }}
          startIcon={<ContentPaste />}
        >
          {!isMobile ? "Paste Text" : "Paste"}
        </Button>
        <Box>
          <FileUpload isMobile={isMobile} setInput={handleFileData} />
          <Typography
            component='p'
            variant='caption'
            sx={{
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            Supported {isMobile ? "" : "file"} formats:{" "}
            {supportedFileFormats.map((format, i) => (
              <React.Fragment key={i}>
                {format}
                {supportedFileFormats.length - 1 === i ? "." : ", "}
              </React.Fragment>
            ))}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default UserActionInput;
