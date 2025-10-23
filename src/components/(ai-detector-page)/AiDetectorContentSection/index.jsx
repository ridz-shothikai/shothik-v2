"use client";

import { trySamples } from "@/_mock/trySamples";
import { trackEvent } from "@/analysers/eventTracker";
import BookIcon from "@/components/icons/BookIcon";
import WordCounter from "@/components/tools/common/WordCounter";
import useLoadingText from "@/hooks/useLoadingText";
import useSnackbar from "@/hooks/useSnackbar";
import {
  useGetShareAidetectorContendQuery,
  useGetUsesLimitQuery,
  useScanAidetectorMutation,
} from "@/redux/api/tools/toolsApi";
import {
  setIsSectionbarOpen,
  setSections,
  setSectionsMeta,
  setSelectedSection,
} from "@/redux/slice/ai-detector-slice";
import { setShowLoginModal } from "@/redux/slice/auth";
import { setAlertMessage, setShowAlert } from "@/redux/slice/tools";
import LoadingScreen from "@/resource/LoadingScreen";
import {
  fetchAiDetectorSection,
  fetchAiDetectorSections,
} from "@/services/ai-detector.service";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AiDetectorSectionbar from "./AiDetectorSectionbar";
import { getColorByPerplexity } from "./helpers/pdfHelper";
import InitialInputActions from "./InitialInputActions";
import OutputResult from "./OutputResult";
import SampleText from "./SampleText";
import ShareURLModal from "./ShareURLModal";
import UsesLimitBar from "./UsesLimitBar";

const dataGroupsByPeriod = (histories = []) => {
  if (!Array.isArray(histories) || histories.length === 0) return [];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const groups = histories.reduce((acc, entry) => {
    if (!entry?.timestamp) return acc;

    const d = new Date(entry.timestamp);
    const m = d.getMonth();
    const y = d.getFullYear();
    const monthName = d.toLocaleString("default", { month: "long" });
    const key =
      m === currentMonth && y === currentYear
        ? "This Month"
        : `${monthName} ${y}`;

    if (!acc?.[key]) acc[key] = [];
    acc?.[key]?.push({
      ...(entry || {}),
      _id: entry?._id,
      text: entry?.text,
      time: entry?.timestamp,
    });
    return acc;
  }, {});

  const result = [];

  if (groups?.["This Month"]) {
    result.push({ period: "This Month", history: groups["This Month"] });
    delete groups["This Month"];
  }

  Object.keys(groups)
    .sort((a, b) => {
      const [ma, ya] = a.split(" ");
      const [mb, yb] = b.split(" ");
      const da = new Date(`${ma} 1, ${ya}`);
      const db = new Date(`${mb} 1, ${yb}`);
      return db - da;
    })
    .forEach((key) => {
      result.push({ period: key, history: groups?.[key] });
    });

  return result;
};

