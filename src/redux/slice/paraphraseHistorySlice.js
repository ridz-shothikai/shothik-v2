import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  histories: [],
  historyGroups: [],
  activeHistory: {},
  activeHistoryIndex: -1,
};

const paraphraseHistorySlice = createSlice({
  name: "paraphraseHistory",
  initialState,
  reducers: {
    setHistories: (state, action) => {
      state.histories = action.payload;
      if (state.activeHistory?._id && action?.payload?.length > 0) {
        state.activeHistoryIndex = action?.payload.findIndex(
          (history) => history?._id === state.activeHistory?._id,
        );
      } else {
        state.activeHistoryIndex = -1;
      }
    },
    setHistoryGroups: (state, action) => {
      state.historyGroups = action.payload;
    },
    setActiveHistory: (state, action) => {
      state.activeHistory = action.payload;
      if (action?.payload?._id && state?.histories?.length > 0) {
        state.activeHistoryIndex = state.histories.findIndex(
          (history) => history?._id === action.payload?._id,
        );
      } else {
        state.activeHistoryIndex = -1;
      }
    },
  },
});

export const { setActiveHistory, setHistories, setHistoryGroups } =
  paraphraseHistorySlice.actions;
export default paraphraseHistorySlice.reducer;
