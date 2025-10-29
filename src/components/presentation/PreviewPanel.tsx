"use client";

import { cn } from "@/lib/utils";
import { Chart, registerables } from "chart.js";
import { Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import AppLink from "../common/AppLink";
import SlidePreview from "./SlidePreview";

// Register Chart.js components
Chart.register(...registerables);

export default function PreviewPanel({
  currentAgentType,
  slidesData,
  slidesLoading,
  presentationId,
  currentPhase,
  completedPhases,
  presentationBlueprint,
  qualityMetrics,
  validationResult,
  isValidating,
  onApplyAutoFixes,
  onRegenerateWithFeedback,
  title,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullUrl = pathname + "?" + searchParams.toString();
  const hasReplay = fullUrl.includes("replay");

  const [previewTab, setPreviewTab] = useState("preview");
  const [slideTabs, setSlideTabs] = useState({});

  const handleSlideTabChange = (slideIndex, newValue) => {
    setSlideTabs((prev) => ({
      ...prev,
      [slideIndex]: newValue,
    }));
  };

  console.log("slides data", slidesData);

  return (
    <div className="bg-background text-foreground flex h-full max-h-full flex-col overflow-hidden">
      <div
        className={cn(
          "min-h-0 flex-1 overflow-x-hidden overflow-y-auto",
          "max-h-[90dvh] lg:max-h-[calc(100dvh-70px)]",
          "[&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-track]:bg-muted/20",
          "[&::-webkit-scrollbar-track]:rounded",
          "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
          "[&::-webkit-scrollbar-thumb]:rounded",
          "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30",
          "scrollbar-thin",
        )}
      >
        {previewTab === "preview" && (
          <div>
            {currentAgentType === "presentation" ? (
              <>
                {/* Sticky Header */}
                <div className="border-border bg-card sticky top-0 z-10 flex items-center justify-between border-b px-3 pt-3 pb-2">
                  <h6 className="min-w-0 overflow-hidden text-[0.9rem] font-medium text-ellipsis whitespace-nowrap sm:text-base md:text-[1.1rem]">
                    {slidesData?.status !== "failed"
                      ? title || slidesData?.title || "Generating..."
                      : "Presentation generation failed"}
                  </h6>

                  {(slidesData?.status === "completed" ||
                    slidesData?.status === "saved") && (
                    <div className="text-muted-foreground text-[0.8rem] sm:text-[0.9rem] md:text-base">
                      {!hasReplay && (
                        <AppLink
                          href={`/slides?project_id=${presentationId}`}
                          newTab
                          underline="hover"
                          color="primary"
                          fontSize="14px"
                          whiteSpace="nowrap"
                        >
                          View & Export
                        </AppLink>
                      )}
                    </div>
                  )}
                </div>

                {/* Scrollable Content */}
                <div className="p-3 pt-0">
                  {slidesData?.length === 0 ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="text-primary h-8 w-8 animate-spin" />
                    </div>
                  ) : slidesData?.length > 0 ? (
                    <div className="flex flex-col justify-center gap-2 pt-2">
                      {slidesData?.map((slide, index) => (
                        <SlidePreview
                          key={index}
                          slide={slide}
                          index={index}
                          activeTab={slideTabs[index] || "preview"}
                          onTabChange={handleSlideTabChange}
                          totalSlides={
                            slidesData?.length || slidesData?.data?.length
                          }
                        />
                      ))}

                      {slidesLoading && (
                        <div className="flex justify-center p-4">
                          <Loader2 className="text-primary h-8 w-8 animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-8 p-3 text-center">
                      <p className="text-muted-foreground">
                        No slides generated
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-8 p-3 text-center">
                <p className="text-muted-foreground">
                  Agent output will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
