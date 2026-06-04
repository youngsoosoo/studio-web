import type { Education } from '../types';

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <ol className="space-y-6">
      {education.map((entry) => (
        <li key={entry.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900">{entry.school}</h3>
            <p className="text-sm text-slate-500">{entry.period}</p>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-700">{entry.degree}</p>
          {entry.description ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{entry.description}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
