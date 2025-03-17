"use client";
import { Box, Card, Grid2, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aiDetectorSampleText } from "../../../_mock/tools/sampleText";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import { useScanAidetectorMutation } from "../../../redux/api/tools/toolsApi";
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import UserActionInput from "../common/UserActionInput";
import WordCounter from "../common/WordCounter";
import SampleText from "./SampleText";

const AiDetector = () => {
  const [openSampleDrawer, setOpenSampleDrawer] = useState(false);
  const [outputContend, setOutputContend] = useState(null);
  const [scanAidetector] = useScanAidetectorMutation();
  const { user } = useSelector((state) => state.auth);
  const [enableEdit, setEnableEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const isMobile = useResponsive("down", "sm");
  const isMd = useResponsive("down", "md");
  const [update, setUpdate] = useState(false);
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const { themeLayout } = useSelector((state) => state.settings);
  const isMini = themeLayout === "mini";

  function handleClear() {
    setUserInput("");
  }
  async function handleSubmit() {
    try {
      setIsLoading(true);

      const res = await scanAidetector({ text: userInput }).unwrap();
      console.log(res);
      const data = res?.result;
      if (!data) throw { message: "Something went wrong" };
      setOutputContend({
        ...data,
        aiSentences: data.sentences.filter(
          (sentence) => sentence.highlight_sentence_for_ai
        ),
        humanSentences: data.sentences.filter(
          (sentence) => !sentence.highlight_sentence_for_ai
        ),
      });

      setUpdate((prev) => !prev);
      setEnableEdit(false);
    } catch (err) {
      console.log(err);
      const error = err?.data;
      if (/LIMIT_REQUEST|PACAKGE_EXPIRED/.test(error?.error)) {
        dispatch(setShowAlert(true));
        dispatch(setAlertMessage(error?.message));
      } else if (error?.error === "UNAUTHORIZED") {
        dispatch(setShowLoginModal(true));
      } else {
        enqueueSnackbar(error?.message, { variant: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleSampleText(keyName) {
    const text = aiDetectorSampleText[keyName];
    if (text) {
      setUserInput(text);
      setOpenSampleDrawer(false);
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              position: "relative",
              height: 600,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              name='input'
              variant='outlined'
              rows={18}
              fullWidth
              multiline
              placeholder='Enter your text here...'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              sx={{
                flexGrow: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            />
            {!userInput ? (
              <UserActionInput
                setUserInput={setUserInput}
                isMobile={isMobile}
                disableTrySample={true}
              />
            ) : (
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: "divider",
                  px: 2,
                }}
              >
                <WordCounter
                  btnText='Scan'
                  toolName='ai-detector'
                  userInput={userInput}
                  isLoading={isLoading}
                  handleClearInput={handleClear}
                  handleSubmit={handleSubmit}
                  userPackage={user?.package}
                />
              </Box>
            )}
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <SampleText
            handleSampleText={handleSampleText}
            isMini={isMini}
            isMobile={isMd}
            setOpen={setOpenSampleDrawer}
            isDrawer={openSampleDrawer}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default AiDetector;
