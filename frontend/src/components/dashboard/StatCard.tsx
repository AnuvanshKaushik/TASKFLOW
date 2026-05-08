import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../utils/cn";

type StatCardProps = {
  label: string;
  value: number;
  suffix?: string;
  icon: ReactNode;
  accent: "coral" | "mint" | "violet" | "saffron";
};

const accentClasses = {
  coral: "from-coral/20 to-red-100 text-red-600 dark:from-coral/30 dark:to-coral/5 dark:text-red-100",
  mint: "from-mint/20 to-emerald-100 text-emerald-700 dark:from-mint/30 dark:to-mint/5 dark:text-emerald-100",
  violet: "from-violet/20 to-indigo-100 text-violet dark:from-violet/30 dark:to-violet/5 dark:text-violet-100",
  saffron:
    "from-saffron/25 to-orange-100 text-amber-700 dark:from-saffron/30 dark:to-saffron/5 dark:text-amber-100"
};

export const StatCard = ({ label, value, suffix = "", icon, accent }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 700;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-4xl font-black text-ink dark:text-white">
            {displayValue}
            {suffix}
          </p>
        </div>
        <div className={cn("grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br", accentClasses[accent])}>
          {icon}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-400">
        <ArrowUpRight className="h-4 w-4" />
        Live workspace signal
      </div>
    </motion.div>
  );
};

