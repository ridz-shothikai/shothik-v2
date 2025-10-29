import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import Link from "next/link";
import React from "react";

export const BookACall = () => {
  return (
    <div className="p-4 md:p-16 bg-primary/90 text-primary-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-start mb-2 md:mb-0"
        >
          <h2 className="text-2xl md:text-3xl font-semibold leading-8 md:leading-[2.9375rem] w-full md:w-3/5">
            Book a call with our Excellent Team
          </h2>
          <div className="w-full md:w-1/2 h-0.5 bg-primary-foreground" />
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-start gap-6 content-center h-full"
        >
          <p className="text-base">
            Book a 15-minute call with our team to discuss your business goals
          </p>
          <Link href="/contact-us" className="no-underline">
            <Button
              variant="secondary"
              className="h-10"
            >
              Book a Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
