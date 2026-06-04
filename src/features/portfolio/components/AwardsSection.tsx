import type { Award } from '../types';

interface AwardsSectionProps {
  awards: Award[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <ul className="space-y-4">
      {awards.map((award) => (
        <li key={award.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900">{award.title}</h3>
            <p className="text-sm text-slate-500">{award.date}</p>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-700">{award.issuer}</p>
          {award.description ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{award.description}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
