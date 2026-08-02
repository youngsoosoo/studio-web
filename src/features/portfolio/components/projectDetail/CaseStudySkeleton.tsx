/** Placeholder shown while a project's case study is being fetched. */
export function CaseStudySkeleton() {
  return (
    <div className="animate-pulse space-y-12" aria-busy="true" aria-label="케이스 스터디 불러오는 중">
      <div className="space-y-4">
        <div className="h-3 w-28 rounded bg-slate-200" />
        <div className="h-10 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="aspect-[21/9] w-full rounded-2xl bg-slate-200" />
      </div>
      <div className="lg:flex lg:gap-12">
        <div className="hidden lg:block lg:w-48 lg:shrink-0 lg:space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-4 w-full rounded bg-slate-200" />
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-32 rounded-xl bg-slate-200" />
            <div className="h-32 rounded-xl bg-slate-200" />
          </div>
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
          <div className="h-4 w-2/3 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
