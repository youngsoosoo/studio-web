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
  avatarUrl: string;
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

export type TimelineType = 'work' | 'education' | 'milestone';

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  type: TimelineType;
}

export interface Contact {
  email: string;
  phone: string | null;
  location: string;
  socials: SocialLink[];
  availability: string;
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
  timeline: TimelineEntry[];
  contact: Contact;
}
