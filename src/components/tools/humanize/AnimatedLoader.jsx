import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const AnimatedChecklist = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Analyzing the Text", checked: false },
    { id: 2, text: "Detecting AI Patterns", checked: false },
    { id: 3, text: "Understanding Semantics", checked: false },
    { id: 4, text: "Recalibrating Tone", checked: false },
    { id: 5, text: "Restructuring Sentences", checked: false },
    { id: 6, text: "Diversifying Word Choice", checked: false },
    { id: 7, text: "Rewriting for Context", checked: false },
    { id: 8, text: "Optimizing Flow and Coherence", checked: false },
    { id: 9, text: "Rechecking AI Detectability", checked: false },
    { id: 10, text: "Polishing Grammar and Style", checked: false },
    { id: 11, text: "Scoring Output Quality", checked: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Check the current first item
      setItems((prevItems) => {
        const newItems = [...prevItems];
        newItems[0].checked = true;
        return newItems;
      });

      // Wait 500ms after checking before moving to end
      setTimeout(() => {
        setItems((prevItems) => {
          const newItems = [...prevItems];
          const checkedItem = newItems.shift(); // Remove first item
          checkedItem.checked = false; // Reset for next cycle
          newItems.push(checkedItem); // Add to end
          return newItems;
        });
      }, 500);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const itemHeight = 62.5; // 250px / 4 items = 62.5px per item

  return (
    <div className="flex max-h-[250px] items-center justify-center p-8">
      <div className="relative w-full max-w-md">
        <div className="relative h-[250px] overflow-hidden">
          {/* Top blur overlay */}
          {/* <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-16 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent"></div> */}

          {/* Bottom blur overlay */}
          {/* <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-16 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent"></div> */}

          {/* Scrollable content */}
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            className="will-change-transform"
          >
            {items.map((item, index) => {
              const isFirst = index === 0;
              const isInView = index < 4;

              return (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-3 px-2"
                  style={{ height: `${itemHeight}px` }}
                  animate={{
                    opacity: isInView ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      item.checked
                        ? "border-emerald-500 bg-emerald-500"
                        : isFirst
                          ? "border-emerald-400"
                          : "border-slate-300"
                    }`}
                    animate={{
                      scale: item.checked
                        ? [1, 1.3, 1]
                        : isFirst
                          ? [1, 1.1, 1]
                          : 1,
                    }}
                    transition={{
                      duration: item.checked ? 0.4 : 1.5,
                      repeat: isFirst && !item.checked ? Infinity : 0,
                    }}
                  >
                    <AnimatePresence>
                      {item.checked && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 600,
                            damping: 20,
                          }}
                        >
                          <Check
                            className="h-3 w-3 text-white"
                            strokeWidth={3}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <span
                    className={`text-xs font-medium transition-all duration-300 md:text-sm ${
                      item.checked
                        ? "text-emerald-600"
                        : isFirst
                          ? "text-slate-800"
                          : "text-slate-400"
                    }`}
                  >
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedChecklist;
