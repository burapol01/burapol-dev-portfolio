import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/projects/ProjectCard';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Portfolio of full-stack projects: .NET APIs, React apps, Python automation, DevOps pipelines, and SQL dashboards.',
};

const categories = [
  { key: 'all', label: 'All' },
  { key: 'automation', label: 'Automation' },
  { key: 'backend', label: 'Backend' },
  { key: 'fullstack', label: 'Full Stack' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'data', label: 'Data / Reporting' },
  { key: 'devops', label: 'DevOps' },
];

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return <ProjectsContent searchParams={searchParams} />;
}

async function ProjectsContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category ?? 'all';

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
            Portfolio
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Projects
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">
            Full-stack systems, automation tools, APIs, and DevOps pipelines built
            across enterprise and personal projects.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => {
              const isActive = cat.key === activeCategory;
              return (
                <a
                  key={cat.key}
                  href={cat.key === 'all' ? '/projects' : `/projects?category=${cat.key}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </a>
              );
            })}
          </div>

          {/* Count */}
          <p className="text-sm text-slate-500 mb-6">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
