import type { ReactNode } from 'react';
import { useClipboard } from '../../../shared/lib/useClipboard';

interface CopyButtonProps {
  /** The text written to the clipboard on click. */
  value: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** Message shown in the floating tooltip after a successful copy. */
  copiedLabel?: string;
}

/**
 * A button that copies `value` to the clipboard and shows a brief "복사됨!"
 * tooltip. Used for the email address so clicking copies it instead of opening
 * a mail client.
 */
export function CopyButton({
  value,
  children,
  className,
  ariaLabel,
  copiedLabel = '복사됨!',
}: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      aria-label={ariaLabel}
      className={`relative ${className ?? ''}`}
    >
      {children}
      {copied ? (
        <span
          role="status"
          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow"
        >
          {copiedLabel}
        </span>
      ) : null}
    </button>
  );
}
