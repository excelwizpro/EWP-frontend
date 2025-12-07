import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, description, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle ${className}`}
    >
      {(title || description) && (
        <header className="mb-3 space-y-1">
          {title && (
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          )}
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
