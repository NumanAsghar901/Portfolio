export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  category: 'web' | 'ml' | 'ai' | 'all';
  tech: string[];
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
  skills: string[] | Skill[];
}

export interface Experience {
  role: string;
  company: string;
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
