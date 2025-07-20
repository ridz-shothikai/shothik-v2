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
  router
) {
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
    console.error(
      "[AgentLandingPage] No accessToken token found in localStorage"
    );
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
    return;
  }
  setIsInitiatingPresentation(false);
  const presentationId = response?.presentationId;

  console.log(
    "[AgentLandingPage] Presentation initiated with ID:",
    presentationId
  );

  if (presentationId) {
    router.push(`/agents/presentation?id=${presentationId}`);
  } else {
    console.error("[AgentLandingPage] No presentation ID received from API");
    // alert("Failed to create presentation. Please try again.");
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
  email
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
      console.error("[AgentPageUtils] No access token found");

      setLoginDialogOpen(true);
      setIsSubmitting(false);
      return;
    }

    setIsInitiatingSheet(true);

    // Check if we have a sheet stored token
    const storedSheetToken = localStorage.getItem("sheetai-token");

    if(!storedSheetToken) {
      // TODO: Authentication needs to be handled on the login and register page
      await authenticateToSheetService(email);
    }

    // After authenticate we will have a sheet token on the local storage

    const response = await fetch(
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

    if(!response.ok) {
      // TODO: Here we need to show user a toast message that we failed
      console.log("Failed to create chat");
      return;
    }

    const result = await response.json();

    const chatId = result.chat_id || result.id || result._id;

    router.push(`/agents/sheets/?id=${chatId}`);
  } catch (error) {
    console.log("[handleSheetGenerationRequest] error:", error);
  }
}

// ====== For Download generation handler ======
// ====== For AI Chat generation handler ======
// ====== For Calls generation handler ======
// ====== For ALl Agents generation handler ======


export { handleSlideCreation, handleSheetGenerationRequest };