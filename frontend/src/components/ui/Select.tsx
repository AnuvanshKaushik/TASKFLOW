import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <select
        ref={ref}
        className={cn(
          "w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-ink outline-none transition focus:border-violet/50 focus:ring-4 focus:ring-violet/10 dark:border-white/10 dark:bg-white/10 dark:text-white",
          error && "border-coral",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-2 block text-sm text-red-500">{error}</span> : null}
    </label>
  )
);

Select.displayName = "Select";

