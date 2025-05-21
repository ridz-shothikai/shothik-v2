import { Task } from "@mui/icons-material";
import { Box, Drawer, Stack, Typography } from "@mui/material";

const SessionHistoryModal = ({ open, setOpen, data, setSessionHistoryId }) => {
  const histories = data?.data;
  return (
    <Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: "400px", overflowY: "auto" }}>
        <Stack
          justifyContent='center'
          alignItems='center'
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            padding: 1.5,
          }}
        >
          <Typography fontSize={18} fontWeight={600}>
            Session History
          </Typography>
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
                  width: "100%",
                }}
              >
                <Task sx={{ color: "primary.main" }} fontSize='small' />
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {history.messages[0].content.message}
                </Typography>
              </Stack>
            ))}
        </Stack>
      </Box>
    </Drawer>
  );
};

export default SessionHistoryModal;
