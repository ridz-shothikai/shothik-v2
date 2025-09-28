import { Button } from "@mui/material";
import {
  AlignVerticalDistributeCenter,
  ChartNoAxesCombined,
  UserCheck,
} from "lucide-react";

const TabsAndMediaSection = ({ tab, onTabChange, adSetCount, mediasCount }) => (
  <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
    <div className="flex h-12 w-full items-center justify-between gap-4 rounded-full border px-4 lg:w-auto">
      <div className="flex items-center gap-2">
        <ChartNoAxesCombined />
        <span>Performance Forecast</span>
      </div>
      <div className="flex items-center gap-2">
        <UserCheck />
        <span>Ad sets</span>
        <span className="flex size-6 items-center justify-center rounded-full bg-green-950 text-white">
          {adSetCount}
        </span>
      </div>
    </div>
    <Button
      size="large"
      className="w-full gap-2 !rounded-full lg:w-auto"
      variant="contained"
    >
      <AlignVerticalDistributeCenter />
      <span>images/videos</span>
      <span className="flex size-6 items-center justify-center rounded-full bg-white font-light text-black">
        {mediasCount}
      </span>
    </Button>
  </div>
);

export default TabsAndMediaSection;
