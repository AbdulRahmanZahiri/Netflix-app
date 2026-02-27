import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export function PricingCard({
  name,
  price,
  subtitle,
  features,
  cta,
  highlighted
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-6 shadow-soft",
        highlighted && "glow-ring border-cyan/40"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">{name}</h3>
        {highlighted ? (
          <span className="rounded-full bg-cyan/20 px-2 py-1 text-xs font-medium text-cyan">
            Popular
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-3xl font-semibold text-ink">{price}</p>
      <p className="mt-1 text-sm text-slate/70">{subtitle}</p>
      <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-slate/80">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="text-cyan">-</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button className="mt-6" variant={highlighted ? "primary" : "secondary"}>
        {cta}
      </Button>
    </div>
  );
}
