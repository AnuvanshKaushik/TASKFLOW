import type { ReactNode } from "react";
import { motion } from "framer-motion";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-[28px] border border-dashed border-slate-300 bg-white/60 p-10 text-center shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/[0.04]"
  >
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-aurora-strip text-ink dark:text-white">
      {icon}
    </div>
    <h3 className="mt-5 text-lg font-bold text-ink dark:text-white">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
      {description}
    </p>
    {action ? <div className="mt-6">{action}</div> : null}
  </motion.div>
);

