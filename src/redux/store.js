import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./api/auth/authApiSlice";
import { blogApiSlice } from "./api/blog/blogApiSlice";
import { pricingApiSlice } from "./api/pricing/pricingApi";
import auth from "./slice/auth";
import inputOutput from "./slice/inputOutput";
import settings from "./slice/settings";
import tools from "./slice/tools";

const store = configureStore({
  reducer: {
    auth,
    inputOutput,
    settings,
    tools,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [blogApiSlice.reducerPath]: blogApiSlice.reducer,
    [pricingApiSlice.reducerPath]: pricingApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApiSlice.middleware,
      blogApiSlice.middleware,
      pricingApiSlice.middleware
    ),
});

export default store;
