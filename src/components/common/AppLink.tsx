import NextLink from "next/link";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { forwardRef } from "react";

type AppLinkProps = MuiLinkProps & {
  href: string;
  newTab?: boolean;
};

const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>((props, ref) => {
  const { href, newTab = false, children, ...muiProps } = props;

  // If newTab, just render an <a> with target="_blank"
  if (newTab) {
    return (
      <MuiLink
        href={href}
        ref={ref}
        target="_blank"
        rel="noopener noreferrer"
        {...muiProps}
      >
        {children}
      </MuiLink>
    );
  }

  // Normal Next.js link
  return (
    <NextLink href={href} passHref legacyBehavior>
      <MuiLink ref={ref} {...muiProps}>
        {children}
      </MuiLink>
    </NextLink>
  );
});

AppLink.displayName = "AppLink";

export default AppLink;
