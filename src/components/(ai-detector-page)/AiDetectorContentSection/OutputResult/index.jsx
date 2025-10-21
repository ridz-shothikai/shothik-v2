"use client";

import useSnackbar from "@/hooks/useSnackbar";
import {
  CloudDownload,
  ExpandMoreOutlined,
  InfoOutlined,
  KeyboardArrowUpOutlined,
  Share,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import { pdfDownload } from "../helpers/pdfDownload";
import { getColorByPerplexity } from "../helpers/pdfHelper";
import {
  colorDefinitions,
  colorDefinitionsAI,
  colorDefinitionsHuman,
} from "../helpers/pdfStyles";

const widths = [130, 80, 60, 60, 80, 130];

const AIColor = ({ colors, perplexity, highlight_sentence_for_ai }) => {
  const color = getColorByPerplexity(highlight_sentence_for_ai, perplexity);

  return (
    <div className="flex items-center gap-1">
      {colors?.map((item, index) => (
        <div
          key={index}
          className={`h-5 w-5 rounded-full transition-colors duration-200`}
          style={{
            backgroundColor: item === color ? color : "#E0E0E0",
          }}
        />
      ))}
    </div>
  );
};

const Accordion = ({ colorList, data, title }) => {
  const [isExpanded, setIsExpanded] = useState(-1);

  return (
    <div className="border-border flex flex-1 flex-col border-b px-4 py-2 last:border-b-0">
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <div className="h-full min-h-8 flex-1 overflow-y-auto">
        {data?.map((item, index) => (
          <div
            key={index}
            className="border-border flex items-start gap-2 border-b py-2 last:border-b-0"
          >
            <AIColor
              highlight_sentence_for_ai={item?.highlight_sentence_for_ai}
              colors={Object.values(colorList)}
              perplexity={item.perplexity}
            />
            <div className="flex w-full flex-1 items-start justify-between gap-2">
              <p
                className={`text-sm leading-6 transition-all duration-300 ${
                  isExpanded !== index
                    ? "line-clamp-1 overflow-hidden text-ellipsis"
                    : ""
                }`}
              >
                {item?.sentence}
              </p>
              <Button
                onClick={() =>
                  setIsExpanded((prev) => (prev === index ? -1 : index))
                }
                sx={{ padding: 0, minWidth: "unset", width: "fit-content" }}
              >
                {isExpanded === index ? (
                  <KeyboardArrowUpOutlined />
                ) : (
                  <ExpandMoreOutlined />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OutputResult = ({ handleOpen, outputContend }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const enqueueSnackbar = useSnackbar();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await pdfDownload({
        content: outputContend,
        logo: "/shothik_light_logo.png",
      });
      enqueueSnackbar("PDF downloaded successfully", { variant: "success" });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      enqueueSnackbar("Failed to download PDF. Please try again.", {
        variant: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="border-border bg-background text-foreground flex flex-1 flex-col rounded-lg border">
      {/* Header */}
      <div className="border-border flex justify-end gap-2 border-b px-4 py-2">
        <Button
          onClick={handleOpen}
          startIcon={<Share />}
          sx={{
            border: "1px solid rgba(145, 158, 171, 0.32)",
            borderRadius: "9999px",
            px: 2,
            py: 1,
            color: "var(--foreground)",
            transition: "all 300ms ease-in-out",
            "&:hover": { color: "primary.main" },
          }}
        >
          Share
        </Button>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          startIcon={<CloudDownload />}
          sx={{
            border: "1px solid rgba(145, 158, 171, 0.32)",
            borderRadius: "9999px",
            px: 2,
            py: 1,
            color: "var(--foreground)",
            transition: "all 300ms ease-in-out",
            "&:hover": { color: "primary.main" },
            "&:disabled": { opacity: 0.6 },
          }}
        >
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </div>

      {/* Main section */}
      <div className="border-border border-b px-4 py-2">
        <div className="my-2 flex flex-col items-center justify-start gap-3 md:flex-row lg:flex-row">
          <div className="relative flex size-40 items-center justify-center">
            <div
              className="absolute h-full w-full rounded-full border-8"
              style={{ borderColor: colorDefinitions.humanHigh }}
            />
            <div
              className="absolute h-full w-full rounded-full border-8"
              style={{
                borderColor: colorDefinitions.aiHigh,
                clipPath: `inset(${100 - outputContend.ai_percentage}% 0 0 0)`,
              }}
            />
            <p
              className={`text-lg font-semibold ${
                outputContend.ai_percentage > 50
                  ? "text-warning"
                  : "text-primary"
              }`}
            >
              {outputContend.ai_percentage > 50 ? "AI" : "Human"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row flex-wrap items-center gap-2">
              <p className="text-muted-foreground whitespace-nowrap">We are</p>
              <span className="border-border border-b font-bold whitespace-nowrap uppercase">
                highly confident
              </span>
              <p className="text-muted-foreground whitespace-nowrap">
                this text is
              </p>
            </div>
            <div className="flex justify-start">
              <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-sm font-bold">
                {outputContend.assessment}
              </div>
            </div>
            <div className="border-border text-muted-foreground flex items-center gap-2 rounded-md border px-4 py-1">
              <InfoOutlined />
              <p>
                {parseInt(outputContend.ai_percentage ?? 0)}% Probability AI
                generated
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-[18px] font-semibold">
            Enhanced Sentence Detection
          </h4>
          <p className="text-muted-foreground text-sm">
            Sentences that have the biggest influence on the probability score.
          </p>
        </div>

        <div className="my-3">
          <div className="flex h-[20px] w-full gap-[2px] overflow-hidden rounded">
            {[
              ...Object.values(colorDefinitionsAI).reverse(),
              ...Object.values(colorDefinitionsHuman),
            ].map((color, index) => (
              <div
                key={index}
                style={{ backgroundColor: color, width: widths[index] }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between">
            <span
              className="text-sm font-medium"
              style={{ color: colorDefinitions.aiHigh }}
            >
              AI
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: colorDefinitions.humanHigh }}
            >
              Human
            </span>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="flex-1 flex-col">
        <Accordion
          colorList={Object.values(colorDefinitionsAI)}
          data={outputContend.aiSentences}
          title="Top sentences driving AI probability"
        />
        <Accordion
          colorList={Object.values(colorDefinitionsHuman)}
          data={outputContend.humanSentences}
          title="Top sentences driving Human probability"
        />
      </div>
    </div>
  );
};

export default OutputResult;
