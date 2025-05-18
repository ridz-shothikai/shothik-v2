import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { Box, IconButton, TextField } from "@mui/material";
import { useState } from "react";

export default function InputArea({ addChatHistory, loading }) {
  const [value, setValue] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!value) return;

    addChatHistory(value, "user");
    setValue("");
  };

  return (
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
      <SmartToyIcon sx={{ color: "#00A76F", mr: 1 }} />
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
        <SendIcon />
      </IconButton>
    </Box>
  );
}
