import AboutHero from "../../../components/about/AboutHero";
import AboutTeam from "../../../components/about/AboutTeam";
import AboutVision from "../../../components/about/AboutVision";
import AboutWhat from "../../../components/about/AboutWhat";

export async function generateMetadata() {
  return {
    title: "About us | Shothik AI",
    description: "This is About us page",
  };
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <div className="container mx-auto px-4">
        <AboutWhat />
        <AboutVision />
        <div className="mt-12 mb-2 mx-auto w-[100px] h-0.5 bg-border" />
        <div className="mb-12 mx-auto w-[100px] h-0.5 bg-border" />
        <AboutTeam />
      </div>
    </>
  );
}
