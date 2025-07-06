import { PresentationProvider } from "../../../components/slide/context/SlideContext";

export default function SlidePreviewLayout({ children }) {
  return (
    <html lang="en">
      <PresentationProvider>
        <body style={{ margin: 0, padding: 0 }}>
          {children}
        </body>
      </PresentationProvider>
    </html>
  )
}
