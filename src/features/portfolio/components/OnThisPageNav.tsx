import type { ReactNode } from 'react';
import { useActiveSection } from '../sections/useActiveSection';

export interface NavItem {
  id: string;
  label: string;
}

interface OnThisPageNavProps {
  items: NavItem[];
  /** Optional block rendered inside the sticky column, below the list. */
  footer?: ReactNode;
}

/**
 * Sticky "on this page" table of contents. Hidden below lg; highlights the
 * section currently in view and smooth-scrolls to a section on click.
 */
export function OnThisPageNav({ items, footer }: OnThisPageNavProps) {
  const activeId = useActiveSection(items.map((item) => item.id));

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="On this page"
      className="hidden lg:block lg:w-48 lg:shrink-0 lg:self-start lg:sticky lg:top-24"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        On this page
      </p>
      <ul className="space-y-1 border-l border-slate-200">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'true' : undefined}
                className={
                  active
                    ? '-ml-px block border-l-2 border-slate-900 bg-slate-100 py-1.5 pl-4 text-sm font-semibold text-slate-900'
                    : '-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-800'
                }
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </nav>
  );
}
