"use client";

import { CacheProvider } from "@emotion/react";
import * as React from "react";
import createEmotionCache from "./createEmotionCache";
import ThemeProvider from "./mui";

const clientSideEmotionCache = createEmotionCache();

export default function MUIProvider({ children }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider>{children}</ThemeProvider>
    </CacheProvider>
  );
}
