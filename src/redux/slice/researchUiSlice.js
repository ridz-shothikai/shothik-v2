import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: 0, // 0: Research, 1: Images, 2: Sources
  headerHeight: 20,
  isDarkMode: false,
  uploadedFiles: [],
  isUploading: false,
};

export const researchUiSlice = createSlice({
  name: "researchUi",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setHeaderHeight: (state, action) => {
      state.headerHeight = action.payload;
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    addUploadedFile: (state, action) => {
      state.uploadedFiles.push(action.payload);
    },
    removeUploadedFile: (state, action) => {
      state.uploadedFiles = state.uploadedFiles.filter(
        (_, index) => index !== action.payload
      );
    },
    setUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },
  },
});

export const {
  setSelectedTab,
  setHeaderHeight,
  setDarkMode,
  addUploadedFile,
  removeUploadedFile,
  setUploading,
  clearUploadedFiles,
} = researchUiSlice.actions;

export default researchUiSlice.reducer;
