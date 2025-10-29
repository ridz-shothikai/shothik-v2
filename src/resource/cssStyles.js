// CSS utility functions for Tailwind CSS
// Note: Most of these can be replaced with Tailwind classes directly

// ----------------------------------------------------------------------

/**
 * Convert hex color to rgba
 */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Background blur effect
 * Usage: Apply returned classes or styles to element
 */
export function bgBlur(props) {
  const color = props?.color || "#000000";
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  const validColor = hexToRgba(color, opacity);

  if (imgUrl) {
    return {
      position: "relative",
      backgroundImage: `url(${imgUrl})`,
      "&:before": {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: "100%",
        height: "100%",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: validColor,
      },
    };
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: validColor,
  };
}

// ----------------------------------------------------------------------

/**
 * Background gradient
 * Consider using Tailwind's bg-gradient-* classes instead
 */
export function bgGradient(props) {
  const direction = props?.direction || "to bottom";
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

// ----------------------------------------------------------------------

/**
 * Text gradient
 * Consider using Tailwind: bg-gradient-* bg-clip-text text-transparent
 */
export function textGradient(value) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
}

// ----------------------------------------------------------------------

/**
 * Filter styles
 * Can use Tailwind filter utilities: filter blur-* brightness-* etc.
 */
export function filterStyles(value) {
  return {
    filter: value,
    WebkitFilter: value,
    MozFilter: value,
  };
}

// ----------------------------------------------------------------------

/**
 * Hide scrollbar Y
 * Tailwind equivalent: scrollbar-hide (requires plugin) or custom class
 */
export const hideScrollbarY =
  "overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

/**
 * Hide scrollbar X
 * Tailwind equivalent: scrollbar-hide (requires plugin) or custom class
 */
export const hideScrollbarX =
  "overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";
