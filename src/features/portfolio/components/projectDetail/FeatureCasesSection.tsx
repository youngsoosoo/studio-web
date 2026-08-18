import type { ReactNode } from 'react';
import type { ProjectProblemCase } from '../../types';
import { FeatureVisualGallery } from './FeatureVisualGallery';
import { normalizeCaseVisuals } from './visualUtils';

/**
 * Feature work uses its own full-width implementation narrative. The blue
 * header and implementation-oriented stages keep it distinct from the
 * diagnosis/result vocabulary used by `ProblemCasesSection`.
 */
export function FeatureCasesSection({ cases }: { cases: ProjectProblemCase[] }) {
  return (
    <ol className="space-y-6">
      {cases.map((featureCase, index) => (
        <li key={featureCase.title}>
          <FeatureCaseCard index={index} featureCase={featureCase} />
        </li>
      ))}
    </ol>
  );
}

function FeatureCaseCard({
  index,
  featureCase,
}: {
  index: number;
  featureCase: ProjectProblemCase;
}) {
  const visuals = normalizeCaseVisuals(featureCase.visuals, featureCase.images);
  const hasResults =
    featureCase.challenges.length ||
    featureCase.outcomes.length ||
    featureCase.metrics.length;
  const ordinal = String(index + 1).padStart(2, '0');

  return (
    <article className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <header className="flex items-center gap-4 border-b border-blue-100 bg-blue-50/70 px-6 py-5">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-xs font-bold tabular-nums tracking-widest text-white"
        >
          {ordinal}
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-500">
            Feature {ordinal}
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            {featureCase.title}
          </h3>
        </div>
      </header>

      <div className="divide-y divide-slate-100 px-6">
        <FeatureStage label="구현 개요" tone="overview">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {featureCase.problemDefinition}
          </p>
        </FeatureStage>

        {featureCase.approach.length ? (
          <FeatureStage label="핵심 구현" tone="implementation">
            <ol className="space-y-3">
              {featureCase.approach.map((step, stepIndex) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 font-semibold tabular-nums tracking-widest text-blue-400"
                  >
                    {String(stepIndex + 1).padStart(2, '0')}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </FeatureStage>
        ) : null}

        {visuals.length ? (
          <FeatureStage label="구성 및 예시" tone="visual">
            <FeatureVisualGallery caseTitle={featureCase.title} visuals={visuals} />
          </FeatureStage>
        ) : null}

        {hasResults ? (
          <FeatureStage label="적용 결과" tone="result">
            <div className="space-y-4">
              {featureCase.challenges.map((challenge) => (
                <div key={challenge.title}>
                  <h4 className="text-sm font-semibold text-slate-900">{challenge.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {challenge.description}
                  </p>
                </div>
              ))}

              {featureCase.outcomes.length ? (
                <ul className="space-y-2">
                  {featureCase.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {featureCase.metrics.length ? (
                <dl className="grid gap-2.5 sm:grid-cols-2">
                  {featureCase.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"
                    >
                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                        {metric.label}
                      </dt>
                      <dd className="mt-1 whitespace-pre-line text-sm font-semibold text-blue-950">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </FeatureStage>
        ) : null}
      </div>
    </article>
  );
}

function FeatureStage({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'overview' | 'implementation' | 'visual' | 'result';
  children: ReactNode;
}) {
  const labelClass = {
    overview: 'text-blue-700',
    implementation: 'text-cyan-700',
    visual: 'text-indigo-700',
    result: 'text-sky-700',
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
