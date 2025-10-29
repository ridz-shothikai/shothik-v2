import * as motion from "motion/react-client";
import { officeAddress } from "../../_mock/officeAdress";

export default function ContactHero() {
  return (
    <div
      className="relative bg-cover bg-center px-4 sm:px-6 md:px-10 py-10 h-auto sm:h-[560px]"
      style={{
        backgroundImage: "url(/overlay_1.svg), url(/cotact-hero.jpg)",
      }}
    >
      <div className="container mx-auto">
        <div>
          <div className="flex flex-row text-primary">
            {["W", "h", "e", "r", "e"].map((w, i) => (
              <motion.h1
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * (i + 1) }}
                className="text-6xl font-bold"
              >
                {w}
              </motion.h1>
            ))}
          </div>

          <div className="inline-flex flex-row gap-2 text-primary-foreground">
            {["to", "find", "us?"].map((w, i) => (
              <motion.p
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 * (i + 1) }}
                className="text-6xl font-bold"
              >
                {w}
              </motion.p>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3 text-primary-foreground">
            {officeAddress.map((office, i) => (
              <motion.div
                key={office.name}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 * (i + 1) }}
                className="pr-0 md:pr-5"
              >
                <h6 className="text-lg font-semibold">{office.name}</h6>
                <p className="text-sm">{office.address}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
