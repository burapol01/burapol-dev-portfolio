import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const topSkills = [
  { label: 'C# / .NET 8', variant: 'blue' as const },
  { label: 'REST APIs', variant: 'blue' as const },
  { label: 'SQL Server', variant: 'green' as const },
  { label: 'Stored Procedures', variant: 'green' as const },
  { label: 'React / TypeScript', variant: 'purple' as const },
  { label: 'Jenkins CI/CD', variant: 'orange' as const },
];

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <p className="mb-8 text-sm font-semibold text-teal-300">
          Backend systems · API integration · SQL Server workflows
        </p>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
          <span className="text-white">Burapol</span>{' '}
          <span className="text-teal-300">Ussawawirulrit</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-300 font-medium mb-6">
          Backend / .NET Developer
        </p>

        <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed mb-10">
          Modernizing business-critical APIs and application workflows with C#, .NET 8,
          SQL Server, and pragmatic full-stack delivery.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {topSkills.map((skill) => (
            <Badge key={skill.label} label={skill.label} variant={skill.variant} size="md" />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/projects" variant="primary" size="lg">
            View Projects
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
      </div>
    </section>
  );
}
