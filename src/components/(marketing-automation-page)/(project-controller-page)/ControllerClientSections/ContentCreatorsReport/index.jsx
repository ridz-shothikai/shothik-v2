import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ChevronDown } from "lucide-react";

const ContentCreatorsReport = () => {
  const metrics = [
    { label: "Age", value: "25-34" },
    { label: "Gender", value: "Female" },
    { label: "Location", value: "USA" },
    { label: "Ad set spent", value: "$7.14" },
  ];

  const audienceTags = ["fashion", "clothing", "shoes", "accessories"];

  return (
    <div className="space-y-2">
      <strong className="inline-block">Content creators</strong>
      <div className="grid grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="flex flex-col justify-center border-s px-2 py-6 first:justify-start first:border-s-0 first:ps-0 last:justify-end"
          >
            <div className="flex h-full flex-col space-y-2">
              <strong className="inline-block leading-none">
                {metric.label}
              </strong>
              <div className="mt-auto text-sm">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-md border">
        <Accordion>
          <AccordionSummary expandIcon={<ChevronDown className="size-4" />}>
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
          {audienceTags.map((tag, index) => (
            <div
              key={index}
              className="bg-primary/10 text-muted-foreground line-clamp-1 rounded-md px-4 py-2 text-center capitalize"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorsReport;
