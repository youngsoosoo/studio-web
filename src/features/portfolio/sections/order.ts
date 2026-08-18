import type { SectionKey } from './registry';

/**
 * The page's section order. Edit this array to reorder, add, or remove sections
 * — both the page body and the on-this-page nav follow it. Only keys defined in
 * SECTION_REGISTRY are allowed (the type enforces it), and each carries its own
 * layout/CSS. A section with no data is skipped automatically.
 *
 * Example: to surface 강점 again, insert 'strengths' wherever you want it.
 */
export const SECTION_ORDER: SectionKey[] = [
  'about',
  'achievements',
  'experiences',
  'projects',
  'expertise',
  'education',
  'awards',
  'certifications',
];
