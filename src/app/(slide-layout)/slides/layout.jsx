import { PresentationProvider } from "../../../components/slide/context/SlideContext";
import SlidePreviewNavbar from "../../../components/slide/SlidePreviewNavbar";

export default function SlidePreviewLayout({ children }) {
  return (
    <html lang="en">
      <PresentationProvider>
        <SlidePreviewNavbar/>
        <body style={{ margin: 0, padding: 0 }}>
          {children}
        </body>
      </PresentationProvider>
    </html>
  )
}
