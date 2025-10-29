import FaqForm from "../../../components/faqPage/FaqForm";
import FaqsHero from "../../../components/faqPage/FaqHero";
import FAQ from "../../../components/home/FAG";

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

      <div className="container mx-auto px-4 pt-60 pb-40 relative">
        <div className="mb-40 mt-0">
          <FAQ />

          <div className="border-t border-border my-4" />
        </div>

        <div className="w-full sm:w-3/5 mx-auto">
          <FaqForm />
        </div>
      </div>
    </>
  );
}
