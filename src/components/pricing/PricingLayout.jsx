"use client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGeolocation from "../../hooks/useGeolocation";
import useResponsive from "../../hooks/useResponsive";
import { useGetPricingPlansQuery } from "../../redux/api/pricing/pricingApi";
import PricingPlanCard from "./PricingPlanCard";
import PricingSlider from "./PricingSlider";
import PricingPlanCardSkeleton from "./pricingPlanCardSkeleton";

export default function PricingLayout({ children, TitleContend }) {
  const { user } = useSelector((state) => state.auth);
  const [isMonthly, setIsMonthly] = useState(false);
  const { data, isLoading } = useGetPricingPlansQuery();
  const { location } = useGeolocation();
  const isMobile = useResponsive("down", "sm");

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
    <div className="pt-4 md:pt-0 -mt-2">
      <div
        className="bg-cover bg-no-repeat bg-center h-[35rem] pt-6 md:pt-8 px-2 md:px-0 flex flex-col items-center"
        style={{
          backgroundImage: `url(/pricing_bg_img.webp)`,
        }}
      >
        {TitleContend}

        <div className="my-4">
          <div className="flex flex-row items-center justify-end gap-2">
            <Label htmlFor="yearly-switch" className="text-sm uppercase tracking-wide text-primary-foreground">
              MONTHLY
            </Label>
            <Switch id="yearly-switch" checked={isMonthly} onCheckedChange={handleIsMonthly} />
            <Label htmlFor="yearly-switch" className="text-sm uppercase tracking-wide text-primary-foreground ml-0 sm:ml-1.5">
              YEARLY (save 2 months)
            </Label>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-screen-xl">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-5 -mt-60 sm:-mt-68 md:-mt-60 px-2 md:px-0 mx-auto pricing_card_style"
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
        </div>
        {!isLoading && data?.data ? (
          <div className="flex flex-col gap-10 my-5 md:my-14 mx-2 md:mx-[140px]">
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
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
