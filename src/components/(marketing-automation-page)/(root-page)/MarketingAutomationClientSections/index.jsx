"use client";

import { useState } from "react";
import AnalysisStreamTabSection from "../AnalysisStreamTabSection";
import { demo } from "../data";
import RootFromTabSection from "../RootFromTabSection";

const MarketingAutomationClientSections = () => {
  const [tab, setTab] = useState("form");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streamData, setStreamData] = useState(demo);
  const [screenshot, setScreenshot] = useState("");
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) return;

    setIsSubmitting(true);
    setProgress(0);
    setStreamData([]);
    setCurrentStep("");
    setError(null);

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
            link: url,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTab("stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("Stream finished");
          setProgress(100);

          setTimeout(() => {
            setIsSubmitting(false);
          }, 2000);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        lines?.forEach((line) => {
          if (line?.trim()) {
            try {
              const data = JSON.parse(line);
              console.log("Stream Data:", data);

              setStreamData((prev) => [...prev, data]);

              if (data?.step) {
                setCurrentStep(data.step);
                updateProgress(data.step);
                if (data?.step === "completed") {
                  setScreenshot(data?.data?.finalState?.screenshot || "");
                }
              }
            } catch (error) {
              console.error("JSON parse error:", error, "Line:", line);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error submitting:", error);
      // Error হলে form section এ থাকো এবং error দেখাও
      setError(
        error.message || "An error occurred while processing your request",
      );
      setIsSubmitting(false);
    }
  };

  const updateProgress = (step) => {
    const stepProgressMap = {
      "step1.1": 5,
      "step1.2": 10,
      "step1.3": 20,
      "step1.4": 25,
      "step1.5": 30,
      "step2.1": 35,
      "step2.2": 50,
      "step2.3": 60,
      "step2.4": 70,
      "step2.5": 80,
      step3: 90,
      step4: 95,
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
    <div className="transition-all duration-500 ease-in-out">
      {tab === "form" && (
        <RootFromTabSection
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          progress={progress}
          url={url}
          setUrl={setUrl}
          error={error}
        />
      )}
      {tab === "stream" && (
        <AnalysisStreamTabSection
          url={url}
          streamData={streamData}
          screenshot={screenshot}
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          progress={progress}
          getStepDisplayName={getStepDisplayName}
          getStepMessage={getStepMessage}
        />
      )}
    </div>
  );
};

export default MarketingAutomationClientSections;
