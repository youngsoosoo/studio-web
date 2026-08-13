import type { ProjectSummary } from './types';

const FOCUS_COVER_SRC = '/projects/focus-business-flow-v2.png';

/** Keeps the FOCUS cover consistent while its thumbnail is managed outside the API. */
export function getProjectCoverSrc(
  project: Pick<ProjectSummary, 'id' | 'title' | 'thumbnailUrl'>,
) {
  const isFocusProject =
    project.id.trim().toLowerCase() === 'focus' ||
    project.title.trim().toLowerCase().startsWith('focus');

  return isFocusProject ? FOCUS_COVER_SRC : project.thumbnailUrl;
}
