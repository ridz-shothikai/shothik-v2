import { Box, Paper, Typography } from "@mui/material";
import * as motion from "motion/react-client";

export default function UserMessage({ message }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Paper
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        variant='outlined'
        sx={{
          p: 1.5,
          borderRadius: "15px 15px 0 15px",
          maxWidth: "70%",
        }}
      >
        <Typography variant='body1'>{message.content}</Typography>
      </Paper>
    </Box>
  );
}
