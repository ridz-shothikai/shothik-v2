"use client";
import { Box, Container, Grid2 } from "@mui/material";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatContainer from "../../../components/agent/ChatContainer";
import ComputerWindow from "../../../components/agent/ComputerWindow";
import InputArea from "../../../components/agent/InputArea";
import useResponsive from "../../../hooks/useResponsive";

export default function AgentPage() {
  const [computerLogs, setComputerLogs] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useResponsive("down", "md");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [taskProgress, setTaskProgress] = useState([]);

  async function requestToAgent(message) {
    try {
      setLoading(true);
      setError("");

      if (!user?._id) {
        throw new Error("User ID is not available");
      }

      const formData = new FormData();
      formData.append("query", message);
      formData.append("user_id", user._id);
      formData.append("session_id", user._id);
      const response = await fetch("http://localhost:5001/agent", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      while (!done) {
        const { done: readerDone, value } = await reader.read();
        done = readerDone;
        if (value) {
          const data = decoder.decode(value, { stream: !done });
          const fixed = data.replace(/\\'/g, "'");
          if (fixed.includes("Error:")) {
            throw fixed;
          }
          try {
            fixed.split("json_data:").forEach((item) => {
              if (item.trim() !== "") {
                console.log("newMessage", item);

                const newMessage = JSON.parse(item);

                if (newMessage?.type === "tool") {
                  setTaskProgress((prev) => {
                    const lastContent = prev[prev.length - 1];
                    if (lastContent?.status === "progress") {
                      lastContent.status = "success";
                    } else {
                      prev.push({
                        name: newMessage?.message?.slice(0, 200),
                        status: "progress",
                      });
                    }
                    return [...prev];
                  });
                }

                setChatHistory((history) => {
                  // Create a copy to avoid direct state mutation
                  const updatedHistory = [...history];

                  // Check if history is empty or last message is not from assistant
                  if (
                    updatedHistory[updatedHistory.length - 1].role !==
                    "assistant"
                  ) {
                    // Add new assistant message with the new data
                    updatedHistory.push({
                      role: "assistant",
                      content: [newMessage],
                    });
                  } else {
                    // Last message is from assistant
                    const lastMessage =
                      updatedHistory[updatedHistory.length - 1];
                    const lastContent =
                      lastMessage.content[lastMessage.content.length - 1];

                    // Check if agent_name matches and both are tool type
                    if (lastContent.agent_name === newMessage.agent_name) {
                      if (
                        lastContent.type === "tool" &&
                        newMessage.type === "tool"
                      ) {
                        // Update status and data of existing content
                        // lastContent.status = newMessage.status;
                        // lastContent.data = newMessage.data;
                      } else {
                        //  Add as new content inside the last content data
                        if (lastContent.data) {
                          const lastContentData =
                            lastContent.data[lastContent.data.length - 1];
                          if (
                            lastContentData.status === "progress" &&
                            lastContentData.agent_name === newMessage.agent_name
                          ) {
                            // Update existing in-progress message of the same type
                            lastContentData.status = newMessage.status;
                            lastContentData.data = newMessage.data;
                          } else {
                            lastContent.data.push(newMessage);
                          }
                        } else {
                          lastContent.data = [newMessage];
                        }
                      }
                    } else {
                      // Add as new content
                      lastMessage.content.push(newMessage);
                    }
                  }

                  return updatedHistory;
                });
              }
            });
          } catch (error) {
            console.error("Error parsing JSON: ", fixed, "error: ", error);
          }
        }
      }
    } catch (error) {
      console.log("Error in requestToAgent:", error);
      setError(
        error.message || "An error occurred while processing your request."
      );
    } finally {
      setLoading(false);
    }
  }

  const addChatHistory = async (content, role) => {
    setChatHistory((prev) => {
      return [
        ...prev,
        {
          role,
          content: content,
        },
      ];
    });
    if (role === "user") {
      requestToAgent(content);
    }
  };

  const handleSideView = (log) => {
    setExpanded(true);
    setComputerLogs(log);
  };

  useEffect(() => {
    if (chatHistory.length < 2) return;
    const lastMessage = chatHistory[chatHistory.length - 1];

    if (lastMessage?.role !== "assistant") return;

    const lastContent = lastMessage.content;
    if (!lastContent) return;
    if (lastContent.length === 0) return;

    const lastData = lastContent[lastContent.length - 1];
    if (!lastData) return;

    if (lastData?.message?.includes("##")) {
      handleSideView({
        type: "result",
        message: "Shothik AI Agent Task is completed",
        data: lastData.message,
      });
    } else {
      const lastMessagesData = lastData?.data;
      if (!lastMessagesData || !lastMessagesData?.length) return;
      const lastMessage = lastMessagesData[lastMessagesData.length - 1];
      if (lastMessage?.type !== "text" && lastMessage?.status === "success") {
        handleSideView(lastMessage);
      }
    }
  }, [chatHistory]);

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Container maxWidth={expanded ? "xl" : "md"} sx={{ height: "100%" }}>
        <Grid2 container spacing={2} sx={{ position: "relative" }}>
          {/* Right Side or loggin side */}
          <Grid2
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "calc(100vh - 90px)",
            }}
            size={{ xs: 12, md: expanded ? 6 : 12 }}
          >
            {/* Chat messages area */}
            <ChatContainer
              handleSideView={handleSideView}
              chatHistory={chatHistory}
            />

            {/* Input area */}
            <InputArea
              addChatHistory={addChatHistory}
              loading={loading}
              error={error}
            />
          </Grid2>

          {/* Window side for showing image or .md file */}
          <AnimatePresence initial={false}>
            {expanded ? (
              <Grid2
                size={{ xs: 12, md: 6 }}
                sx={{
                  height: "calc(100vh - 90px)",
                  ...(isMobile && {
                    position: "absolute",
                    top: 0,
                    bottom: 5,
                    right: 5,
                    left: 0,
                    zIndex: 50,
                  }),
                }}
              >
                <ComputerWindow
                  computerLogs={computerLogs}
                  closeWindow={() => setExpanded(false)}
                  taskProgress={taskProgress}
                />
              </Grid2>
            ) : null}
          </AnimatePresence>
        </Grid2>
      </Container>
    </Box>
  );
}
