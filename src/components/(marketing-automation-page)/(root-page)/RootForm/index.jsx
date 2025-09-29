"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import UrlInputField from "./UrlInputField";

const RootForm = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Start loading state
    setIsSubmitting(true);
    setProgress(0);

    // Simulate progress animation over 3 seconds
    const intervalTime = 30;
    const increments = 100 / (3000 / intervalTime);
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += increments;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, intervalTime);

    // Redirect after 3 seconds
    setTimeout(() => {
      const processId = generateProcessId();
      router.push(`/marketing-automation/projects/${processId}/analysis`);
    }, 3000);
  };

  const generateProcessId = () => {
    return `abc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
            {/* Progress Bar - Button এর পাশেই */}

            <Button
              className="!h-10 !min-w-24"
              variant="contained"
              type="submit"
              disabled={isSubmitting || !url}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
            {isSubmitting && (
              <div className="bg-muted h-2 w-20 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-30"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default RootForm;
