import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: '1',
    slug: 'scss-accounting-loan',
    title: 'Sugar Cane Support System — Accounting & Loan Module',
    shortDescription:
      'Developed and maintained accounting and loan workflow modules for an internal enterprise system, covering UI, API, and SQL Server database operations.',
    longDescription: `The Sugar Cane Support System (SCSS) is an internal enterprise application used to manage sugarcane-related business operations. My primary contribution was the Accounting and Loan Module, which handles financial calculations, loan tracking, and data workflows.

Working end-to-end across the stack, I built and maintained REST API endpoints in C# .NET, integrated the frontend UI with backend business logic, and wrote optimized SQL Server stored procedures to support data-intensive operations.

The module improved accuracy in financial record-keeping and reduced manual steps in the accounting workflow through better validation and structured data flows.`,
    tech: ['C#', '.NET', 'SQL Server', 'Stored Procedures', 'JavaScript', 'TypeScript'],
    category: 'fullstack',
    featured: true,
    demoUrl: '/demo/loan-management',
    features: [
      'REST API endpoints for accounting and loan workflows',
      'SQL Server stored procedures for data read/write operations',
      'Frontend UI integration with .NET backend',
      'Loan calculation and tracking module',
      'Data validation and error handling across layers',
      'Maintenance and enhancement of existing modules',
    ],
    highlights: [
      'Full-stack ownership from UI through API to database',
      'Improved data accuracy by refining validation logic',
      'Reduced manual steps through structured workflow improvements',
    ],
    status: 'completed',
    year: 2024,
  },
  {
    id: '2',
    slug: 'trr-mes-timesheet',
    title: 'TRR Dynamic AX MES — Timesheet & Worklog Module',
    shortDescription:
      'Manual or fragmented timesheet tracking makes OT calculation and approval review difficult. Built a shift-aware timesheet dashboard with worklog entry, auto OT calculation, approval workflow, and management summaries.',
    longDescription: `**Problem:** Manual or fragmented timesheet tracking makes OT calculation and approval review difficult — operators lose time correcting entries, supervisors struggle to get accurate summary views.

**Solution:** A shift-aware timesheet dashboard with filters, worklog entry, OT calculation, status workflow, and management summaries. Built as part of TRR Dynamic AX, a Manufacturing Execution System used for production operations.

Full-stack work across React TypeScript frontend, C# .NET REST API, and SQL Server stored procedures. The module handles daily worklog submission, shift-based OT calculation (overtime after each shift's normal end time), and a structured approval flow from operator through supervisor.`,
    tech: ['C#', '.NET', 'SQL Server', 'React', 'TypeScript', 'Stored Procedures'],
    category: 'fullstack',
    featured: true,
    demoUrl: '/demo/timesheet-dashboard',
    features: [
      'Shift-aware OT calculation — overtime computed from each shift\'s normal end time',
      'Multi-step approval workflow: Draft → Submitted → Approved / Rejected',
      'Department and status filtering with worklog search',
      'Worklog entry modal with real-time work hours and OT preview',
      'Management summary dashboard: working days, total hours, OT, pending approvals',
      'React TypeScript frontend with .NET REST API and SQL Server stored procedures',
    ],
    highlights: [
      'Shift-aware OT calculation — no manual hour adjustment needed',
      'Approval workflow reduced review time for supervisors',
      'Built within existing enterprise MES stack without disrupting other modules',
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
    longDescription: `Bitkub_Bot is a personal automation project — a crypto trading bot for the Bitkub exchange (Thailand's leading crypto exchange). Built entirely in Python, it connects to the Bitkub REST API and executes trades based on configurable strategies.

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
      'Zero unguarded trades — all orders pass safety checks first',
      'Full audit trail with timestamp and reason on every action',
      'One-command deploy via Docker Compose',
      'Strategy comparison without risking real capital',
    ],
    status: 'active',
    year: 2024,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getProjectsByCategory = (category: string) =>
  projects.filter((p) => p.category === category);
