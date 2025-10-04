import { Button } from "@mui/material";
import Image from "next/image";
import UrlInputField from "./UrlInputField";

const RootFromTabSection = ({ onSubmit, error, url, setUrl, isSubmitting }) => {
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
                {error && (
                  <div className="border-destructive border/50 bg-destructive/5 mt-4 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg
                        className="text-destructive mt-0.5 mr-3 h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-destructive text-sm font-medium">
                          Error occurred
                        </h3>
                        <p className="text-destructive mt-1 text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
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
