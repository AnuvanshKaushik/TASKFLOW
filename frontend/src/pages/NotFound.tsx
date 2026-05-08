import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";

export const NotFound = () => (
  <div className="grid min-h-[70vh] place-items-center">
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg rounded-[32px] border border-white/60 bg-white/75 p-8 text-center shadow-glow backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
    >
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-aurora-strip">
        <Compass className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-4xl font-black text-ink dark:text-white">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
        This route is outside the current workspace map.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-ink px-4 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-white dark:text-ink dark:hover:bg-slate-100"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to dashboard
      </Link>
    </motion.div>
  </div>
);
