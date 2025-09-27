"use client";
import { Box, Container, Stack, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGeolocation from "../../hooks/useGeolocation";
import useResponsive from "../../hooks/useResponsive";
import { useGetPricingPlansQuery } from "../../redux/api/pricing/pricingApi";
import PricingPlanCard from "./PricingPlanCard";
import PricingSlider from "./PricingSlider";
import PricingTable from "./PricingTable";
import PricingPlanCardSkeleton from "./pricingPlanCardSkeleton";

export default function PricingLayout({ children, TitleContend }) {
  const { user } = useSelector((state) => state.auth);
  const [isMonthly, setIsMonthly] = useState(false);
  const { data, isLoading } = useGetPricingPlansQuery();
  const { location } = useGeolocation();
  const isMobile = useResponsive("down", "sm");

  // console.log(location, "location data on pricing layout");

  useEffect(() => {
    const haveValue = localStorage.getItem("isMonthly");
    if (haveValue) {
      setIsMonthly(JSON.parse(haveValue));
    }
  }, [isMonthly]);

  const handleIsMonthly = () => {
    setIsMonthly((prev) => !prev);
    localStorage.setItem("isMonthly", !isMonthly);
  };

  return (
    <Box sx={{ pt: { xs: 4, md: 0 }, mt: -2 }}>
      <Box
        sx={{
          backgroundImage: `url(/pricing_bg_img.webp)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "35rem",
          pt: { xs: 6, md: 8 },
          px: { xs: 2, md: 0 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {TitleContend}

        <Box sx={{ my: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Typography
              variant="overline"
              sx={{ mr: 1.5, color: "error.contrastText" }}
            >
              MONTHLY
            </Typography>
            <Switch checked={isMonthly} onClick={handleIsMonthly} />
            <Typography
              variant="overline"
              sx={{ ml: { xs: 0, sm: 1.5 }, color: "error.contrastText" }}
            >
              YEARLY (save 2 months)
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Container maxWidth="xl">
        <Box
          gap={{ xl: 5, md: 3, xs: 3 }}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          sx={{
            mt: { xs: "-15rem", sm: "-17rem", md: "-15rem" },
            px: { xs: 2, md: 0 },
            mx: "auto",
          }}
          className="pricing_card_style"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <PricingPlanCardSkeleton key={`skeleton-${index}`} />
              ))
            : data?.data?.map((card, index) => (
                <PricingPlanCard
                  key={index}
                  user={user}
                  card={card}
                  index={index}
                  yearly={isMonthly}
                  paymentMethod={
                    location === "bangladesh"
                      ? "bkash"
                      : location === "india"
                        ? "razor"
                        : "stripe"
                  }
                  country={location}
                />
              ))}
        </Box>
        {!isLoading && data?.data ? (
          <Stack
            spacing={10}
            sx={{ my: { xs: 5, md: "56px" }, mx: { xs: 2, md: "140px" } }}
          >
            {isMobile && (
              <PricingSlider
                data={data?.data}
                yearly={isMonthly}
                country={location}
                paymentMethod={
                  location === "bangladesh"
                    ? "bkash"
                    : location === "india"
                      ? "razor"
                      : "stripe"
                }
                user={user}
              />
            )}
            {/* <PricingTable
            user={user}
            data={data?.data}
            yearly={isMonthly}
            paymentMethod={
              location === "bangladesh"
                ? "bkash"
                : location === "india"
                ? "razor"
                : "stripe"
            }
            country={location}
          /> */}
          </Stack>
        ) : null}
        {children}
      </Container>
    </Box>
  );
}
