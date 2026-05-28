export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  tech: string[];
  category: string;
  featured: boolean;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  backendUrl?: string;
  features: string[];
  highlights: string[];
  status: 'active' | 'completed' | 'in-progress';
  year: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Skill {
  name: string;
  category: 'backend' | 'frontend' | 'database' | 'devops' | 'scripting' | 'soft';
}

export interface NavLink {
  href: string;
  label: string;
}
