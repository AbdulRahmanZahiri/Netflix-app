import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {subtitle ? <p className="text-sm text-slate/70">{subtitle}</p> : null}
    </div>
  );
}
