import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type BaseFieldProps = {
  label: string;
  error?: string;
  hint?: string;
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & BaseFieldProps;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & BaseFieldProps;

const fieldClasses =
  "w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-violet/50 focus:ring-4 focus:ring-violet/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-slate-500";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <input ref={ref} className={cn(fieldClasses, error && "border-coral", className)} {...props} />
      {error ? <span className="mt-2 block text-sm text-red-500">{error}</span> : null}
      {!error && hint ? (
        <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>
      ) : null}
    </label>
  )
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <textarea
        ref={ref}
        className={cn(fieldClasses, "min-h-32 resize-y", error && "border-coral", className)}
        {...props}
      />
      {error ? <span className="mt-2 block text-sm text-red-500">{error}</span> : null}
      {!error && hint ? (
        <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>
      ) : null}
    </label>
  )
);

Textarea.displayName = "Textarea";

