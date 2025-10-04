import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Step11Component = ({ stepData }) => {
  if (!stepData) return null;

  return (
    <div className="space-y-2 text-xs">
      {stepData?.domain && (
        <div className="flex gap-2">
          <span className="font-semibold">Domain:</span>
          <span className="text-foreground">{stepData?.domain}</span>
        </div>
      )}
      {stepData?.parsedData && (
        <div className="space-y-1">
          <div className="font-semibold">Parsed Data:</div>
          <div className="ml-3 space-y-1">
            {stepData?.parsedData?.title && (
              <div>
                <span className="font-bold">Title:</span>{" "}
                <span className="text-foreground">
                  {stepData?.parsedData?.title}
                </span>
              </div>
            )}
            {stepData?.parsedData?.description && (
              <div>
                <span className="font-bold">Description:</span>{" "}
                <span className="text-foreground">
                  {stepData?.parsedData?.description}...
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Step13Component = ({ stepData }) => {
  if (!stepData) return null;

  return (
    <div className="space-y-2 text-xs">
      {stepData?.name && (
        <div>
          <span className="font-bold">Product:</span>{" "}
          <span className="text-foreground">{stepData?.name}</span>
        </div>
      )}
      {stepData?.category && (
        <div>
          <span className="font-bold">Category:</span>{" "}
          <span className="text-foreground">{stepData?.category}</span>
        </div>
      )}
      {stepData?.description && (
        <div>
          <span className="font-bold">Description:</span>{" "}
          <span className="text-foreground">{stepData?.description}</span>
        </div>
      )}
    </div>
  );
};

const Step14Component = ({ stepData }) => {
  if (!stepData?.sellingPoints) return null;

  return (
    <div className="space-y-2 text-xs">
      <div>
        <div className="mb-1 font-bold">Key Selling Points:</div>
        <ul className="ml-4 list-inside list-disc space-y-1">
          {stepData?.sellingPoints?.map((point, idx) => (
            <li key={idx} className="text-foreground">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Step15Component = ({ stepData }) => {
  if (!stepData?.adsGoalStrategy) return null;

  return (
    <div className="space-y-2 text-xs">
      <div>
        <span className="font-bold">Strategy:</span>{" "}
        <span className="text-foreground">{stepData?.adsGoalStrategy}</span>
      </div>
    </div>
  );
};

const Step21Component = ({ stepData }) => {
  if (!stepData?.competitors) return null;

  return (
    <div className="space-y-3 text-xs">
      <div>
        <div className="mb-2 font-bold">Top Competitors:</div>
        {stepData?.competitors?.map((comp, idx) => (
          <div key={idx} className="bg-card mb-3 rounded border p-2">
            <div className="text-card-foreground font-medium">{comp?.name}</div>
            {comp?.url && (
              <div className="text-primary mt-1 truncate">{comp?.url}</div>
            )}
            {comp?.analysis && <div className="mt-1">{comp?.analysis}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const Step22Component = ({ stepData }) => {
  if (!stepData?.keywords) return null;

  return (
    <div className="space-y-2 text-xs">
      <div>
        <div className="mb-2 font-bold">
          Keywords ({stepData?.keywords?.length}):
        </div>
        <ul className="flex flex-wrap gap-2">
          {stepData?.keywords?.map((kw, idx) => (
            <li
              key={idx}
              className="border-primary/20 bg-primary/5 rounded border px-2 py-1"
            >
              <div className="text-primary font-medium">{kw?.keyword}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Step23Component = ({ stepData }) => {
  if (!stepData?.marketAnalysis) return null;

  return (
    <div className="space-y-2 text-xs">
      <div>
        {stepData?.marketAnalysis?.targetRegions && (
          <div className="mb-2">
            <span className="font-bold">Target Regions:</span>{" "}
            <span className="text-foreground">
              {stepData?.marketAnalysis?.targetRegions?.join(", ")}
            </span>
          </div>
        )}
        {stepData?.marketAnalysis?.currentMarket && (
          <div>
            <div className="mb-1 font-bold">Market Overview:</div>
            <div className="leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-sm [&_h3]:text-foreground [&_p]:text-foreground [&_strong]:text-foreground text-foreground max-w-none [&_ol]:list-inside [&_ol]:list-none [&_ul]:list-inside [&_ul]:list-none"
              >
                {stepData?.marketAnalysis?.currentMarket || ""}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Step24Component = ({ stepData }) => {
  if (!stepData?.regionalStrategy) return null;

  return (
    <div className="space-y-2 text-xs">
      <div>
        <div className="mb-2 font-bold">Regional Strategy Highlights:</div>
        <div className="leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm [&_h3]:text-foreground [&_p]:text-foreground [&_strong]:text-foreground text-foreground max-w-none [&_ol]:list-none [&_ul]:list-none"
          >
            {String(stepData?.regionalStrategy || "")}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const Step25Component = ({ stepData }) => {
  if (!stepData?.communityAnalysis) return null;

  return (
    <div className="space-y-2 text-xs">
      <div>
        <div className="mb-2 font-bold">Community Insights:</div>
        <div className="text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm [&_h3]:text-foreground [&_p]:text-foreground [&_strong]:text-foreground text-foreground max-w-none [&_ol]:list-none [&_ul]:list-none"
          >
            {stepData?.communityAnalysis || ""}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const Step3Component = ({ stepData }) => {
  if (!stepData?.finalAnalysis) return null;

  return (
    <div className="space-y-2 text-xs">
      <div>
        <div className="mb-2 font-bold">Final Analysis:</div>
        <div className="text-foreground overflow-y-auto leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm text-foreground [&_h3]:text-foreground [&_p]:text-foreground [&_strong]:text-foreground max-w-none space-y-2 [&_ol]:list-none [&_ul]:list-none"
          >
            {stepData?.finalAnalysis || ""}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const Step4Component = ({ stepData }) => {
  if (!stepData?.snapshot) return null;

  return (
    <div className="space-y-2 text-xs">
      <div>
        <div className="mb-1 font-bold">{stepData?.snapshot?.title}</div>
        {stepData?.snapshot?.summary && (
          <div className="text-foreground space-y-1">
            <div>
              <span className="font-medium">Positioning:</span>{" "}
              {stepData?.snapshot?.summary?.productPositioning}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const CompletedComponent = ({ stepData }) => {
  return (
    <div className="rounded bg-green-50 p-3 text-center dark:bg-green-900/20">
      <div className="font-semibold text-green-800 dark:text-green-300">
        ✓ Analysis Completed Successfully!
      </div>
      {stepData?.projectId && (
        <div className="mt-1 text-xs text-green-600 dark:text-green-400">
          Project ID: {stepData?.projectId}
        </div>
      )}
    </div>
  );
};

const StepDetails = ({ step, data }) => {
  const stepData = data?.data?.data;
  if (!stepData) return null;

  const components = {
    "step1.1": <Step11Component stepData={stepData} />,
    "step1.3": <Step13Component stepData={stepData} />,
    "step1.4": <Step14Component stepData={stepData} />,
    "step1.5": <Step15Component stepData={stepData} />,
    "step2.1": <Step21Component stepData={stepData} />,
    "step2.2": <Step22Component stepData={stepData} />,
    "step2.3": <Step23Component stepData={stepData} />,
    "step2.4": <Step24Component stepData={stepData} />,
    "step2.5": <Step25Component stepData={stepData} />,
    step3: <Step3Component stepData={stepData} />,
    step4: <Step4Component stepData={stepData} />,
    completed: <CompletedComponent stepData={stepData} />,
  };

  return components[step] || null;
};

export default StepDetails;
