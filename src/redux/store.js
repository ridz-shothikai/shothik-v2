import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import user from "./slice/auth";
import inputOutput from "./slice/inputOutput";
import pricing from "./slice/pricing";
import settings from "./slice/settings";

const store = configureStore({
  reducer: {
    auth: user,
    inputOutput,
    pricing,
    settings,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
