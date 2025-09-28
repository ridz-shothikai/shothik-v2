"use client";

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

const ControllerClientSection = ({ project }) => {
  const [campaignData, setCampaignData] = useState({
    selectedGoal: "sales",
    startDateTime: "",
    endDateTime: "",
    locations: [],
    budget: 100,
    adSetCount: 5,
    selectedAdSet: 1,
    selectedPlatform: "facebook",
    medias: [],
  });

  const updateCampaignData = (updates) => {
    setCampaignData((prev) => ({ ...prev, ...updates }));
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
    </div>
  );
};

export default ControllerClientSection;
