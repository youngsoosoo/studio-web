import type { SocialLink } from '../types';
import { CopyButton } from './CopyButton';

type Variant = 'chip' | 'icon' | 'text';

const LIST_CLASS: Record<Variant, string> = {
  chip: 'flex flex-wrap items-center gap-2',
  icon: 'flex gap-2',
  text: 'space-y-2.5',
};

const ITEM_CLASS: Record<Variant, string> = {
  chip: 'inline-flex min-h-7 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-center text-sm font-medium leading-none text-slate-700 transition hover:border-slate-300 hover:bg-slate-50',
  icon: 'flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50',
  text: 'text-sm text-slate-500 transition hover:text-slate-900',
};

function isEmail(social: SocialLink): boolean {
  return social.icon === 'mail' || social.url.startsWith('mailto:');
}

function emailAddress(social: SocialLink): string {
  return social.url.replace(/^mailto:/, '');
}

interface SocialLinksProps {
  socials: SocialLink[];
  variant?: Variant;
}

/**
 * Renders social links in one of three visual variants. Email entries become a
 * copy-to-clipboard button (with "복사됨!" feedback) instead of a mailto link.
 */
export function SocialLinks({ socials, variant = 'chip' }: SocialLinksProps) {
  if (socials.length === 0) {
    return null;
  }

  return (
    <ul className={LIST_CLASS[variant]}>
      {socials.map((social) => {
        const content = (
          <span data-pdf-pill-text data-pdf-pill-latin className="relative -top-px">
            {variant === 'icon' ? social.label.charAt(0) : social.label}
          </span>
        );
        return (
          <li key={social.label}>
            {isEmail(social) ? (
              <CopyButton
                value={emailAddress(social)}
                ariaLabel={`이메일 주소 복사: ${emailAddress(social)}`}
                className={ITEM_CLASS[variant]}
                dataPdfPill={variant === 'chip'}
                dataPdfCopyText={variant === 'chip' ? emailAddress(social) : undefined}
              >
                {content}
              </CopyButton>
            ) : (
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={variant === 'icon' ? social.label : undefined}
                data-pdf-pill={variant === 'chip' ? '' : undefined}
                className={ITEM_CLASS[variant]}
              >
                {content}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
