import useSnackbar from "@/hooks/useSnackbar";
import {
  CloudDownload,
  ExpandMoreOutlined,
  InfoOutlined,
  KeyboardArrowUpOutlined,
  Share,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { pdfDownload } from "../helpers/pdfDownload";
import { getColorByPerplexity } from "../helpers/pdfHelper";
import {
  colorDefinitions,
  colorDefinitionsAI,
  colorDefinitionsHuman,
} from "../helpers/pdfStyles";

const widths = [130, 80, 60, 60, 80, 130];

const OutputResult = ({ handleOpen, outputContend }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const enqueueSnackbar = useSnackbar();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      await pdfDownload({
        content: outputContend,
        logo: "/shothik_light_logo.png",
      });

      enqueueSnackbar("PDF downloaded successfully", { variant: "success" });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      enqueueSnackbar("Failed to download PDF. Please try again.", {
        variant: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        justifyContent="flex-end"
        flexDirection="row"
        gap={1}
        sx={{
          paddingX: 2,
          paddingY: 1,
          borderBottom: "1px solid",
          borderBottomColor: "divider",
        }}
      >
        <Button
          onClick={handleOpen}
          startIcon={<Share />}
          sx={{
            border: "1px solid rgba(145, 158, 171, 0.32)",
            borderRadius: "9999px",
            px: 2,
            py: 1,
            color: "#212B36",
            transition: "all 300ms ease-in-out",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          Share
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          startIcon={<CloudDownload />}
          sx={{
            border: "1px solid rgba(145, 158, 171, 0.32)",
            borderRadius: "9999px",
            px: 2,
            py: 1,
            color: "#212B36",
            transition: "all 300ms ease-in-out",
            "&:hover": {
              color: "primary.main",
            },
            "&:disabled": {
              opacity: 0.6,
            },
          }}
        >
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </Stack>

      {/* ai ditector highlight */}
      <Box
        sx={{
          paddingX: 2,
          paddingY: 1,
          borderBottom: "1px solid",
          borderBottomColor: "divider",
        }}
      >
        <Stack
          sx={{ flexDirection: { md: "column", lg: "row", sm: "row" }, my: 2 }}
          gap={3}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Box
            sx={{
              width: 150,
              height: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <CircularProgress
              variant="determinate"
              value={100}
              size={150}
              thickness={4}
              sx={{ color: colorDefinitions.humanHigh, position: "absolute" }}
            />
            <CircularProgress
              variant="determinate"
              value={outputContend.ai_percentage}
              size={150}
              thickness={4}
              sx={{ color: colorDefinitions.aiHigh, position: "absolute" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                color:
                  outputContend.ai_percentage > 50
                    ? "warning.main"
                    : "primary.main",
              }}
            >
              {outputContend.ai_percentage > 50 ? "AI" : "Human"}
            </Typography>
          </Box>
          <Stack flexDirection="column" gap={1.5}>
            <Stack flexDirection="row" gap={1} alignItems="center">
              <Typography sx={{ textWrap: "nowrap" }} color="GrayText">
                We are{" "}
              </Typography>
              <Typography
                color="inherit"
                fontWeight={700}
                fontSize={16}
                sx={{
                  borderBottom: "1px solid",
                  borderBottomColor: "divider",
                  width: "fit-content",
                  display: "inline-block",
                  textWrap: "nowrap",
                  textTransform: "uppercase",
                }}
              >
                highly confident
              </Typography>
              <Typography sx={{ textWrap: "nowrap" }} color="GrayText">
                this text is
              </Typography>
            </Stack>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: {
                  lg: "flex-start",
                  md: "center",
                  xs: "center",
                },
              }}
            >
              <Chip
                label={outputContend.assessment}
                sx={{
                  backgroundColor: "#7c3aed1a",
                  color: "#6B46C1",
                  fontWeight: 700,
                  fontSize: 16,
                  "& .MuiChip-label": {
                    px: 2,
                    py: 0.5,
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 1,
                px: 2,
                border: "1px solid rgba(127, 129, 133, 0.28)",
                borderRadius: 1,
              }}
              color="GrayText"
            >
              <InfoOutlined />
              <Typography>
                {parseInt(outputContend.ai_percentage ?? 0)}% Probability AI
                generated
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Typography color="inherit" fontWeight={600} fontSize={18}>
            Enhanced Sentence Detection
          </Typography>
          <Typography color="gray">
            Sentences that have the biggest influence on the probability score.
          </Typography>
        </Box>

        <Box sx={{ my: 2 }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "20px",
              gap: "2px",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {[
              ...Object.values(colorDefinitionsAI).reverse(),
              ...Object.values(colorDefinitionsHuman),
            ].map((color, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: color,
                  width: widths[index],
                }}
              />
            ))}
          </Box>
          <Stack
            sx={{ mt: 0.6 }}
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: colorDefinitions.aiHigh,
              }}
            >
              AI
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: colorDefinitions.humanHigh,
              }}
            >
              Human
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Accortion
        colorList={Object.values(colorDefinitionsAI)}
        data={outputContend.aiSentences}
        title="Top sentences driving AI probability"
      />
      <Accortion
        colorList={Object.values(colorDefinitionsHuman)}
        data={outputContend.humanSentences}
        title="Top sentences driving Human probability"
      />
    </Card>
  );
};

const Accortion = ({ colorList, data, title, children }) => {
  const [isExpanded, setIsExpanded] = useState(-1);

  return (
    <Box
      sx={{
        paddingX: 2,
        paddingY: 1,
        maxHeight: { xs: "200px", md: "174px" },
        overflowY: "auto",
        "&:not(:last-child)": {
          borderBottom: "1px solid #E0E0E0",
        },
      }}
    >
      <Typography fontWeight={600} fontSize={18}>
        {title}
      </Typography>
      {children}

      {data.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            gap: 2,
            paddingY: 2,
            alignItems: "flex-start",
            "&:not(:last-child)": {
              borderBottom: "1px solid #E0E0E0",
            },
          }}
        >
          <AIColor
            highlight_sentence_for_ai={item.highlight_sentence_for_ai}
            colors={Object.values(colorList)}
            perplexity={item.perplexity}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: isExpanded !== index ? 1 : undefined,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.5em",
                transition: "all 0.3s ease",
              }}
            >
              {item.sentence}
            </Typography>

            <Button
              onClick={() =>
                setIsExpanded((prev) => {
                  if (prev === index) {
                    return -1;
                  } else {
                    return index;
                  }
                })
              }
              sx={{ padding: 0, width: "fit-content", minWidth: "unset" }}
            >
              {isExpanded === index ? (
                <KeyboardArrowUpOutlined />
              ) : (
                <ExpandMoreOutlined />
              )}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

function AIColor({ colors, perplexity, highlight_sentence_for_ai }) {
  const color = getColorByPerplexity(highlight_sentence_for_ai, perplexity);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {colors.map((item, index) => (
        <Box
          key={index}
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: item === color ? color : "#E0E0E0",
          }}
        ></Box>
      ))}
    </Box>
  );
}

export default OutputResult;
