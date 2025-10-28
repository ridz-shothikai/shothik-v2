"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import store from "../redux/store";
import AnalyticsLoader from "./../components/analytics/AnalyticsLoader";
import MUIProvider from "./MUIProvider";
import { NotificationProvider } from "./NotificationProvider";

function ConditionalGoogleProvider({ children }) {
  const hasGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Don't load Google OAuth if no client ID
  if (!hasGoogleClientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={hasGoogleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AnalyticsLoader />
      <MUIProvider>
        <NotificationProvider>
          <ConditionalGoogleProvider>
            {children}
          </ConditionalGoogleProvider>
        </NotificationProvider>
      </MUIProvider>
    </Provider>
  );
}
