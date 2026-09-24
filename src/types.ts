export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets?: string[];
  category: 'web' | 'ml' | 'ai' | 'all';
  tech: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface Skill {
  name: string;
  level: number; // percentage for progress bars (e.g. 90)
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: (Skill | string)[];
}

export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  gpa?: string;
}

export interface Achievement {
  title: string;
  description: string;
}

export interface Interest {
  title: string;
  description: string;
  iconName: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  portraitUrl: string;
  linkedin: string;
  github: string;
  summary: string;
  // About section fields
  aboutTitle?: string;
  aboutSubtitle?: string;
  origin?: string;
  availability?: string;
  yearsExp?: string;
  projectsCount?: string;
  awardsCount?: string;
  // Hero section additions
  heroGreeting?: string;
  heroHeadline?: string;
  heroHeadlinePrefix?: string;
  heroHeadlineHighlight?: string;
}

export interface CvMetadata {
  fileName: string;
  fileSize: number;
  updatedAt: string;
}
