import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const topSkills = [
  { label: 'C# / .NET 8', variant: 'blue' as const },
  { label: 'React / TypeScript', variant: 'purple' as const },
  { label: 'MS SQL Server', variant: 'green' as const },
  { label: 'Docker', variant: 'orange' as const },
  { label: 'Azure DevOps', variant: 'blue' as const },
  { label: 'Python', variant: 'red' as const },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(148,163,184,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Available for new opportunities
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
          <span className="text-white">Burapol</span>{' '}
          <span className="gradient-text">Ussawawirulrit</span>
        </h1>

        {/* Title */}
        <p className="text-xl sm:text-2xl text-slate-400 font-medium mb-6">
          Full-Stack Developer
        </p>

        {/* Tagline */}
        <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed mb-10">
          Building backend services, REST APIs, and web applications using .NET,
          React, and SQL Server. Comfortable working end-to-end across UI, API,
          database, and deployment.
        </p>

        {/* Skill badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {topSkills.map((skill) => (
            <Badge key={skill.label} label={skill.label} variant={skill.variant} size="md" />
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/projects" variant="primary" size="lg">
            View Projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact Me
          </Button>
          <Button
            href="/resume/burapol-ussawawirulrit-resume.pdf"
            variant="ghost"
            size="lg"
            external
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Resume
          </Button>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
