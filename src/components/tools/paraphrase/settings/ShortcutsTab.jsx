// ShortcutsTab.jsx
import { Box, Typography } from "@mui/material";

const ShortcutsTab = ({
  fromComp = "paraphrase", // This flag is to maintain different sesstings on same component. ENUM: [paraphrase, humanize, ai-detector, grammar-fix, translator]
}) => {
  const humanizeRows = [
    { action: "Copy sentence", shortcut: "Ctrl + C" },
    {
      action: "Humanize all text",
      shortcut: "Ctrl + Enter",
    },
    {
      action: "Copy all humanized text",
      shortcut: "Ctrl + C",
    },
  ];
  const paraphraseRows = [
    { action: "Paraphrase text", shortcut: "Ctrl/Cmd + Enter" },
    {
      action: "Clear all",
      shortcut: "Ctrl/Cmd + Shift + C",
    },
    {
      action: "Copy output",
      shortcut: "Ctrl/Cmd + K",
    },
    {
      action: "Cycle language",
      shortcut: "Ctrl/Cmd + Shift + L",
    },
    {
      action: "Switch mode",
      shortcut: "Ctrl/Cmd + 1-4",
    },
    {
      action: "Clear output",
      shortcut: "Escape",
    },
  ];

  const currentCompData =
    fromComp === "paraphrase" ? paraphraseRows : humanizeRows;

  return (
    <Box id="shortcuts_tab" sx={{ px: 2, py: 1 }}>
      {/* Title */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Keyboard Shortcuts
      </Typography>

      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Action
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Keyboard shortcut
        </Typography>
      </Box>

      {/* Data Rows */}
      {currentCompData.map((row, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            borderBottom: i < currentCompData.length - 1 ? 1 : 0,
            borderColor: "divider",
          }}
        >
          <Typography variant="body2">{row.action}</Typography>
          <Typography variant="body2" sx={{ fontFamily: "Monospace" }}>
            {row.shortcut}
          </Typography>
        </Box>
      ))}

      {/* Section Divider */}
      {/* <Divider sx={{ my: 3 }} /> */}

      {/* Canvas Divider Section */}
      {/* <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Canvas divider
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
        }}
      >
        <Typography variant="body2">Auto center</Typography>
        <Typography variant="body2" sx={{ fontFamily: "Monospace" }}>
          Ctrl + |
        </Typography>
      </Box> */}
    </Box>
  );
};

export default ShortcutsTab;
