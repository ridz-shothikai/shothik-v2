"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PAYMENT } from "../../config/config/route";
import useGeolocation from "../../hooks/useGeolocation";
import useSnackbar from "../../hooks/useSnackbar";
import { useGetPricingMutation } from "../../redux/api/auth/authApi";
import {
  useBkashPaymentMutation,
  useGetPricingPlansQuery,
} from "../../redux/api/pricing/pricingApi";
import LoadingScreen from "../../resource/LoadingScreen";
import PaymentSummary from "./PaymentSummary";

export default function BkashPyament() {
  const { data, isLoading: pricingLoading } = useGetPricingPlansQuery();
  const { location, isLoading: geoLoading } = useGeolocation();
  const [{ isLoading }] = useGetPricingMutation();
  const [bkashPayment] = useBkashPaymentMutation();
  const [monthly, setMonthly] = useState("monthly");
  const [totalBill, setTotalBill] = useState(0);
  const params = useSearchParams();
  const subscription = params.get("subscription");
  const tenure = params.get("tenure");
  const [plan, setPlan] = useState({});
  const snackbar = useSnackbar();

  const handleMonthly = (event) => {
    let { value } = event?.target;
    window.history.pushState(
      {},
      "",
      `${PAYMENT.bkash}/?subscription=${subscription}&tenure=${value}`
    );

    setMonthly(value);
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const payload = {
        pricingId: plan?._id,
        amount: totalBill,
        payment_type: tenure,
      };
      const data = await bkashPayment(payload).unwrap();
      window.location.href = data?.bkashURL;
    } catch (error) {
      console.error("Error:", error);
      snackbar(error.data?.error || "An error ocured", { variant: "error" });
    }
  };

  useEffect(() => {
    if (data) {
      const planData = data?.data.filter(
        (item) => item._id === subscription
      )[0];
      setPlan(planData);
      setMonthly(tenure);
    }
  }, [data, subscription, tenure]);

  if (pricingLoading || geoLoading) {
    return <LoadingScreen />;
  }

  if (plan) {
    return (
      <PaymentSummary
        plan={plan}
        monthly={monthly}
        setTotalBill={setTotalBill}
        handleMonthly={handleMonthly}
        isSubmitting={isLoading}
        onSubmit={onSubmit}
        status={"status"}
        country={location}
      />
    );
  } else return null;
}
