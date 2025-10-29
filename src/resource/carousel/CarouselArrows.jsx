import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LeftIcon, RightIcon } from "./Icon";

export default function CarouselArrows({
  shape = "circular",
  filled = false,
  onNext,
  onPrevious,
  children,
  leftButtonProps,
  rightButtonProps,
  className,
  ...other
}) {
  const buttonClasses = cn(
    "transition-all duration-200",
    shape === "rounded" ? "rounded-lg" : "rounded-full",
    filled
      ? "bg-gray-900/50 text-white/80 hover:bg-gray-900 hover:text-white"
      : "opacity-50 hover:opacity-100",
  );

  const positionClasses = children ? "absolute top-1/2 z-10 -mt-5" : "";

  return (
    <div className={cn(className)} {...other}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        className={cn(
          buttonClasses,
          positionClasses,
          "left-4",
          leftButtonProps?.className,
        )}
        {...leftButtonProps}
      >
        <LeftIcon />
      </Button>

      {children}

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className={cn(
          buttonClasses,
          positionClasses,
          "right-4",
          rightButtonProps?.className,
        )}
        {...rightButtonProps}
      >
        <RightIcon />
      </Button>
    </div>
  );
}
