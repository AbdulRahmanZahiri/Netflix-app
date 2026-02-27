import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: 120,
  md: 160,
  lg: 220
};

export function Logo({ className, size = "md" }: LogoProps) {
  const width = sizes[size];
  const height = Math.round((width * 140) / 560);

  return (
    <img
      src="/brand/scholarflow-logo.svg"
      width={width}
      height={height}
      alt="Scholarflow"
      className={cn("block", className)}
      loading="eager"
    />
  );
}
