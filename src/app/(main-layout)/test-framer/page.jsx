"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function TestFramerPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [count, setCount] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <motion.div
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-6 text-center text-3xl font-bold text-gray-800"
          variants={itemVariants}
        >
          Modern Framer Motion Test
        </motion.h1>

        <motion.div className="space-y-4" variants={itemVariants}>
          <motion.button
            className="w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setCount(count + 1)}
          >
            Click Me: {count}
          </motion.button>

          <motion.button
            className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsVisible(!isVisible)}
          >
            Toggle Visibility
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="mt-6 rounded-lg bg-gray-100 p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-gray-700"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                This is a modern Framer Motion animation! ✨
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-8 grid grid-cols-3 gap-2"
          variants={itemVariants}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              {i}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
