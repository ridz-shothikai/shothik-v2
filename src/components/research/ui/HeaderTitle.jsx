"use client";

import { Box, Button, Typography, TextField, useMediaQuery, useTheme } from "@mui/material";
import { SaveIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function HeaderTitle({ headerHeight, setHeaderHeight, query }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(query ||"");
  const [titleWidth, setTitleWidth] = useState();
  const titleRef = useRef(null);
  const [titleCharCount, setTitleCharCount] = useState(60);

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  // const { currentResearch } = useSelector((state) => state.researchCore);

  // Initialize title from sessionStorage
  useEffect(() => {
    if (query) {
      setTitle(query);
    } else {
      const initialQuery =
        sessionStorage.getItem("initialResearchPrompt") || "";
      setTitle(initialQuery);
    }
  }, [query]);

  // Measure Typography dimensions
  useEffect(() => {
    if (titleRef.current) {
      setHeaderHeight(titleRef.current.offsetHeight);
      setTitleWidth(titleRef.current.offsetWidth);
    }
  }, [title, isEditing]);

  useEffect(() => {
    if(isMd) {
      setTitleCharCount(40); 
    } else {
      setTitleCharCount(100);
    }
  }, [isMd]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    sessionStorage.setItem("initialResearchPrompt", title);
    setIsEditing(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSaveClick();
    if (event.key === "Escape") {
      const originalQuery =
        sessionStorage.getItem("initialResearchPrompt") || "";
      setTitle(originalQuery);
      setIsEditing(false);
    }
  };

  // Truncate to 100 characters with ellipsis
  const getTruncatedTitle = (text, maxChars) => {
    if (text.length <= maxChars) {
      return text;
    }
    return text.slice(0, maxChars) + "…";
  };

  return (
    <Box
      sx={{
        mb: { xl: 1 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        padding: 1,
        position: "relative",
      }}
    >
      {/* Overlay */}
      {isEditing && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#07B37A",
            opacity: 0.05,
            border: "1px solid #000000",
            borderRadius: "inherit",
            zIndex: 0,
          }}
        />
      )}

      {isEditing ? (
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSaveClick}
          autoFocus
          fullWidth
          variant="standard"
          multiline
          // minRows={1}
          maxRows={1}
          sx={{
            height: headerHeight,
            // maxWidth: titleWidth,
            "& .MuiInputBase-input": {
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
                lg: "22px",
                xl: "30px",
              },
              fontWeight: "700",
              fontFamily: "inherit",
              border: "none",
              height: "100%",
              boxSizing: "border-box",
              resize: "none",
              overflow: "hidden",
              lineHeight: {md:1.2},
            },
            "& .MuiInput-underline:before": {
              borderBottom: "none",
            },
            "& .MuiInput-underline:hover:before": {
              borderBottom: "none !important",
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none",
            },
          }}
        />
      ) : (
        <Typography
          ref={titleRef}
          variant="h1"
          sx={{
            fontSize: {
              xs: "16px",
              sm: "16px",
              md: "20px",
              lg: "22px",
              xl: "30px",
            },
            fontWeight: "700",
            cursor: "pointer",
            // lineHeight: 1.2,
            "&:hover": { opacity: 0.8 },
          }}
          onClick={handleEditClick}
        >
          {getTruncatedTitle(title, titleCharCount)}
        </Typography>
      )}

      <Button
        onClick={isEditing ? handleSaveClick : handleEditClick}
        sx={{
          backgroundColor: "#FFF",
          borderRadius: "6px",
          width: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
          height: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
          minWidth: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
          minHeight: { xs: "24px", md: "28px", lg: "36px", xl: "48px" },
          padding: { xs: "4px", lg: "8px", xl: "12px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: "#f5f5f5",
            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          },
        }}
      >
        {isEditing ? (
          <SaveIcon width={24} height={24} color="#212B36" />
        ) : (
          <Image
            src={"/agents/edit.svg"}
            alt={"Edit title"}
            width={24}
            height={24}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        )}
      </Button>
    </Box>
  );
}
