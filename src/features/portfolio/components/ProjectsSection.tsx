import { Link } from 'react-router-dom';
import type { ProjectSummary } from '../types';
import { ProjectCover } from './projectDetail/ProjectCover';

interface ProjectsSectionProps {
  projects: ProjectSummary[];
}

/**
 * Image-led project cards. The whole card links to the standalone case study at
 * `/projects/:id`; the external repo/live links sit above the stretched overlay
 * so they stay independently clickable.
 */
export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <li
          key={project.id}
          className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md focus-within:ring-2 focus-within:ring-slate-900/10"
        >
          <ProjectCover
            src={project.thumbnailUrl}
            title={project.title}
            className="border-b border-slate-100"
          />

          <div className="flex flex-1 flex-col p-6">
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  data-pdf-pill
                  className="inline-flex min-h-5 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-center text-[11px] font-medium uppercase leading-none tracking-wide text-slate-600"
                >
                  <span data-pdf-pill-text data-pdf-pill-latin className="relative -top-px">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                {project.title}
              </h3>
              {project.featured ? (
                <span
                  data-pdf-pill
                  className="mt-0.5 inline-flex min-h-5 shrink-0 items-center justify-center rounded-full bg-slate-900 px-2 py-0.5 text-center text-[10px] font-semibold uppercase leading-none tracking-wide text-white"
                >
                  <span data-pdf-pill-text data-pdf-pill-latin className="relative -top-px">
                    Featured
                  </span>
                </span>
              ) : null}
            </div>
            {project.period ? (
              <p className="mt-1 text-xs text-slate-400">
                {project.role} · {project.period}
              </p>
            ) : null}

            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{project.summary}</p>

            {project.repoUrl || project.liveUrl ? (
              <div className="relative z-10 mt-5 flex gap-4 text-sm font-medium">
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-slate-500 underline-offset-4 transition hover:text-slate-900 hover:underline"
                  >
                    Code ↗
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-slate-500 underline-offset-4 transition hover:text-slate-900 hover:underline"
                  >
                    Live ↗
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Stretched overlay: makes the whole card navigate to the case study
              while the elevated (z-10) external links stay clickable. */}
          <Link
            to={`/projects/${project.id}`}
            aria-label={`${project.title} 케이스 스터디 보기`}
            className="absolute inset-0 z-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          />
        </li>
      ))}
    </ul>
  );
}
