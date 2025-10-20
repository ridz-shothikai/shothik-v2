import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => ({
  showAlert: false,
  alertMessage: "",
  agentHistoryMenu: false, // Controls the visibility of the agent history menu,
  isNavVertical: false, // Gives information about vertical nav state
});

const toolsSlice = createSlice({
  name: "tools",
  initialState: getInitialState(),
  reducers: {
    setShowAlert: (state, action) => {
      state.showAlert = action.payload;
    },
    setAlertMessage: (state, action) => {
      state.alertMessage = action.payload;
    },
    setAgentHistoryMenu: (state, action) => {
      state.agentHistoryMenu = action.payload;
    },
    setIsNavVertical: (state, action) => {
      state.isNavVertical = action.payload;
    },
  },
});

export const {
  setShowAlert,
  setAlertMessage,
  setAgentHistoryMenu,
  setIsNavVertical,
} = toolsSlice.actions;

export default toolsSlice.reducer;
