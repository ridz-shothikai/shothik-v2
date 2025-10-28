import { Box, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { NAV } from "../../config/config/nav";
import navConfig from "../../config/config/navConfig";
import ShothikCheckMark from "../../resource/assets/Check_Mark_Logo";
import { hideScrollbarX } from "../../resource/cssStyles";
import NavSectionMini from "./components/NavSectionMini";
import NavToggleButton from "./components/toggleButton";
// ----------------------------------------------------------------------

export default function NavMini({ isDarkMode }) {
  const { user } = useSelector((state) => state.auth);
  const plan = user.package;

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: 0,
        width: NAV.W_DASHBOARD_MINI,
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        bgcolor: isDarkMode ? "#242526" : "background.paper",
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <NavToggleButton
        sx={{
          top: 50,
          left: NAV.W_DASHBOARD_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: "100%",
          width: NAV.W_DASHBOARD_MINI,
          borderRight: "1px dashed",
          borderColor: "divider",
          ...hideScrollbarX,
        }}
      >
        <ShothikCheckMark sx={{ mx: "auto", my: 2 }} />

        <NavSectionMini data={navConfig} user={user} />
      </Stack>
    </Box>
  );
}
