import type { Experience } from '../types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <ol className="space-y-6">
      {experiences.map((experience) => (
        <li
          key={experience.id}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {experience.role}
              <span className="text-slate-400"> · </span>
              <span className="text-slate-700">{experience.company}</span>
            </h3>
            <p className="text-sm text-slate-500">{experience.period}</p>
          </div>
          <p className="mt-1 text-sm text-slate-500">{experience.location}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{experience.summary}</p>

          {experience.achievements.length > 0 ? (
            <ul className="mt-4 space-y-1.5">
              {experience.achievements.map((achievement) => (
                <li key={achievement} className="flex gap-2 text-sm text-slate-600">
                  <span aria-hidden className="mt-1 text-slate-400">
                    ▹
                  </span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
