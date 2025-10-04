import DotIndicator from "@/components/ui/DotIndicator";
import { Button, TextField } from "@mui/material";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import PageHeader from "../../PageHeader";
import StepDetails from "./StepDetails";

const renderStepData = (step, data) => {
  const stepData = data?.data?.data;

  if (!stepData) return null;

  switch (step) {
    case "step1.1":
      return (
        <div className="space-y-2 text-xs">
          {stepData.domain && (
            <div className="flex gap-2">
              <span className="font-semibold text-gray-600">Domain:</span>
              <span className="text-gray-800">{stepData.domain}</span>
            </div>
          )}
          {stepData.parsedData && (
            <div className="space-y-1">
              <div className="font-semibold text-gray-600">Parsed Data:</div>
              <div className="ml-3 space-y-1">
                {stepData.parsedData.title && (
                  <div>
                    <span className="font-medium">Title:</span>{" "}
                    <span className="text-gray-700">
                      {stepData.parsedData.title}
                    </span>
                  </div>
                )}
                {stepData.parsedData.description && (
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    <span className="text-gray-700">
                      {stepData.parsedData.description}...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );

    case "step1.3": // Product Analysis
      return (
        <div className="space-y-2 text-xs">
          {stepData.name && (
            <div>
              <span className="font-semibold text-gray-600">Product:</span>{" "}
              <span className="text-gray-800">{stepData.name}</span>
            </div>
          )}
          {stepData.category && (
            <div>
              <span className="font-semibold text-gray-600">Category:</span>{" "}
              <span className="text-gray-800">{stepData.category}</span>
            </div>
          )}
          {stepData.description && (
            <div>
              <span className="font-semibold text-gray-600">Description:</span>{" "}
              <span className="text-gray-700">{stepData.description}</span>
            </div>
          )}
        </div>
      );

    case "step1.4": // AI Selling Points
      return (
        <div className="space-y-2 text-xs">
          {stepData.sellingPoints && (
            <div>
              <div className="mb-1 font-semibold text-gray-600">
                Key Selling Points:
              </div>
              <ul className="ml-4 list-inside list-disc space-y-1">
                {stepData.sellingPoints.map((point, idx) => (
                  <li key={idx} className="text-gray-700">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case "step1.5": // Ads Strategy
      return (
        <div className="space-y-2 text-xs">
          {stepData.adsGoalStrategy && (
            <div>
              <span className="font-semibold text-gray-600">Strategy:</span>{" "}
              <span className="text-gray-700">{stepData.adsGoalStrategy}</span>
            </div>
          )}
        </div>
      );

    case "step2.1": // Competitors
      return (
        <div className="space-y-3 text-xs">
          {stepData.competitors && (
            <div>
              <div className="mb-2 font-semibold text-gray-600">
                Top Competitors:
              </div>
              {stepData.competitors.map((comp, idx) => (
                <div
                  key={idx}
                  className="mb-3 rounded border border-gray-200 bg-gray-50 p-2"
                >
                  <div className="font-medium text-gray-800">{comp.name}</div>
                  {comp.url && (
                    <div className="mt-1 truncate text-blue-600">
                      {comp.url}
                    </div>
                  )}
                  {comp.analysis && (
                    <div className="mt-1 text-gray-600">{comp.analysis}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case "step2.2": // Keywords
      return (
        <div className="space-y-2 text-xs">
          {stepData.keywords && (
            <div>
              <div className="mb-2 font-semibold text-gray-600">
                Keywords ({stepData?.keywords?.length}):
              </div>
              <ul className="flex flex-wrap gap-2">
                {stepData.keywords.map((kw, idx) => (
                  <li
                    key={idx}
                    className="rounded border border-blue-200 bg-blue-50 px-2 py-1"
                  >
                    <div className="font-medium text-blue-800">
                      {kw.keyword}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case "step2.3": // Market Analysis
      return (
        <div className="space-y-2 text-xs">
          {stepData.marketAnalysis && (
            <div>
              {stepData.marketAnalysis.targetRegions && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-600">
                    Target Regions:
                  </span>{" "}
                  <span className="text-gray-700">
                    {stepData.marketAnalysis.targetRegions.join(", ")}
                  </span>
                </div>
              )}
              {stepData.marketAnalysis.currentMarket && (
                <div>
                  <div className="mb-1 font-semibold text-gray-600">
                    Market Overview:
                  </div>
                  <div className="leading-relaxed text-gray-700">
                    {stepData.marketAnalysis.currentMarket}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );

    case "step2.4": // Regional Strategy
      return (
        <div className="space-y-2 text-xs">
          {stepData.regionalStrategy && (
            <div>
              <div className="mb-2 font-semibold text-gray-600">
                Regional Strategy Highlights:
              </div>
              <div className="overflow-y-auto leading-relaxed text-gray-700">
                {stepData.regionalStrategy}
              </div>
            </div>
          )}
        </div>
      );

    case "step2.5": // Community Analysis
      return (
        <div className="space-y-2 text-xs">
          {stepData.communityAnalysis && (
            <div>
              <div className="mb-2 font-semibold text-gray-600">
                Community Insights:
              </div>
              <div className="leading-relaxed text-gray-700">
                {stepData.communityAnalysis}
              </div>
            </div>
          )}
        </div>
      );

    case "step3": // Final Analysis
      return (
        <div className="space-y-2 text-xs">
          {stepData.finalAnalysis && (
            <div>
              <div className="mb-2 font-semibold text-gray-600">
                Final Analysis:
              </div>
              <div className="overflow-y-auto leading-relaxed text-gray-700">
                {stepData.finalAnalysis}
              </div>
            </div>
          )}
        </div>
      );

    case "step4": // Snapshot
      return (
        <div className="space-y-2 text-xs">
          {stepData.snapshot && (
            <div>
              <div className="mb-1 font-semibold text-gray-600">
                {stepData.snapshot.title}
              </div>
              {stepData.snapshot.summary && (
                <div className="space-y-1 text-gray-700">
                  <div>
                    <span className="font-medium">Positioning:</span>{" "}
                    {stepData.snapshot.summary.productPositioning}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );

    case "completed":
      return (
        <div className="rounded bg-green-50 p-3 text-center">
          <div className="font-semibold text-green-800">
            ✓ Analysis Completed Successfully!
          </div>
          {stepData.projectId && (
            <div className="mt-1 text-xs text-green-600">
              Project ID: {stepData.projectId}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

const AnalysisStreamTabSection = ({
  url,
  streamData,
  currentStep,
  isSubmitting,
  progress,
  screenshot = "",
  getStepDisplayName,
  getStepMessage,
}) => {
  // SCROLL ref
  const scrollRef = useRef(null);

  // Auto scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [streamData, progress]);
  return (
    <main className="bg-card relative flex min-h-[calc(100vh-100px)] flex-col space-y-6 p-6">
      <PageHeader />
      <div className="space-y-6 md:space-y-10">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="bg-card rounded-full border shadow">
            <TextField
              value={`${url}`}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                className: "px-4 !py-2",
              }}
              fullWidth
            />
          </div>
          <h2>Creating customized insights for your marketing campaigns</h2>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 md:space-y-10">
            {streamData.map((data, index) => {
              if (!data?.data?.data && data?.step !== "step1.2") {
                return null;
              }

              if (
                data?.step === "step1.2" &&
                data?.data?.message === "Taking screenshot..."
              ) {
                return null;
              }

              if (
                data?.step === "step1.2" &&
                data?.data?.message !== "Taking screenshot..."
              ) {
                return (
                  <div
                    key={index}
                    className={`space-y-4 transition-all duration-500 ease-in-out`}
                  >
                    <div className="flex items-baseline gap-4">
                      <div className="bg-card flex size-10 shrink-0 items-center justify-center rounded-full shadow">
                        <Image
                          src={"/images/marketing-automation/shothik-icon.png"}
                          width={24}
                          height={24}
                          alt={"arrow"}
                        />
                      </div>
                      <div className="flex w-full items-center justify-between gap-2">
                        <h5 className="flex-1 font-semibold">
                          {getStepDisplayName(data.step)}
                        </h5>
                        <div className="text-muted-foreground text-xs">
                          {new Date(data.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {/* <div className="prose max-w-none rounded-xl p-4 shadow lg:p-6 [&_ol]:list-inside [&_ul]:list-inside">
                  <div dangerouslySetInnerHTML={{ __html: data?.content }} />
                </div> */}
                    <div className="space-y-2 rounded-xl p-4 shadow">
                      <p className="text-muted-foreground text-sm">
                        {getStepMessage(data)}
                      </p>
                      <div>
                        <div className="bg-primary/10 size-fit rounded-xl p-4">
                          {screenshot ? (
                            <div className="bg-muted-foreground/50 aspect-video size-fit h-60 max-h-60 rounded-lg">
                              <Image
                                src={screenshot}
                                alt="Demo Product"
                                className="size-full object-cover"
                                width={450}
                                height={400}
                              />
                            </div>
                          ) : (
                            <div className="bg-muted aspect-video size-fit h-60 max-h-60 animate-pulse rounded-lg" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`space-y-4 transition-all duration-500 ease-in-out`}
                >
                  <div className="flex items-baseline gap-4">
                    <div className="bg-card flex size-10 shrink-0 items-center justify-center rounded-full shadow">
                      <Image
                        src={"/images/marketing-automation/shothik-icon.png"}
                        width={24}
                        height={24}
                        alt={"arrow"}
                      />
                    </div>
                    <div className="flex w-full items-center justify-between gap-2">
                      <h5 className="flex-1 font-semibold">
                        {getStepDisplayName(data.step)}
                      </h5>
                      <div className="text-muted-foreground text-xs">
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  {/* <div className="prose max-w-none rounded-xl p-4 shadow lg:p-6 [&_ol]:list-inside [&_ul]:list-inside">
                  <div dangerouslySetInnerHTML={{ __html: data?.content }} />
                </div> */}
                  <div className="space-y-2 rounded-xl p-4 shadow">
                    <p className="text-muted-foreground text-sm">
                      {getStepMessage(data)}
                    </p>
                    <div>
                      <StepDetails step={data.step} data={data} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading State */}
            {isSubmitting && progress !== 100 && (
              <div className="mx-auto max-w-2xl space-y-6">
                <div className="text-center">
                  <DotIndicator />
                </div>

                <div className="space-y-2 text-center">
                  <div className="text-center">{progress}% to complete</div>
                  <div className="flex items-center gap-4">
                    <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Completion State */}
            {progress === 100 && (
              <div className="animate-in fade-in mx-auto max-w-2xl space-y-6 duration-500">
                <div className="space-y-2 text-center">
                  <div className="text-center">{progress}% completed!</div>
                  <div className="flex items-center gap-4">
                    <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link
                    href={`/marketing-automation/projects/${123}/controller`}
                  >
                    <Button size="large" variant="contained">
                      <span>Next Step</span>
                      <ArrowRight />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Scroll Target */}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnalysisStreamTabSection;
