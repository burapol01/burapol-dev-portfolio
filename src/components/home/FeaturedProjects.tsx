import Link from 'next/link';
import { getFeaturedProjects } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const categoryColor: Record<string, 'blue' | 'purple' | 'green' | 'orange' | 'slate'> = {
  automation: 'orange',
  backend: 'blue',
  fullstack: 'purple',
  data: 'green',
  devops: 'slate',
  mobile: 'green',
};

export default function FeaturedProjects() {
  const featured = getFeaturedProjects();

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Featured Projects
            </h2>
            <p className="text-slate-400 max-w-lg">
              Selected work across automation, APIs, full-stack systems, and DevOps.
            </p>
          </div>
          <Button href="/projects" variant="outline" size="md">
            All Projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <div
              key={project.id}
              className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {project.demoUrl && (
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Interactive Demo
                    </span>
                  )}
                  {i === 0 && (
                    <span className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <Link href={`/projects/${project.slug}`} className="block">
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                {project.shortDescription}
              </p>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech.slice(0, 4).map((t) => (
                  <Badge key={t} label={t} variant={categoryColor[project.category] ?? 'slate'} size="sm" />
                ))}
                {project.tech.length > 4 && (
                  <span className="text-xs text-slate-500 self-center">
                    +{project.tech.length - 4}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <span className="text-xs text-slate-500 capitalize">{project.category}</span>
                {project.demoUrl ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={project.demoUrl}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Live Demo
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-blue-500/70 hover:border-blue-400 text-blue-400 hover:text-blue-300 text-xs font-medium rounded-lg transition-colors"
                    >
                      Case Study
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-blue-500/70 hover:border-blue-400 text-blue-400 hover:text-blue-300 text-xs font-medium rounded-lg transition-colors"
                  >
                    Case Study
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
