import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OnThisPageNav } from '../features/portfolio/components';
import type { NavItem } from '../features/portfolio/components/OnThisPageNav';
import { CaseStudySkeleton } from '../features/portfolio/components/projectDetail/CaseStudySkeleton';
import { ProjectCover } from '../features/portfolio/components/projectDetail/ProjectCover';
import { ProjectFigure } from '../features/portfolio/components/projectDetail/ProjectFigure';
import type { ProjectDetail, ProjectProblemCase } from '../features/portfolio/types';
import { useProjectDetail } from '../features/portfolio/useProjectDetail';

/**
 * Standalone case study at `/projects/:id`. Replaces the old modal: a wide hero,
 * a sticky section nav, and one long scrollable column, so a project can carry
 * architecture diagrams and a full problem → approach → outcome narrative.
 *
 * Everything comes from a single `GET /api/portfolio/projects/{id}` — the
 * response embeds the card summary — so the page never refetches the portfolio.
 */
export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const { data: detail, loading } = useProjectDetail(id);

  // Arriving from a card leaves the window scrolled to the projects section.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <BackLink />

      {loading ? <CaseStudySkeleton /> : null}
      {!loading && !detail ? <CaseStudyMissing /> : null}
      {!loading && detail ? <CaseStudy detail={detail} /> : null}
    </main>
  );
}

function BackLink() {
  return (
    <Link
      to="/#projects"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
    >
      ← 프로젝트 목록
    </Link>
  );
}

function CaseStudy({ detail }: { detail: ProjectDetail }) {
  const { project } = detail;
  const images = detail.images ?? [];
  const problemCases = detail.problemCases ?? [];
  const hasNestedProblemCases = problemCases.some(
    (problemCase) =>
      problemCase.approach.length ||
      problemCase.challenges.length ||
      problemCase.outcomes.length ||
      problemCase.metrics.length,
  );

  // Only sections that have content, so the sticky nav never links to a gap.
  const sections: { id: string; label: string; render: () => ReactNode }[] = [
    {
      id: 'overview',
      label: '개요',
      render: () => <Overview detail={detail} />,
    },
    ...(detail.contributions.length || detail.metrics.length
      ? [
          {
            id: 'role-metrics',
            label: '역할 · 핵심 지표',
            render: () => <RoleMetrics detail={detail} />,
          },
        ]
      : []),
    ...(images.length
      ? [
          {
            id: 'architecture',
            label: '아키텍처',
            render: () => (
              <div className="space-y-6">
                {images.map((image) => (
                  <ProjectFigure key={image.src} image={image} />
                ))}
              </div>
            ),
          },
        ]
      : []),
    ...(hasNestedProblemCases
      ? [
          {
            id: 'problem-solving',
            label: '문제 해결',
            render: () => <ProblemCasesSection lead={detail.problem} cases={problemCases} />,
          },
        ]
      : [
          ...(detail.problem || detail.problems.length
            ? [
                {
                  id: 'problem',
                  label: '문제 정의',
                  render: () => (
                    <div className="space-y-6">
                      {detail.problem ? <Lead>{detail.problem}</Lead> : null}
                      {detail.problems.length ? (
                        <ol className="space-y-4">
                          {detail.problems.map((problem, index) => (
                            <li key={problem.title}>
                              <NumberedCard
                                index={index}
                                title={problem.title}
                                description={problem.description}
                              />
                            </li>
                          ))}
                        </ol>
                      ) : null}
                    </div>
                  ),
                },
              ]
            : []),
          ...(detail.approach.length
            ? [
                {
                  id: 'approach',
                  label: '해결 과정',
                  render: () => (
                    <ol className="space-y-4">
                      {detail.approach.map((step, index) => (
                        <li key={step} className="flex gap-4">
                          <StepNumber index={index} />
                          <p className="pt-0.5 text-sm leading-relaxed text-slate-600">{step}</p>
                        </li>
                      ))}
                    </ol>
                  ),
                },
              ]
            : []),
          ...(detail.challenges.length
            ? [
                {
                  id: 'challenges',
                  label: '기술적 도전 및 성과',
                  render: () => (
                    <div className="space-y-4">
                      {detail.challenges.map((challenge) => (
                        <article
                          key={challenge.title}
                          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                        >
                          <h3 className="text-base font-semibold tracking-tight text-slate-900">
                            {challenge.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">
                            {challenge.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  ),
                },
              ]
            : []),
        ]),
  ];

  const navItems: NavItem[] = sections.map(({ id, label }) => ({ id, label }));

  return (
    <>
      {/* Hero */}
      <header className="mb-14 mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Case Study · {project.role}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
          {project.title}
        </h1>
        {project.period ? <p className="mt-3 text-sm text-slate-400">{project.period}</p> : null}
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{project.summary}</p>

        <ProjectCover
          src={project.thumbnailUrl}
          title={project.title}
          aspect="aspect-[21/9]"
          className="mt-10 rounded-2xl border border-slate-200"
        />
      </header>

      {/* Body */}
      <div className="lg:flex lg:items-start lg:gap-12">
        <div className="min-w-0 flex-1 space-y-16">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
                {section.label}
              </h2>
              {section.render()}
            </section>
          ))}

          <div className="border-t border-slate-200 pt-8">
            <BackLink />
          </div>
        </div>

        <OnThisPageNav
          items={navItems}
          footer={
            <div className="space-y-6">
              {project.repoUrl || project.liveUrl ? (
                <div className="flex flex-col gap-2 border-t border-slate-200 pt-6">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    프로젝트 링크
                  </p>
                  {project.repoUrl ? <GitHubLink href={project.repoUrl} /> : null}
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Live ↗
                    </a>
                  ) : null}
                </div>
              ) : null}
              <SidebarTechStack stack={detail.stack.length ? detail.stack : project.tags} />
            </div>
          }
        />
      </div>
    </>
  );
}

