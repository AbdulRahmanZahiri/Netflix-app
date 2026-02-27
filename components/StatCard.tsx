import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  trend?: string;
  className?: string;
};

export function StatCard({ title, value, trend, className }: StatCardProps) {
  return (
    <div className={cn("surface-card rounded-xl p-5 shadow-soft", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate/70">
        {title}
      </p>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-semibold text-ink">{value}</span>
        {trend ? (
          <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs font-medium text-cyan">
            {trend}
          </span>
        ) : null}
      </div>
    </div>
  );
}
