// components/InputArea.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/system';

const PRIMARY_GREEN = '#07B37A';

export default function InputArea({ currentAgentType, inputValue, setInputValue, onSend, isLoading }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        bgcolor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "#f8f9fa",
      }}
    >
      <Box
        sx={{
          bgcolor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#f8f9fa",
          borderRadius: 4,
          p: 3,
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder={
              currentAgentType === "presentation"
                ? "Create a presentation about..."
                : "Ask anything, create anything..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "transparent",
                color: "#333",
                fontSize: "1rem",
                border: "none",
                "& fieldset": { border: "none" },
                "& input": { color: "#333" },
                "& textarea": { color: "#333" },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                color: "#999",
                opacity: 1,
              },
            }}
          />
          {/* <IconButton
            sx={{ color: "#666", "&:hover": { color: PRIMARY_GREEN } }}
          >
            <MicIcon />
          </IconButton> */}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <Button
            startIcon={<PersonIcon />}
            sx={{
              color: "#666",
              textTransform: "none",
              "&:hover": {
                color: PRIMARY_GREEN,
                bgcolor: "rgba(7, 179, 122, 0.1)",
              },
            }}
          >
            Personalize
          </Button> */}
          <IconButton
            onClick={() => onSend()}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              bgcolor: PRIMARY_GREEN,
              color: "white",
              width: 40,
              height: 40,
              "&:hover": { bgcolor: "#06A36D" },
              "&.Mui-disabled": { bgcolor: "#ddd", color: "#999" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}