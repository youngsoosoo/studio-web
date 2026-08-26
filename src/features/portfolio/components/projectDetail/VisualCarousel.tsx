import { useLayoutEffect, useRef, useState } from 'react';
import type { ProjectCaseVisual } from '../../types';
import { CaseVisualRenderer } from './CaseVisualRenderer';

export function VisualCarousel({ visuals }: { visuals: ProjectCaseVisual[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const activeSlide = slideRefs.current[activeIndex];

    if (!viewport || !activeSlide || visuals.length < 2) {
      return;
    }

    const updateViewportHeight = () => {
      const height = activeSlide.getBoundingClientRect().height;
      if (height > 0) {
        viewport.style.height = `${height}px`;
      }
    };

    updateViewportHeight();

    const resizeObserver = new ResizeObserver(updateViewportHeight);
    resizeObserver.observe(activeSlide);

    return () => resizeObserver.disconnect();
  }, [activeIndex, visuals.length]);

  if (!visuals.length) {
    return null;
  }

  if (visuals.length === 1) {
    return <CaseVisualRenderer visual={visuals[0]} />;
  }

  const moveTo = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, visuals.length - 1));
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.scrollTo({
      left: viewport.clientWidth * nextIndex,
      behavior: 'smooth',
    });
    setActiveIndex(nextIndex);
  };

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport || viewport.clientWidth === 0) {
      return;
    }

    const nextIndex = Math.round(viewport.scrollLeft / viewport.clientWidth);
    setActiveIndex(Math.max(0, Math.min(nextIndex, visuals.length - 1)));
  };

  return (
    <section aria-label="사례 시각 자료">
      <header className="mb-3 flex items-center justify-between gap-4">
        <p className="text-xs font-medium tabular-nums text-slate-500">
          {activeIndex + 1} / {visuals.length}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => moveTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="이전 시각 자료"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-35"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => moveTo(activeIndex + 1)}
            disabled={activeIndex === visuals.length - 1}
            aria-label="다음 시각 자료"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-35"
          >
            →
          </button>
        </div>
      </header>

      <div
        ref={viewportRef}
        onScroll={handleScroll}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveTo(activeIndex - 1);
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveTo(activeIndex + 1);
          }
        }}
        tabIndex={0}
        aria-label="좌우로 이동할 수 있는 시각 자료"
        className="visual-carousel flex items-start snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth transition-[height] duration-300 ease-out motion-reduce:transition-none"
      >
        {visuals.map((visual, index) => (
          <div
            key={visual.id}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
            className="w-full shrink-0 snap-start px-px"
          >
            <CaseVisualRenderer visual={visual} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2" aria-label="시각 자료 페이지">
        {visuals.map((visual, index) => (
          <button
            key={visual.id}
            type="button"
            onClick={() => moveTo(index)}
            aria-label={`${index + 1}번 시각 자료 보기`}
            aria-current={activeIndex === index ? 'true' : undefined}
            className={
              activeIndex === index
                ? 'h-2 w-6 rounded-full bg-slate-900 transition-all'
                : 'h-2 w-2 rounded-full bg-slate-300 transition-all'
            }
          />
        ))}
      </div>
    </section>
  );
}
