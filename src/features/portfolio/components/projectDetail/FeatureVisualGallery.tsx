import type { ProjectCaseVisual } from '../../types';
import { CaseVisualRenderer } from './CaseVisualRenderer';

interface FeatureVisualGalleryProps {
  caseTitle: string;
  visuals: ProjectCaseVisual[];
}

/**
 * Feature work benefits from seeing every supporting example together. Unlike
 * the problem-case carousel, this gallery keeps all uploaded visuals visible
 * in their API sort order so multiple screenshots can be compared at a glance.
 */
export function FeatureVisualGallery({ caseTitle, visuals }: FeatureVisualGalleryProps) {
  if (!visuals.length) {
    return null;
  }

  return (
    <section aria-label={`${caseTitle} 시각 자료`} className="space-y-5">
      {visuals.map((visual) => (
        <article key={visual.id}>
          {visual.type === 'image' && visual.title ? (
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900">
                {visual.title}
              </h4>
              <span className="shrink-0 text-xs text-slate-400">예시 이미지</span>
            </div>
          ) : null}
          <CaseVisualRenderer visual={visual} />
        </article>
      ))}
    </section>
  );
}
