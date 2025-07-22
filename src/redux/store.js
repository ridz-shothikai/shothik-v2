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
import sheetSlice from './slice/sheetSlice';
import {sheetApiSlice} from "./api/sheet/sheetApi";

const store = configureStore({
  reducer: {
    auth,
    inputOutput,
    settings,
    tools,
    presentation: presentationSlice,
    sheet: sheetSlice,
    [shareApiSlice.reducerPath]: shareApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [blogApiSlice.reducerPath]: blogApiSlice.reducer,
    [pricingApiSlice.reducerPath]: pricingApiSlice.reducer,
    [toolsApiSlice.reducerPath]: toolsApiSlice.reducer,
    [presentationApiSlice.reducerPath]: presentationApiSlice.reducer,
    [sheetApiSlice.reducerPath]: sheetApiSlice.reducer,
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
      sheetApiSlice.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
