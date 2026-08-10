import type { ProjectCaseVisual, ProjectImage } from '../../types';

export function normalizeCaseVisuals(
  visuals: ProjectCaseVisual[] | undefined,
  legacyImages: ProjectImage[] | undefined,
): ProjectCaseVisual[] {
  if (visuals?.length) {
    return [...visuals].sort((left, right) => left.sortOrder - right.sortOrder);
  }

  return (legacyImages ?? []).map((image, index) => ({
    id: -(index + 1),
    type: 'image' as const,
    title: null,
    caption: image.caption,
    src: image.src,
    alt: image.alt,
    payload: null,
    schemaVersion: 1,
    sortOrder: index,
  }));
}
