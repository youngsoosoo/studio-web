import type { ReactNode } from 'react';

/** Section-opening paragraph, set off by a rule on the left. */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-slate-900 pl-5 text-base leading-relaxed text-slate-700">
      {children}
    </p>
  );
}

/** Two-digit ordinal chip, e.g. "01". */
export function StepNumber({ index }: { index: number }) {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-xs font-semibold tabular-nums tracking-widest text-slate-400"
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  );
}
