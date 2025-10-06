import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import SvgColor from "../../../resource/SvgColor";

const UpgradePrompt = ({ onClose }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "calc(100dvh - 200px)",
        maxHeight: "calc(100dvh - 200px)",
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Unlock Premium Features
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upgrade to a premium plan to access advanced plagiarism checking,
        history, tone analysis, and comparison tools.
      </Typography>
      <Link href="/pricing" onClick={onClose}>
        <Button
          color="primary"
          size="medium"
          variant="contained"
          rel="noopener"
          startIcon={
            <SvgColor
              src="/navbar/diamond.svg"
              sx={{
                width: { xs: 16, md: 20 },
                height: { xs: 16, md: 20 },
              }}
            />
          }
        >
          Upgrade Plan
        </Button>
      </Link>
    </Box>
  );
};

export default UpgradePrompt;
