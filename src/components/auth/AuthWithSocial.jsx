import { Google } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useGoogleLoginMutation } from "../../redux/api/auth/authApi";
import {
  logout,
  setShowLoginModal,
  setShowRegisterModal,
} from "../../redux/slice/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// ----------------------------------------------------------------------

export default function AuthWithSocial({ loading, setLoading, title = "in" }) {
  const theme = useTheme();
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      dispatch(logout());
      localStorage.setItem("logout-event", Date.now().toString());
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error);
    }
  };

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "logout-event") {
        dispatch(logout());
        router.replace("/");
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [dispatch]);

  const onGoogleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      handleLogout();
      const { code } = res;
      if (code) {
        const res = await googleLogin({ code });
        if (res?.data) {
          dispatch(setShowLoginModal(false));
          dispatch(setShowRegisterModal(false));
        }
      }
      setLoading(false);
    },
    flow: "auth-code",
    onError: (err) => {
      console.error(err, "google login error");
      setLoading(false);
    },
    scope: "email profile",
  });

  return (
    <Box sx={{ mt: "1.25rem" }}>
      <Stack direction="row" justifyContent="center" spacing={2}>
        <Button
          sx={{
            marginTop: 20,
            width: `100%`,
            height: "44px",
            borderRadius: "10px",
            backgroundColor: "transparent",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
          onClick={() => {
            setLoading(true);
            onGoogleLogin();
          }}
          disabled={loading}
        >
          <Box sx={{ mt: "5px" }}>
            {loading ? (
              <CircularProgress color="success" thickness={6} size={24} />
            ) : (
              <Google color="primary.main" />
            )}
          </Box>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              lineHeight: "1.5rem",
              color:
                theme.palette.mode === "dark"
                  ? "text.disabled"
                  : "rgb(75 85 99)",
            }}
          >
            Sign {title} with Google
          </Typography>
        </Button>
      </Stack>
    </Box>
  );
}