const AiDetectorContentSection = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(null);

  const [openSampleDrawer, setOpenSampleDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [scanAidetector] = useScanAidetectorMutation();

  const [enableEdit, setEnableEdit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const enqueueSnackbar = useSnackbar();
  const searchParams = useSearchParams();
  const share_id = searchParams.get("share_id");
  const sectionId = searchParams.get("section");
  const dispatch = useDispatch();
  const loadingText = useLoadingText(isLoading);

  const minCharacters = 250;

  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [isCurrentSection, setIsCurrentSection] = useState(false);

  const {
    isCheckLoading,
    isRecommendationLoading,
    language,
    // text,
    score,
    scores,
    issues,
    selectedIssue,
    recommendations,
    isSidebarOpen,
    isSectionbarOpen,
    sections,
    selectedSection,
    selectedTab,
  } = useSelector((state) => state.ai_detector) || {};

  const { data: shareContend, isLoading: isContendLoading } =
    useGetShareAidetectorContendQuery(share_id, {
      skip: !share_id,
    });

  const { data: limit, refetch } = useGetUsesLimitQuery({
    service: "ai-detector",
  });
  const sessionContent = JSON.parse(
    sessionStorage.getItem("ai-detect-content"),
  );

  const pathname = usePathname();

  const setResultToState = (result) => {
    if (!result) return;
    setResult({
      ...result,
      aiSentences: result?.sentences?.filter(
        (sentence) => sentence?.highlight_sentence_for_ai,
      ),
      humanSentences: result?.sentences?.filter(
        (sentence) => !sentence.highlight_sentence_for_ai,
      ),
    });
  };

  // URL parameter management
  const setSectionId = useCallback(
    (newId) => {
      if (!newId) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", newId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const removeSectionId = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("section");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!shareContend) return;
    const { result, history } = shareContend;

    if (!result) return;

    setText(history?.text || "");
    setHistory(history);
    setResultToState(history?.result || result);

    setEnableEdit(false);
  }, [shareContend]);

  async function handleSubmit(inputData = null) {
    try {
      if (!enableEdit) {
        setEnableEdit(true);
        return;
      }

      trackEvent("click", "ai-detector", "ai-detector_click", 1);

      setIsLoading(true);
      const res = await scanAidetector({
        text: inputData ? inputData : text,
      }).unwrap();
      const { result, history } = res;
      if (!result) throw { message: "Something went wrong" };

      setText(history?.text || "");
      setHistory(history);
      setResultToState(result || history?.result);
      setEnableEdit(false);

      refetch();

      if (sessionContent) {
        sessionStorage.removeItem("ai-detect-content");
      }

      const { _id } = res?.section || {};
      if (_id && (!sectionId || _id !== sectionId)) {
        setIsCurrentSection(true);
        dispatch(
          setSections([
            { ...(res?.section || {}), last_history: history },
            ...sections,
          ]),
        );
        dispatch(setSelectedSection(res?.section));
        setSectionId(_id);
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
      setText(text);
      setOpenSampleDrawer(false);
    }
  }

  // Clear function
  const handleClear = useCallback(() => {
    setText("");
    setResult(null);
    setHistory(null);
    setEnableEdit(true);
    dispatch(setText(""));
  }, [dispatch]);

  // Section management
  const handleNewSection = useCallback(() => {
    handleClear();
    dispatch(setSelectedSection({}));
    removeSectionId();
    enqueueSnackbar("New chat opened!", { variant: "info" });
  }, [handleClear, dispatch, removeSectionId, enqueueSnackbar]);

  const handleSelectSection = useCallback(
    (section) => {
      handleClear();
      setIsCurrentSection(true);
      dispatch(setSelectedSection(section || {}));

      const { text, result, last_history } = section;

      if (result) {
        setText(last_history?.text || text || "");
        setHistory(last_history || null);
        setResultToState(last_history?.result || result);
        setEnableEdit(false);
      }

      if (section?._id && section._id !== sectionId) {
        setSectionId(section._id);
      }
    },
    [handleClear, setIsCurrentSection, dispatch, setSectionId],
  );

  const fetchSections = useCallback(
    async ({ page = 1, limit = 10, search = "", reset = false } = {}) => {
      try {
        const { data, meta } = await fetchAiDetectorSections({
          page,
          limit,
          search,
        });

        if (reset) {
          const groups = dataGroupsByPeriod(data || []);
          dispatch(setSections(data || []));
          dispatch(setSectionsGroups(groups));
          dispatch(setSectionsMeta(meta || {}));
        } else {
          const allData = [...(sections || []), ...(data || [])];
          const groups = dataGroupsByPeriod(allData);
          dispatch(setSections(allData));
          dispatch(setSectionsGroups(groups));
          dispatch(setSectionsMeta(meta || {}));
        }
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    },
    [sections, dispatch],
  );

  // Load section by ID
  useEffect(() => {
    if (!sectionId) {
      dispatch(setSelectedSection({}));
      return;
    }

    if (isCurrentSection) return;

    if (selectedSection?._id === sectionId) return;

    console.log("Fetching section:", sectionId, selectedSection);

    const setCurrentSection = async () => {
      try {
        const { success, data } = await fetchAiDetectorSection(sectionId);
        if (success && data) {
          dispatch(setSelectedSection(data));
          setText(data?.text);

          const result = data?.result;

          if (result) {
            setResultToState(result);
            setEnableEdit(false);
          }
        }
      } catch (err) {
        console.error("Error fetching section:", err);
      }
    };

    setCurrentSection();
  }, [sectionId]);

  useEffect(() => {
    if (sessionContent) {
      setText(sessionContent);
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
    <>
      <div className="py-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="bg-card hidden h-fit rounded-md border p-4 px-3 lg:block">
            <div className="flex flex-col gap-6">
              <button onClick={() => dispatch(setIsSectionbarOpen(true))}>
                <BookIcon className="size-5" />
              </button>
              <button onClick={() => handleNewSection()}>
                <Plus className="size-6" />
              </button>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-0">
            {/* Left Section */}
            <div className="bg-card border-border text-card-foreground relative self-stretch border">
              <div className="flex h-full min-h-60 flex-col rounded-xl">
                <div className="relative h-full">
                  <div className="h-full">
                    {enableEdit ? (
                      <textarea
                        name="input"
                        rows={16}
                        placeholder="Enter your text here..."
                        className="placeholder:text-muted-foreground w-full flex-1 resize-none bg-transparent p-4 text-sm outline-none md:text-base"
                        value={loadingText ? loadingText : text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    ) : (
                      <div className="h-full overflow-auto p-4">
                        {result &&
                          result?.sentences?.map((item, index) => (
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
                  </div>

                  {!text && !share_id ? (
                    <div className="absolute right-4 bottom-6 left-4 mx-auto flex items-center justify-center">
                      <InitialInputActions
                        setInput={(text) => {
                          setText(text);
                        }}
                        showPaste={true}
                        showInsertDocument={true}
                      />
                    </div>
                  ) : null}
                </div>

                {text ? (
                  <div className="border-border border-t px-4">
                    <WordCounter
                      btnText={enableEdit ? "Scan" : "Edit"}
                      toolName="ai-detector"
                      userInput={text}
                      isLoading={isLoading}
                      handleClearInput={handleClear}
                      handleSubmit={handleSubmit}
                      userPackage={user?.package}
                      sticky={0}
                    />
                  </div>
                ) : null}

                {limit && !text ? (
                  <UsesLimitBar text={text} min={minCharacters} limit={limit} />
                ) : null}
              </div>
            </div>

            {/* Right Section */}
            <div className="bg-card border-border text-card-foreground relative self-stretch border">
              <div className="flex h-full min-h-60 flex-col rounded-xl">
                {result ? (
                  <OutputResult
                    handleOpen={() => setShowShareModal(true)}
                    result={result}
                    history={history}
                  />
                ) : (
                  <SampleText
                    handleSampleText={handleSampleText}
                    setOpen={setOpenSampleDrawer}
                    isDrawer={openSampleDrawer}
                  />
                )}
              </div>
            </div>
          </div>

          {history?._id && (
            <ShareURLModal
              open={showShareModal}
              handleClose={() => setShowShareModal(false)}
              title="AI Detection Report"
              history={history}
              hashtags={["Shothik AI", "AI Detector"]}
            />
          )}
        </div>
      </div>
      <AiDetectorSectionbar
        fetchSections={fetchSections}
        handleNewSection={handleNewSection}
        handleSelectSection={handleSelectSection}
        sectionId={sectionId}
        setSectionId={setSectionId}
        removeSectionId={removeSectionId}
      />
    </>
  );
};

export default AiDetectorContentSection;
