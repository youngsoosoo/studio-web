import type { ReactNode } from 'react';

interface SectionProps {
  /** Anchor id; must equal the section key so the TOC can link to it. */
  id: string;
  title: string;
  /** Optional short label rendered above the title. */
  eyebrow?: string;
  children: ReactNode;
}

/**
 * Consistent section shell: label (eyebrow + title) on the left, value/content
 * on the right (resume-style two columns) on >= md; stacked on mobile. The
 * `id` doubles as the scroll anchor target for the on-this-page nav.
 */
export function Section({ id, title, eyebrow, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-24 border-t border-slate-200 py-12 first:border-t-0 md:grid md:grid-cols-[10rem_1fr] md:gap-10"
    >
      <div className="md:self-start">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{eyebrow}</p>
        ) : null}
        <h2 id={headingId} className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      </div>
      <div className="mt-6 md:mt-0">{children}</div>
    </section>
  );
}
