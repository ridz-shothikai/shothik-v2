"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import store from "../redux/store";
import MUIProvider from "./MUIProvider";
import TanstackProvider from "./TanstackProvider";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <MUIProvider>
        <TanstackProvider>
          <SnackbarProvider maxSnack={3}>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            >
              {children}
            </GoogleOAuthProvider>
          </SnackbarProvider>
        </TanstackProvider>
      </MUIProvider>
    </Provider>
  );
}
