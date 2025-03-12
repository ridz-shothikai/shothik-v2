import React from "react";
import B2bFeatures from "../../components/home/B2BFeatures";
import CTA from "../../components/home/CTA";
import FAQ from "../../components/home/FAG";
import HomeFeatures from "../../components/home/HomeFeatures";
import HomeHeroSection from "../../components/home/HomeHeroSection";
import HomeTools from "../../components/home/HomeTools";
import Testimonials from "../../components/home/Testimonials";
import WhyShothik from "../../components/home/WhyShothik";

export async function generateMetadata() {
  return {
    title: "Home || Shothik AI",
    description: "Home description",
  };
}

const Home = () => {
  return (
    <>
      <HomeHeroSection />
      <HomeTools />
      <HomeFeatures />
      <B2bFeatures />
      <WhyShothik />
      <Testimonials />
      <CTA />
      <FAQ />

      <div hidden>
        <h1>Shothik AI: Humanize, Paraphrase, Detect & Translate AI Text</h1>
        <h2>Humanize AI Text: Make AI Sound Like a Human</h2>
        <p>
          Shothik AI's advanced algorithms use natural language processing to
          humanize AI-generated content. By refining the style, tone, and
          structure of your text, it transforms robotic AI writing into
          something that sounds natural, engaging, and truly human.
        </p>
        <h2>Paraphrase for Originality: Rewrite Text Effortlessly</h2>
        <p>
          Whether you're looking to rephrase a few sentences or an entire
          paragraph, Shothik AI makes it easy. It ensures that your rewritten
          content maintains the original meaning while improving its readability
          and flow, giving you unique, plagiarism-free text in seconds.
        </p>
        <h2>Detect AI Content: Ensure Authenticity & Avoid Penalties</h2>
        <p>
          Shothik AI can detect AI-generated content, helping you ensure the
          authenticity of your work. Whether you're an educator, publisher, or
          business owner, using our AI detection tool can help avoid penalties
          for plagiarism or duplicate content.
        </p>
        <h2>Translate Text: Break Language Barriers with AI</h2>
        <p>
          With Shothik AI's translation capabilities, you can break down
          language barriers and reach a global audience. Our tool offers
          seamless, accurate translations to and from multiple languages,
          ensuring that your content remains consistent across borders.
        </p>
        <h2>Edit Your Text: Fine-Tune Every Sentence</h2>
        <p>
          Shothik AI allows you to edit your text with precision. Whether you're
          adjusting the tone, grammar, or word choice, our tool provides
          intelligent suggestions to enhance your writing, making every sentence
          more polished and professional.
        </p>
        <h2>Why Choose Shothik AI</h2>
        <p>
          Shothik AI is the ultimate writing tool for anyone looking to improve
          the quality and originality of their content. With features like AI
          humanization, paraphrasing, detection, and translation, it's the
          all-in-one solution for creating authentic, error-free text in any
          language.
        </p>
        <h2>How Shothik AI Works</h2>
        <p>
          Shothik AI uses cutting-edge machine learning and natural language
          processing techniques to analyze and improve text. Whether you're
          paraphrasing, humanizing, detecting AI-generated content, or
          translating text, Shothik AI provides a seamless, intuitive experience
          with fast and accurate results.
        </p>
      </div>
    </>
  );
};

export default Home;
