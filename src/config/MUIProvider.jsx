"use client";

import { CacheProvider } from "@emotion/react";
import * as React from "react";
import createEmotionCache from "./createEmotionCache";
import ThemeProvider from "./mui";

export default function MUIProvider({ children }) {
  const [clientSideEmotionCache] = React.useState(() => createEmotionCache());

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider>{children}</ThemeProvider>
    </CacheProvider>
  );
}
