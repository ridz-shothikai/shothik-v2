import { cn } from "@/lib/utils";
import { Slider } from "@mui/material";

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
        "flex h-12 flex-row items-center justify-between gap-6 px-4 py-1",
        className,
      )}
    >
      {/* Tailwind Tabs */}
      <div className="flex flex-1 items-center gap-2 md:flex-auto md:gap-x-4">
        {modes?.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setSelectedMode(tab.name)}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1 text-xs leading-none font-medium whitespace-nowrap md:text-sm",
              {
                "text-primary": selectedMode === tab.name,
              },
            )}
          >
            {tab?.icon && (
              <span className="text-base leading-0 md:text-xl">{tab.icon}</span>
            )}
            <span className="leading-0">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="flex max-w-xs flex-1 items-center gap-2 md:flex-auto">
        <span className="hidden text-sm font-medium sm:inline-block">
          Length:
        </span>
        <Slider
          style={{ width: "100%" }}
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
        />
      </div>
    </div>
  );
};

export default TopNavigation;
