import { cn } from "../../utils/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-2xl bg-slate-200/80 dark:bg-white/10", className)} />
);

export const DashboardSkeleton = () => (
  <div className="grid gap-4">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-32" />
      ))}
    </div>
    <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
    <Skeleton className="h-72" />
  </div>
);

