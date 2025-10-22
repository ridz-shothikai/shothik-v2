"use client";
import { Box, Link, useTheme } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { forwardRef } from "react";
import { useSelector } from "react-redux";
import enterprise_plan_logo from "../../../public/logos/enterprise_plan_logo.svg";
import pro_plan_log from "../../../public/logos/pro_plan_logo.svg";
import unlimited_plan_logo from "../../../public/logos/unlimited_plan_logo.svg";
import value_plan_logo from "../../../public/logos/value_plan_logo.svg";

// ----------------------------------------------------------------------

const Logo = forwardRef((_, ref) => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const logoSrc =
    user?.package === "pro_plan"
      ? pro_plan_log
      : user?.package === "value_plan"
        ? value_plan_logo
        : user?.package === "unlimited"
          ? unlimited_plan_logo
          : user?.package === "enterprise"
            ? enterprise_plan_logo
            : "/shothik_dark_logo.png";

  return (
    <Link
      component={NextLink}
      href="/?utm_source=internal"
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
          component="div"
          sx={{
            width: { xs: 100, sm: 100, md: 100, lg: 150 },
            height: "auto",
          }}
        >
          <Image
            src={logoSrc}
            priority={true}
            alt="shothik_logo"
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

Logo.displayName = "Logo";

export default Logo;
