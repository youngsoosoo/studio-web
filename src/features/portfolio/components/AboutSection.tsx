import type { About } from '../types';

interface AboutSectionProps {
  about: About;
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <div>
      <p className="text-pretty text-lg font-medium text-slate-900">{about.headline}</p>

      <div className="mt-4 space-y-4">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-slate-600">
            {paragraph}
          </p>
        ))}
      </div>

      {about.highlights.length > 0 ? (
        <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4">
          {about.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2 text-sm text-slate-600">
              <span aria-hidden className="mt-1 text-slate-400">
                ▹
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
