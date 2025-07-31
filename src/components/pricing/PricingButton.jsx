import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { trackEvent } from "../../analysers/eventTracker";
import { PAYMENT } from "../../config/config/route";
import { setShowLoginModal } from "../../redux/slice/auth";

export default function PricingButton({
  user,
  paymentMethod,
  yearly,
  yearly_plan_available,
  caption,
  subscription,
  id,
  redirect,
  outline = false,
  isPopular,
}) {
  const dispatch = useDispatch();

  //track event
  const handleTrigger = () => {
    trackEvent("click", "payment", subscription, 1);
  };

  // console.log(subscription, "subscription");


  // Define purple styling for popular plan
  const purpleButtonSx = isPopular
    ? {
        backgroundColor: "#7c3aed", // Purple color
        "&:hover": {
          backgroundColor: "#6d28d9", // Darker purple on hover
        },
        "&:disabled": {
          backgroundColor: "#e5e7eb", // Gray when disabled
          color: "#9ca3af",
        },
      }
    : {};

  const purpleOutlinedSx =
    isPopular && outline
      ? {
          borderColor: "#7c3aed",
          color: "#7c3aed",
          "&:hover": {
            borderColor: "#6d28d9",
            backgroundColor: "rgba(124, 58, 237, 0.04)",
          },
          "&:disabled": {
            borderColor: "#e5e7eb",
            color: "#9ca3af",
          },
        }
      : {};

  return (
    <Box>
      {user?.email ? (
        <Button
          component={Link}
          onClick={handleTrigger}
          href={
            paymentMethod === "bkash"
              ? `${PAYMENT.bkash}/?subscription=${id}&tenure=${
                  yearly ? "yearly" : "monthly"
                }&redirect=${redirect}`
              : paymentMethod === "razor"
              ? `${PAYMENT.razor}/?subscription=${id}&tenure=${
                  yearly ? "yearly" : "monthly"
                }&redirect=${redirect}`
              : `${PAYMENT.stripe}/?subscription=${id}&tenure=${
                  yearly ? "yearly" : "monthly"
                }&redirect=${redirect}`
          }
          fullWidth
          size="large"
          variant={outline ? "outlined" : "contained"}
          disabled={
            !yearly_plan_available && yearly
              ? true
              : subscription === "free" ||
                (/pro_plan|unlimited/.test(user?.package) &&
                  /pro_plan|value_plan/.test(subscription)) ||
                user?.package === subscription
          }
          sx={{
            ...purpleButtonSx,
            ...purpleOutlinedSx,
          }}
        >
          {user?.package === subscription
            ? "current plan"
            : !yearly_plan_available && yearly
            ? "Available for monthly plan"
            : `Choose ${caption}`}
        </Button>
      ) : (
        <Button
          disabled={!yearly_plan_available && yearly}
          onClick={() => dispatch(setShowLoginModal(true))}
          fullWidth
          size="large"
          variant={
            outline || subscription === "free" ? `outlined` : "contained"
          }
          sx={{
            ...purpleButtonSx,
            ...purpleOutlinedSx,
          }}
        >
          {!yearly_plan_available && yearly
            ? "Available for monthly plan"
            : subscription === "free"
            ? `Sign up - it's free`
            : `Choose ${caption}`}
        </Button>
      )}
    </Box>
  );
}
