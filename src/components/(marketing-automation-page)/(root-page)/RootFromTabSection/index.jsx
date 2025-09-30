import { Button } from "@mui/material";
import Image from "next/image";
import UrlInputField from "./UrlInputField";

const RootFromTabSection = ({
  onSubmit,
  url,
  setUrl,
  isSubmitting,
  progress,
}) => {
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
            <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
              <label className="block w-full space-y-1">
                <div>Website URL</div>
                <UrlInputField
                  value={url}
                  onChange={setUrl}
                  placeholder="http://yourstore/product/service"
                />
              </label>

              <div className="flex items-center justify-between">
                <div className="inline-flex flex-1 items-center gap-4">
                  <Button
                    className="!h-10 !min-w-24"
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting || !url}
                  >
                    {isSubmitting ? "Processing..." : "Continue"}
                  </Button>
                  {isSubmitting && (
                    <div className="bg-muted h-2 w-20 flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="relative hidden self-stretch lg:col-span-2 lg:block">
            <Image
              className="absolute inset-0 h-full w-full object-contain"
              src="/images/marketing-automation/social-icons.png"
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

export default RootFromTabSection;
