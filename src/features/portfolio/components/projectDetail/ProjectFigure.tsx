import { useState } from 'react';
import type { ProjectImage } from '../../types';

function getLocalFallback(src: string) {
  try {
    const filename = new URL(src).pathname.split('/').pop();
    return filename ? `/projects/${filename}` : null;
  } catch {
    return null;
  }
}

/** Renders an uploaded figure, falling back to a bundled project asset when available. */
export function ProjectFigure({ image }: { image: ProjectImage }) {
  const [src, setSrc] = useState(image.src);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  const handleError = () => {
    const fallback = getLocalFallback(image.src);
    if (fallback && src !== fallback) {
      setSrc(fallback);
      return;
    }
    setFailed(true);
  };

  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <img
        src={src}
        alt={image.alt}
        loading="lazy"
        onError={handleError}
        className="w-full"
      />
      {image.caption ? (
        <figcaption className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
