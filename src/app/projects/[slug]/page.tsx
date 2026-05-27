import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects, getProjectBySlug } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const categoryColor: Record<string, 'blue' | 'purple' | 'green' | 'orange' | 'slate'> = {
  automation: 'orange',
  backend: 'blue',
  fullstack: 'purple',
  data: 'green',
  devops: 'slate',
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const color = categoryColor[project.category] ?? 'slate';

  return (
    <div className="pt-16">
      {/* Back nav */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge label={project.category} variant={color} />
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                project.status === 'active'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
              }`}
            >
              {project.status}
            </span>
            <span className="text-xs text-slate-500">{project.year}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mb-8">
            {project.shortDescription}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t) => (
              <Badge key={t} label={t} variant={color} size="md" />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button href={project.liveUrl} variant="primary" external>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </Button>
            )}
            {project.githubUrl && (
              <Button href={project.githubUrl} variant="outline" external>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Source
              </Button>
            )}
            <Button href="/contact" variant="ghost">
              Discuss This Project
            </Button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: description + features */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <div className="prose prose-invert max-w-none">
                  {project.longDescription.split('\n\n').map((para, i) => (
                    <p key={i} className="text-slate-400 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
                <ul className="space-y-3">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-300 text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: highlights + tech sidebar */}
            <div className="space-y-6">
              {/* Highlights */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Key Highlights
                </h3>
                <ul className="space-y-3">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm text-slate-300 leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech stack */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <Badge key={t} label={t} variant={color} size="sm" />
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Category</span>
                  <span className="text-slate-300 capitalize">{project.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={`capitalize font-medium ${
                      project.status === 'active' ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Year</span>
                  <span className="text-slate-300">{project.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Interested in similar work?
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            I&apos;m available for full-time roles and freelance projects. Let&apos;s talk.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/contact" variant="primary">Contact Me</Button>
            <Button href="/projects" variant="outline">All Projects</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
