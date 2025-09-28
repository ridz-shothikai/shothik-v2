const CampaignOverview = ({ selectedGoal, startDateTime, endDateTime }) => (
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
);

export default CampaignOverview;
