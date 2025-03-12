"use client";
import { Box, Card, Grid2, TextField } from "@mui/material";
import { useState } from "react";
import useResponsive from "../../../hooks/useResponsive";

const Translator = () => {
  const [userInput, setUserInput] = useState();
  const isMobile = useResponsive("down", "sm");

  function handleInput(e) {
    const value = e.target.value;
    setUserInput(value);
  }

  return (
    <Card sx={{ mt: 1, paddingX: 2, paddingY: 3 }}>
      <Grid2
        container
        sx={{ height: "cale(100vh - 200px)", overflow: "hidden" }}
        spacing={2}
      >
        <Grid2
          sx={{ height: "100%", overflowY: "auto" }}
          size={{ xs: 12, md: 6 }}
        >
          <Box>
            <TextField
              name='input'
              variant='outlined'
              minRows={isMobile ? 12 : 19}
              maxRows={isMobile ? 12 : 19}
              fullWidth
              multiline
              placeholder={"Input your text here..."}
              value={userInput}
              onChange={handleInput}
              sx={{
                flexGrow: 1,
                "& .MuiOutlinedInput-root": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                },
              }}
            />
          </Box>
        </Grid2>
        <Grid2
          sx={{ height: "100%", overflowY: "auto" }}
          size={{ xs: 12, md: 6 }}
        >
          <TextField
            name='input'
            variant='outlined'
            minRows={isMobile ? 12 : 19}
            maxRows={isMobile ? 12 : 19}
            fullWidth
            multiline
            placeholder={"Translated text"}
            value={userInput}
            disabled
            sx={{
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
              },
            }}
          />
        </Grid2>
      </Grid2>
    </Card>
  );
};

export default Translator;
