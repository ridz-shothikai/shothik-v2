import {
  Box,
  Container,
  Divider,
  Grid2,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { Fragment } from "react";
import { _socials } from "../../_mock/socials";
import { PATH_PAGE, PATH_TOOLS } from "../../config/config/route";
import Logo from "../../resource/assets/Logo";

const LINKS = [
  {
    headline: "AI Writing Tools",
    children: [
      { name: "Paraphrasing", href: PATH_TOOLS.paraphrase },
      { name: "Humanize GPT", href: PATH_TOOLS.humanize },
      { name: "Summarizer", href: PATH_TOOLS.summarize },
      { name: "Grammar Checker", href: PATH_TOOLS.grammar },
      { name: "Translator", href: PATH_TOOLS.translator },
    ],
  },
  {
    headline: "Legal",
    children: [
      { name: "Terms of service ", href: PATH_PAGE.terms },
      { name: "Privacy policy", href: PATH_PAGE.privacy },
      { name: "Refund policy", href: PATH_PAGE.refundPolicy },
      { name: "Payment policy", href: PATH_PAGE.paymentPolicy },
    ],
  },

  {
    headline: "For Busines",
    children: [
      { name: "Reseller Program", href: PATH_PAGE.resellerPanel },
      { name: "Affiliate Program", href: PATH_PAGE.affiliateMarketing },
      { name: "B2B Portfolios", href: "/portfolio" },
    ],
  },
  {
    headline: "Company",
    children: [
      { name: "About us", href: PATH_PAGE.about },
      { name: "Our Team", href: PATH_PAGE.about },
      { name: "Career", href: PATH_PAGE.career },
      { name: "Blogs", href: PATH_PAGE.community },
      { name: "Contact us", href: PATH_PAGE.contact },
    ],
  },
  {
    headline: "Content Analysis",
    children: [{ name: "AI Detector", href: PATH_TOOLS.ai_detector }],
  },

  {
    headline: "Support",
    children: [
      { name: "Help center", href: "mailto:support@shothik.ai" },
      { name: "Tutorials", href: PATH_PAGE.tutorials },
      { name: "FAQs", href: PATH_PAGE.faqs },
      { name: "Join us on Discord", href: PATH_PAGE.discord },
    ],
  },
];

export default function Footer() {
  const simpleFooter = (
    <Box
      component='footer'
      sx={{
        py: 5,
        bgcolor: "background.default",
        display: "flex",
        flexDirection: { xs: "column", sm: "column", md: "row" },
        justifyContent: "space-around",
      }}
    >
      <Box
        component='footer'
        sx={{
          bgcolor: "background.default",
          display: { xs: "flex", sm: "flex", md: "block" },
          justifyContent: { xs: "center", sm: "center" },
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            alignItems: "flex-start",
            gap: { xs: 1, sm: 1, md: 4 },
          }}
        >
          <Logo />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography>© 2025 All rights reserved.</Typography>
            <Stack
              direction={{ xs: "column", sm: "column", md: "row" }}
              spacing={1}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Link href='/terms' color='inherit'>
                Terms of Service
              </Link>
              <Link href='/privacy' color='inherit'>
                Privacy Policy
              </Link>
              <Link href='/copyright' color='inherit'>
                Copyright, Community Guidelines
              </Link>
            </Stack>
            <Typography>
              This site is protected by reCAPTCHA and the Google Privacy Policy
              and Terms of Service apply
            </Typography>
          </Box>
        </Container>
      </Box>
      <Typography
        variant='caption'
        component='div'
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        Developed by  <Link href='/?utm_source=internal'>Shothik AI</Link>
      </Typography>
    </Box>
  );

  const mainFooter = (
    <Box
      component='footer'
      sx={{
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      <Divider />

      <Container sx={{ py: 10 }}>
        <Grid2 container>
          <Grid2 container spacing={4}>
            {LINKS.map((list) => (
              <Grid2 key={list.headline} size={{ xs: 6, sm: 6, md: 3 }}>
                <Stack
                  spacing={{ xs: 1, md: 2 }}
                  alignItems={{
                    xs: "flex-start",
                    sm: "flex-start",
                    md: "flex-start",
                  }}
                  sx={{ width: "100%" }}
                >
                  <Typography
                    component='div'
                    variant='overline'
                    sx={{ fontSize: 14 }}
                  >
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={NextLink}
                      href={link.href}
                      color='inherit'
                    >
                      {link.name.split("\n").map((line, index) => (
                        <Fragment key={index}>
                          {line}
                          {index !== link.name.split("\n").length - 1 && <br />}
                        </Fragment>
                      ))}
                    </Link>
                  ))}
                </Stack>
              </Grid2>
            ))}

            {/* Social Section */}
            <Grid2
              sx={{
                mt: 4,
                ml: 4,
              }}
            >
              <Stack
                spacing={4}
                direction={{ xs: "column", sm: "column", md: "row" }}
                justifyContent={{
                  xs: "center",
                  sm: "center",
                  md: "space-between",
                }}
                alignItems='center'
              >
                <Box>
                  <Typography
                    variant='overline'
                    fontSize={14}
                    textAlign={{ xs: "center", sm: "center", md: "left" }}
                  >
                    Get to Know Us
                  </Typography>
                  <Stack
                    direction='row'
                    justifyContent={{
                      xs: "center",
                      sm: "center",
                      md: "flex-start",
                    }}
                    sx={{ mb: { xs: 5, md: 0 }, ml: { xs: -1, md: -1 } }}
                  >
                    {_socials.map((Social) => (
                      <IconButton
                        key={Social.name}
                        component={NextLink}
                        target='_blank'
                        href={Social.path}
                      >
                        <Social.icon />
                      </IconButton>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );

  return (
    <>
      {mainFooter}
      {simpleFooter}
    </>
  );
}
