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
      <div className="flex items-center gap-2">
        {Array.from({ length: adSetCount }, (_, index) => (
          <Button
            onClick={() => onAdSetSelect(index + 1)}
            variant={selectedAdSet === index + 1 ? "contained" : "text"}
            key={index}
            className="gap-2"
          >
            <Check strokeWidth={3} className="size-4" />
            Ad Set {index + 1}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default TopPerformingAdSets;
