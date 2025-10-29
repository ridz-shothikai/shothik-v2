"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toolsData } from "../../../_mock/tutorials";
import TutorialSection, {
  IconWrapper,
} from "../../../components/tutorial/TutorialSection";
import useYoutubeSubscriber from "../../../hooks/useYoutubeSubcriber";

const Tutorials = () => {
  const [currentTab, setCurrentTab] = useState("paraphrase");
  const { subscriberCount, loading, handleSubscribe, formatSubscriberCount } =
    useYoutubeSubscriber();

  const handleVideoClick = (videoId) => {
    console.log("Video clicked:", videoId);
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-40">
      <div className="bg-transparent">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="w-full justify-start h-auto flex-wrap bg-transparent border-b rounded-none sm:pl-12 pt-12">
            {Object.entries(toolsData).map(([key, tool]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex items-center gap-2 capitalize data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                aria-label={`${tool.name} tutorial tab`}
              >
                <span className={cn("inline-flex", tool.iconColor && `text-[${tool.iconColor}]`)}>
                  {tool.icon}
                </span>
                {tool.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(toolsData).map(([key, tool]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <TutorialSection
                tool={tool}
                onVideoClick={handleVideoClick}
                subscriberCount={subscriberCount}
                loading={loading}
                handleSubscribe={handleSubscribe}
                formatSubscriberCount={formatSubscriberCount}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Tutorials;
