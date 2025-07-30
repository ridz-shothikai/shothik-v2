// ====== For Slide creation handler ======

import { authenticateToSheetService } from "../../../src/libs/sheetUtils";
import { setPresentationState } from "../../../src/redux/slice/presentationSlice";
import { setSheetState } from "../../../src/redux/slice/sheetSlice";
import { createPresentationServer } from "../../../src/services/createPresentationServer";

// ====== For SLIDE generation handler ======
async function handleSlideCreation(
  inputValue,
  setAgentType,
  dispatch,
  setLoginDialogOpen,
  setIsSubmitting,
  setIsInitiatingPresentation,
  router,
  showToast
) {
  try {
    sessionStorage.setItem("initialPrompt", inputValue);
  
    setAgentType("presentation");
  
    dispatch(
      setPresentationState({
        logs: [],
        slides: [],
        status: "planning",
        currentPhase: "planning",
        completedPhases: [],
        presentationBlueprint: null,
        title: "Generating...",
        totalSlides: 0,
      })
    );
  
    console.log(
      "[AgentLandingPage] Initiating presentation with message:",
      inputValue
    );
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      // console.error(
      //   "[AgentLandingPage] No accessToken token found in localStorage"
      // );
      setLoginDialogOpen(true);
      setIsSubmitting(false);
      return;
    }
  
    setIsInitiatingPresentation(true);
  
    const response = await createPresentationServer({
      message: inputValue,
      token,
    });
  
    // for action service👇
    if (!response?.success) {
      console.log("Failed to create presentation");
      showToast("Failed to create presentation. Please try again.");
      setIsSubmitting(false);
      setIsInitiatingPresentation(false);
      return;
    }
    const presentationId = response?.presentationId;
  
    console.log(
      "[AgentLandingPage] Presentation initiated with ID:",
      presentationId
    );
  
    if (presentationId) {
      router.push(`/agents/presentation?id=${presentationId}`);
    } else {
      // console.error("[AgentLandingPage] No presentation ID received from API");
      showToast("Failed to create presentation. Please try again.");
      setIsSubmitting(false);
      setIsInitiatingPresentation(false);
    }
  } catch (error) {
    showToast("Failed to initiate presentation. Please try again.");
    setIsSubmitting(false);
    setIsInitiatingPresentation(false);
  }
};

// ====== For SHEET generation handler ======
async function handleSheetGenerationRequest(
  inputValue,
  setAgentType,
  dispatch,
  setLoginDialogOpen,
  setIsSubmitting,
  setIsInitiatingSheet,
  router,
  email,
  showToast,
  refreshSheetAIToken
) {
  try {
    // console.log(inputValue, "input value");
    sessionStorage.setItem("initialSheetPrompt", inputValue);

    setAgentType("sheet");

    dispatch(
      setSheetState({
        logs: [],
        sheet: [],
        status: "idle",
        title: "Generating...",
      })
    );

    console.log(
      "[agentPageUtils] Initiating presentation with message:",
      inputValue
    );

    const token = localStorage.getItem("accessToken");

    if (!token) {
      // console.error("[AgentPageUtils] No access token found");
      showToast("You need to be logged in to create a report sheet.");
      setLoginDialogOpen(true);
      setIsSubmitting(false);
      setIsInitiatingSheet(false);
      return;
    }

    setIsInitiatingSheet(true);

    // Check if we have a sheet stored token
    const storedSheetToken = localStorage.getItem("sheetai-token");

    if (!storedSheetToken) {
      refreshSheetAIToken();
    }

    // After authenticate we will have a sheet token on the local storage
    let response;
    try {
      response = await fetch(
        "https://sheetai.pixigenai.com/api/chat/create_chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sheetai-token")}`,
          },
          body: JSON.stringify({
            name: `${inputValue} - ${new Date().toLocaleString()}`,
          }),
        }
      );
      if (!response.ok) {
        // TODO: Here we need to show user a toast message that we failed
        // console.log("Failed to create chat");
        showToast("Failed to create spreadsheet. Please try again.");
        setIsSubmitting(false);
        setIsInitiatingSheet(false);
        return;
      }
    } catch (error) {
      console.log("Failed to create chat");
      setIsSubmitting(false);
      setIsInitiatingSheet(false);
      return;
    }

    const result = await response.json();

    const chatId = result.chat_id || result.id || result._id;

    // Save active chat ID for connection polling
    sessionStorage.setItem("activeChatId", chatId);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push(`/agents/sheets/?id=${chatId}`);
  } catch (error) {
    console.log("[handleSheetGenerationRequest] error:", error);
    setIsSubmitting(false);
    showToast("An error occurred while creating the spreadsheet.");
    setIsInitiatingSheet(false);
  }
}

// ====== For Download generation handler ======
// ====== For AI Chat generation handler ======
// ====== For Calls generation handler ======
// ====== For ALl Agents generation handler ======


export { handleSlideCreation, handleSheetGenerationRequest };