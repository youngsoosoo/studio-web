import type { ProjectProblemCase } from '../../types';

/**
 * "기능 구현" — routine implementation work, kept deliberately light so it never
 * competes with the measured cases in `ProblemCasesSection`. No ordinal badge,
 * no labelled stages, and no emerald metric chips: that vocabulary is reserved
 * for work with a real before/after, and reusing it here would flatten the
 * distinction the two sections exist to make.
 */
export function FeatureCasesSection({ cases }: { cases: ProjectProblemCase[] }) {
  return (
    <ul className="grid items-start gap-4 md:grid-cols-2">
      {cases.map((featureCase) => (
        <li
          key={featureCase.title}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <h3 className="text-base font-semibold tracking-tight text-slate-900">
            {featureCase.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {featureCase.problemDefinition}
          </p>

          {featureCase.approach.length ? (
            <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
              {featureCase.approach.map((step) => (
                <li key={step} className="flex gap-2.5 text-sm leading-relaxed text-slate-500">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-300"
                  />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
