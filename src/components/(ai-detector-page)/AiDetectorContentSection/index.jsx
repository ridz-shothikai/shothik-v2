"use client";

import { trySamples } from "@/_mock/trySamples";
import { trackEvent } from "@/analysers/eventTracker";
import UserActionInput from "@/components/tools/common/UserActionInput";
import WordCounter from "@/components/tools/common/WordCounter";
import useLoadingText from "@/hooks/useLoadingText";
import useResponsive from "@/hooks/useResponsive";
import useSnackbar from "@/hooks/useSnackbar";
import {
  useGetShareAidetectorContendQuery,
  useGetUsesLimitQuery,
  useScanAidetectorMutation,
} from "@/redux/api/tools/toolsApi";
import { setShowLoginModal } from "@/redux/slice/auth";
import { setAlertMessage, setShowAlert } from "@/redux/slice/tools";
import LoadingScreen from "@/resource/LoadingScreen";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OutputResult from "./OutputResult";
import SampleText from "./SampleText";
import ShareURLModal from "./ShareURLModal";
import { getColorByPerplexity } from "./helpers/pdfHelper";

function formatNumber(number) {
  if (!number) return 0;
  const length = number.toString().length;
  return length >= 4 ? number.toLocaleString("en-US") : number.toString();
}

const UsesLimit = ({ userLimit }) => {
  const progressPercentage = () => {
    if (!userLimit) return 0;
    const totalWords = userLimit.totalWordLimit;
    const remainingWords = userLimit.remainingWord;
    return (remainingWords / totalWords) * 100;
  };

  return (
    <div className="flex justify-end px-4 py-2">
      <div className="w-[220px] sm:w-[250px]">
        <div className="bg-muted/50 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${progressPercentage()}%` }}
          ></div>
        </div>
        <p className="text-muted-foreground mt-1 text-[12px] sm:text-[14px]">
          {formatNumber(userLimit?.totalWordLimit)} words /{" "}
          {formatNumber(userLimit?.remainingWord)} words left
        </p>
      </div>
    </div>
  );
};

const AiDetectorContentSection = () => {
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
  const loadingText = useLoadingText(isLoading);
  const { data: shareContend, isLoading: isContendLoading } =
    useGetShareAidetectorContendQuery(share_id, {
      skip: !share_id,
    });
  const { data: userLimit, refetch } = useGetUsesLimitQuery({
    service: "ai-detector",
  });
  const sessionContent = JSON.parse(
    sessionStorage.getItem("ai-detect-content"),
  );

  useEffect(() => {
    if (!shareContend) return;
    const data = shareContend?.result;
    if (!data) return;
    setOutputContend({
      ...data,
      aiSentences: data.sentences.filter(
        (sentence) => sentence.highlight_sentence_for_ai,
      ),
      humanSentences: data.sentences.filter(
        (sentence) => !sentence.highlight_sentence_for_ai,
      ),
    });
    setEnableEdit(false);
  }, [shareContend]);

  function handleClear() {
    setOutputContend(null);
    setUserInput("");
    setEnableEdit(true);
  }

  async function handleSubmit(inputData = null) {
    try {
      if (!enableEdit) {
        setEnableEdit(true);
        return;
      }

      trackEvent("click", "ai-detector", "ai-detector_click", 1);

      setIsLoading(true);
      const res = await scanAidetector({
        text: inputData ? inputData : userInput,
      }).unwrap();
      const data = res?.result;
      if (!data) throw { message: "Something went wrong" };

      setOutputContend({
        ...data,
        aiSentences: data.sentences.filter(
          (sentence) => sentence.highlight_sentence_for_ai,
        ),
        humanSentences: data.sentences.filter(
          (sentence) => !sentence.highlight_sentence_for_ai,
        ),
      });
      setEnableEdit(false);
      refetch();

      if (sessionContent) {
        sessionStorage.removeItem("ai-detect-content");
      }
    } catch (err) {
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
    const text = trySamples.ai_detector[keyName];
    if (text) {
      setUserInput(text);
      setOpenSampleDrawer(false);
    }
  }

  useEffect(() => {
    if (sessionContent) {
      setUserInput(sessionContent);
      handleSubmit(sessionContent);
      sessionStorage.removeItem("ai-detect-content");
    }

    return () => {
      sessionStorage.removeItem("ai-detect-content");
    };
  }, [sessionContent]);

  if (isContendLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mt-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Section */}
        <div className="bg-card border-border text-card-foreground relative self-stretch border">
          <div className="flex h-full min-h-80 flex-col rounded-xl">
            {enableEdit ? (
              <textarea
                name="input"
                rows={isMobile ? 13 : 22}
                placeholder="Enter your text here..."
                className="placeholder:text-muted-foreground w-full flex-1 resize-none bg-transparent p-4 text-sm outline-none md:text-base"
                value={loadingText ? loadingText : userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            ) : (
              <div className="h-full overflow-auto p-4">
                {outputContend &&
                  outputContend.sentences.map((item, index) => (
                    <Fragment key={index}>
                      <span
                        onClick={() => setEnableEdit(true)}
                        style={{
                          backgroundColor: getColorByPerplexity(
                            item.highlight_sentence_for_ai,
                            item.perplexity,
                          ),
                        }}
                      >
                        {item.sentence}
                      </span>
                    </Fragment>
                  ))}
              </div>
            )}

            {!userInput && !share_id ? (
              <UserActionInput
                setUserInput={setUserInput}
                isMobile={isMobile}
                disableTrySample={true}
              />
            ) : null}

            {userInput ? (
              <div className="border-border border-t px-4">
                <WordCounter
                  btnText={enableEdit ? "Scan" : "Edit"}
                  toolName="ai-detector"
                  userInput={userInput}
                  isLoading={isLoading}
                  handleClearInput={handleClear}
                  handleSubmit={handleSubmit}
                  userPackage={user?.package}
                  sticky={0}
                />
              </div>
            ) : null}

            {userLimit && !userInput ? (
              <UsesLimit userLimit={userLimit} />
            ) : null}
          </div>

          {userLimit && userInput ? <UsesLimit userLimit={userLimit} /> : null}
        </div>

        {/* Right Section */}
        <div className="bg-card border-border text-card-foreground relative self-stretch border">
          <div className="flex h-full min-h-80 flex-col rounded-xl">
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
          </div>
        </div>
      </div>

      {outputContend ? (
        <ShareURLModal
          open={showShareModal}
          handleClose={() => setshowShareModal(false)}
          title="AI Detection Report"
          content={outputContend}
          hashtags={["Shothik AI", "AI Detector"]}
        />
      ) : null}
    </div>
  );
};

export default AiDetectorContentSection;
