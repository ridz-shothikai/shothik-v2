"use client";

import { Radio, TextField } from "@mui/material";
import { CircleAlert, CreditCardIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import LocationField from "./LocationField";

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
    <div className="mb-6 space-y-6 lg:mb-10 lg:space-y-10">
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
              Cities and Countries to Advertise
            </strong>
            <CircleAlert className="text-muted-foreground size-4" />
          </div>
          <div>
            <LocationField />
          </div>
        </label>
      </div>
      <div className="bg-card space-y-6 rounded-2xl p-6 lg:p-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4>Human Quality AI Writing Assistant</h4>
            <div className="bg-primary/10 text-primary rounded-md px-4 py-2 capitalize">
              {selectedGoal}
            </div>
          </div>
          <div className="text-muted-foreground flex items-center justify-end gap-2 text-sm">
            {startDateTime && (
              <span>
                Start: {new Date(startDateTime).toLocaleDateString("en-CA")}{" "}
                {new Date(startDateTime).toLocaleTimeString()}
              </span>
            )}{" "}
            -{" "}
            {endDateTime && (
              <span>
                End: {new Date(endDateTime).toLocaleDateString("en-CA")}{" "}
                {new Date(endDateTime).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 shadow">
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-2">
              <CreditCardIcon />
              <strong className="text-muted-foreground">
                Instagram account you want to use
              </strong>
              <CircleAlert className="text-muted-foreground size-4" />
            </div>
            <div className="border-primary text-primary inline-block rounded-md border px-2">
              <span>$</span>
              <input
                type="number"
                step="any"
                placeholder="100.00"
                className="text-primary w-20 border-0 bg-transparent px-2 py-1 text-center outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControllerClientSection;
