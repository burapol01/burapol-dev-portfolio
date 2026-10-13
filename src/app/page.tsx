import Hero from '@/components/home/Hero';
import SkillsGrid from '@/components/home/SkillsGrid';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SkillsGrid />
      <FeaturedProjects />

      <section className="py-20 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 border-y border-slate-800 py-10">
            <div>
              <p className="text-sm font-semibold text-teal-300 mb-3">Recent experience</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Fast Track Revamp
              </h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                Programmer (Backend / .NET Developer) at Tokio Marine Life Insurance
                (Thailand) PCL. Contract work from Jun to Dec 2026.
              </p>
            </div>
            <ul className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <li className="border-l-2 border-teal-400 pl-4">
                Legacy API and business workflow modernization with C# and .NET 8.
              </li>
              <li className="border-l-2 border-slate-600 pl-4">
                SQL Server stored procedure integration, data validation, and UAT checks.
              </li>
              <li className="border-l-2 border-slate-600 pl-4">
                Logging, regression checks, and documentation for release-readiness reviews.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-purple-600/20 border border-blue-500/20 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Looking for a Backend / .NET Developer?
            </h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              Read current experience, technical focus, and case studies.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/about" variant="primary" size="lg">
                View Experience
              </Button>
              <Button href="/resume/burapol-ussawawirulrit-resume.pdf" variant="outline" size="lg" download>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
