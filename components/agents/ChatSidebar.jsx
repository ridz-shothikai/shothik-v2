"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format } from "date-fns";

export default function ChatSidebar({
  sidebarOpen,
  toggleDrawer,
  isMobile,
  isNavbarExpanded,
  isDarkMode,
  isLoading,
  error,
  router,
  myChats = [],
  SlideDataLoading,
  slidesChats,
  SlideDataLoadingError,
  researchData,
  researchDataLoading,
  researchDataError,
}) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  console.log("researchData in ChatSidebar:", researchData);
  console.log("researchDataLoading in ChatSidebar:", researchDataLoading);
  console.log("researchDataError in ChatSidebar:", researchDataError);

  return (
    <Drawer
      anchor="left"
      open={sidebarOpen}
      onClose={toggleDrawer(false)}
      ModalProps={{ keepMounted: true }}
      sx={{
        zIndex: 1102,
        "& .MuiDrawer-paper": {
          position: "absolute",
          left: isMobile ? 0 : isNavbarExpanded ? 273 : 100,
          width: { xs: "100vw", sm: 320, md: 360 },
          maxWidth: { xs: "100vw", sm: "calc(100vw - 320px)" },
          bgcolor: isDarkMode ? "#1e272e" : "#fff",
          color: isDarkMode ? "#eee" : "#333",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs value={tabIndex} onChange={handleTabChange} sx={{ px: 2 }}>
            <Tab label="Sheet" />
            <Tab label="Slide" />
            <Tab label="Research" />
          </Tabs>
          <IconButton onClick={toggleDrawer(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {tabIndex === 0 && (
            <>
              {/* your existing sheet‑listing UI */}
              {isLoading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Loading chats…</Typography>
                </Box>
              )}
              {error && (
                <Typography color="text.secondary">No chats found</Typography>
              )}
              {!isLoading && myChats.length === 0 && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <ChatBubbleOutlineIcon
                    sx={{ fontSize: 48, color: "text.disabled" }}
                  />
                  <Typography>No chats yet</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a new conversation to see it here
                  </Typography>
                </Box>
              )}
              {myChats.length > 0 && (
                <Stack spacing={1}>
                  {myChats.map((chat) => (
                    <Card
                      key={chat._id || chat.id}
                      onClick={() =>
                        router.push(`/agents/sheets?id=${chat._id}`)
                      }
                      sx={{
                        cursor: "pointer",
                        border: 1,
                        borderColor: "divider",
                        "&:hover": {
                          bgcolor: "action.hover",
                          borderColor: "primary.main",
                        },
                        transition: "transform 0.1s",
                        "&:active": { transform: "scale(0.98)" },
                      }}
                      elevation={0}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography noWrap fontWeight={600} title={chat.name}>
                          {chat.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          {format(
                            new Date(chat.createdAt),
                            "dd/MM/yyyy, hh:mm a"
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </>
          )}

          {tabIndex === 1 && (
            <>
              {SlideDataLoading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Loading chats…</Typography>
                </Box>
              )}
              {SlideDataLoadingError && (
                <Typography color="text.secondary">No chats found</Typography>
              )}
              {!SlideDataLoading && slidesChats?.length === 0 && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <ChatBubbleOutlineIcon
                    sx={{ fontSize: 48, color: "text.disabled" }}
                  />
                  <Typography>No chats yet</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a new conversation to see it here
                  </Typography>
                </Box>
              )}
              {slidesChats?.length > 0 && (
                <Stack spacing={1}>
                  {slidesChats.map((chat) => (
                    <Card
                      key={chat.p_id}
                      onClick={() =>
                        router.push(`/agents/presentation?id=${chat.p_id}`)
                      }
                      sx={{
                        cursor: "pointer",
                        border: 1,
                        borderColor: "divider",
                        "&:hover": {
                          bgcolor: "action.hover",
                          borderColor: "primary.main",
                        },
                        transition: "transform 0.1s",
                        "&:active": { transform: "scale(0.98)" },
                      }}
                      elevation={0}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography noWrap fontWeight={600} title={chat.title}>
                          {chat.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          {format(
                            new Date(chat.creation_date),
                            "dd/MM/yyyy, hh:mm a"
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </>
          )}

          {tabIndex === 2 && (
            <>
              {researchDataLoading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                  }}
                >
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Loading chats…</Typography>
                </Box>
              )}
              {researchDataError && (
                <Typography color="text.secondary">No chats found</Typography>
              )}
              {!researchDataLoading && researchData?.length === 0 && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <ChatBubbleOutlineIcon
                    sx={{ fontSize: 48, color: "text.disabled" }}
                  />
                  <Typography>No chats yet</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a new conversation to see it here
                  </Typography>
                </Box>
              )}
              {researchData?.length > 0 && (
                <Stack spacing={1}>
                  {researchData.map((chat) => (
                    <Card
                      key={chat._id}
                      onClick={() =>
                        router.push(`/agents/research?id=${chat._id}`)
                      }
                      sx={{
                        cursor: "pointer",
                        border: 1,
                        borderColor: "divider",
                        "&:hover": {
                          bgcolor: "action.hover",
                          borderColor: "primary.main",
                        },
                        transition: "transform 0.1s",
                        "&:active": { transform: "scale(0.98)" },
                      }}
                      elevation={0}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography noWrap fontWeight={600} title={chat.name}>
                          {chat.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          {format(
                            new Date(chat.createdAt),
                            "dd/MM/yyyy, hh:mm a"
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
