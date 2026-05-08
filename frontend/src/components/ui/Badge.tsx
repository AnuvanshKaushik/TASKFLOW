import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export const Badge = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
      className
    )}
  >
    {children}
  </span>
);

