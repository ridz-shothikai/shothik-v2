import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "rounded",
})(({ rounded, theme }) => ({
  zIndex: 9,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  "& li": {
    width: 18,
    height: 18,
    opacity: 0.32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "&.slick-active": {
      opacity: 1,
      ...(rounded && {
        "& span": {
          width: 16,
          borderRadius: 6,
        },
      }),
    },
  },
}));

const StyledDot = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  }),
}));

// ----------------------------------------------------------------------

export default function CarouselDots(props) {
  const rounded = props?.rounded || false;
  const sx = props?.sx;

  return {
    appendDots: (dots) => (
      <>
        <StyledRoot component='ul' rounded={rounded} sx={sx} {...props}>
          {dots}
        </StyledRoot>
      </>
    ),
    customPaging: () => (
      <Stack
        component='div'
        alignItems='center'
        justifyContent='center'
        sx={{ width: 1, height: 1 }}
      >
        <StyledDot
          sx={{
            bgcolor: "currentColor",
          }}
        />
      </Stack>
    ),
  };
}
