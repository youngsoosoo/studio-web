import { useRef, useState } from 'react';

export interface UseClipboardResult {
  copied: boolean;
  copy: (text: string) => void;
}

/**
 * Copies text to the clipboard and exposes a transient `copied` flag (auto-resets
 * after `resetMs`) for "Copied!" feedback. Uses the async Clipboard API with a
 * legacy execCommand fallback for non-secure contexts. setState is only called
 * from event/promise callbacks, never in an effect body.
 */
export function useClipboard(resetMs = 1500): UseClipboardResult {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const markCopied = () => {
    setCopied(true);
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setCopied(false), resetMs);
  };

  const copy = (text: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(markCopied)
        .catch(() => {
          if (fallbackCopy(text)) {
            markCopied();
          }
        });
    } else if (fallbackCopy(text)) {
      markCopied();
    }
  };

  return { copied, copy };
}

function fallbackCopy(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
