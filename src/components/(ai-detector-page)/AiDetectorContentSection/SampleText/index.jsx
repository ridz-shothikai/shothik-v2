import { cn } from "@/lib/utils";
import { Dialog } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

const gptModel = [
  { name: "Chat GPT", icon: "/tools/chatgpt.svg", text: "chatgpt" },
  { name: "Claude", icon: "/tools/claude.svg", text: "claude" },
  { name: "Llama", icon: "/tools/llama.svg", text: "llama" },
  { name: "Human", icon: "/tools/human.svg", text: "human" },
];

function SampleTextForMobile({ setOpen }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    function handleScroll() {
      const height = window.innerHeight;
      const scrollHeight = window.scrollY;
      setShow(!(scrollHeight + height - 100 > height));
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed right-5 bottom-2 left-0 z-50`}>
      <div
        className="bg-background mt-3 flex items-center gap-2 rounded-full px-4 py-2 hover:cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="h-6 w-6">
          <Image width={24} height={24} src="/tools/sample.svg" alt="sample" />
        </div>
        <span className="text-foreground">Sample Text</span>
      </div>
    </div>
  );
}

const SampleTextForLarge = ({
  isDrawer = false,
  setOpen,
  handleSampleText,
}) => {
  const handleClick = (text) => {
    handleSampleText(text);
    if (isDrawer) setOpen(false);
  };

  const contentTypes = [
    { label: "AI-generated", color: "#f5c33b" },
    { label: "AI-generated & AI-refined", color: "#fbe7b1" },
    { label: "Human-written & AI-refined", color: "#9fe3a5" },
    { label: "Human-written", color: "#10b91d" },
  ];

  return (
    <div className={cn("relative flex h-full justify-center p-4")}>
      <div className="flex h-full w-full flex-col gap-4">
        <div className="space-y-4">
          <strong className="block font-semibold">Try Sample Text</strong>
          {/* <div className="flex w-full flex-wrap items-center gap-4"> */}
          <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
            {gptModel?.map((item, index) => (
              <button
                key={index}
                onClick={() => handleClick(item.text)}
                className="bg-muted hover:bg-muted/50 flex h-8 cursor-pointer items-center justify-center gap-2 self-stretch rounded-md px-2 py-1 shadow xl:flex-1"
              >
                <div className="size-6 shrink-0 dark:invert">
                  <Image
                    width={24}
                    height={24}
                    src={item?.icon || ""}
                    alt={item?.name}
                  />
                </div>
                <span className="shrink-0 text-sm whitespace-nowrap">
                  {item?.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col space-y-4">
          <div className="space-y-3">
            <strong className="block font-semibold">Try Sample Text</strong>
            <ul className="space-y-2">
              {contentTypes?.map((item, index) => (
                <li key={index}>
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="block text-sm">{item?.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-block text-sm leading-0">
                        ---%
                      </span>
                      <span
                        className="inline-block size-5 rounded-md leading-0"
                        style={{ backgroundColor: item?.color }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <div className={cn("flex items-center gap-1")}>
              <Image
                src="/tools/language.svg"
                alt="language"
                width={20}
                height={20}
                className="max-w-[100px]"
              />
              <span className="text-foreground font-semibold">
                Supported languages:
              </span>
            </div>
            <span className="text-foreground mt-1 mb-2 inline-block">
              English, Bangla, Hindi and 100+ more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function SampleText({ isMobile, isDrawer = false, setOpen, handleSampleText }) {
  if (isMobile) {
    return (
      <>
        <Dialog
          maxWidth="xs"
          fullWidth
          open={isDrawer}
          onClose={() => setOpen(false)}
        >
          <SampleTextForLarge
            isDrawer={true}
            setOpen={setOpen}
            handleSampleText={handleSampleText}
          />
        </Dialog>
        <SampleTextForMobile setOpen={setOpen} />
      </>
    );
  } else {
    return (
      <SampleTextForLarge
        handleSampleText={handleSampleText}
        setOpen={setOpen}
        isDrawer={isDrawer}
      />
    );
  }
}

export default SampleText;
