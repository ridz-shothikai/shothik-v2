"use client";

import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { SettingsProvider } from "../hooks/SettingsContext";
import store from "../redux/store";
import MUIProvider from "./MUIProvider";
import TanstackProvider from "./TanstackProvider";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <SettingsProvider>
        <MUIProvider>
          <TanstackProvider>
            <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
          </TanstackProvider>
        </MUIProvider>
      </SettingsProvider>
    </Provider>
  );
}
