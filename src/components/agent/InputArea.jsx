import { keyframes } from "@emotion/react";
import { AutoMode, Replay, Send, SmartToy } from "@mui/icons-material";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function InputArea({ addChatHistory, loading, error }) {
  const [value, setValue] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!value) return;

    addChatHistory(value, "user");
    setValue("");
  };

  const spin = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

  return (
    <Box>
      {error && (
        <Stack
          direction='row'
          gap={0.5}
          alignItems='center'
          mb={1}
          justifyContent='center'
        >
          <Typography sx={{ color: "error.main" }}>{error}</Typography>
          <Replay
            onClick={() => addChatHistory("proceed", "user")}
            sx={{ color: "error.main", cursor: "pointer", fontSize: 18 }}
          />
        </Stack>
      )}
      <Box
        component='form'
        onSubmit={handleAdd}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: "8px",
        }}
      >
        <SmartToy sx={{ color: "#00A76F", mr: 1 }} />
        <TextField
          fullWidth
          variant='standard'
          placeholder='Give a task to Shothik AI Agent'
          slotProps={{
            input: { disableUnderline: true },
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <IconButton disabled={loading} type='submit' color='primary'>
          {loading ? (
            <AutoMode
              sx={{
                animation: `${spin} 2s linear infinite`,
                color: "primary.main",
              }}
            />
          ) : (
            <Send />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}
