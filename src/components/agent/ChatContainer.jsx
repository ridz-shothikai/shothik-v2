import { Stack } from "@mui/material";
import AgentMessage from "./AgentMessage";
import UserMessage from "./UserMessage";

export default function ChatContainer({ chatHistory, handleSideView }) {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
      {chatHistory.map((message, index) =>
        message.role === "user" ? (
          <UserMessage key={index} message={message} />
        ) : (
          <AgentMessage
            handleSideView={handleSideView}
            key={index}
            message={message}
          />
        )
      )}
    </Stack>
  );
}
