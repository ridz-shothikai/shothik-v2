import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { HEADER, NAV } from "../../config/config/nav";
import useResponsive from "../../hooks/useResponsive";
import { useGetUserQuery } from "../../redux/api/auth/authApi";
import { setOpen } from "../../redux/slice/settings";
import DotFlashing from "../../resource/DotFlashing";
import SvgColor from "../../resource/SvgColor";
import Logo from "../../resource/assets/Logo";
import AccountPopover from "./components/AccountProper";

export default function MainHeader() {
  const { accessToken, user } = useSelector((state) => state.auth);
  const { themeLayout } = useSelector((state) => state.settings);
  const isNavHorizontal = themeLayout === "horizontal";
  const isNavMini = themeLayout === "mini";
  const isDesktop = useResponsive("up", "sm");
  const isMd = useResponsive("up", "sm");
  const isMobile = useResponsive("down", "sm");
  const { isLoading } = useGetUserQuery(undefined, {
    skip: !accessToken,
  });
  const pathname = usePathname();
  const theme = useTheme();
  const dispatch = useDispatch();

  const title = () => {
    const routeTitles = {
      "/paraphrase": "Paraphrase",
      "/humanize-gpt": "Humanize GPT",
      "/ai-detector": "AI Detector",
      "/plagiarism-checker": "Plagiarism Checker",
      "/grammar-check": "Grammar Fix",
      "/summarize": "Summarize",
      "/translator": "Translate",
      "/pricing": "Shothik.ai Premium",
      "/agents/research": "Research",
      "/agents/sheets": "Sheet",
      "/agents/presentation": "Presentation Slide",
      "/agents": "Shothik AI Agent",
      "/marketing-automation": "Marketing Automation",
    };

    return routeTitles[pathname] || "";
  };

  const renderContent = (
    <>
      {!isDesktop && (
        <>
          <IconButton
            onClick={() => dispatch(setOpen(true))}
            sx={{
              mr: 1,
              ml: { xs: 0, sm: 1 },
              color: "primary.main",
            }}
          >
            <SvgColor src="/navbar/ic_menu_item.svg" />
          </IconButton>
          <Logo sx={{ mr: 2.5 }} />
        </>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        {isNavMini && isMd && <Logo sx={{ mr: 2.5 }} />}

        {isMd && (
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              {title()}
            </Typography>
          </Box>
        )}

        {isLoading ? (
          <DotFlashing />
        ) : (
          user?.package !== "unlimited" && (
            <Link href={"/pricing?redirect=" + pathname}>
              <Button
                data-umami-event="Nav: Upgrade To Premium"
                color="primary"
                size={isMd ? "medium" : "small"}
                variant="contained"
                rel="noopener"
                startIcon={
                  <SvgColor
                    src="/navbar/diamond.svg"
                    sx={{
                      width: { xs: 20, md: 24 },
                      height: { xs: 20, md: 24 },
                    }}
                  />
                }
              >
                {user?.email
                  ? isMobile
                    ? "Upgrade"
                    : "Upgrade Plan"
                  : isMobile
                    ? "Premium"
                    : "Upgrade To Premium"}
              </Button>
            </Link>
          )
        )}

        {!isLoading && (
          <>
            <AccountPopover accessToken={accessToken} user={user} />
          </>
        )}
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        display: "block",
        boxShadow: "none",
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        backgroundColor: theme.palette.background.default,
        backdropFilter: "blur(6px)",
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: theme.palette.background.default,
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 3 },
          bgcolor: theme.palette.background.default,
          borderBottom:
            pathname === "/" ? `dashed 1px ${theme.palette.divider}` : "none",
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
