import { Link } from 'react-router-dom';
import type { ProjectSummary } from '../types';
import { ProjectCover } from './projectDetail/ProjectCover';

interface ProjectsSectionProps {
  projects: ProjectSummary[];
}

/**
 * Editorial project cards with a consistent media area. Projects without an
 * uploaded cover use the shared titled placeholder so every card keeps the
 * same visual rhythm.
 */
export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <ul className={`grid gap-6 ${projects.length > 1 ? 'sm:grid-cols-2' : ''}`}>
      {projects.map((project) => {
        return (
          <li
            key={project.id}
            className="project-card relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md focus-within:ring-2 focus-within:ring-slate-900/10"
          >
            <ProjectCover
              src={project.thumbnailUrl}
              title={project.title}
              aspect="aspect-[2/1]"
              fit="contain"
              className="border-b border-slate-100 bg-slate-900"
            />

            <div className="project-card__body project-card__body--with-cover">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {project.role}
                  {project.period ? ` · ${project.period}` : ''}
                </p>
                {project.featured ? (
                  <span
                    data-pdf-pill
                    className="inline-flex min-h-5 shrink-0 items-center justify-center rounded-full bg-slate-900 px-2 py-0.5 text-center text-[10px] font-semibold uppercase leading-none tracking-wide text-white"
                  >
                    <span data-pdf-pill-text data-pdf-pill-latin className="relative -top-px">
                      Featured
                    </span>
                  </span>
                ) : null}
              </div>

              <h3 className="project-card__title text-lg font-semibold leading-snug tracking-tight text-slate-900">
                {project.title}
              </h3>

              <div className="project-card__footer">
                <Link
                  to={`/projects/${project.id}`}
                  className="border-b border-slate-700 pb-0.5 text-sm font-semibold text-slate-800 transition hover:border-slate-950 hover:text-slate-950"
                >
                  프로젝트 상세 보기 ↗
                </Link>
              </div>
            </div>

            <Link
              to={`/projects/${project.id}`}
              aria-label={`${project.title} 케이스 스터디 보기`}
              className="absolute inset-0 z-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            />
          </li>
        );
      })}
    </ul>
  );
}
