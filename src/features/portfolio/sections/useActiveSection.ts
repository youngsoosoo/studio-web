import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view by observing each section element by
 * id. Returns the id of the section nearest the top of the viewport so the
 * on-this-page nav can highlight it. setState is only called from the observer
 * callback (never synchronously in the effect body).
 */
export function useActiveSection(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  // Join into a stable primitive so the effect re-runs only when the set changes.
  const key = ids.join('|');

  useEffect(() => {
    const sectionIds = key ? key.split('|') : [];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when a section crosses the upper portion of the viewport.
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
