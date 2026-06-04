import type { ProjectSummary } from '../types';

interface ProjectsSectionProps {
  projects: ProjectSummary[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <li
          key={project.id}
          className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-slate-400">{project.role}</p>
            {project.featured ? (
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Featured
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{project.title}</h3>
          {project.period ? <p className="mt-1 text-xs text-slate-400">{project.period}</p> : null}
          <p className="mt-3 flex-1 text-sm text-slate-600">{project.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {tag}
              </li>
            ))}
          </ul>
          {project.repoUrl || project.liveUrl ? (
            <div className="mt-4 flex gap-4 text-sm font-medium">
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-slate-900 underline-offset-4 hover:underline"
                >
                  Code
                </a>
              ) : null}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-slate-900 underline-offset-4 hover:underline"
                >
                  Live
                </a>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
