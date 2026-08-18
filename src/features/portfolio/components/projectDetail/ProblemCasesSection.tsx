import type { ReactNode } from 'react';
import type { ProjectProblemCase } from '../../types';
import { Lead, StepNumber } from './primitives';
import { VisualCarousel } from './VisualCarousel';
import { normalizeCaseVisuals } from './visualUtils';

/**
 * "문제 해결" — the heavyweight half of the case study. Every card here earns
 * its size by carrying a diagnosis, the steps taken, and measured results; the
 * lighter implementation work lives in `FeatureCasesSection` instead so the
 * two never read as equivalent.
 */
export function ProblemCasesSection({
  lead,
  cases,
}: {
  lead: string;
  cases: ProjectProblemCase[];
}) {
  return (
    <div className="space-y-7">
      {lead ? <Lead>{lead}</Lead> : null}
      <ol className="space-y-6">
        {cases.map((problemCase, index) => (
          <li key={problemCase.title}>
            <ProblemCaseCard index={index} problemCase={problemCase} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProblemCaseCard({
  index,
  problemCase,
}: {
  index: number;
  problemCase: ProjectProblemCase;
}) {
  const hasResults =
    problemCase.challenges.length ||
    problemCase.outcomes.length ||
    problemCase.metrics.length;
  const visuals = normalizeCaseVisuals(problemCase.visuals, problemCase.images);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-xs font-bold tabular-nums tracking-widest text-white"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Problem {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            {problemCase.title}
          </h3>
        </div>
      </header>

      <div className="divide-y divide-slate-100 px-6">
        <ProblemStage label="문제 정의" tone="problem">
          <p className="text-sm leading-relaxed text-slate-600">
            {problemCase.problemDefinition}
          </p>
        </ProblemStage>

        {problemCase.approach.length ? (
          <ProblemStage label="해결 과정" tone="approach">
            <ol className="space-y-3">
              {problemCase.approach.map((step, stepIndex) => (
                <li key={step} className="flex gap-3">
                  <StepNumber index={stepIndex} />
                  <p className="text-sm leading-relaxed text-slate-600">{step}</p>
                </li>
              ))}
            </ol>
          </ProblemStage>
        ) : null}

        {visuals.length ? (
          <ProblemStage label="구조 변화" tone="architecture">
            <VisualCarousel visuals={visuals} />
          </ProblemStage>
        ) : null}

        {hasResults ? (
          <ProblemStage label="도전 및 성과" tone="outcome">
            <div className="space-y-4">
              {problemCase.challenges.map((challenge) => (
                <div key={challenge.title}>
                  <h4 className="text-sm font-semibold text-slate-900">{challenge.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {challenge.description}
                  </p>
                </div>
              ))}

              {problemCase.outcomes.length ? (
                <ul className="space-y-2">
                  {problemCase.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {problemCase.metrics.length ? (
                <dl className="grid gap-2.5 sm:grid-cols-2">
                  {problemCase.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3"
                    >
                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        {metric.label}
                      </dt>
                      <dd className="mt-1 whitespace-pre-line text-sm font-semibold text-emerald-900">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </ProblemStage>
        ) : null}
      </div>
    </article>
  );
}

function ProblemStage({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'problem' | 'approach' | 'architecture' | 'outcome';
  children: ReactNode;
}) {
  const labelClass = {
    problem: 'text-amber-700',
    approach: 'text-blue-700',
    architecture: 'text-indigo-700',
    outcome: 'text-emerald-700',
  }[tone];

  return (
    <section className="grid gap-3 py-6 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-6">
      <h4 className={`pt-0.5 text-xs font-semibold uppercase tracking-widest ${labelClass}`}>
        {label}
      </h4>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
