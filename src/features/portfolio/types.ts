/**
 * TypeScript mirror of the studio-api portfolio DTOs. Field names match the
 * backend's camelCase JSON 1:1, so responses deserialize without remapping.
 */

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  /** Absolute URL served by the API, or null until a photo is uploaded. */
  avatarUrl: string | null;
  resumeUrl: string;
  socials: SocialLink[];
}

export interface About {
  headline: string;
  paragraphs: string[];
  highlights: string[];
}

export interface Strength {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  stack: string[];
}

export interface ProjectSummary {
  id: string;
  title: string;
  summary: string;
  role: string;
  tags: string[];
  period: string;
  thumbnailUrl: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

export interface ProjectMetric {
  /** Short label, e.g. "응답 시간". */
  label: string;
  /** Headline figure, e.g. "-42%". */
  value: string;
}

export interface ProjectImage {
  /** Absolute URL served by the API (e.g. "http://…/files/….svg"). */
  src: string;
  /** Alt text for screen readers. */
  alt: string;
  /** Optional caption shown under the image. */
  caption?: string | null;
}

interface ProjectVisualBase {
  id: number;
  title?: string | null;
  caption?: string | null;
  schemaVersion: number;
  sortOrder: number;
}

export interface ProjectImageVisual extends ProjectVisualBase {
  type: 'image';
  src: string;
  alt: string;
  payload: null;
}

export interface ProjectFlowStep {
  label?: string;
  title: string;
  emphasis?: 'danger' | 'success';
}

export interface ProjectFlowGroup {
  key: string;
  label: string;
  description?: string;
  tone?: 'neutral' | 'danger' | 'success';
  steps: ProjectFlowStep[];
}

export interface ProjectFlowVisual extends ProjectVisualBase {
  type: 'flow';
  src: null;
  alt: null;
  payload: {
    layout: 'vertical';
    groups: ProjectFlowGroup[];
  };
}

export interface ProjectTableColumn {
  key: string;
  label: string;
}

export interface ProjectTableVisual extends ProjectVisualBase {
  type: 'table';
  src: null;
  alt: null;
  payload: {
    columns: ProjectTableColumn[];
    rows: Array<Record<string, string>>;
  };
}

/** Safe declarative visuals; the API never sends executable markup or code. */
export type ProjectCaseVisual =
  | ProjectImageVisual
  | ProjectFlowVisual
  | ProjectTableVisual;

/** One numbered card in the case study's "문제 정의" section. */
export interface ProjectProblem {
  title: string;
  description: string;
}

/** One card in the case study's "기술적 도전 및 성과" section. */
export interface ProjectChallenge {
  title: string;
  description: string;
}

/**
 * Which section a case-study block belongs to. `problem` blocks carry a
 * diagnosed problem with measured results and get the full card; `feature`
 * blocks are routine implementation work and get a deliberately lighter one.
 */
export type ProjectProblemCaseKind = 'problem' | 'feature';

/** One problem-centred block containing its own solution narrative and results. */
export interface ProjectProblemCase {
  /** Optional while older API deployments omit it — absent means `problem`. */
  kind?: ProjectProblemCaseKind;
  title: string;
  problemDefinition: string;
  approach: string[];
  challenges: ProjectChallenge[];
  outcomes: string[];
  metrics: ProjectMetric[];
  /** Legacy case images returned by older API deployments. */
  images?: ProjectImage[];
  /** Ordered IMAGE/FLOW/TABLE items rendered directly from API data. */
  visuals?: ProjectCaseVisual[];
}

/**
 * Rich case-study content for a single project, served by
 * `GET /api/portfolio/projects/{id}` (see `useProjectDetail`). A project
 * without a case study returns 404 and the detail page shows a "준비 중"
 * placeholder instead.
 */
export interface ProjectDetail {
  /**
   * The card-level summary (title, role, period, thumbnail, links), embedded so
   * the standalone `/projects/:id` page renders its header from this one
   * response instead of refetching the whole portfolio.
   */
  project: ProjectSummary;
  /** One or two intro paragraphs describing what the project is. */
  overview: string[];
  /** The situation/problem that motivated the work — lead paragraph. */
  problem: string;
  /** The problem broken into numbered cards. */
  problems: ProjectProblem[];
  /** Concrete actions taken — the "what I did". */
  approach: string[];
  /** What was technically hard, and what came out of solving it. */
  challenges: ProjectChallenge[];
  /** What this person specifically owned on the project. */
  contributions: string[];
  /** Measurable or qualitative results. */
  outcomes: string[];
  /** Headline metrics rendered as stat chips. */
  metrics: ProjectMetric[];
  /** Full tech stack (richer than the card's tags). */
  stack: string[];
  /** Team composition / size, e.g. "프론트 2 · 백엔드 3 · PM 1". */
  team?: string | null;
  /**
   * Architecture diagrams / screenshots, uploaded via the admin image API
   * (`POST /api/admin/images?target=project-image`). Empty hides the section;
   * broken images are hidden gracefully at render time.
   */
  images?: ProjectImage[];
  /**
   * Problem-centred case-study blocks. Optional while older API deployments
   * still return only the legacy flat problem/approach/challenge fields.
   */
  problemCases?: ProjectProblemCase[];
}

export interface TechItem {
  name: string;
  icon: string;
  level?: number | null;
}

export interface TechStackGroup {
  category: string;
  items: TechItem[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  metric: string | null;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
  description: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId: string | null;
}

export interface PortfolioResponse {
  profile: Profile;
  about: About;
  strengths: Strength[];
  achievements: Achievement[];
  experiences: Experience[];
  projects: ProjectSummary[];
  techStack: TechStackGroup[];
  education: Education[];
  awards: Award[];
  certifications: Certification[];
}
