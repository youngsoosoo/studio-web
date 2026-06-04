import { useState } from 'react';
import type { Profile } from '../types';
import { SocialLinks } from './SocialLinks';

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <header className="flex flex-col items-start gap-6 py-12 sm:flex-row sm:items-center sm:gap-8">
      <Avatar name={profile.name} src={profile.avatarUrl} />

      <div className="min-w-0">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
          {profile.title}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg text-slate-600">{profile.tagline}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span aria-label="location">📍 {profile.location}</span>
          {profile.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              className="font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              이력서 다운로드
            </a>
          ) : null}
        </div>

        {profile.socials.length > 0 ? (
          <div className="mt-5">
            <SocialLinks socials={profile.socials} variant="chip" />
          </div>
        ) : null}
      </div>
    </header>
  );
}

/**
 * Square photo slot. The space is always reserved; when no usable image is
 * present (missing URL or a failed load) it falls back to the name's initial
 * so the layout stays intact even without a photo.
 */
function Avatar({ name, src }: { name: string; src: string | null }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  const initial = name.trim().charAt(0) || '?';

  return (
    <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-40 sm:w-40">
      {showImage ? (
        <img
          src={src as string}
          alt={`${name} 프로필 사진`}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400"
          aria-label="프로필 사진 자리"
        >
          <span className="text-4xl font-semibold text-slate-300 sm:text-5xl">{initial}</span>
          <span className="text-[11px] font-medium uppercase tracking-widest">Photo</span>
        </div>
      )}
    </div>
  );
}
