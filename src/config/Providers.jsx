"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import store from "../redux/store";
import MUIProvider from "./MUIProvider";
import { NotificationProvider } from "./NotificationProvider";
import AnalyticsLoader from "../components/analytics/AnalyticsProvider";

function ConditionalGoogleProvider({ children }) {
  const pathname = usePathname();
  const isSharedPage = pathname?.startsWith('/shared');
  const hasGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Don't load Google OAuth on shared pages or if no client ID
  if (isSharedPage || !hasGoogleClientId) {
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
