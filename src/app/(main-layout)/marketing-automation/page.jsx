import React from 'react';
import RootForm from "../../../components/marketing-automation/RootForm";
import Image from 'next/image';

const MarketingAutomationPage = () => {
    return (
      <main className="min-h-[calc(100vh-100px)] p-6 relative flex bg-card flex-col">
        <div className="max-w-5xl w-full mx-auto flex-grow flex flex-col">
          <div className="my-auto grid lg:grid-cols-5">
            <div className="py-4 lg:col-span-3 space-y-6">
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
            <div className="hidden relative self-stretch lg:block lg:col-span-2">
              <Image
                className="h-full absolute inset-0 w-full object-contain"
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