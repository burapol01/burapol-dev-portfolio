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

      {/* Services teaser */}
      <section className="py-20 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Available for Freelance Work
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">
            Web apps, .NET APIs, React frontends, SQL optimization, dashboards, and
            deployment pipelines. Let&apos;s build something together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/services" variant="primary" size="lg">
              View Services
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-purple-600/20 border border-blue-500/20 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Looking for a Full Stack Developer?
            </h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              Open to full-time roles and long-term freelance projects. Response
              within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/contact" variant="primary" size="lg">
                Contact Me
              </Button>
              <Button href="/resume.pdf" variant="outline" size="lg" download>
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
