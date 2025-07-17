import { Box } from "@mui/material";
import InputArea from "../presentation/InputArea";
import { useState } from "react";

export default function SheetChatArea({
  currentAgentType,
  isLoading,
}) {
    const [inputValue, setInputValue] = useState("");

    const handleNewMessage = () => {
        console.log(inputValue, "input value");
    }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        borderRight: "1px solid #e0e0e0",
        bgcolor: "#fafafa",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "3px",
            "&:hover": { background: "#a8a8a8" },
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#c1c1c1 transparent",
        }}
      >
        <Box
          sx={{
            p: 3,
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          Sheet chat area
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: "1px solid #e0e0e0",
          bgcolor: "white",
          flexShrink: 0,
          maxHeight: "300px",
          overflow: "hidden",
        }}
      >
        <InputArea
          currentAgentType={currentAgentType}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={handleNewMessage}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
}
