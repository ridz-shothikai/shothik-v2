import { Button, Slider } from "@mui/material";
import {
  AlertCircle,
  AlignVerticalDistributeCenter,
  CircleAlert,
  CreditCardIcon,
} from "lucide-react";

const BudgetSection = ({ budget, onBudgetChange }) => {
  const handleBudgetInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) {
      onBudgetChange(value);
    }
  };

  return (
    <div className="bg-card space-y-2 rounded-lg p-4 shadow">
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <CreditCardIcon />
          <strong className="text-muted-foreground">Set your ads budget</strong>
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
            onChange={handleBudgetInputChange}
          />
        </div>
      </div>
      <div className="px-2">
        <Slider
          value={budget}
          onChange={(_, newValue) => onBudgetChange(newValue)}
          min={0}
          max={1000}
          step={10}
          valueLabelDisplay="auto"
          sx={{
            color: "var(--primary)",
            "& .MuiSlider-thumb": { borderRadius: "50%" },
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
  );
};

export default BudgetSection;
