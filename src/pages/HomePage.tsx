import { mockProjects } from '../data/mock/mockProjects';

export function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
          Studio Portfolio
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Building thoughtful product experiences.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          A scaffold rendered from mock data. Real content will be sourced from the
          studio-api service once integration lands.
        </p>
      </header>

      <section aria-labelledby="projects-heading">
        <h2
          id="projects-heading"
          className="mb-6 text-lg font-semibold text-slate-900"
        >
          Featured projects
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <li
              key={project.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {project.role}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {project.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{project.summary}</p>
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
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
