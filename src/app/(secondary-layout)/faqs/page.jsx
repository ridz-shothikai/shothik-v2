import FaqForm from "@/components/faqPage/FaqForm";
import FaqsHero from "@/components/faqPage/FaqHero";
import FAQ from "@/components/home/FAG";

export async function generateMetadata() {
  return {
    title: "Faqs | Shothik AI",
    description: "This is FAQ page",
  };
}

export default function FaqsPage() {
  return (
    <>
      <FaqsHero />

      <div className="relative container mx-auto px-4 pt-60 pb-40">
        <div className="mt-0 mb-40">
          <FAQ />

          <div className="border-border my-4 border-t" />
        </div>

        <div className="mx-auto w-full sm:w-3/5">
          <FaqForm />
        </div>
      </div>
    </>
  );
}
