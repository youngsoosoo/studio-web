import { useState } from 'react';

interface ProjectCoverProps {
  src: string | null;
  title: string;
  /** Tailwind aspect ratio class — cards use video, the page hero uses a wider crop. */
  aspect?: string;
  fit?: 'cover' | 'contain';
  className?: string;
}

/**
 * A project's cover image, shared by the project card and the case-study page
 * hero. Falls back to a titled gradient panel when there is no thumbnail or the
 * file fails to load, so a project without an uploaded image still reads as a
 * deliberate card rather than a hole in the layout.
 */
export function ProjectCover({
  src,
  title,
  aspect = 'aspect-video',
  fit = 'cover',
  className = '',
}: ProjectCoverProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src !== null && !failed;

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${aspect} ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={`${title} 커버 이미지`}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-6"
        >
          <span className="text-center text-lg font-semibold tracking-tight text-white/90">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
