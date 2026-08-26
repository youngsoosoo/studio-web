import type { ProjectCaseVisual } from '../../types';
import { VisualCarousel } from './VisualCarousel';

interface FeatureVisualGalleryProps {
  caseTitle: string;
  visuals: ProjectCaseVisual[];
}

/** Keeps feature visuals compact with the same paging interaction as problem cases. */
export function FeatureVisualGallery({ caseTitle, visuals }: FeatureVisualGalleryProps) {
  if (!visuals.length) {
    return null;
  }

  return (
    <section aria-label={`${caseTitle} 시각 자료`}>
      <VisualCarousel visuals={visuals} />
    </section>
  );
}
