"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import UrlFiled from "./(input-fields)/UrlField";
import LocationField from "./(input-fields)/LocationField";
import NameField from "./(input-fields)/NameField";
import { Button } from "@mui/material";

const RootForm = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [projectName, setProjectName] = useState("");
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
      router.push(`/marketing-automation/${processId}/process`);
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
          <UrlFiled
            value={url}
            onChange={setUrl}
            placeholder="http://yourstore/product/service"
          />
        </label>
        <label className="block w-full space-y-1">
          <div>Primary target location</div>
          <LocationField
            value={selectedLocation}
            onChange={setSelectedLocation}
            placeholder="Select country, state, or city"
          />
        </label>
        <label className="block w-full space-y-1">
          <div>Project name</div>
          <NameField
            value={projectName}
            onChange={setProjectName}
            placeholder="Your project name"
          />
        </label>

        <div className="flex items-center justify-between">
          <div className="inline-flex flex-1 items-center gap-4">
            {/* Progress Bar - Button এর পাশেই */}
            

            <Button
              className="!h-10 !min-w-24"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
            {isSubmitting && (
              <div className="w-20 h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-30"
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
