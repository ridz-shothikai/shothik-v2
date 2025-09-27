import Analytics from "../analysers/Analytics";
import SettingApplier from "../components/appliers/SettingApplier";
import { LoginModal, RegisterModal } from "../components/auth/AuthModal";
import { Login } from "../components/auth/components/Login";
import { Register } from "../components/auth/components/Register";
import Providers from "../config/Providers";
import "./globals.css";

export const metadata = {
  title: "Shothik AI",
  description:
    "Shothik AI: Paraphrase, humanize, detect AI & translate text to bypass Turnitin & GPTZero. Get a 100% human score & better writing for students, academics & SEOs.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="503cfbe2-6b94-4fa0-8259-3353fa792769"
        ></script>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="a19fecea-d6b0-4093-9074-26531c827bfe"
        ></script>
      </head>
      <body suppressHydrationWarning>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=GTM-PPRFW7NP`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <Providers>
          <SettingApplier />
          {children}
          {/* login modal  */}
          <LoginModal>
            <Login />
          </LoginModal>
          <RegisterModal>
            <Register />
          </RegisterModal>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
