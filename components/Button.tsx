import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gradient-to-r from-cyan to-accent text-midnight hover:opacity-90 shadow-soft",
  secondary:
    "bg-white/10 text-ink border border-white/10 hover:border-white/20",
  ghost: "bg-transparent text-slate hover:bg-white/5"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base"
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
    variants[variant],
    sizes[size],
    className
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props} />
  );
}
