import * as motion from "motion/react-client";
import Image from "next/image";
import { whyChooseUs } from "../../_mock/b2b/whychooseusdata";

export const WhyChooseUsSection = () => (
  <div className="grid grid-cols-1 bg-primary text-primary-foreground md:h-[40rem] md:grid-cols-12 pt-4 md:pt-0">
    <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center border-b border-border md:border-b-0 md:border-r p-4 md:p-10">
      <motion.p
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center text-5xl font-semibold leading-none md:text-[6rem]"
      >
        Why{" "}
        <Image
          src="/b2b/icon-1.svg"
          alt="icon"
          width={56}
          height={56}
          className="inline-block h-14 w-14 flex-shrink-0 object-cover object-center"
        />{" "}
        choose us?
      </motion.p>
    </div>
    <div className="col-span-12 md:col-span-8 h-full w-full">
      <div className="grid h-full w-full grid-cols-1 md:grid-cols-2">
        {whyChooseUs.map((item, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center border-b border-r border-border p-4"
          >
            <Image src={item.icon} alt={item.title} width={60} height={45} />
            <p className="mt-8 mb-4 text-center text-2xl font-bold text-primary-foreground">
              {item.title}
            </p>
            <p className="mx-auto text-center text-sm font-normal text-primary-foreground/80 md:w-[22.75rem] md:text-base">
              {item.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
