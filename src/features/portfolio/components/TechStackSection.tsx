import type { TechStackGroup } from '../types';

interface TechStackSectionProps {
  techStack: TechStackGroup[];
}

export function TechStackSection({ techStack }: TechStackSectionProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {techStack.map((group) => (
        <div key={group.category} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            {group.category}
          </h3>
          <ul className="mt-4 space-y-3">
            {group.items.map((item) => (
              <li key={item.name} className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
                {typeof item.level === 'number' ? (
                  <span className="flex gap-1" role="img" aria-label={`숙련도 ${item.level} / 5`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={
                          i < (item.level ?? 0)
                            ? 'h-1.5 w-1.5 rounded-full bg-slate-800'
                            : 'h-1.5 w-1.5 rounded-full bg-slate-200'
                        }
                      />
                    ))}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
