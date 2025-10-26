import { cn } from "@/lib/utils";
import { Slider, Tab, Tabs } from "@mui/material";

const TopNavigation = ({
  className,
  selectedMode,
  setSelectedMode,
  modes,
  LENGTH,
  currentLength,
  setCurrentLength,
}) => {
  return (
    <div
      className={cn(
        "flex h-12 flex-wrap items-center justify-between gap-2 px-4",
        className,
      )}
    >
      {/* Tabs */}
      <div>
        <Tabs
          value={selectedMode}
          onChange={(_, value) => setSelectedMode(value)}
          sx={{
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {modes.map((tab) => (
            <Tab
              key={tab.name}
              icon={tab.icon}
              value={tab.name}
              label={tab.name}
              sx={{
                color: "text.secondary",
                "&.Mui-selected": { color: "primary.main" },
              }}
            />
          ))}
        </Tabs>
      </div>

      {/* Slider */}
      <div className="hidden items-center gap-2 sm:flex">
        <span className="text-sm font-medium">Length:</span>
        <Slider
          style={{ width: 150 }}
          aria-label="Length"
          getAriaValueText={(value) => LENGTH[value]}
          value={Object.keys(LENGTH).find(
            (key) => LENGTH[key] === currentLength,
          )}
          marks
          step={20}
          min={20}
          max={80}
          valueLabelDisplay="on"
          valueLabelFormat={currentLength}
          onChange={(_, value) => setCurrentLength(LENGTH[value])}
          sx={{
            "& .MuiSlider-valueLabel": {
              fontSize: 12,
              padding: "2px 6px",
              transform: "translateY(-21px)",
              "&:before": { width: 6, height: 6, bottom: 0 },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TopNavigation;
