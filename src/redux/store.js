import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./api/auth/authApiSlice";
import { blogApiSlice } from "./api/blog/blogApiSlice";
import { pricingApiSlice } from "./api/pricing/pricingApi";
import { toolsApiSlice } from "./api/tools/toolsApi";
import { presentationApiSlice } from "./api/presentation/presentationApi";
import {shareApiSlice} from './api/share/shareApi';
import auth from "./slice/auth";
import inputOutput from "./slice/inputOutput";
import settings from "./slice/settings";
import tools from "./slice/tools";
import presentationSlice from './slice/presentationSlice';

const store = configureStore({
  reducer: {
    auth,
    inputOutput,
    settings,
    tools,
    presentation: presentationSlice,
    [shareApiSlice.reducerPath]: shareApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [blogApiSlice.reducerPath]: blogApiSlice.reducer,
    [pricingApiSlice.reducerPath]: pricingApiSlice.reducer,
    [toolsApiSlice.reducerPath]: toolsApiSlice.reducer,
    [presentationApiSlice.reducerPath]: presentationApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApiSlice.middleware,
      blogApiSlice.middleware,
      pricingApiSlice.middleware,
      toolsApiSlice.middleware,
      presentationApiSlice.middleware,
      shareApiSlice.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
