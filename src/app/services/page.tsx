import type { Metadata } from 'next';
import { services } from '@/data/services';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Freelance services: .NET API development, React frontends, SQL optimization, dashboards, and CI/CD deployment pipelines.',
};

export default function ServicesPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
            Freelance Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            What I Can Build for You
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">
            Available for freelance projects and long-term contracts. I work
            independently and deliver production-ready systems.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-all duration-300"
              >
                {/* Icon */}
                <div className="text-3xl mb-4">{service.icon}</div>

                <h3 className="text-lg font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why work with me */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Work With Me</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              I bring production experience, not just theory.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: '🎯',
                title: 'Production-Ready',
                desc: 'Code that ships and stays shipped. Proper error handling, logging, and deployment.',
              },
              {
                icon: '⚡',
                title: 'Fast Delivery',
                desc: 'Focused scope, clean implementation. No over-engineering.',
              },
              {
                icon: '🔧',
                title: 'Full Stack',
                desc: 'I handle both ends. No handoff gaps between frontend and backend.',
              },
              {
                icon: '🤝',
                title: 'Clear Communication',
                desc: 'Regular updates, honest timelines, and straightforward status reporting.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery', desc: 'You describe what you need. I ask the right questions to scope it clearly.' },
              { step: '02', title: 'Proposal', desc: 'I send a clear proposal: scope, timeline, and price. No hidden costs.' },
              { step: '03', title: 'Build', desc: 'I build iteratively with regular check-ins. You always know where things stand.' },
              { step: '04', title: 'Deliver', desc: 'Deployed, tested, documented. Handoff with full source code and setup notes.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-start">
                <span className="text-5xl font-bold text-slate-800 mb-3 font-mono">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-purple-600/20 border border-blue-500/20 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to Start a Project?
            </h2>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">
              Send me a message with what you need. I&apos;ll get back to you within 24
              hours with an honest assessment.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
