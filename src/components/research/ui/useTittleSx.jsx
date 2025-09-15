import { useTheme } from "@mui/material/styles";

const useTitleSx = (isLast) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return {
    position: "relative",
    overflow: "hidden",
    display: "inline-block",
    zIndex: 1,
    color: isDark ? theme.palette.grey[100] : theme.palette.text.primary,
    ...(isLast && {
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-140%",
        width: "140%",
        height: "100%",
        background: isDark
          ? "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 100%)"
          : "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)",
        transform: "skewX(-20deg)",
        pointerEvents: "none",
        animation: "shineMove 1800ms linear infinite",
        mixBlendMode: isDark ? "screen" : "multiply",
      },
      "@keyframes shineMove": {
        "0%": { left: "-140%" },
        "100%": { left: "140%" },
      },
    }),
  };
};

export default useTitleSx;
