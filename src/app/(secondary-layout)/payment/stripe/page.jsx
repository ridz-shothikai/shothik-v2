import StripePayment from "../../../../components/payment/StripePayment";

export async function generateMetadata() {
  return {
    title: "Payment With Stripe | Shothik AI",
    description: "This is Stripe payment for international payment system",
  };
}

const StripePyamentPage = () => {
  return (
    <div className="container mx-auto px-4 pt-40 pb-40 min-h-screen">
      <h1 className="text-3xl font-bold text-center">
        {`Let's finish powering you up!`}
      </h1>

      <p className="text-center text-muted-foreground mb-20">
        Professional plan is right for you.
      </p>

      <div className="flex flex-col items-center justify-center">
        <StripePayment />
      </div>
    </div>
  );
};

export default StripePyamentPage;
