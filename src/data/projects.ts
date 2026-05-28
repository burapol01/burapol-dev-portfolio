import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: '1',
    slug: 'scss-accounting-loan',
    title: 'Sugar Cane Support System - Loan & Accounting Module',
    shortDescription:
      'Manual loan tracking and fragmented approval steps made financial workflows slow and error-prone. Built a multi-step loan request and approval system with status tracking, accounting summaries, and SQL Server-backed data operations.',
    longDescription: `**Problem:** Manual loan tracking and fragmented approval steps made financial workflows slow and error-prone. Officers spent time correcting entries instead of processing requests.

**Solution:** A structured loan request and approval workflow covering submission, multi-step review (Draft -> Submitted -> Under Review -> Approved / Rejected), and accounting summary views. Built as part of the Sugar Cane Support System (SCSS), an internal enterprise application for managing agricultural financial operations.

Full-stack work: C# .NET REST API endpoints, SQL Server stored procedures for data-intensive operations, and frontend UI integrated with backend business logic. Validation at every layer reduced data entry errors and improved record accuracy across the accounting module.`,
    tech: ['C#', '.NET', 'SQL Server', 'Stored Procedures', 'JavaScript', 'TypeScript'],
    category: 'fullstack',
    featured: true,
    demoUrl: '/demo/loan-management',
    features: [
      'Multi-step approval workflow: Draft -> Submitted -> Under Review -> Approved / Rejected',
      'Loan request management with contract tracking and purpose recording',
      'Accounting summary dashboard: total requests, pending review, approved amount, rejected count',
      'REST API endpoints for loan and accounting CRUD operations',
      'SQL Server stored procedures for financial data aggregation',
      'Input validation at UI and API layers to reduce entry errors',
    ],
    highlights: [
      'Multi-step approval workflow replaced manual ad-hoc review process',
      'Accounting summaries gave finance officers instant status visibility',
      'Full-stack ownership from UI through API to stored procedures',
    ],
    status: 'completed',
    year: 2024,
  },
  {
    id: '2',
    slug: 'trr-mes-timesheet',
    title: 'MES Request & Worklog System Demo',
    shortDescription:
      'A unified MES demo showing request approval, technician work execution, worklog tracking, and shift-aware OT calculation using mock data.',
    longDescription: `**Problem:** Internal maintenance and operations work often spans request approval, technician execution, and timesheet review. When those steps are tracked separately, teams lose visibility into request status, work hours, OT, and closeout readiness.

**Solution:** A unified MES-style demo that combines request workflow tracking with technician worklog entry and shift-aware OT calculation. Requesters can submit and close jobs, approvers can approve or reject, and technicians can start work, record hours, and mark jobs done.

**Implementation:** The portfolio demo uses React and TypeScript with mock data to present the user-facing workflow. The real-world implementation experience involved C#, .NET, SQL Server, and enterprise workflow patterns, but this public demo excludes confidential company data and focuses on interaction design, state transitions, filtering, summaries, and OT logic.`,
    tech: ['C#', '.NET', 'SQL Server', 'React', 'TypeScript', 'Workflow', 'Timesheet'],
    category: 'fullstack',
    featured: true,
    demoUrl: '/demo/mes-workflow',
    features: [
      'Request workflow: Draft -> Submitted -> Approved -> Started -> In Progress -> Job Done -> Closed',
      'Role-based actions for requesters, approvers, and technicians',
      'Worklog entry modal with real-time work hour preview',
      'Shift-aware OT calculation for morning, afternoon, and night shifts',
      'Timesheet filters by month, department, status, employee, and task',
      'Dashboard summaries for request counts, working days, work hours, OT, pending, and approved records',
    ],
    highlights: [
      'Connects request approval and execution tracking in one workflow',
      'Demonstrates enterprise UI patterns with mock data only',
      'Shows practical OT logic including midnight crossover handling',
    ],
    status: 'completed',
    year: 2023,
  },
  {
    id: '3',
    slug: 'bitkub-bot',
    title: 'Bitkub_Bot',
    shortDescription:
      'Personal project: Python-based automated crypto trading bot with a Streamlit dashboard, safety guardrails, audit logging, and Docker Compose deployment on DigitalOcean.',
    longDescription: `Bitkub_Bot is a personal automation project - a crypto trading bot for the Bitkub exchange (Thailand's leading crypto exchange). Built entirely in Python, it connects to the Bitkub REST API and executes trades based on configurable strategies.

The system runs on a DigitalOcean VPS deployed via Docker Compose. A Streamlit dashboard provides real-time visibility into positions, trade history, and system health. All trade data is stored in SQLite.

Safety was the primary design concern: every trade passes through configurable guardrails before execution, and every action is written to an immutable audit log. A built-in Strategy Compare Lab allows backtesting strategies side-by-side before going live. Backup and restore tooling protects the database.`,
    tech: ['Python', 'Streamlit', 'SQLite', 'Docker', 'Docker Compose', 'DigitalOcean', 'GitHub Actions'],
    category: 'automation',
    featured: true,
    features: [
      'Automated trade execution via Bitkub REST API',
      'Real-time Streamlit dashboard with position and trade history',
      'SQLite database for trade records and audit logs',
      'Safety guardrails: position limits, loss caps, cooldown periods',
      'Immutable audit log for every order action',
      'Strategy Compare Lab for side-by-side backtesting',
      'Execution Assistant for manual trade review before live orders',
      'Backup and restore system for database snapshots',
      'Docker Compose deployment on DigitalOcean VPS',
      'GitHub Actions for CI workflow',
    ],
    highlights: [
      'Zero unguarded trades - all orders pass safety checks first',
      'Full audit trail with timestamp and reason on every action',
      'One-command deploy via Docker Compose',
      'Strategy comparison without risking real capital',
    ],
    status: 'active',
    year: 2024,
  },
  {
    id: '4',
    slug: 'moveon-android-app',
    title: 'MoveOn - Android Application',
    shortDescription:
      'Graduation project Android application focused on mobile user workflows and application development.',
    longDescription: `**Problem:** Graduation projects need to demonstrate complete application delivery, including mobile screens, user flows, and supporting project logic rather than isolated code samples.

**Solution:** MoveOn is an Android application project with user workflow screens such as login, registration, home, game, and profile sections, plus supporting project logic and backend-oriented assets.

**Implementation:** Built as a graduation project using Android Studio and Java, with related web/backend technologies noted in the repository including PHP, HTML, JavaScript, CSS, and MySQL. The project demonstrates Android application development, UI flow planning, and mobile app implementation.`,
    tech: ['Android', 'Java', 'Mobile App', 'PHP', 'MySQL'],
    category: 'mobile',
    featured: false,
    githubUrl: 'https://github.com/burapol01/moveon',
    features: [
      'Android mobile application',
      'User workflow screens',
      'Mobile UI implementation',
      'Local/project-based app logic',
      'Graduation project delivery',
    ],
    highlights: [
      'Built as a graduation project',
      'Demonstrates mobile application development experience',
      'Adds Android/mobile development breadth to the portfolio',
    ],
    status: 'completed',
    year: 2021,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getProjectsByCategory = (category: string) =>
  projects.filter((p) => p.category === category);
