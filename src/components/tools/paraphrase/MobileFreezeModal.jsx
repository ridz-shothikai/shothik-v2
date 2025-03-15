import { CloseRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const MobileFreezeModal = ({
  isFreeze,
  handleClose,
  freezeWords,
  setFreezeWords,
}) => {
  const [value, setValue] = useState();

  function handleSubmit(e) {
    e.preventDefault();
    setFreezeWords((prev) => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
    setValue("");
  }

  function handleDelete(word) {
    const rest = freezeWords.filter((item) => item !== word);
    setFreezeWords(rest);
  }

  return (
    <Drawer
      anchor='right'
      slotProps={{
        paper: {
          sx: { width: "65%" },
        },
      }}
      open={isFreeze}
      onClose={handleClose}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          padding: 1,
          justifyContent: "space-between",
        }}
      >
        <Typography variant='h4'>Freeze Words</Typography>

        <IconButton onClick={handleClose}>
          <CloseRounded />
        </IconButton>
      </Box>

      <form
        onSubmit={handleSubmit}
        style={{ padding: "10px", marginTop: "30px", marginBottom: "20px" }}
      >
        <TextField
          name='input'
          variant='outlined'
          rows={3}
          fullWidth
          multiline
          label='Enter the word to freeze...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Button
          sx={{ mt: 1, textAlign: "right" }}
          variant='contained'
          type='submit'
        >
          Freeze
        </Button>
      </form>

      {freezeWords.length > 0 && (
        <Stack
          direction='row'
          sx={{ px: 2, width: "100%" }}
          spacing={{ xs: 1, sm: 2 }}
          useFlexGap
          flexWrap='wrap'
        >
          <Chip
            label='Clear All'
            color='error'
            variant='filled'
            onClick={() => setFreezeWords([])}
            onDelete={() => setFreezeWords([])}
            sx={{
              "& .MuiChip-deleteIcon": { color: "white" },
              fontWeight: 700,
            }}
          />

          {freezeWords.map((item, index) => (
            <Chip
              key={index}
              label={item}
              variant='outlined'
              onDelete={(e) => handleDelete(item)}
            />
          ))}
        </Stack>
      )}
    </Drawer>
  );
};

export default MobileFreezeModal;
