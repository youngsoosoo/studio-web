import type { Achievement } from '../types';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  return (
    <ul className="space-y-4">
      {achievements.map((achievement) => (
        <li
          key={achievement.id}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900">{achievement.title}</h3>
            {achievement.metric ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {achievement.metric}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{achievement.description}</p>
        </li>
      ))}
    </ul>
  );
}
