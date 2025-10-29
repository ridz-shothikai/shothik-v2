import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import { toolsCta } from "../../../_mock/toolsCta";
import CTAImages from "./CTAImages";

export default function ToolsCTA({ toolType }) {
  const toolConfig = toolsCta[toolType];

  if (!toolConfig) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-br from-primary/5 to-primary/10 py-16 px-6 md:py-24 md:px-12 rounded-3xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="w-full">
          <Description config={toolConfig} />
        </div>

        <div className="w-full flex justify-center">
          <CTAImages
            title={toolConfig.title}
            lightImage={toolConfig.image.light}
            darkImage={toolConfig.image.dark}
            sx={{
              img: {
                borderRadius: { xs: "8px", md: "0px" },
                width: { xs: "100%", md: "auto" },
                height: { xs: "auto", md: "auto" },
                aspectRatio: { xs: "1 / 1", md: "unset" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Description({ config }) {
  return (
    <div className="w-full text-center md:text-left">
      <motion.p
        initial={{ x: -35, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-xs uppercase tracking-wider text-primary/80 mb-4"
      >
        {config.title}
      </motion.p>

      <motion.h2
        initial={{ x: -40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
      >
        {config.heading}
      </motion.h2>

      <motion.div
        initial={{ x: -45, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="mb-8 text-muted-foreground leading-relaxed"
      >
        {config.description}
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <Button
          size="lg"
          variant="default"
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
        >
          <a href={config.buttonLink}>
            {config.buttonText}
            <ChevronRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
