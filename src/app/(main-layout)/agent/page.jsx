"use client";
import { Box, Container, Grid2 } from "@mui/material";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import ChatContainer from "../../../components/agent/ChatContainer";
import ComputerWindow from "../../../components/agent/ComputerWindow";
import InputArea from "../../../components/agent/InputArea";
import RenderMarkdown from "../../../components/agent/RenderMarkdown";
import useResponsive from "../../../hooks/useResponsive";

export default function AgentPage() {
  const [computerLogs, setComputerLogs] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useResponsive("down", "md");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestToAgent(message) {
    try {
      const formData = new FormData();
      formData.append("query", message);
      formData.append("user_id", "user_1");
      formData.append("session_id", "session_1");
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
          const rawData = data.replace("json_data: ", "").trim();
          const fixed = rawData.replace(/\\'/g, "'");
          if (rawData.includes("Error:")) {
            throw fixed;
          }
          try {
            const newMessage = JSON.parse(fixed);

            console.log("newMessage", fixed);

            setChatHistory((history) => {
              // Create a copy to avoid direct state mutation
              const updatedHistory = [...history];

              // Check if history is empty or last message is not from assistant
              if (
                updatedHistory[updatedHistory.length - 1].role !== "assistant"
              ) {
                // Add new assistant message with the new data
                updatedHistory.push({
                  role: "assistant",
                  content: [newMessage],
                });
              } else {
                // Last message is from assistant
                const lastMessage = updatedHistory[updatedHistory.length - 1];
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
          } catch (error) {
            console.error("Error parsing JSON:", fixed, error);
          }
        }
      }
    } catch (error) {
      console.error("Error in requestToAgent:", error);
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
      // for (const newMessage of agentDataArray) {
      // setChatHistory((history) => {
      //   // Create a copy to avoid direct state mutation
      //   const updatedHistory = [...history];

      //   // Check if history is empty or last message is not from assistant
      //   if (updatedHistory[updatedHistory.length - 1].role !== "assistant") {
      //     // Add new assistant message with the new data
      //     updatedHistory.push({
      //       role: "assistant",
      //       content: [newMessage],
      //     });
      //   } else {
      //     // Last message is from assistant
      //     const lastMessage = updatedHistory[updatedHistory.length - 1];
      //     const lastContent =
      //       lastMessage.content[lastMessage.content.length - 1];

      //     // Check if agent_name matches and both are tool type
      //     if (lastContent.agent_name === newMessage.agent_name) {
      //       if (lastContent.type === "tool" && newMessage.type === "tool") {
      //         // Update status and data of existing content
      //         // lastContent.status = newMessage.status;
      //         // lastContent.data = newMessage.data;
      //       } else {
      //         //  Add as new content inside the last content data
      //         if (lastContent.data) {
      //           const lastContentData =
      //             lastContent.data[lastContent.data.length - 1];
      //           if (
      //             lastContentData.status === "progress" &&
      //             lastContentData.agent_name === newMessage.agent_name
      //           ) {
      //             // Update existing in-progress message of the same type
      //             lastContentData.status = newMessage.status;
      //             lastContentData.data = newMessage.data;
      //           } else {
      //             lastContent.data.push(newMessage);
      //           }
      //         } else {
      //           lastContent.data = [newMessage];
      //         }
      //       }
      //     } else {
      //       // Add as new content
      //       lastMessage.content.push(newMessage);
      //     }
      //   }

      //   return updatedHistory;
      // });
      // setChatHistory((history) => {
      //   const updated = [...history];

      //   if (
      //     updated.length === 0 ||
      //     updated[updated.length - 1].role !== "assistant"
      //   ) {
      //     // First message or previous message wasn't from assistant
      //     updated.push({
      //       role: "assistant",
      //       content: [newData],
      //     });
      //   } else {
      //     const lastMessage = updated[updated.length - 1];
      //     const content = lastMessage.content;

      //     // Find if there's an existing message from this agent with:
      //     // 1. Same agent_name
      //     // 2. Same message type (text or tool)
      //     // 3. Status is "progress"
      //     const existingIndex = content.findIndex(
      //       (item) =>
      //         item.agent_name === newData.agent_name &&
      //         item.type === newData.type &&
      //         item.status === "progress"
      //     );

      //     if (existingIndex !== -1) {
      //       // Update existing in-progress message of the same type
      //       content[existingIndex] = {
      //         ...content[existingIndex],
      //         status: newData.status,
      //         data: newData.data,
      //       };
      //     } else {
      //       // Add as new message (either different agent, different type, or previous was already "success")
      //       content.push(newData);
      //     }
      //   }

      //   return updated;
      // });
      // }
    }
  };

  console.log("chatHistory", chatHistory);

  const handleSideView = (log) => {
    setExpanded(true);
    setComputerLogs(log);
  };

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
            <InputArea addChatHistory={addChatHistory} loading={loading} />
          </Grid2>

          {/* Window side for showing image or .md file */}
          {!result ? (
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
                  />
                </Grid2>
              ) : null}
            </AnimatePresence>
          ) : (
            <Grid2
              sx={{ height: "calc(100vh - 90px)", overflow: "auto" }}
              size={{ xs: 12, md: 6 }}
            >
              <RenderMarkdown content={result} />
            </Grid2>
          )}
        </Grid2>
      </Container>
    </Box>
  );
}
