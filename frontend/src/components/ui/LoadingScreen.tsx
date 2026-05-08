import { motion } from "framer-motion";

export const LoadingScreen = () => (
  <div className="grid min-h-screen place-items-center bg-cloud text-ink dark:bg-ink dark:text-white">
    <div className="text-center">
      <motion.div
        className="mx-auto h-14 w-14 rounded-2xl bg-aurora-strip shadow-glow"
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      />
      <p className="mt-4 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-300">
        Syncing TaskFlow AI
      </p>
    </div>
  </div>
);

