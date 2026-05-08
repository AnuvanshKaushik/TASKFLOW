import { cn } from "../../utils/cn";

export const ProgressBar = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn("h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10", className)}>
    <div
      className="h-full rounded-full bg-gradient-to-r from-coral via-saffron to-mint transition-all duration-500"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

