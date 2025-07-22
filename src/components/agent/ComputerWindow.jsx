import Editor from "@monaco-editor/react";
import { BrowserUpdated, Terminal, UnfoldLess } from "@mui/icons-material";
import {
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "motion/react";
import Image from "next/image";
import TaskProgress from "./TaskProgress";

const ComputerWindow = ({ computerLogs, closeWindow }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme("mint-light-theme", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "", foreground: "2d2d2d" }, // default text
        { token: "comment", foreground: "6a737d", fontStyle: "italic" },
        { token: "keyword", foreground: "d73a49" },
        { token: "string", foreground: "032f62" },
        { token: "number", foreground: "005cc5" },
        { token: "variable", foreground: "e36209" },
        { token: "type", foreground: "22863a" },
      ],
      colors: {
        "editor.background": "#cbe9dd",
        "editor.foreground": "#2d2d2d",
        "editorLineNumber.foreground": "#5c5c5c",
        "editorCursor.foreground": "#333333",
        "editor.selectionBackground": "#a4c8ba88",
        "editor.inactiveSelectionBackground": "#a4c8ba44",
      },
    });
  }

  return (
    <Card
      component={motion.div}
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ x: 50, opacity: 0, transition: { duration: 0.5 } }}
      sx={{
        height: "100%",
        padding: 2,
        position: "relative",
      }}
    >
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography fontSize={18} fontWeight={700}>
          Shothik AI Computer
        </Typography>
        <IconButton onClick={closeWindow}>
          <UnfoldLess
            sx={{ color: "text.secondary", transform: "rotate(45deg)" }}
          />
        </IconButton>
      </Stack>

      <Stack direction='row' alignItems='center' gap={1} mb={1}>
        <IconButton
          disableRipple
          sx={{
            bgcolor: "rgba(73, 149, 87, 0.04)",
            borderRadius: "5px",
          }}
        >
          {computerLogs.icon === "browser" ? (
            <BrowserUpdated fontSize='small' />
          ) : (
            <Terminal fontSize='small' />
          )}
        </IconButton>
        <Box>
          <Typography fontSize={14}>
            Shothik is using {computerLogs.icon}
          </Typography>
          <Typography
            sx={{
              backgroundColor: dark ? "rgba(4, 64, 57, 0.5)" : "#cbe9dd",
              paddingX: 1.3,
              paddingY: 0.2,
              borderRadius: 2,
              cursor: "pointer",
              width: "fit-content",
              color: dark ? "primary.lighter" : "primary.darker",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 12,
            }}
          >
            {computerLogs.message}
          </Typography>
        </Box>
      </Stack>

      <Typography
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          padding: 0.5,
          textAlign: "center",
          backgroundColor: "rgba(73, 149, 87, 0.1)",
          borderRadius: 1,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {computerLogs.link?.split(".com/")[0]}
      </Typography>
      <Box
        sx={{
          backgroundColor: "rgba(73, 149, 87, 0.1)",
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: "68%",
          overflow: "hidden",
        }}
      >
        {computerLogs.link?.startsWith("https://") ? (
          <Image
            src={computerLogs.link}
            alt='screenshort'
            height={300}
            width={200}
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
            objectFit='cover'
          />
        ) : (
          <Editor
            height='400px'
            defaultLanguage='markdown'
            defaultValue={computerLogs.data}
            beforeMount={handleEditorWillMount}
            theme={dark ? "vs-dark" : "mint-light-theme"}
            options={{
              readOnly: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              lineNumbers: "off",
              wordWrap: "on",
            }}
          />
        )}
      </Box>

      {/* bottom progress */}
      <TaskProgress />
    </Card>
  );
};

export default ComputerWindow;
