import { PresentationProvider } from "../../../../components/slide/context/SlideContextProvider";

export default function SlideShareLayout({ children }) {
  return (
    <>
      <PresentationProvider>
        <div style={{ margin: 0, padding: 0 }}>{children}</div>
      </PresentationProvider>
    </>
  );
}
