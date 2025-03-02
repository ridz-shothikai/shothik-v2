import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import user from "./slice/auth";
import inputOutput from "./slice/inputOutput";
import pricing from "./slice/pricing";

const store = configureStore({
  reducer: {
    user,
    inputOutput,
    pricing,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
