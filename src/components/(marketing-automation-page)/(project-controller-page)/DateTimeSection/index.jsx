import { TextField } from "@mui/material";
import { CircleAlert } from "lucide-react";
import Image from "next/image";

const SectionHeader = ({
  iconSrc = "/images/marketing-automation/star-icon.png",
  title,
}) => (
  <div className="flex items-center gap-2">
    <div className="flex size-8 items-center justify-center rounded-full shadow">
      <Image src={iconSrc} alt={"icon"} width={20} height={20} />
    </div>
    <strong className="text-muted-foreground">{title}</strong>
    <CircleAlert className="text-muted-foreground size-4" />
  </div>
);

const DateTimeField = ({ label, value, onChange, min }) => (
  <label className="space-y-2">
    <SectionHeader title={label} showIcon />
    <TextField
      type="datetime-local"
      value={value}
      onChange={onChange}
      fullWidth
      size="small"
      InputLabelProps={{ shrink: true }}
      inputProps={{ min }}
    />
  </label>
);

const DateTimeSection = ({
  startDateTime,
  endDateTime,
  onStartDateTimeChange,
  onEndDateTimeChange,
}) => {
  const getCurrentDateTime = () => new Date().toISOString().slice(0, 16);

  return (
    <div className="grid grid-cols-2 gap-4">
      <DateTimeField
        label="Start date & time"
        value={startDateTime}
        onChange={(e) => onStartDateTimeChange(e.target.value)}
        min={getCurrentDateTime()}
      />
      <DateTimeField
        label="End date & time"
        value={endDateTime}
        onChange={(e) => onEndDateTimeChange(e.target.value)}
        min={startDateTime || getCurrentDateTime()}
      />
    </div>
  );
};

export default DateTimeSection;
