import Link from 'next/link';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-1.5 font-bold text-white w-fit">
              <span className="text-blue-400 font-mono">&lt;</span>
              <span>Burapol.dev</span>
              <span className="text-blue-400 font-mono">/&gt;</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Full Stack Developer specializing in .NET, React, and DevOps automation.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Contact</h3>
            <div className="space-y-2">
              <a
                href="mailto:burapol_golf@hotmail.com"
                className="block text-sm text-slate-400 hover:text-white transition-colors break-all"
              >
                burapol_golf@hotmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {year} Burapol Ussawawirulrit. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
