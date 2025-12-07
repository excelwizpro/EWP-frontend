import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand";
  const variants: Record<string, string> = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-600",
    ghost:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:text-slate-400"
  };

  return (
    <button
      className={`${base} ${variants[variant]} px-4 py-2 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
