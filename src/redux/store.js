import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./api/auth/authApiSlice";
import { blogApiSlice } from "./api/blog/blogApiSlice";
import { presentationApiSlice } from "./api/presentation/presentationApi";
import { pricingApiSlice } from "./api/pricing/pricingApi";
import { researchChatApi } from "./api/research/researchChatApi";
import { researchCoreApi } from "./api/research/researchCoreApi";
import { shareApiSlice } from "./api/share/shareApi";
import { sheetApiSlice } from "./api/sheet/sheetApi";
import { toolsApiSlice } from "./api/tools/toolsApi";
import analyticsReducer from "./slice/analyticsSlice";
import auth from "./slice/auth";
import inputOutput from "./slice/inputOutput";
import paraphraseHistoryReducer from "./slice/paraphraseHistorySlice";
import presentationSlice from "./slice/presentationSlice";
import researchChatReducer from "./slice/researchChatSlice";
import researchCoreReducer from "./slice/researchCoreSlice";
import researchUiSlice from "./slice/researchUiSlice";
import settings from "./slice/settings";
import sheetSlice from "./slice/sheetSlice";
import tools from "./slice/tools";

// Development vs Production configuration
const isDevelopment = process.env.NODE_ENV !== "production";

// Custom RTK Query error handler
const rtkQueryErrorHandler = (api, options) => (next) => (action) => {
  const result = next(action);

  // Handle RTK Query errors specifically for research APIs
  if (action.type?.endsWith("/rejected")) {
    const isResearchApi =
      action.type.includes("researchCore") ||
      action.type.includes("researchChat");

    if (isResearchApi) {
      console.error("[RTK Query Error]", {
        action: action.type,
        error: action.payload,
        meta: action.meta,
      });

      // Could dispatch error recovery actions here
      // store.dispatch(setConnectionStatus('failed'));
    }
  }

  return result;
};

const store = configureStore({
  reducer: {
    auth,
    inputOutput,
    settings,
    tools,
    presentation: presentationSlice,
    sheet: sheetSlice,
    analytics: analyticsReducer,
    researchChat: researchChatReducer,
    researchCore: researchCoreReducer,
    researchUi: researchUiSlice,
    paraphraseHistory: paraphraseHistoryReducer,
    [shareApiSlice.reducerPath]: shareApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [blogApiSlice.reducerPath]: blogApiSlice.reducer,
    [pricingApiSlice.reducerPath]: pricingApiSlice.reducer,
    [toolsApiSlice.reducerPath]: toolsApiSlice.reducer,
    [presentationApiSlice.reducerPath]: presentationApiSlice.reducer,
    [sheetApiSlice.reducerPath]: sheetApiSlice.reducer,
    [researchChatApi.reducerPath]: researchChatApi.reducer,
    [researchCoreApi.reducerPath]: researchCoreApi.reducer,
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
      researchChatApi.middleware,
      researchCoreApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore certain action types that contain non-serializable data
//         ignoredActions: [
//           'persist/PERSIST',
//           'persist/REHYDRATE',
//           // Research-specific actions that might contain functions/objects
//           'researchCore/addStreamEvent',
//         ],
//         // Ignore paths in state that contain non-serializable data
//         ignoredPaths: [
//           'researchCore.streamEvents', // Events might contain complex objects
//         ],
//       },
//       immutableCheck: {
//         // Disable in production for performance
//         enable: isDevelopment,
//       },
//       // Enable thunk with extra argument for dependency injection
//       thunk: {
//         extraArgument: {
//           // Could inject services here
//           queueService: null, // Will be injected after store creation
//         },
//       },
//     })
//     // Add RTK Query API middleware
//     .concat(
//       authApiSlice.middleware,
//       blogApiSlice.middleware,
//       pricingApiSlice.middleware,
//       toolsApiSlice.middleware,
//       presentationApiSlice.middleware,
//       shareApiSlice.middleware,
//       sheetApiSlice.middleware,
//       researchChatApi.middleware,
//       researchCoreApi.middleware,
//     )
//     // Add custom middleware for research stream management
//     .concat(
//       researchErrorMiddleware,      // Must be first to catch all errors
//       researchStreamMiddleware,     // Core business logic
//       rtkQueryErrorHandler,         // Handle RTK Query errors
//       ...(isDevelopment ? [researchPerformanceMiddleware] : []), // Performance monitoring in dev only
//     ),

//   devTools: isDevelopment && {
//     // Enhanced dev tools configuration
//     name: 'Research App Store',
//     trace: true,
//     traceLimit: 25,
//     actionSanitizer: (action) => ({
//       ...action,
//       // Sanitize large payloads in dev tools
//       payload: action.type.includes('streamEvent')
//         ? { ...action.payload, sanitized: true }
//         : action.payload,
//     }),
//     stateSanitizer: (state) => ({
//       ...state,
//       // Don't show large stream events in dev tools
//       researchCore: {
//         ...state.researchCore,
//         streamEvents: state.researchCore?.streamEvents?.length > 10
//           ? `[${state.researchCore.streamEvents.length} events - truncated for devtools]`
//           : state.researchCore?.streamEvents,
//       },
//     }),
//   },

//   // Preloaded state for hydration
//   preloadedState: {},
// });
