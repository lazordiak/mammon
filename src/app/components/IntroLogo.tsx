"use client";

import { motion } from "framer-motion";

export const IntroLogo = () => {
  return (
    <motion.div
      initial={{ translateY: "40vh" }}
      animate={{ translateY: "-50vh" }}
      transition={{ delay: 5, duration: 3, ease: "easeIn" }}
      className="flex absolute flex-col items-center justify-center"
    >
      <p className={`text-8xl lg:text-8xl demonic-text demonic-anim`}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0, duration: 0.1 }}
        >
          M
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.1 }}
        >
          A
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.1 }}
        >
          M
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.1 }}
        >
          M
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.1 }}
        >
          O
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.1 }}
        >
          N
        </motion.span>
      </p>
      <p className={`text-8xl lg:text-8xl demonic-text demonic-anim`}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.1 }}
        >
          .
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 0.1 }}
        >
          e
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 0.1 }}
        >
          x
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5, duration: 0.1 }}
        >
          e
        </motion.span>
      </p>
    </motion.div>
  );
};
