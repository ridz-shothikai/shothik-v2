import { Box, Link } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { forwardRef } from "react";
import { useSettingsContext } from "../../hooks/SettingsContext";

// ----------------------------------------------------------------------

const Logo = forwardRef((_, ref) => {
  const { themeMode } = useSettingsContext();
  const isLight = themeMode === "light";

  return (
    <Link
      component={NextLink}
      href='/?utm_source=internal'
      sx={{ display: "contents" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          margin: "10px 2px",
        }}
      >
        <Box
          ref={ref}
          component='div'
          sx={{
            width: { xs: 100, sm: 100, md: 100, lg: 150 },
            height: "auto",
          }}
        >
          <Image
            src={isLight ? "/shothik_light_logo.png" : "/shothik_dark_logo.png"}
            priority
            alt='shothik_logo'
            width={100}
            height={40}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
      </div>
    </Link>
  );
});

export default Logo;
