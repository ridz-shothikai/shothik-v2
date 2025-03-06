"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "../redux/store";
import MUIProvider from "./MUIProvider";
import { NotificationProvider } from "./NotificationProvider";
import TanstackProvider from "./TanstackProvider";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <MUIProvider>
        <TanstackProvider>
          <NotificationProvider>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            >
              {children}
            </GoogleOAuthProvider>
          </NotificationProvider>
        </TanstackProvider>
      </MUIProvider>
    </Provider>
  );
}
