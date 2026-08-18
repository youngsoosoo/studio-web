import { useRef, useState } from 'react';
import { Footer, HeroSection, OnThisPageNav, Section } from '../features/portfolio/components';
import type { NavItem } from '../features/portfolio/components/OnThisPageNav';
import { SECTION_ORDER } from '../features/portfolio/sections/order';
import { SECTION_REGISTRY } from '../features/portfolio/sections/registry';
import type { PortfolioResponse } from '../features/portfolio/types';
import { usePortfolio } from '../features/portfolio/usePortfolio';

export function HomePage() {
  const { data, loading, error } = usePortfolio();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {loading ? <PortfolioSkeleton /> : null}

      {!loading && error ? <PortfolioError message={error} /> : null}

      {!loading && !error && !data ? <PortfolioEmpty /> : null}

      {!loading && !error && data ? <Portfolio data={data} /> : null}
    </main>
  );
}

function Portfolio({ data }: { data: PortfolioResponse }) {
  const [resumeDownloading, setResumeDownloading] = useState(false);
  const resumeContentRef = useRef<HTMLDivElement>(null);

  // Only sections that exist in the data, in the configured order.
  const visibleKeys = SECTION_ORDER.filter((key) => SECTION_REGISTRY[key].available(data));

  const navItems: NavItem[] = visibleKeys
    .filter((key) => SECTION_REGISTRY[key].inNav !== false)
    .map((key) => ({ id: key, label: SECTION_REGISTRY[key].navLabel }));

  const handleResumeDownload = async () => {
    if (resumeDownloading) {
      return;
    }

    setResumeDownloading(true);
    try {
      if (!resumeContentRef.current) {
        throw new Error('Resume content is not mounted.');
      }

      const { downloadResumePdf } = await import('../features/portfolio/pdf/downloadResumePdf');
      await downloadResumePdf(resumeContentRef.current, data.profile.name);
    } catch (error) {
      console.error('Failed to generate resume PDF', error);
      window.alert('PDF를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setResumeDownloading(false);
    }
  };

  return (
    <div className="lg:flex lg:items-start lg:gap-12">
      {/* The footer sits at the end of this column so it doubles as the scroll
          track that keeps the sticky on-this-page nav pinned through the final
          sections. */}
      <div ref={resumeContentRef} data-resume-capture-root className="min-w-0 flex-1">
        <HeroSection
          profile={data.profile}
          resumeDownloading={resumeDownloading}
          onDownloadResume={handleResumeDownload}
        />
        {visibleKeys.map((key) => {
          const def = SECTION_REGISTRY[key];
          return (
            <Section key={key} id={key} title={def.title} eyebrow={def.eyebrow}>
              {def.render(data)}
            </Section>
          );
        })}
        <Footer profile={data.profile} navItems={navItems} />
      </div>

      <OnThisPageNav items={navItems} />
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="포트폴리오 불러오는 중">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="h-12 w-2/3 rounded bg-slate-200" />
      <div className="h-4 w-1/2 rounded bg-slate-200" />
      <div className="grid gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-40 rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

function PortfolioError({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <h1 className="text-lg font-semibold text-red-900">콘텐츠를 불러오지 못했습니다</h1>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      <p className="mt-1 text-xs text-red-500">
        studio-api 서버와 데이터베이스가 실행 중인지 확인해 주세요.
      </p>
    </div>
  );
}

function PortfolioEmpty() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-500">
      표시할 포트폴리오 콘텐츠가 없습니다.
    </div>
  );
}
