"use client";
import { Box, Card, Grid2, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { aiDetectorSampleText } from "../../../_mock/tools/sampleText";
import useResponsive from "../../../hooks/useResponsive";
import useSnackbar from "../../../hooks/useSnackbar";
import {
  useGetShareAidetectorContendQuery,
  useScanAidetectorMutation,
} from "../../../redux/api/tools/toolsApi";
import { setShowLoginModal } from "../../../redux/slice/auth";
import { setAlertMessage, setShowAlert } from "../../../redux/slice/tools";
import LoadingScreen from "../../../resource/LoadingScreen";
import UserActionInput from "../common/UserActionInput";
import WordCounter from "../common/WordCounter";
import OutputResult, { getColorByPerplexity } from "./OutputResult";
import SampleText from "./SampleText";
import ShareURLModal from "./ShareURLModal";

const AiDetector = () => {
  const [openSampleDrawer, setOpenSampleDrawer] = useState(false);
  const { themeLayout } = useSelector((state) => state.settings);
  const [showShareModal, setshowShareModal] = useState(false);
  const [outputContend, setOutputContend] = useState(null);
  const [scanAidetector] = useScanAidetectorMutation();
  const { user } = useSelector((state) => state.auth);
  const [enableEdit, setEnableEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const isMobile = useResponsive("down", "sm");
  const isMd = useResponsive("down", "md");
  const enqueueSnackbar = useSnackbar();
  const isMini = themeLayout === "mini";
  const params = useSearchParams();
  const share_id = params.get("share_id");
  const dispatch = useDispatch();
  const { data: shareContend, isLoading: isContendLoading } =
    useGetShareAidetectorContendQuery(share_id, {
      skip: !share_id,
    });

  useEffect(() => {
    if (!shareContend) return;
    const data = shareContend?.result;
    if (!data) return;
    setOutputContend({
      ...data,
      aiSentences: data.sentences.filter(
        (sentence) => sentence.highlight_sentence_for_ai
      ),
      humanSentences: data.sentences.filter(
        (sentence) => !sentence.highlight_sentence_for_ai
      ),
    });
    setEnableEdit(false);
  }, [shareContend]);

  function handleClear() {
    setOutputContend(null);
    setUserInput("");
  }
  async function handleSubmit() {
    try {
      // handle edit;
      if (!enableEdit) {
        setEnableEdit(true);
        return;
      }

      setIsLoading(true);
      const res = await scanAidetector({ text: userInput }).unwrap();
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

  if (isContendLoading) {
    return <LoadingScreen />;
  }
  console.log({ share_id });
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
            {enableEdit ? (
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
            ) : (
              <Box sx={{ height: "100%", overflow: "auto", padding: 2 }}>
                {outputContend &&
                  outputContend.sentences.map((item, index) => (
                    <Fragment key={index}>
                      <span
                        onClick={() => setEnableEdit(true)}
                        style={{
                          backgroundColor: getColorByPerplexity(
                            item.highlight_sentence_for_ai,
                            item.perplexity
                          ),
                        }}
                      >
                        {item.sentence}
                      </span>
                    </Fragment>
                  ))}
              </Box>
            )}

            {!userInput ? (
              <>
                {!share_id ? (
                  <UserActionInput
                    setUserInput={setUserInput}
                    isMobile={isMobile}
                    disableTrySample={true}
                  />
                ) : null}
              </>
            ) : null}
            {userInput ? (
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: "divider",
                  px: 2,
                }}
              >
                <WordCounter
                  btnText={enableEdit ? "Scan" : "Edit"}
                  toolName='ai-detector'
                  userInput={userInput}
                  isLoading={isLoading}
                  handleClearInput={handleClear}
                  handleSubmit={handleSubmit}
                  userPackage={user?.package}
                />
              </Box>
            ) : null}
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          {outputContend ? (
            <OutputResult
              handleOpen={() => setshowShareModal(true)}
              outputContend={outputContend}
            />
          ) : (
            <SampleText
              handleSampleText={handleSampleText}
              isMini={isMini}
              isMobile={isMd}
              setOpen={setOpenSampleDrawer}
              isDrawer={openSampleDrawer}
            />
          )}
        </Grid2>
      </Grid2>

      {outputContend ? (
        <ShareURLModal
          open={showShareModal}
          handleClose={() => setshowShareModal(false)}
          title='AI Detection Report'
          content={outputContend}
          hashtags={["Shothik AI", "AI Detector"]}
        />
      ) : null}
    </Box>
  );
};

export default AiDetector;
