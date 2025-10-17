import {
  ChevronLeft,
  ChevronRight,
  DeleteRounded,
  ExpandMore,
  GppMaybe,
  History,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import { setActiveHistory } from "../../../redux/slice/paraphraseHistorySlice";
import { downloadFile } from "../common/downloadfile";

const OutputBotomNavigation = ({
  setHighlightSentence,
  highlightSentence,
  sentenceCount,
  outputWordCount,
  proccessing,
  setOutputHistoryIndex,
  outputHistoryIndex,
  outputHistory,
  handleClear,
  outputContend,
}) => {
  const enqueueSnackbar = useSnackbar();
  const isMobile = useResponsive("down", "sm");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [formatMenuAnchor, setFormatMenuAnchor] = useState(null);

  const dispatch = useDispatch();

  const handleDownloadClick = () => {
    setDownloadModalOpen(true);
  };

  const handleCloseModal = () => {
    setDownloadModalOpen(false);
    setFormatMenuAnchor(null);
  };

  const handleFormatMenuOpen = (event) => {
    setFormatMenuAnchor(event.currentTarget);
  };

  const handleFormatMenuClose = () => {
    setFormatMenuAnchor(null);
  };

  const { activeHistory, activeHistoryIndex, histories, historyGroups } =
    useSelector((state) => state.paraphraseHistory);

  const setActiveHistoryByIndex = (index) => {
    const history = histories[index];
    if (history) {
      dispatch(setActiveHistory(history));
    }
  };

  const handleDownloadFormat = async (format) => {
    try {
      let fontData = null;

      if (format === "pdf") {
        // Try loading font as base64 directly
        try {
          const fontResponse = await fetch("/fonts/bangla-font.ttf");
          if (fontResponse.ok) {
            const arrayBuffer = await fontResponse.arrayBuffer();
            fontData = arrayBuffer;
            console.log(
              "Font loaded successfully, size:",
              arrayBuffer.byteLength,
            );
          } else {
            console.warn(
              "Font file not accessible, PDF will use fallback font",
            );
          }
        } catch (fontError) {
          console.warn("Failed to load font:", fontError);
        }
      }

      await downloadFile(outputContend, "paraphrase", format, fontData);
      enqueueSnackbar(`Text Downloaded as ${format.toUpperCase()}`);
      handleCloseModal();
    } catch (error) {
      console.error("Download failed:", error);
      enqueueSnackbar("Download failed", { variant: "error" });
    }
  };

  async function handleCopy() {
    await navigator.clipboard.writeText(outputContend);
    enqueueSnackbar("Copied to clipboard");
  }

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    outline: "none",
  };

  return (
    <>
      <Stack
        direction="row"
        columnGap={2}
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap={1}
        sx={{
          paddingBottom: { xs: 1, md: 2 },
          paddingX: 2,
          flexShrink: 0,
          minHeight: "auto",
          mt: "auto",
        }}
      >
        <Stack direction="row" columnGap={1} alignItems="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Previous sentence" arrow placement="top">
              <IconButton
                onClick={() => setHighlightSentence((prev) => prev - 1)}
                disabled={highlightSentence === 0}
                color="primary"
                size="small"
                aria-label="delete"
                sx={{
                  bgcolor: "rgba(73, 149, 87, 0.04)",
                  borderRadius: "5px",
                }}
              >
                <KeyboardArrowUp />
              </IconButton>
            </Tooltip>

            <Tooltip title="Next sentence" arrow placement="top">
              <IconButton
                onClick={() => setHighlightSentence((prev) => prev + 1)}
                disabled={highlightSentence === sentenceCount - 1}
                size="small"
                sx={{
                  bgcolor: "rgba(73, 149, 87, 0.04)",
                  borderRadius: "5px",
                }}
                aria-label="delete"
                color="primary"
              >
                <KeyboardArrowDown />
              </IconButton>
            </Tooltip>

            <Typography sx={{ fontWeight: 600 }}>
              <b>{highlightSentence + 1}</b>/{sentenceCount} Sentences
            </Typography>
          </Stack>

          <span className="bg-primary h-1.5 w-1.5 rounded-full" />

          <Stack direction="row" alignItems="center" gap={0.5}>
            {/* <WordIcon /> */}
            <Typography sx={{ fontWeight: 600 }}>
              {outputWordCount} words
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="end">
          <Box>
            {proccessing.loading ? (
              <Image
                src="/loading-gif.gif"
                alt="arrow-left"
                width={25}
                height={25}
              />
            ) : !proccessing.success && sentenceCount ? (
              <GppMaybe sx={{ color: "#991006", fontSize: "16px" }} />
            ) : null}
          </Box>
          {!isMobile && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title="Previous history" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={() =>
                    setActiveHistoryByIndex(activeHistoryIndex + 1)
                  }
                  disabled={
                    !histories.length ||
                    activeHistoryIndex === histories.length - 1
                  }
                  color="primary"
                  aria-label="delete"
                  sx={{
                    bgcolor: "rgba(73, 149, 87, 0.04)",
                    borderRadius: "5px",
                  }}
                >
                  <ChevronLeft />
                </IconButton>
              </Tooltip>

              <IconButton
                color={activeHistory?._id ? "text.primary" : "text.secondary"}
                aria-label="History"
                size="small"
                sx={{
                  bgcolor: "rgba(73, 149, 87, 0.04)",
                  borderRadius: "5px",
                }}
              >
                <History />
              </IconButton>

              <Tooltip title="Next history" arrow placement="top">
                <IconButton
                  size="small"
                  onClick={() =>
                    setActiveHistoryByIndex(activeHistoryIndex - 1)
                  }
                  disabled={!histories.length || activeHistoryIndex < 1}
                  sx={{
                    bgcolor: "rgba(73, 149, 87, 0.04)",
                    borderRadius: "5px",
                    mr: 0.5,
                  }}
                  aria-label="delete"
                  color="primary"
                >
                  <ChevronRight />
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          <Tooltip title="Clear result" placement="top" arrow>
            <IconButton
              onClick={() => handleClear("output")}
              sx={{
                borderRadius: "5px",
                p: 1,
                "&:hover": {
                  backgroundColor: "inherit",
                  color: "primary",
                  boxShadow: "none",
                },
              }}
              aria-label="clear"
              size="large"
            >
              <DeleteRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export" placement="top" arrow>
            <IconButton
              onClick={handleDownloadClick}
              sx={{
                borderRadius: "5px",
                p: 1,
                "&:hover": {
                  backgroundColor: "inherit",
                  color: "primary",
                  boxShadow: "none",
                },
              }}
              aria-label="download"
              size="large"
            >
              <Image
                src={"/icons/download-text.svg"}
                alt="copy"
                width={24}
                height={24}
                priority={true}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Copy Full Text" placement="top" arrow>
            <IconButton
              onClick={handleCopy}
              sx={{
                borderRadius: "5px",
                p: 1,
                "&:hover": {
                  backgroundColor: "inherit",
                  color: "primary.main",
                  boxShadow: "none",
                },
              }}
              aria-label="download"
              size="large"
            >
              <Image
                src={"/icons/copy.svg"}
                alt="copy"
                width={24}
                height={24}
                priority={true}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {!!isMobile && (
        <div className="flex items-center justify-center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Previous history" arrow placement="top">
              <IconButton
                size="small"
                onClick={() => setActiveHistoryByIndex(activeHistoryIndex + 1)}
                disabled={
                  !histories.length ||
                  activeHistoryIndex === histories.length - 1
                }
                color="primary"
                aria-label="delete"
                sx={{
                  bgcolor: "rgba(73, 149, 87, 0.04)",
                  borderRadius: "5px",
                }}
              >
                <ChevronLeft />
              </IconButton>
            </Tooltip>

            <IconButton
              color={activeHistory?._id ? "text.primary" : "text.secondary"}
              aria-label="History"
              size="small"
              sx={{
                bgcolor: "rgba(73, 149, 87, 0.04)",
                borderRadius: "5px",
              }}
            >
              <History />
            </IconButton>

            <Tooltip title="Next history" arrow placement="top">
              <IconButton
                size="small"
                onClick={() => setActiveHistoryByIndex(activeHistoryIndex - 1)}
                disabled={!histories.length || activeHistoryIndex < 1}
                sx={{
                  bgcolor: "rgba(73, 149, 87, 0.04)",
                  borderRadius: "5px",
                  mr: 0.5,
                }}
                aria-label="delete"
                color="primary"
              >
                <ChevronRight />
              </IconButton>
            </Tooltip>
          </Stack>
        </div>
      )}

      {/* Download Modal */}
      <Modal
        open={downloadModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="download-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography
            id="download-modal-title"
            variant="h4"
            component="h2"
            sx={{
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
            }}
          >
            Download Report
          </Typography>

          <Button
            variant="outlined"
            onClick={handleFormatMenuOpen}
            endIcon={<ExpandMore />}
            fullWidth
            sx={{
              justifyContent: "space-between",
              textTransform: "none",
              py: 1.5,
              fontSize: "16px",
            }}
          >
            Download
          </Button>

          <Menu
            anchorEl={formatMenuAnchor}
            open={Boolean(formatMenuAnchor)}
            onClose={handleFormatMenuClose}
            PaperProps={{
              sx: { width: formatMenuAnchor?.offsetWidth || 200 },
            }}
          >
            <MenuItem onClick={() => handleDownloadFormat("pdf")}>
              <ListItemIcon>
                <Image src="/icons/pdf.svg" alt="PDF" width={20} height={20} />
              </ListItemIcon>
              <ListItemText>.pdf</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => handleDownloadFormat("txt")}>
              <ListItemIcon>
                <Image src="/icons/txt.svg" alt="TXT" width={20} height={20} />
              </ListItemIcon>
              <ListItemText>.txt</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => handleDownloadFormat("docx")}>
              <ListItemIcon>
                <Image
                  src="/icons/docx.svg"
                  alt="DOCX"
                  width={20}
                  height={20}
                />
              </ListItemIcon>
              <ListItemText>.docx</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Modal>
    </>
  );
};

export default OutputBotomNavigation;
