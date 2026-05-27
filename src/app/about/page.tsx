import type { Metadata } from 'next';
import { skills, skillCategories } from '@/data/skills';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Full-Stack Developer with experience in C#, .NET, React, TypeScript, MS SQL Server, and CI/CD pipelines. Based in Bangkok, Thailand.',
};

const experiences = [
  {
    period: 'Mar 2026 – Apr 2026',
    role: 'Full-Stack Developer (Contract)',
    company: 'Cloud Fission Co., Ltd. — On-site at Government Pension Fund (GPF)',
    description:
      'Supported enhancement and maintenance of internal GPF applications. Investigated and resolved bugs, reviewed system configurations, and improved local environment setup. Reviewed static asset paths and supported CDN-related front-end adjustments. Assisted with unit testing and deployment workflow support.',
    tech: ['C#', '.NET Core', 'MS SQL Server', 'Jenkins', 'CI/CD'],
  },
  {
    period: 'Jul 2022 – Dec 2025',
    role: 'Software Developer (Junior)',
    company: 'Thai Roong Ruang Technologies Co., Ltd.',
    description:
      'Developed and maintained web applications and backend services for internal systems. Built REST APIs and integrated front-end with database workflows. Wrote and optimized SQL queries and Stored Procedures using MS SQL Server. Collaborated via Git and Azure DevOps for delivery and deployment. Improved data accuracy and reduced manual steps by refining validation and workflow logic.',
    tech: ['C#', '.NET', 'MS SQL Server', 'Stored Procedures', 'React', 'TypeScript', 'JavaScript', 'Git', 'Azure DevOps'],
  },
];

const education = {
  university: 'Rajamangala University of Technology Phra Nakhon (Thewet Campus)',
  degree: 'Bachelor of Business Administration (B.B.A.)',
  field: 'Information Technology & Software Development',
  year: '2020',
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  red: 'bg-red-500/10 text-red-300 border-red-500/20',
  slate: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
};

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
                About Me
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                Burapol Ussawawirulrit
              </h1>
              <p className="text-xl text-slate-300 font-medium mb-6">
                Full-Stack Developer · Bangkok, Thailand
              </p>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  Full-Stack Developer with experience building backend services and
                  web applications. Skilled in C#, .NET Framework, .NET 8, RESTful
                  API development, React, JavaScript, TypeScript, MS SQL Server, and
                  Stored Procedures.
                </p>
                <p>
                  Comfortable working end-to-end across UI, API, database, and
                  deployment workflows. I have delivered modules in enterprise internal
                  systems and have hands-on experience with Git, Azure DevOps, Jenkins,
                  CI/CD, Docker, and Python.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button href="/projects" variant="primary">
                  View Projects
                </Button>
                <Button
                  href="/resume/burapol-ussawawirulrit-resume.pdf"
                  variant="outline"
                  external
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Resume
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '3+', label: 'Years Experience' },
                { value: '3+', label: 'Projects Delivered' },
                { value: '.NET', label: 'Primary Backend' },
                { value: 'React', label: 'Primary Frontend' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center"
                >
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                    <p className="text-blue-400 text-sm font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono bg-slate-800 px-3 py-1 rounded-full whitespace-nowrap self-start">
                    {exp.period}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">Education</h2>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {education.degree}
                </h3>
                <p className="text-blue-400 text-sm font-medium mb-1">{education.field}</p>
                <p className="text-slate-400 text-sm">{education.university}</p>
              </div>
              <span className="text-xs text-slate-500 font-mono bg-slate-800 px-3 py-1 rounded-full whitespace-nowrap self-start">
                Graduated {education.year}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">Technical Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillCategories.map((cat) => {
              const cls = colorMap[cat.color];
              const catSkills = skills.filter((s) => s.category === cat.key);
              return (
                <div key={cat.key} className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                    {cat.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((s) => (
                      <span key={s.name} className={`text-xs px-3 py-1 rounded-full border font-medium ${cls}`}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Open to full-time roles and freelance projects. Response within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/contact" variant="primary" size="lg">
              Contact Me
            </Button>
            <Button
              href="/resume/burapol-ussawawirulrit-resume.pdf"
              variant="outline"
              size="lg"
              external
            >
              Download Resume
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
