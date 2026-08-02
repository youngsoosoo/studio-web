import type { Strength } from '../types';

interface StrengthsSectionProps {
  strengths: Strength[];
}

export function StrengthsSection({ strengths }: StrengthsSectionProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {strengths.map((strength, index) => (
        <li
          key={`${strength.id}-${index}`}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900">{strength.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{strength.description}</p>
        </li>
      ))}
    </ul>
  );
}
