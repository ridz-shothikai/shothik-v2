import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import { PATH_PAGE, PATH_TOOLS } from "../../config/config/route";

export default function HomeAdvertisement() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-primary to-primary/80 rounded-3xl py-16 md:py-24 px-8 md:px-16 mb-20">
      <Content />
      <Description />
    </div>
  );
}

function Description() {
  return (
    <div className="w-full md:w-1/2 text-center md:text-left px-4 md:px-8">
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-10 leading-tight"
      >
        Get started with
        <br />
        Shothik.ai today
      </motion.h2>

      <motion.div
        initial={{ x: 30, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
      >
        <Button
          size="lg"
          variant="secondary"
          asChild
          className="min-w-[160px] font-semibold"
        >
          <Link href={PATH_PAGE.pricing} rel="noopener">
            Upgrade To Pro
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          asChild
          className="min-w-[180px] border-2 border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-transparent hover:border-primary-foreground hover:text-primary-foreground font-semibold"
        >
          <Link href={PATH_TOOLS.discord} target="_blank" rel="noopener">
            Join Us On Discord
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------

function Content() {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0"
    >
      <motion.div
        animate={{ y: [-20, 0, -20] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="w-full max-w-[320px] md:max-w-[400px]"
      >
        <Image
          height={400}
          width={400}
          className="w-full h-auto"
          alt="Shothik AI Mascot"
          src="/moscot.png"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
