import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

const tasks = [
  "Visit YC official website",
  "Search for W25 B2B tag in Companies directory",
  "Collect enterprise information for W25 B2B companies",
  "Organize collected data into structured table format",
  "Verify completeness of enterprise information",
  "Create final document with compiled company details",
  "Deliver results to user",
];

export default function TaskProgress() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        left: 16,
      }}
    >
      <Paper
        sx={{
          px: 2,
          py: expanded ? 2 : 0.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        {expanded ? (
          <>
            <Typography variant='subtitle1' fontWeight='bold' mb={1}>
              Task progress
            </Typography>
            <List dense>
              {tasks.map((task, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color='success' fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary={task} />
                </ListItem>
              ))}
            </List>

            <IconButton
              sx={{
                position: "absolute",
                right: 10,
                bottom: 10,
              }}
              onClick={toggleExpanded}
              color='inherit'
              size='small'
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </>
        ) : (
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='body2'>Deliver results to user</Typography>
            <Stack direction='row' alignItems='center' gap={1}>
              <Typography variant='caption'>7/{tasks.length}</Typography>
              <IconButton onClick={toggleExpanded} color='inherit' size='small'>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
