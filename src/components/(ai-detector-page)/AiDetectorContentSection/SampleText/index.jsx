import { Dialog } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

const gptModel = [
  { name: "Chat GPT", icon: "/tools/chatgpt.svg", text: "chatgpt" },
  { name: "Claude", icon: "/tools/claude.svg", text: "claude" },
  { name: "Llama", icon: "/tools/llama.svg", text: "llama" },
  { name: "Human", icon: "/tools/human.svg", text: "human" },
];

function SampleTextForMobile({ setOpen, isMini }) {
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
    <div
      className={`fixed right-5 bottom-2 z-50 ${isMini ? "sm:left-[105px]" : "sm:left-[290px]"} left-0`}
    >
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

  return (
    <div className={`relative flex h-full justify-center p-4`}>
      <div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Try Sample Text</h3>
          <div className="flex flex-wrap items-center gap-4">
            {gptModel?.map((item, index) => (
              <button
                key={index}
                onClick={() => handleClick(item.text)}
                className="bg-muted hover:bg-muted/50 flex h-8 cursor-pointer items-center justify-start gap-2 self-stretch px-4 py-1"
              >
                <div className="h-5 w-5 dark:invert">
                  <Image
                    width={20}
                    height={20}
                    src={item?.icon || ""}
                    alt={item?.name}
                  />
                </div>
                <span className="text-sm">{item?.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className={`flex flex-col ${isDrawer ? "items-center" : "items-start"} mt-3`}
        >
          <div
            className={`flex items-center gap-1 ${isDrawer ? "justify-center" : "justify-start"}`}
          >
            <Image
              src="/tools/language.svg"
              alt="language"
              width={100}
              height={100}
              className="max-w-[100px]"
            />
            <span className="text-foreground font-semibold">
              Supported languages:
            </span>
          </div>
          <span className="text-foreground mt-1 mb-2">
            English, Bangla, Hindi and 100+ more
          </span>
        </div>
      </div>
    </div>
  );
};

function SampleText({
  isMobile,
  isDrawer = false,
  setOpen,
  handleSampleText,
  isMini,
}) {
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
        <SampleTextForMobile setOpen={setOpen} isMini={isMini} />
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
