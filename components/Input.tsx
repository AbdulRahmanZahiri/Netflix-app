import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
};

export function Input({ label, helper, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate/80">
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        className={cn(
          "h-11 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-ink shadow-soft outline-none transition focus:border-cyan",
          className
        )}
        {...props}
      />
      {helper ? <span className="text-xs text-slate/60">{helper}</span> : null}
    </label>
  );
}
