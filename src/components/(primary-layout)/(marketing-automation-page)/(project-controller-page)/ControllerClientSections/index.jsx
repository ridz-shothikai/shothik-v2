"use client";

import { Button } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import AdGoalSection from "./AdGoalSection";
import AdPreviewSection from "./AdPreviewSection";
import BudgetSection from "./BudgetSection";
import CampaignOverview from "./CampaignOverview";
import ContentCreatorsReport from "./ContentCreatorsReport";
import DateTimeSection from "./DateTimeSection";
import LocationSection from "./LocationSection";
import TabsAndMediaSection from "./TabsAndMediaSection";
import TopPerformingAdSets from "./TopPerformingAdSets";

const ControllerClientSections = ({ project }) => {
  const formatDateTime = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const now = new Date();
  const plus30Days = new Date();
  plus30Days.setDate(now.getDate() + 30);

  const [campaignData, setCampaignData] = useState({
    selectedGoal: "sales",
    startDateTime: formatDateTime(now),
    endDateTime: formatDateTime(plus30Days),
    locations: [],
    tab: "ad-sets",
    budget: 100,
    adSetCount: 5,
    selectedAdSet: 1,
    selectedPlatform: "facebook",
    medias: [],
  });

  const updateCampaignData = (updates) => {
    setCampaignData((prev) => ({ ...prev, ...updates }));
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files) return;

    const newMedias = Array.from(files).map((file) => {
      const type = file.type.startsWith("image/") ? "image" : "video";
      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        source: "uploaded",
        url: URL.createObjectURL(file),
        name: file.name,
      };
    });

    updateCampaignData({
      medias: [...campaignData.medias, ...newMedias],
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate images handler
  const handleGenerateImages = async () => {
    try {
      const generatedImages = await generateImagesAPI();

      const newMedias = generatedImages.map((img, index) => ({
        id: `generated-${Date.now()}-${index}`,
        type: "image",
        source: "generated",
        url: img.url,
        name: `Generated Image ${index + 1}`,
      }));

      updateCampaignData({
        medias: [...campaignData.medias, ...newMedias],
      });
    } catch (error) {
      console.error("Error generating images:", error);
    }
  };

  // Remove media handler
  const handleRemoveMedia = (id) => {
    updateCampaignData({
      medias: campaignData.medias.filter((item) => item.id !== id),
    });
  };

  // Mock generate API
  const generateImagesAPI = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { url: "/images/marketing-automation/demo-product.png" },
      { url: "/images/marketing-automation/demo-product.png" },
      { url: "/images/marketing-automation/demo-product.png" },
    ];
  };

  const filteredMediaItems = (section) => {
    switch (section) {
      case "all-images":
        return mediaItems.filter((item) => item.type === "image");
      case "uploaded-images":
        return mediaItems.filter(
          (item) => item.type === "image" && item.source === "uploaded",
        );
      case "generated-images":
        return mediaItems.filter(
          (item) => item.type === "image" && item.source === "generated",
        );
      case "videos":
        return mediaItems.filter((item) => item.type === "video");
      default:
        return mediaItems;
    }
  };

  return (
    <div className="mb-6 space-y-6 lg:mb-10 lg:space-y-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <AdGoalSection
          selectedGoal={campaignData.selectedGoal}
          onGoalChange={(goal) => updateCampaignData({ selectedGoal: goal })}
        />

        <DateTimeSection
          startDateTime={campaignData.startDateTime}
          endDateTime={campaignData.endDateTime}
          onStartDateTimeChange={(datetime) =>
            updateCampaignData({ startDateTime: datetime })
          }
          onEndDateTimeChange={(datetime) =>
            updateCampaignData({ endDateTime: datetime })
          }
        />

        <LocationSection
          locations={campaignData.locations}
          onLocationChange={(locations) => updateCampaignData({ locations })}
        />
      </div>

      <div className="bg-card space-y-6 rounded-2xl p-6 lg:p-10">
        <CampaignOverview
          selectedGoal={campaignData.selectedGoal}
          startDateTime={campaignData.startDateTime}
          endDateTime={campaignData.endDateTime}
        />

        <BudgetSection
          budget={campaignData.budget}
          onBudgetChange={(budget) => updateCampaignData({ budget })}
        />

        <TabsAndMediaSection
          tab={campaignData.tab}
          onTabChange={(tab) => updateCampaignData({ tab })}
          adSetCount={campaignData.adSetCount}
          mediasCount={campaignData.medias.length}
        />

        <TopPerformingAdSets
          adSetCount={campaignData.adSetCount}
          selectedAdSet={campaignData.selectedAdSet}
          onAdSetSelect={(adSet) =>
            updateCampaignData({ selectedAdSet: adSet })
          }
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <ContentCreatorsReport />
          <AdPreviewSection
            project={project}
            selectedPlatform={campaignData.selectedPlatform}
            onPlatformChange={(platform) =>
              updateCampaignData({ selectedPlatform: platform })
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button size="large" variant="outlined">
          A/B Testing
        </Button>
        <Button className="gap-2" size="large" variant="contained">
          Publish Ads
          <ArrowRight className="size-6" />
        </Button>
      </div>
    </div>
  );
};

export default ControllerClientSections;
