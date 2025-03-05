import { Box } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HEADER, NAV } from "../../config/config/nav";
import useResponsive from "../../hooks/useResponsive";
import { setShowLoginModal } from "../../redux/slice/auth";
import FooterServerComponent from "../navigation/components/FooterServerComponent";
// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children }) {
  const { themeLayout } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const useparams = useSearchParams();
  const isNavMini = themeLayout === "mini";
  const isDesktop = useResponsive("up", "sm");
  const login = useparams.get("login");

  useEffect(() => {
    if (login) {
      dispatch(setShowLoginModal(true));
    }
  }, [login]);

  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        pt: `${HEADER.H_MOBILE + SPACING}px`,
        ...(isDesktop && {
          px: 2,
          pt: `${HEADER.H_DASHBOARD_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.W_DASHBOARD}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI}px)`,
            ml: { sm: "95px" },
          }),
        }),
      }}
    >
      <Box sx={{ minHeight: "calc(100vh - 200px)" }}>{children}</Box>
      <FooterServerComponent />
    </Box>
  );
}
