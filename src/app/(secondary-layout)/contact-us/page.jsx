import Image from "next/image";
import ContactHero from "../../../components/contact-us/ContacHero";
import ContactForm from "../../../components/contact-us/ContactForm";

export async function generateMetadata() {
  return {
    title: "Contact Us | Shothik AI",
    description: "This is Contact Us page",
  };
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <div className="container mx-auto px-4 py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-40">
          <ContactForm />

          <Image
            src="/location.png"
            height={400}
            width={400}
            alt="Location"
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
