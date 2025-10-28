"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [openVideo, setOpenVideo] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpenVideo(false);
    }
    if (openVideo) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openVideo]);

  // Prevent background page scrolling when the video modal is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (openVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevOverflow;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [openVideo]);

  return (
    <>
      <section className="mx-auto w-full bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10 text-center">
        <h1 className="text-8xl font-[400] text-zinc-800">
          Let Shothik Handle It
          <br />
          <span className="text-4xl font-[200] text-gray-400">
            Write better, Work Smarter, Scale Faster
          </span>
        </h1>

        <button
          type="button"
          onClick={() => setOpenVideo(true)}
          aria-label="Play introduction video"
          className="relative mx-auto mt-54 aspect-[16/9] w-full max-w-[800px] cursor-pointer overflow-hidden rounded-[23px] border-[7px] border-[#dcdcdc] bg-cover bg-center shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          style={{
            backgroundImage: "url('THUMBNEL.png')",
          }}
        >
          {/* Fade shadow overlay */}
          <span className="absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.75)_100%)]" />

          {/* Play circle */}
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/8 bg-white/95"
          >
            <svg
              className="h-10 w-10 text-[#00A76F]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>

          {/* Inner border */}
          <span className="pointer-events-none absolute inset-[8px] rounded-[12px] border border-black/4" />
        </button>

        <div className="mt-6">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-waitlist"))
            }
            className="mx-auto cursor-pointer rounded-[11px] border-[4px] border-[#f0f8ff] bg-emerald-500 px-12 py-5 font-bold text-white"
          >
            JOIN THE WAITLIST
          </button>
        </div>
      </section>

      {/* Video Modal */}
      {openVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpenVideo(false)}
            aria-hidden
          />

          <div className="relative z-10 aspect-[16/9] w-[92vw] overflow-hidden rounded-sm bg-black md:w-[80vw]">
            <button
              type="button"
              aria-label="Close video"
              onClick={() => setOpenVideo(false)}
              className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 6l12 12M6 18L18 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <video
              src="/intro.mp4"
              controls
              autoPlay
              className="block h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
