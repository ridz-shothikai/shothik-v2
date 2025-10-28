"use client";

import { toggleParaphraseOption } from "@/redux/slice/settings";
import { Box, Stack, styled, Switch, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

// switch icon
const AutoFreeze = styled(Switch)(({ theme }) => ({
  width: 30,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 3,
    left: "1px",
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& .MuiSwitch-thumb": {
        backgroundColor: "#F4F6F8",
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#004B50",
        ...theme.applyStyles("dark", {
          backgroundColor: "#177ddc",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    color: "#004B50 !important",
    width: 10,
    height: 10,
    borderRadius: 8,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    border: "2px solid #004B50",
    opacity: 1,
    backgroundColor: "#F4F6F8",
    boxSizing: "border-box",
    ...theme.applyStyles("dark", {
      backgroundColor: "rgba(255,255,255,.35)",
    }),
  },
}));

export default function AutoFreezeSettings() {
  const dispatch = useDispatch();
  const { paraphraseOptions } = useSelector((state) => state.settings);

  const handleAutoFreezeToggle = () => {
    dispatch(toggleParaphraseOption("autoFreeze"));
  };
  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Typography
          sx={{
            color: "#858481",
            fontSize: "13px",
            whiteSpace: "nowrap",
            fontWeight: "600",
          }}
        >
          Auto Freeze
        </Typography>
        <AutoFreeze
          checked={paraphraseOptions.autoFreeze}
          onChange={handleAutoFreezeToggle}
          inputProps={{ "aria-label": "auto freeze" }}
        />
      </Stack>
    </Box>
  );
}
