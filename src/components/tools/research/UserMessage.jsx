import { Person } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import * as motion from "motion/react-client";
import React from "react";

const UserMessage = ({ message }) => {
  return (
    <Stack
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      direction='row'
      alignItems='center'
      gap={1}
      mb={1}
    >
      <IconButton
        color='text.secondary'
        aria-label='User'
        sx={{
          bgcolor: "rgba(73, 149, 87, 0.04)",
          borderRadius: "5px",
        }}
      >
        <Person size={20} />
      </IconButton>
      <Typography>{message.content}</Typography>
    </Stack>
  );
};

{
  /* <Stack gap={1}>
              {message.experimental_attachments?.map(
                (attachment, attachmentIndex) => (
                  <Box sx={{ mt: 1 }} key={attachmentIndex}>
                    {attachment.contentType.startsWith("image/") && (
                      <Avatar
                        src={attachment.url}
                        alt={`Attachment ${attachmentIndex + 1}`}
                        sx={{
                          width: 150,
                          height: 100,
                          borderRadius: 2,
                          objectFit: "fill",
                        }}
                      />
                    )}
                  </Box>
                )
              )}
            </Stack> */
}

export default UserMessage;
