import type { Profile } from '../types';
import type { NavItem } from './OnThisPageNav';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  profile: Profile;
  /** Same section list the on-this-page nav uses; rendered as quick links. */
  navItems: NavItem[];
}

/**
 * Page footer: a compact profile block, in-page navigation, and social links.
 * Lives at the end of the content column so it doubles as the scroll track that
 * keeps the sticky on-this-page nav pinned through the final sections.
 */
export function Footer({ profile, navItems }: FooterProps) {
  const initial = profile.name.trim().charAt(0) || '?';
  const year = new Date().getFullYear();

  return (
    <footer data-pdf-page-section className="mt-16 border-t border-slate-200 pt-12">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-lg font-semibold text-slate-400">
              {initial}
            </span>
            <div>
              <p className="text-base font-semibold text-slate-900">{profile.name}</p>
              <p className="text-xs text-slate-500">{profile.title}</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-slate-500">
            {profile.tagline}
          </p>
          {profile.socials.length > 0 ? (
            <div className="mt-5">
              <SocialLinks socials={profile.socials} variant="chip" />
            </div>
          ) : null}
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-sm font-semibold text-slate-900">둘러보기</p>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-slate-500 transition hover:text-slate-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-slate-900">소셜</p>
          <div className="mt-4">
            <SocialLinks socials={profile.socials} variant="text" />
          </div>
        </div>
      </div>

      <p className="mt-12 border-t border-slate-100 pt-6 text-xs text-slate-400">
        © {year} {profile.name}. All rights reserved.
      </p>
    </footer>
  );
}
