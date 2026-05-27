import { Service } from '@/types';

export const services: Service[] = [
  {
    id: '1',
    title: 'Web Application Development',
    description:
      'Full-stack web apps built with React, TypeScript, and .NET. From internal tools to customer-facing systems.',
    icon: '🌐',
    features: [
      'React + TypeScript frontends',
      'Responsive, accessible UI',
      'RESTful API integration',
      'Role-based access control',
      'Form validation and workflows',
    ],
  },
  {
    id: '2',
    title: '.NET API Development',
    description:
      'Scalable REST APIs built with .NET 8 and clean architecture. Production-ready with proper auth, logging, and docs.',
    icon: '⚙️',
    features: [
      '.NET 8 Web API',
      'JWT authentication',
      'OpenAPI / Swagger docs',
      'Clean architecture',
      'Entity Framework or Dapper',
    ],
  },
  {
    id: '3',
    title: 'React Frontend Development',
    description:
      'Modern, performant React applications. Type-safe with TypeScript, styled with Tailwind, and built to scale.',
    icon: '⚛️',
    features: [
      'React 18 + TypeScript',
      'Tailwind CSS styling',
      'State management (Zustand / Context)',
      'Data fetching with React Query',
      'Component library integration',
    ],
  },
  {
    id: '4',
    title: 'SQL & Stored Procedure Optimization',
    description:
      'Query tuning, index optimization, and stored procedure development for SQL Server. Make slow queries fast.',
    icon: '🗄️',
    features: [
      'Query performance analysis',
      'Index strategy and optimization',
      'Stored procedure development',
      'Database schema design',
      'Execution plan review',
    ],
  },
  {
    id: '5',
    title: 'Dashboard & Reporting',
    description:
      'Data dashboards and reporting tools built with Streamlit, React, or Power BI integration. Turn raw data into insights.',
    icon: '📊',
    features: [
      'Streamlit dashboards',
      'Interactive charts (Plotly, Recharts)',
      'KPI tracking',
      'Excel / CSV export',
      'SQL-backed live data',
    ],
  },
  {
    id: '6',
    title: 'Deployment & DevOps Support',
    description:
      'CI/CD pipeline setup, Docker containerization, and deployment automation. Ship faster and with confidence.',
    icon: '🚀',
    features: [
      'GitHub Actions / Jenkins pipelines',
      'Docker & Docker Compose setup',
      'Multi-environment deployment',
      'Azure DevOps configuration',
      'VPS setup and management',
    ],
  },
];
