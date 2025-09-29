import { Radio } from "@mui/material";
import Image from "next/image";

const GoalCard = ({
  goal,
  label,
  description,
  selectedGoal,
  onGoalChange,
  isRecommended,
}) => (
  <label
    className={`border-primary flex cursor-pointer flex-col gap-4 rounded-lg border p-2 ${isRecommended ? "relative lg:col-span-2" : ""}`}
  >
    <div className="flex items-center justify-between gap-2">
      <strong>{label}</strong>
      <Radio
        name="ad_goal"
        value={goal}
        checked={selectedGoal === goal}
        onChange={(e) => onGoalChange(e.target.value)}
        sx={{ padding: 0 }}
      />
    </div>
    <div className="text-muted-foreground mt-auto text-xs capitalize">
      {description}
    </div>
    {isRecommended && (
      <Image
        src="/images/marketing-automation/fall-badge-icon.png"
        alt="Recommended"
        width={10}
        height={10}
        className="absolute top-0 right-16 object-contain"
      />
    )}
  </label>
);

const SectionHeader = ({
  iconSrc = "/images/marketing-automation/star-icon.png",
  title,
}) => (
  <div className="flex items-center gap-2">
    <div className="flex size-8 items-center justify-center rounded-full shadow">
      <Image src={iconSrc} alt={"icon"} width={20} height={20} />
    </div>
    <strong className="text-muted-foreground">{title}</strong>
  </div>
);

const AdGoalSection = ({ selectedGoal, onGoalChange }) => {
  const goals = [
    {
      goal: "traffic",
      label: "Traffic",
      description: "Drive Traffic and build awareness",
    },
    {
      goal: "leads",
      label: "Leads",
      description: "Maximize impact: Build Traffic, then convert",
    },
    {
      goal: "sales",
      label: "Sales",
      description:
        "Best for converting leads into customers. Perfect for both online and offline stores to drive sales and grow revenue",
      isRecommended: true,
    },
  ];

  return (
    <div className="space-y-2">
      <SectionHeader title="Ad Goal" />
      <div className="grid gap-4 lg:grid-cols-4">
        {goals.map((goalConfig) => (
          <GoalCard
            key={goalConfig.goal}
            {...goalConfig}
            selectedGoal={selectedGoal}
            onGoalChange={onGoalChange}
          />
        ))}
      </div>
    </div>
  );
};

export default AdGoalSection;
