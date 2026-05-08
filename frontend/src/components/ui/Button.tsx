import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-white dark:text-ink dark:hover:bg-slate-100",
  secondary:
    "border border-slate-200 bg-white text-ink hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
  danger:
    "bg-coral text-white shadow-soft hover:-translate-y-0.5 hover:bg-red-500 dark:bg-coral dark:hover:bg-red-500"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 gap-2 rounded-xl px-3 text-sm",
  md: "h-11 gap-2 rounded-2xl px-4 text-sm",
  lg: "h-12 gap-2 rounded-2xl px-5 text-base",
  icon: "h-10 w-10 rounded-xl p-0"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-violet/30 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  )
);

Button.displayName = "Button";

