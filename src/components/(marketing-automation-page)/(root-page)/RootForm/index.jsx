"use client";

import { Button } from "@mui/material";
import { useState } from "react";
import { demo } from "../data";
import UrlInputField from "./UrlInputField";

const renderStepData = (step, data) => {
  const stepData = data?.data?.data;

  if (!stepData) return null;

  switch (step) {
    case "step1.1": // URL Parsing
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
                      {stepData.parsedData.description.substring(0, 100)}...
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
              <span className="text-gray-700">
                {stepData.description.substring(0, 120)}...
              </span>
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
              <ul className="ml-4 list-disc space-y-1">
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
                    <div className="mt-1 text-gray-600">
                      {comp.analysis.substring(0, 150)}...
                    </div>
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
                Keywords Found: {stepData.keywords.length}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stepData.keywords.slice(0, 10).map((kw, idx) => (
                  <div
                    key={idx}
                    className="rounded border border-blue-200 bg-blue-50 px-2 py-1"
                  >
                    <div className="font-medium text-blue-800">
                      {kw.keyword}
                    </div>
                    <div className="text-[10px] text-gray-600">
                      {kw.language.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
              {stepData.keywords.length > 10 && (
                <div className="mt-2 text-center text-gray-500">
                  +{stepData.keywords.length - 10} more keywords
                </div>
              )}
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
                    {stepData.marketAnalysis.currentMarket.substring(0, 200)}
                    ...
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
              <div className="max-h-32 overflow-y-auto leading-relaxed text-gray-700">
                {stepData.regionalStrategy.substring(0, 300)}...
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
              <div className="max-h-32 overflow-y-auto leading-relaxed text-gray-700">
                {stepData.communityAnalysis.substring(0, 300)}...
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
              <div className="max-h-32 overflow-y-auto leading-relaxed text-gray-700">
                {stepData.finalAnalysis.substring(0, 300)}...
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
                    {stepData.snapshot.summary.productPositioning?.substring(
                      0,
                      100,
                    )}
                    ...
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

const RootForm = () => {
  const [tab, setTab] = useState("form");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streamData, setStreamData] = useState(demo);
  const [currentStep, setCurrentStep] = useState("");

  // Step-wise data renderers

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setProgress(0);
    setStreamData([]);
    setCurrentStep("");

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTkxMzg0MTksImV4cCI6MTc2MTczMDQxOSwiYXVkIjoiNjhkYTUyNDdkYzE5Mjk1OGZhNDlkNmQ5IiwiaXNzIjoic2hvdGhpay5haSJ9.c0CygqbrtDQzK4kGsNEPG1RefrAtAyq-p-ItctbNdR0";

    try {
      const response = await fetch(
        "http://163.172.181.252:3011/api/project/add_project",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "",
            link:
              url ||
              "https://www.daraz.com.bd/products/apex-i374037850-s1870945392.html",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("Stream finished");
          setProgress(100);

          setTimeout(() => {
            setTab(`analysis`);
          }, 2000);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        lines.forEach((line) => {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              console.log("Stream Data:", data);

              setStreamData((prev) => [...prev, data]);

              if (data.step) {
                setCurrentStep(data.step);
                updateProgress(data.step);
              }
            } catch (error) {
              console.error("JSON parse error:", error, "Line:", line);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setIsSubmitting(false);
    }
  };

  const updateProgress = (step) => {
    const stepProgressMap = {
      "step1.1": 15,
      "step1.2": 30,
      "step1.3": 45,
      "step1.4": 60,
      "step1.5": 75,
      "step2.1": 85,
      "step2.2": 90,
      "step2.3": 93,
      "step2.4": 96,
      "step2.5": 98,
      step3: 99,
      step4: 99,
      completed: 100,
    };

    if (stepProgressMap[step]) {
      setProgress(stepProgressMap[step]);
    }
  };

  const getStepDisplayName = (step) => {
    const stepNames = {
      "step1.1": "URL Parsing",
      "step1.2": "Taking Screenshot",
      "step1.3": "Product Analysis",
      "step1.4": "AI Selling Points",
      "step1.5": "Ads Strategy",
      "step2.1": "Competitor Analysis",
      "step2.2": "Keyword Research",
      "step2.3": "Market Analysis",
      "step2.4": "Regional Strategy",
      "step2.5": "Community Analysis",
      step3: "Finalizing Analysis",
      step4: "Creating Snapshot",
      completed: "Completed",
    };
    return stepNames[step] || step;
  };

  const getStepMessage = (data) => {
    if (data.data && data.data.message) {
      return data.data.message;
    }
    return "Processing...";
  };

  return (
    <>
      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        <label className="block w-full space-y-1">
          <div>Website URL</div>
          <UrlInputField
            value={url}
            onChange={setUrl}
            placeholder="http://yourstore/product/service"
          />
        </label>

        <div className="flex items-center justify-between">
          <div className="inline-flex flex-1 items-center gap-4">
            <Button
              className="!h-10 !min-w-24"
              variant="contained"
              type="submit"
              disabled={isSubmitting || !url}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </div>
        </div>
      </form>

      {streamData?.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold">Processing Steps</h3>

            {currentStep && (
              <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-800">
                    Current: {getStepDisplayName(currentStep)}
                  </span>
                  <span className="text-sm text-blue-600">{progress}%</span>
                </div>
              </div>
            )}

            <div className="max-h-96 space-y-3 overflow-y-auto">
              {streamData.map((data, index) => (
                <div
                  key={index}
                  className="rounded border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="font-medium text-gray-800">
                          {getStepDisplayName(data.step)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(data.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="mb-2 text-xs text-gray-600">
                        {getStepMessage(data)}
                      </div>
                      {renderStepData(data.step, data)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>Overall Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RootForm;
