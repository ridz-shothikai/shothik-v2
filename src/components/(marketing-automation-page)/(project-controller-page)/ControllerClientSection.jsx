"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Radio,
  Slider,
  TextField,
} from "@mui/material";
import {
  AlertCircle,
  AlignVerticalDistributeCenter,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  CircleAlert,
  CreditCardIcon,
  Earth,
  Podcast,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import LocationField from "./LocationField";

const ControllerClientSection = ({ project }) => {
  const [selectedGoal, setSelectedGoal] = useState("sales");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [budget, setBudget] = useState(100);
  const [adSetCount, setAdSetCount] = useState(5);
  const [selectedAdSet, setSelectedAdSet] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");

  const handleGoalChange = (event) => {
    setSelectedGoal(event.target.value);
  };

  const handleStartDateTimeChange = (event) => {
    setStartDateTime(event.target.value);
  };

  const handleEndDateTimeChange = (event) => {
    setEndDateTime(event.target.value);
  };

  const handleBudgetChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      setBudget(value);
    }
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
        <div className="bg-card space-y-2 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-2">
              <CreditCardIcon />
              <strong className="text-muted-foreground">
                Set your ads budget
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
                min="0"
                max="1000"
                value={budget}
                onChange={handleBudgetChange}
              />
            </div>
          </div>
          <div className="px-2">
            <Slider
              value={budget}
              onChange={(_, newValue) => setBudget(newValue)}
              min={0}
              max={1000}
              step={10}
              valueLabelDisplay="auto"
              sx={{
                color: "var(--primary)",
                "& .MuiSlider-thumb": {
                  borderRadius: "50%",
                },
              }}
            />
          </div>
          <div className="px-2 text-end">
            <Button
              size="large"
              className="gap-2 !rounded-full"
              variant="contained"
            >
              <AlignVerticalDistributeCenter />
              <span>Distribute Budget by AI</span>
              <AlertCircle className="size-4" />
            </Button>
          </div>
        </div>
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
              {adSetCount}
            </span>
          </Button>
        </div>
        <div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Podcast className="text-primary rotate-180" />
              <strong>Top-Performing Ad Sets</strong>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: adSetCount }, (_, index) => (
                <Button
                  onClick={() => setSelectedAdSet(index + 1)}
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
        <div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <strong className="inline-block">Content creators</strong>
              <div className="grid grid-cols-4">
                <div className="flex justify-center border-s px-4 py-6 first:justify-start first:border-s-0 first:ps-0 last:justify-end">
                  <div className="space-y-2">
                    <strong className="inline-block">Age</strong>
                    <div className="text-sm">25-34</div>
                  </div>
                </div>
                <div className="flex justify-center border-s px-4 py-6 first:justify-start first:border-s-0 first:ps-0 last:justify-end">
                  <div className="space-y-2">
                    <strong className="inline-block">Gender</strong>
                    <div className="text-sm">Female</div>
                  </div>
                </div>
                <div className="flex justify-center border-s px-4 py-6 first:justify-start first:border-s-0 first:ps-0 last:justify-end">
                  <div className="space-y-2">
                    <strong className="inline-block">Location</strong>
                    <div className="text-sm">USA</div>
                  </div>
                </div>
                <div className="flex justify-center border-s px-4 py-6 first:justify-start first:border-s-0 first:ps-0 last:justify-end">
                  <div className="space-y-2">
                    <strong className="inline-block">Ad set spent</strong>
                    <div className="text-sm">$7.14</div>
                  </div>
                </div>
              </div>
              <div className="rounded-md border">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ChevronDown className="size-4" />}
                  >
                    <strong>See full report</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p>
                      Detailed analytics and insights will be available in your
                      dashboard once the ad campaign is live.
                    </p>
                  </AccordionDetails>
                </Accordion>
              </div>
              <div className="space-y-2">
                <p>Audience Tags</p>
                <div className="grid grid-cols-3 gap-2">
                  {["fashion", "clothing", "shoes", "accessories"].map(
                    (tag, index) => (
                      <div
                        key={index}
                        className="bg-primary/10 text-muted-foreground line-clamp-1 rounded-md px-4 py-2 text-center capitalize"
                      >
                        {tag}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="bg-muted space-y-4 self-stretch rounded-xl p-4">
              <div className="mx-auto flex aspect-[9/14] max-w-80 flex-col space-y-2 rounded-xl bg-white">
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full border">
                      <Image
                        src="/images/marketing-automation/facebook/user.png"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex flex-col space-y-1 leading-none">
                      <strong className="block text-sm">John Doe</strong>
                      <div className="-mt-1 flex items-center gap-2 text-xs">
                        <small>Sponsored</small>{" "}
                        <Earth className="inline-block size-2" />
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sapiente eaque unde atque incidunt quod nesciunt dignissimos
                    excepturi dolor deserunt! Exercitationem possimus, ipsam ut
                    provident recusandae inventore fuga corporis consequatur
                    mollitia!
                  </p>
                </div>
                <div className="flex-1">
                  <Image
                    className="size-full object-cover"
                    src="/images/marketing-automation/facebook/demo-poduct.png"
                    alt="product"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="text flex justify-between">
                  <div className="max-w-1/2">
                    <div className="line-clamp-1 text-xs">{project?.url}</div>
                    <div className="">{project?.name}</div>
                  </div>
                  <button
                    type="button"
                    className="ant-btn css-var-R1fpatb ant-btn-default ant-btn-color-default ant-btn-variant-outlined ant-btn-sm more-btn"
                  >
                    <span className="text-[7px]">Shop Now</span>
                  </button>
                </div>
                <div>
                  <Image
                    className="w-full"
                    src="/images/marketing-automation/facebook/bottom.webp"
                    alt="product"
                    width={400}
                    height={400}
                  />
                </div>
              </div>
              <div className="flex gap-2 space-y-2">
                {["facebook", "instagram", "tiktok"].map((platform, index) => (
                  <Button
                    onClick={() => setSelectedPlatform(platform)}
                    variant={
                      selectedPlatform === platform ? "contained" : "text"
                    }
                    key={index}
                    className="flex-1 gap-2 capitalize"
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControllerClientSection;
