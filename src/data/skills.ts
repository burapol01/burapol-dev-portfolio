import { Skill } from '@/types';

export const skills: Skill[] = [
  // Backend
  { name: 'C#', category: 'backend' },
  { name: '.NET Framework', category: 'backend' },
  { name: '.NET Core', category: 'backend' },
  { name: '.NET 8', category: 'backend' },
  { name: 'RESTful API Development', category: 'backend' },
  { name: 'System Integration', category: 'backend' },
  // Frontend
  { name: 'React', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  // Database
  { name: 'MS SQL Server', category: 'database' },
  { name: 'Stored Procedures', category: 'database' },
  { name: 'SQL Query Optimization', category: 'database' },
  // DevOps
  { name: 'Git', category: 'devops' },
  { name: 'Azure DevOps', category: 'devops' },
  { name: 'Jenkins', category: 'devops' },
  { name: 'CI/CD', category: 'devops' },
  { name: 'Docker', category: 'devops' },
  // Scripting
  { name: 'Python', category: 'scripting' },
  { name: 'Node.js', category: 'scripting' },
  { name: 'Swagger / OpenAPI', category: 'scripting' },
];

export const skillCategories = [
  { key: 'backend', label: 'Backend', color: 'blue' },
  { key: 'frontend', label: 'Frontend', color: 'purple' },
  { key: 'database', label: 'Database', color: 'green' },
  { key: 'devops', label: 'DevOps / Deployment', color: 'orange' },
  { key: 'scripting', label: 'Scripting / Automation', color: 'red' },
] as const;
