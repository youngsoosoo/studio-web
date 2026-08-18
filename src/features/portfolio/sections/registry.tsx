import type { ReactNode } from 'react';
import {
  AboutSection,
  AchievementsSection,
  AwardsSection,
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  StrengthsSection,
  TechStackSection,
} from '../components';
import type { PortfolioResponse } from '../types';

/**
 * The set of developer-defined section "presets". A page is composed by listing
 * these keys in `SECTION_ORDER`; choosing a key automatically pulls in that
 * section's layout/CSS (its component) and its label/title — there is nothing
 * else to wire up per section.
 */
export type SectionKey =
  | 'about'
  | 'strengths'
  | 'achievements'
  | 'experiences'
  | 'projects'
  | 'expertise'
  | 'education'
  | 'awards'
  | 'certifications';

export interface SectionDef {
  /** Label shown in the on-this-page nav. */
  navLabel: string;
  /** Heading rendered in the section's left column. */
  title: string;
  /** Optional small label above the title. */
  eyebrow?: string;
  /** Whether this section appears in the on-this-page nav (default: true). */
  inNav?: boolean;
  /** True when the data for this section is present and worth rendering. */
  available: (data: PortfolioResponse) => boolean;
  /** Renders the section's content (the right column of the Section shell). */
  render: (data: PortfolioResponse) => ReactNode;
}

const nonEmpty = (value: unknown[] | null | undefined) => Array.isArray(value) && value.length > 0;

export const SECTION_REGISTRY: Record<SectionKey, SectionDef> = {
  about: {
    navLabel: '소개',
    title: '소개',
    eyebrow: 'About',
    available: (d) => Boolean(d.about),
    render: (d) => <AboutSection about={d.about} />,
  },
  strengths: {
    navLabel: '강점',
    title: '강점',
    eyebrow: 'Core Strengths',
    available: (d) => nonEmpty(d.strengths),
    render: (d) => <StrengthsSection strengths={d.strengths} />,
  },
  achievements: {
    navLabel: '핵심 성과',
    title: '핵심 성과',
    eyebrow: 'Achievements',
    available: (d) => nonEmpty(d.achievements),
    render: (d) => <AchievementsSection achievements={d.achievements} />,
  },
  experiences: {
    navLabel: '업무 경험',
    title: '업무 경험',
    eyebrow: 'Experience',
    available: (d) => nonEmpty(d.experiences),
    render: (d) => <ExperienceSection experiences={d.experiences} />,
  },
  projects: {
    navLabel: '프로젝트',
    title: '프로젝트',
    eyebrow: 'Projects',
    available: (d) => nonEmpty(d.projects),
    render: (d) => <ProjectsSection projects={d.projects} />,
  },
  expertise: {
    navLabel: '전문 분야',
    title: '전문 분야',
    eyebrow: 'Expertise',
    available: (d) => nonEmpty(d.techStack),
    render: (d) => <TechStackSection techStack={d.techStack} />,
  },
  education: {
    navLabel: '학력',
    title: '학력',
    eyebrow: 'Education',
    available: (d) => nonEmpty(d.education),
    render: (d) => <EducationSection education={d.education} />,
  },
  awards: {
    navLabel: '수상 및 활동',
    title: '수상 및 활동',
    eyebrow: 'Awards',
    available: (d) => nonEmpty(d.awards),
    render: (d) => <AwardsSection awards={d.awards} />,
  },
  certifications: {
    navLabel: '수료 및 자격증',
    title: '수료 및 자격증',
    eyebrow: 'Certifications',
    available: (d) => nonEmpty(d.certifications),
    render: (d) => <CertificationsSection certifications={d.certifications} />,
  },
};
