import { FinalCTA, OneMoreThing } from "./components/common";
import { InspirationGallery } from "./components/features/agents";
import {
  ComparisonSection,
  FeaturesSection,
} from "./components/features/comparison";
import { ShothikHero } from "./components/features/hero";
import { MetaAdsFeatures, MindmapFeature } from "./components/features/product";
import {
  FounderMessage,
  TrustedBy,
  WhyShothik,
} from "./components/features/social-proof";

export default function Home() {
  return (
    <main className="pt-2">
      <ShothikHero />
      <InspirationGallery />
      <TrustedBy />
      <FeaturesSection />
      <ComparisonSection />
      <MetaAdsFeatures />
      <MindmapFeature />
      <FounderMessage />
      <OneMoreThing />
      <WhyShothik />
      <FinalCTA />
    </main>
  );
}
