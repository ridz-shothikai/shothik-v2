import { Button } from "@mui/material";
import { useComponentTracking } from "../../hooks/useComponentTracking";

const TrackedButton = forwardRef(
  (
    {
      children,
      onClick,
      trackingName,
      conversionType,
      conversionValue,
      additionalTrackingData = {},
      ...props // Props of button
    },
    ref,
  ) => {
    const { trackClick, trackConversion } = useComponentTracking("button");

    const handleClick = (event) => {
      // Track the click
      trackClick(trackingName || "button_click", {
        button_text:
          typeof children === "string" ? children : "complex_content",
        button_variant: props.variant,
        ...additionalTrackingData,
      });

      // Track conversion if specified
      if (conversionType) {
        trackConversion(conversionType, conversionValue);
      }

      // Call original onClick
      onClick?.(event);
    };

    return (
      <Button ref={ref} {...props} onClick={handleClick}>
        {children}
      </Button>
    );
  },
);

export default TrackedButton;
