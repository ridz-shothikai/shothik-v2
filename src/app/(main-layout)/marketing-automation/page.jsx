import RootForm from "@/components/(marketing-automation-page)/RootForm";
import Image from "next/image";

const MarketingAutomationPage = () => {
  return (
    <main className="bg-card relative flex min-h-[calc(100vh-100px)] flex-col p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-grow flex-col">
        <div className="my-auto grid lg:grid-cols-5">
          <div className="space-y-6 py-4 lg:col-span-3">
            <div className="space-y-2">
              <h2>Which page do you want to advertise?</h2>
              <p className="text-muted-foreground max-w-md">
                Shothik can craft an ad for you—just share your service or
                product URL (not limited to the homepage)!
              </p>
            </div>
            <>
              <RootForm />
            </>
          </div>
          <div className="relative hidden self-stretch lg:col-span-2 lg:block">
            <Image
              className="absolute inset-0 h-full w-full object-contain"
              src="/images/marketing-automation/social-icons.svg"
              alt="Marketing Automation"
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MarketingAutomationPage;
