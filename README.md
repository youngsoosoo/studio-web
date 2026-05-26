# studio-web

Frontend for the studio portfolio. Built with **Vite + React + TypeScript + Tailwind CSS**.

## Requirements

- Node.js 20+ (developed against Node 24)
- npm 10+

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the built bundle locally
npm run lint     # ESLint
```

## Project layout

```
src/
  app/          App shell, BrowserRouter, route table
  pages/        Top-level route components (HomePage, …)
  features/     Feature-scoped components and hooks (empty for PF-001)
  shared/       Cross-cutting components and libs
    components/
    lib/
  data/
    mock/       Static mock fixtures used until the API is wired up
  main.tsx      Vite entry point
  index.css     Tailwind directives + minimal global resets
```

## Routing

`src/app/routes.tsx` declares the route table. The home page is rendered for `/`
and any unknown path. Real route splits come in later tickets.

## Mock data

Until [studio-api](https://github.com/youngsoosoo/studio-api) endpoints land,
the home page renders fixtures from `src/data/mock/mockProjects.ts`. Swap to
real API calls in a feature module under `src/features/projects/`.

## Conventions

- Branches: `feature/{TICKET_ID}-{short-description}` cut from `dev`.
- Commits: Conventional Commits (`chore:`, `feat:`, `fix:`, `docs:`, `test:`).
- See [studio-docs](https://github.com/youngsoosoo/studio-docs) for the
  cross-repo workflow.

## Known follow-ups from PF-001

- The default Vite scaffold files (`src/App.tsx`, `src/App.css`, `src/assets/*`,
  `public/icons.svg`) were left in place because the working environment blocked
  their deletion. They are not referenced by any module and can be removed in a
  follow-up cleanup ticket.
