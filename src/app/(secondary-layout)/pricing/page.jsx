import HomeAdvertisement from "../../../components/common/HomeAdvertisement";
import PricingLayout from "../../../components/pricing/PricingLayout";

export async function generateMetadata() {
  return {
    title: "Pricing | Shothik AI",
    description: "This is the Pricing page",
  };
}

export default function PricingPage() {
  return (
    <PricingLayout
      TitleContend={
        <>
          <h1 className="text-3xl font-bold text-center text-primary-foreground">
            Our pricing plan made simple.
          </h1>

          <p className="text-center text-primary-foreground max-w-2xl mx-auto">
            Discover the right plan for your needs and take advantage of
            Shothik.ai&apos;s powerful tools. Whether you&apos;re just getting
            started or need advanced features for your business, we&apos;ve got
            you covered.
          </p>
        </>
      }
    >
      <div className="container mx-auto px-4 my-20 md:my-28">
        <HomeAdvertisement />
      </div>
    </PricingLayout>
  );
}
