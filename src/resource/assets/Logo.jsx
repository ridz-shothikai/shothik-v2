"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { useSelector } from "react-redux";
import enterprise_dark_logo from "../../../public/logos/enterprise_dark_logo.svg";
import enterprise_plan_logo from "../../../public/logos/enterprise_plan_logo.svg";
import pro_dark_logo from "../../../public/logos/pro_dark_logo.svg";
import pro_plan_log from "../../../public/logos/pro_plan_logo.svg";
import unlimited_dark_logo from "../../../public/logos/unlimited_dark_logo.svg";
import unlimited_plan_logo from "../../../public/logos/unlimited_plan_logo.svg";
import value_dark_logo from "../../../public/logos/value_dark_logo.svg";
import value_plan_logo from "../../../public/logos/value_plan_logo.svg";

const Logo = forwardRef((_, ref) => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const logoSrc =
    user?.package === "pro_plan"
      ? isDark
        ? pro_dark_logo
        : pro_plan_log
      : user?.package === "value_plan"
        ? isDark
          ? value_dark_logo
          : value_plan_logo
        : user?.package === "unlimited"
          ? isDark
            ? unlimited_dark_logo
            : unlimited_plan_logo
          : user?.package === "enterprise"
            ? isDark
              ? enterprise_dark_logo
              : enterprise_plan_logo
            : isDark
              ? "/shothik_dark_logo.png"
              : "/shothik_light_logo.png";

  return (
    <Link href="/?utm_source=internal" className="contents">
      <div className="mx-0.5 my-2.5 flex items-center justify-start">
        <div
          ref={ref}
          className="h-auto w-[100px] sm:w-[100px] md:w-[100px] lg:w-[150px]"
        >
          <Image
            src={logoSrc}
            priority={true}
            alt="shothik_logo"
            width={100}
            height={40}
            className="h-auto w-full"
          />
        </div>
      </div>
    </Link>
  );
});

Logo.displayName = "Logo";

export default Logo;
