import type { About } from '../types';

interface AboutSectionProps {
  about: About;
}

const aboutHighlightTones = [
  { marker: 'text-blue-500', value: 'text-blue-700' },
  { marker: 'text-emerald-500', value: 'text-emerald-700' },
  { marker: 'text-amber-500', value: 'text-amber-700' },
] as const;

const numericValuePattern = /(\d+(?:[.,]\d+)?(?:\s*[~～–—-]\s*\d+(?:[.,]\d+)?)?\s*(?:%|ms|초|분|시간|일|배|건|회|명|개)?)/g;

function highlightNumericValues(text: string, className: string) {
  return text.split(numericValuePattern).map((part, index) => (
    <span key={`${part}-${index}`} className={index % 2 ? className : undefined}>
      {part}
    </span>
  ));
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <div>
      <p className="text-pretty text-lg font-medium text-slate-900">
        {highlightNumericValues(about.headline, 'font-semibold text-blue-700')}
      </p>

      <div className="mt-4 space-y-4">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-slate-600">
            {highlightNumericValues(paragraph, 'font-semibold text-blue-600')}
          </p>
        ))}
      </div>

      {about.highlights.length > 0 ? (
        <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4">
          {about.highlights.map((highlight, index) => {
            const tone = aboutHighlightTones[index % aboutHighlightTones.length];

            return (
              <li key={highlight} className="flex gap-2 text-sm text-slate-600">
                <span aria-hidden className={`mt-1 ${tone.marker}`}>
                  ▹
                </span>
                <span>{highlightNumericValues(highlight, `font-semibold tabular-nums ${tone.value}`)}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
