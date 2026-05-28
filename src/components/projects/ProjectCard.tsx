import Link from 'next/link';
import { Project } from '@/types';
import Badge from '@/components/ui/Badge';

const categoryColor: Record<string, 'blue' | 'purple' | 'green' | 'orange' | 'slate'> = {
  automation: 'orange',
  backend: 'blue',
  frontend: 'blue',
  fullstack: 'purple',
  data: 'green',
  devops: 'slate',
  mobile: 'green',
};

const statusColor: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  completed: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  'in-progress': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">

      {/* Content area — navigates to project detail */}
      <Link href={`/projects/${project.slug}`} className="flex flex-col flex-1 p-6 pb-4">
        {/* Header: icon + badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {project.demoUrl && (
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Interactive Demo
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[project.status]}`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Title + description */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            <span className="text-xs text-slate-500 shrink-0">{project.year}</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {project.shortDescription}
          </p>

          {/* Highlights */}
          {project.highlights.length > 0 && (
            <ul className="space-y-1">
              {project.highlights.slice(0, 2).map((h) => (
                <li key={h} className="flex items-start gap-2 text-xs text-slate-500">
                  <svg className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>

      {/* Tech badges — outside link to keep CTA area clean */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <Badge key={t} label={t} variant={categoryColor[project.category] ?? 'slate'} size="sm" />
          ))}
          {project.tech.length > 5 && (
            <span className="text-xs text-slate-500 self-center">+{project.tech.length - 5}</span>
          )}
        </div>
      </div>

      {/* CTA row */}
      <div className="px-6 pb-5 pt-3 border-t border-slate-800">
        {project.demoUrl ? (
          /* Two-button layout when demo exists */
          <div className="flex gap-2">
            {/* Primary: Live Demo */}
            <Link
              href={project.demoUrl}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Live Demo
            </Link>
            {/* Secondary: Case Study */}
            <Link
              href={`/projects/${project.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-blue-500/70 hover:border-blue-400 text-blue-400 hover:text-blue-300 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Case Study
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          /* Full-width button when no demo */
          <Link
            href={`/projects/${project.slug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-blue-500/70 hover:border-blue-400 text-blue-400 hover:text-blue-300 text-xs font-medium rounded-lg transition-colors"
          >
            Case Study
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>

    </div>
  );
}
