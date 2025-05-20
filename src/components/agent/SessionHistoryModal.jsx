import { Add, Task } from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

const SessionHistoryModal = ({
  open,
  setOpen,
  data,
  clearChat,
  setSessionHistoryId,
}) => {
  const histories = data?.data;
  return (
    <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: "400px", overflowY: "auto" }}>
        <Stack
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            paddingX: 1.5,
          }}
        >
          <Typography fontWeight={600}>Session History</Typography>
          <Tooltip title='Start New'>
            <IconButton onClick={clearChat}>
              <Add />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack paddingX={1.5}>
          {histories &&
            histories.map((history) => (
              <Stack
                flexDirection='row'
                alignItems='center'
                onClick={() => {
                  setSessionHistoryId(history._id);
                  setOpen(false);
                }}
                gap={1}
                key={history._id}
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  paddingY: 1.5,
                  cursor: "pointer",
                  ":hover": {
                    backgroundColor: "divider",
                  },
                }}
              >
                <Task sx={{ color: "primary.main" }} fontSize='small' />
                <Typography>{history.messages[0].content.message}</Typography>
              </Stack>
            ))}
        </Stack>
      </Box>
    </Drawer>
  );
};

export default SessionHistoryModal;
