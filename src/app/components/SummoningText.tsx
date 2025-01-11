import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { metal } from "../utils/gptUtils";

interface SummoningTextProps {
  entity: string;
  animFinished: boolean;
  setAnimFinished: (finished: boolean) => void;
}

export const SummoningText: FC<SummoningTextProps> = ({
  entity,
  animFinished,
  setAnimFinished,
}) => {
  if (animFinished) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [1, 0],
          transition: { duration: 1, repeat: 4, ease: "easeInOut", delay: 7 },
        }}
        onAnimationComplete={() => setAnimFinished(true)}
        exit={{ opacity: 0 }}
        className={`text-center text-3xl text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-orange-600 animate-glow ${metal.className}`}
      >
        Summoning {entity}
      </motion.div>
    </AnimatePresence>
  );
};