/** 개요: 성과 개수와 프로젝트 설명만 간결하게 보여준다. */
function Overview({ detail }: { detail: ProjectDetail }) {
  const nestedAchievements = (detail.problemCases ?? []).flatMap((problemCase) =>
    problemCase.challenges.length
      ? problemCase.challenges.map((challenge) => challenge.title)
      : problemCase.outcomes,
  );
  const keyAchievements = nestedAchievements.length
    ? nestedAchievements.slice(0, 3)
    : detail.challenges.length
      ? detail.challenges.slice(0, 3).map((challenge) => challenge.title)
      : detail.outcomes.slice(0, 3);

  return (
    <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          프로젝트 요약
        </h3>
        <div className="mt-4 space-y-4">
          {detail.overview.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {keyAchievements.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            주요 성과
          </h3>
          <ol className="mt-2 divide-y divide-slate-100">
            {keyAchievements.map((achievement, index) => (
              <li key={achievement} className="flex gap-3 py-3.5">
                <StepNumber index={index} />
                <span className="text-sm font-medium leading-relaxed text-slate-700">
                  {achievement}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function RoleMetrics({ detail }: { detail: ProjectDetail }) {
  return (
    <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
      {detail.contributions.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            담당 역할
          </h3>
          <ul className="mt-4 space-y-3">
            {detail.contributions.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {detail.metrics.length ? (
        <dl className="grid gap-3">
          {detail.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4"
            >
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                {metric.label}
              </dt>
              <dd className="mt-1 text-base font-semibold tracking-tight text-slate-900">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

function ProblemCasesSection({
  lead,
  cases,
}: {
  lead: string;
  cases: ProjectProblemCase[];
}) {
  return (
    <div className="space-y-7">
      {lead ? <Lead>{lead}</Lead> : null}
      <ol className="space-y-6">
        {cases.map((problemCase, index) => (
          <li key={problemCase.title}>
            <ProblemCaseCard index={index} problemCase={problemCase} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProblemCaseCard({
  index,
  problemCase,
}: {
  index: number;
  problemCase: ProjectProblemCase;
}) {
  const hasResults =
    problemCase.challenges.length ||
    problemCase.outcomes.length ||
    problemCase.metrics.length;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-xs font-bold tabular-nums tracking-widest text-white"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Problem {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            {problemCase.title}
          </h3>
        </div>
      </header>

      <div className="divide-y divide-slate-100 px-6">
        <ProblemStage label="문제 정의" tone="problem">
          <p className="text-sm leading-relaxed text-slate-600">
            {problemCase.problemDefinition}
          </p>
        </ProblemStage>

        {problemCase.approach.length ? (
          <ProblemStage label="해결 과정" tone="approach">
            <ol className="space-y-3">
              {problemCase.approach.map((step, stepIndex) => (
                <li key={step} className="flex gap-3">
                  <StepNumber index={stepIndex} />
                  <p className="text-sm leading-relaxed text-slate-600">{step}</p>
                </li>
              ))}
            </ol>
          </ProblemStage>
        ) : null}

        {hasResults ? (
          <ProblemStage label="도전 및 성과" tone="outcome">
            <div className="space-y-4">
              {problemCase.challenges.map((challenge) => (
                <div key={challenge.title}>
                  <h4 className="text-sm font-semibold text-slate-900">{challenge.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {challenge.description}
                  </p>
                </div>
              ))}

              {problemCase.outcomes.length ? (
                <ul className="space-y-2">
                  {problemCase.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {problemCase.metrics.length ? (
                <dl className="grid gap-2.5 sm:grid-cols-2">
                  {problemCase.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3"
                    >
                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        {metric.label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-emerald-900">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </ProblemStage>
        ) : null}
      </div>
    </article>
  );
}

function ProblemStage({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'problem' | 'approach' | 'outcome';
  children: ReactNode;
}) {
  const labelClass = {
    problem: 'text-amber-700',
    approach: 'text-blue-700',
    outcome: 'text-emerald-700',
  }[tone];

  return (
    <section className="grid gap-3 py-6 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-6">
      <h4 className={`pt-0.5 text-xs font-semibold uppercase tracking-widest ${labelClass}`}>
        {label}
      </h4>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function GitHubLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="GitHub 저장소 새 탭에서 열기"
      className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[18px] w-[18px] shrink-0 fill-current"
      >
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.588 2 12.248c0 4.528 2.865 8.37 6.839 9.726.5.094.682-.222.682-.494 0-.244-.009-.888-.014-1.743-2.782.619-3.369-1.374-3.369-1.374-.455-1.184-1.11-1.5-1.11-1.5-.908-.636.069-.623.069-.623 1.004.073 1.532 1.057 1.532 1.057.892 1.566 2.341 1.114 2.91.852.091-.663.35-1.114.635-1.37-2.221-.26-4.555-1.14-4.555-5.065 0-1.119.389-2.033 1.026-2.75-.103-.259-.445-1.302.098-2.712 0 0 .837-.275 2.742 1.05A9.3 9.3 0 0 1 12 6.976a9.3 9.3 0 0 1 2.5.346c1.904-1.325 2.74-1.05 2.74-1.05.544 1.41.202 2.453.1 2.712.64.717 1.024 1.631 1.024 2.75 0 3.935-2.338 4.802-4.566 5.056.359.317.679.944.679 1.902 0 1.373-.012 2.48-.012 2.818 0 .274.18.593.688.492C19.13 20.644 22 16.804 22 12.248 22 6.588 17.523 2 12 2Z"
          clipRule="evenodd"
        />
      </svg>
      <span>GitHub</span>
      <span
        aria-hidden="true"
        className="text-xs text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-200"
      >
        ↗
      </span>
    </a>
  );
}

function SidebarTechStack({ stack }: { stack: string[] }) {
  if (!stack.length) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 pt-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        사용 기술
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {stack.map((item) => (
          <li
            key={item}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-slate-900 pl-5 text-base leading-relaxed text-slate-700">
      {children}
    </p>
  );
}

/** Two-digit ordinal chip, e.g. "01". */
function StepNumber({ index }: { index: number }) {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-xs font-semibold tabular-nums tracking-widest text-slate-400"
    >
      {String(index + 1).padStart(2, '0')}
    </span>
  );
}

function NumberedCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex gap-4">
        <StepNumber index={index} />
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
    </article>
  );
}

/** Shown when the project slug is unknown or has no case study row (404). */
function CaseStudyMissing() {
  return (
    <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center">
      <h1 className="text-lg font-semibold text-slate-900">케이스 스터디를 준비 중입니다</h1>
      <p className="mt-2 text-sm text-slate-500">
        이 프로젝트의 상세 내용은 아직 등록되지 않았습니다.
      </p>
      <div className="mt-6">
        <BackLink />
      </div>
    </div>
  );
}
