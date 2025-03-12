"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PAYMENT } from "../../config/config/route";
import useGeolocation from "../../hooks/useGeolocation";
import useSnackbar from "../../hooks/useSnackbar";
import {
  useGetPricingPlansQuery,
  useStripePaymentMutation,
} from "../../redux/api/pricing/pricingApi";
import LoadingScreen from "../../resource/LoadingScreen";
import PaymentSummary from "./PaymentSummary";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripePayment() {
  const { data, isLoading: pricingLoading } = useGetPricingPlansQuery();
  const [stripePayment, { isLoading }] = useStripePaymentMutation();
  const { location: k, isLoading: geoLoading } = useGeolocation();
  const [monthly, setMonthly] = useState("monthly");
  const [totalBill, setTotalBill] = useState(0);
  const enqueueSnackbar = useSnackbar();
  const [plan, setPlan] = useState({});
  const params = useSearchParams();
  const subscription = params.get("subscription");
  const tenure = params.get("tenure");
  const location = "quatar";

  const handleMonthly = (event) => {
    let { value } = event?.target;
    window.history.pushState(
      {},
      "",
      `${PAYMENT.razor}/?subscription=${subscription}&tenure=${value}`
    );

    setMonthly(value);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const payload = {
        pricingId: plan?._id,
        amount: totalBill,
        payment_type: tenure,
      };
      const res = await stripePayment(payload).unwrap();
      const order = res.data;
      if (order) {
        const result = (await stripe).redirectToCheckout({
          sessionId: order.id,
        });
        if (result.error) {
          throw { message: "An error occured" };
        }
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message || error.data.error, { variant: "error" });
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

  return (
    <PaymentSummary
      plan={plan}
      monthly={monthly}
      setTotalBill={setTotalBill}
      handleMonthly={handleMonthly}
      isSubmitting={isLoading}
      onSubmit={handleSubmit}
      country={location}
    />
  );
}
