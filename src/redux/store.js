import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./api/auth/authApiSlice";
import { blogApiSlice } from "./api/blog/blogApiSlice";
import auth from "./slice/auth";
import inputOutput from "./slice/inputOutput";
import pricing from "./slice/pricing";
import settings from "./slice/settings";

const store = configureStore({
  reducer: {
    auth,
    inputOutput,
    pricing,
    settings,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [blogApiSlice.reducerPath]: blogApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      blogApiSlice.middleware
    ),
});

export default store;
