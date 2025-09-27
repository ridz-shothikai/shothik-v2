"use client";

import { Radio, TextField } from "@mui/material";
import { CircleAlert } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ControllerClientSection = () => {
  const [selectedGoal, setSelectedGoal] = useState("sales");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const handleGoalChange = (event) => {
    setSelectedGoal(event.target.value);
  };

  const handleStartDateTimeChange = (event) => {
    setStartDateTime(event.target.value);
  };

  const handleEndDateTimeChange = (event) => {
    setEndDateTime(event.target.value);
  };

  // Format current date-time for default value (YYYY-MM-DDTHH:MM)
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full shadow">
              <Image
                src={"/images/marketing-automation/star-icon.png"}
                alt={"ControllerClientSection"}
                width={20}
                height={20}
                className={" "}
              />
            </div>
            <strong className="text-muted-foreground">Ad Goal</strong>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            <label className="border-primary flex cursor-pointer flex-col gap-4 rounded-lg border p-2">
              <div className="flex items-center justify-between gap-2">
                <strong>Traffic</strong>
                <Radio
                  name="ad_goal"
                  value="traffic"
                  checked={selectedGoal === "traffic"}
                  onChange={handleGoalChange}
                  sx={{
                    padding: 0,
                  }}
                />
              </div>
              <div className="text-muted-foreground mt-auto text-xs capitalize">
                Drive Traffic and build awareness
              </div>
            </label>

            <label className="border-primary flex cursor-pointer flex-col gap-4 rounded-lg border p-2">
              <div className="flex items-center justify-between gap-2">
                <strong>Leads</strong>
                <Radio
                  name="ad_goal"
                  value="leads"
                  checked={selectedGoal === "leads"}
                  onChange={handleGoalChange}
                  sx={{
                    padding: 0,
                  }}
                />
              </div>
              <div className="text-muted-foreground mt-auto text-xs capitalize">
                Maximize impact: Build Traffic, then convert
              </div>
            </label>

            <label className="border-primary relative flex cursor-pointer flex-col gap-4 rounded-lg border p-2 lg:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <strong>Sales</strong>
                <Radio
                  name="ad_goal"
                  value="sales"
                  checked={selectedGoal === "sales"}
                  onChange={handleGoalChange}
                  sx={{
                    padding: 0,
                  }}
                />
              </div>
              <div className="text-muted-foreground mt-auto text-xs capitalize">
                Best for converting leads into customers. Perfect for both
                online and offline stores to drive sales and grow revenue
              </div>
              <Image
                src={"/images/marketing-automation/fall-badge-icon.png"}
                alt={"ControllerClientSection"}
                width={10}
                height={10}
                className="absolute top-0 right-16 object-contain"
              />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full shadow">
                <Image
                  src={"/images/marketing-automation/star-icon.png"}
                  alt={"ControllerClientSection"}
                  width={20}
                  height={20}
                  className={" "}
                />
              </div>
              <strong className="text-muted-foreground">
                Start date & time
              </strong>
              <CircleAlert className="text-muted-foreground size-4" />
            </div>
            <div>
              <TextField
                type="datetime-local"
                value={startDateTime}
                onChange={handleStartDateTimeChange}
                fullWidth
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: getCurrentDateTime(),
                }}
              />
            </div>
          </label>
          <label className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full shadow">
                <Image
                  src={"/images/marketing-automation/star-icon.png"}
                  alt={"ControllerClientSection"}
                  width={20}
                  height={20}
                  className={" "}
                />
              </div>
              <strong className="text-muted-foreground">End date & time</strong>
              <CircleAlert className="text-muted-foreground size-4" />
            </div>
            <div>
              <TextField
                type="datetime-local"
                value={endDateTime}
                onChange={handleEndDateTimeChange}
                fullWidth
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: startDateTime || getCurrentDateTime(),
                }}
              />
            </div>
          </label>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ControllerClientSection;
