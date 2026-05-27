import type { Metadata } from 'next';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Burapol Ussawawirulrit — Full-Stack Developer based in Bangkok, Thailand. Open to full-time roles and freelance projects.',
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Contact Me
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">
            Open to full-time roles, freelance projects, and technical discussions.
            I respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Contact Details</h2>

              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:burapol_golf@hotmail.com"
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Email</p>
                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      burapol_golf@hotmail.com
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href="tel:+66958285831"
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                    <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      +66 95-828-5831
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Location</p>
                    <p className="text-sm text-slate-300">Bangkok, Thailand</p>
                  </div>
                </div>

                {/* Response time */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Response Time</p>
                    <p className="text-sm text-slate-300">Within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Availability badge */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-sm font-medium text-emerald-400">Available Now</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Currently accepting new full-time roles and freelance projects.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Reach Out</h2>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
                <p className="text-slate-400 text-sm leading-relaxed">
                  The best way to reach me is by email. I check it daily and respond
                  promptly. For urgent matters, phone is also available.
                </p>

                <div className="space-y-3 pt-2">
                  <a
                    href="mailto:burapol_golf@hotmail.com"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Me
                  </a>

                  <a
                    href="/resume/burapol-ussawawirulrit-resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-transparent border border-blue-500 hover:bg-blue-600/10 text-blue-400 hover:text-blue-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Resume
                  </a>

                  <Button href="/projects" variant="ghost" className="w-full justify-center">
                    View Projects
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* What I can help with */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Good reasons to reach out
                </h3>
                <ul className="space-y-2.5">
                  {[
                    'Full-time developer role',
                    'Freelance project collaboration',
                    'Technical consultation',
                    'API or database work',
                    'DevOps / deployment help',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
