import type { TimelineEntry, TimelineType } from '../types';

interface TimelineSectionProps {
  timeline: TimelineEntry[];
}

const TYPE_LABEL: Record<TimelineType, string> = {
  work: '경력',
  education: '학력',
  milestone: '이정표',
};

const TYPE_DOT: Record<TimelineType, string> = {
  work: 'bg-slate-800',
  education: 'bg-emerald-500',
  milestone: 'bg-amber-500',
};

export function TimelineSection({ timeline }: TimelineSectionProps) {
  return (
    <ol className="relative space-y-6 border-l border-slate-200 pl-6">
      {timeline.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            aria-hidden
            className={`absolute -left-[1.6875rem] top-1.5 h-3 w-3 rounded-full ring-4 ring-slate-50 ${TYPE_DOT[entry.type]}`}
          />
          <div className="flex flex-wrap items-baseline gap-x-3">
            <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {TYPE_LABEL[entry.type]}
            </span>
            <p className="text-xs text-slate-400">{entry.date}</p>
          </div>
          <p className="mt-1 text-sm text-slate-600">{entry.description}</p>
        </li>
      ))}
    </ol>
  );
}
