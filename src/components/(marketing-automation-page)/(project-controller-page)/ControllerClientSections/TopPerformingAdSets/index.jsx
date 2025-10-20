import { Button } from "@mui/material";
import { Check, Podcast } from "lucide-react";

export const TopPerformingAdSets = ({
  adSetCount,
  selectedAdSet,
  onAdSetSelect,
}) => (
  <div>
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Podcast className="text-primary rotate-180" />
        <strong>Top-Performing Ad Sets</strong>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {Array.from({ length: adSetCount }, (_, index) => (
          <div className="shrink-0 pb-2" key={index}>
            <Button
              onClick={() => onAdSetSelect(index + 1)}
              variant={selectedAdSet === index + 1 ? "contained" : "text"}
              key={index}
              className="mb-2 shrink-0 gap-2"
            >
              <Check strokeWidth={3} className="size-4" />
              Ad Set {index + 1}
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TopPerformingAdSets;
