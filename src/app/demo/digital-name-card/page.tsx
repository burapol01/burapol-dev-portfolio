'use client';

import Link from 'next/link';
import QRCode from 'react-qr-code';
import { useMemo, useState, useSyncExternalStore } from 'react';

type ThemeKey = 'dark' | 'blue' | 'emerald' | 'minimal';
type CopyTarget = 'email' | 'phone' | 'share' | 'vcard' | null;

const FALLBACK_PORTFOLIO_URL = 'https://burapol-dev-portfolio.vercel.app';

const PROFILE = {
  name: 'Burapol Ussawawirulrit',
  initials: 'BU',
  role: 'Full-Stack Developer',
  location: 'Bangkok, Thailand',
  headline: '.NET • React • SQL Server • Docker',
  email: 'burapol_golf@hotmail.com',
  phone: '+66 95-828-5831',
  github: 'https://github.com/burapol01',
};

const THEMES: Record<ThemeKey, { label: string; card: string; accent: string; button: string }> = {
  dark: {
    label: 'Dark',
    card: 'from-slate-900 via-slate-900 to-slate-800 border-slate-700',
    accent: 'text-blue-300',
    button: 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100',
  },
  blue: {
    label: 'Blue',
    card: 'from-slate-950 via-blue-950/70 to-slate-900 border-blue-500/30',
    accent: 'text-blue-300',
    button: 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white',
  },
  emerald: {
    label: 'Emerald',
    card: 'from-slate-950 via-emerald-950/60 to-slate-900 border-emerald-500/30',
    accent: 'text-emerald-300',
    button: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white',
  },
  minimal: {
    label: 'Minimal',
    card: 'from-zinc-950 via-zinc-900 to-slate-950 border-zinc-700',
    accent: 'text-zinc-200',
    button: 'bg-zinc-100 hover:bg-white border-zinc-100 text-zinc-950',
  },
};

const STATS = [
  ['Profile Views', '1,284'],
  ['Resume Clicks', '342'],
  ['Contact Clicks', '186'],
  ['GitHub Clicks', '429'],
];

const USE_CASES = [
  'Share during interviews',
  'Add to resume / email signature',
  'Send to freelance clients',
  'Quick mobile contact access',
];

function subscribe() {
  return () => undefined;
}

export default function DigitalNameCardPage() {
  const [theme, setTheme] = useState<ThemeKey>('dark');
  const [copied, setCopied] = useState<CopyTarget>(null);
  const selectedTheme = THEMES[theme];
  const portfolioUrl = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => FALLBACK_PORTFOLIO_URL,
  );

  const vCard = useMemo(() => [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${PROFILE.name}`,
    'N:Ussawawirulrit;Burapol;;;',
    'ORG:Burapol.dev',
    `TITLE:${PROFILE.role}`,
    `EMAIL:${PROFILE.email}`,
    `TEL:${PROFILE.phone}`,
    `ADR;TYPE=WORK:;;${PROFILE.location};;;;`,
    `URL:${portfolioUrl}`,
    `URL;TYPE=GitHub:${PROFILE.github}`,
    'END:VCARD',
  ].join('\n'), [portfolioUrl]);

  function flash(target: CopyTarget) {
    setCopied(target);
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function copyText(value: string, target: CopyTarget) {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(value);
    flash(target);
  }

  function downloadVCard() {
    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'burapol-ussawawirulrit.vcf';
    link.click();
    URL.revokeObjectURL(url);
    flash('vcard');
  }

  async function shareCard() {
    const shareData = {
      title: PROFILE.name,
      text: `Digital name card for ${PROFILE.name}`,
      url: portfolioUrl,
    };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await copyText(portfolioUrl, 'share');
  }

  return (
    <main className="pt-16 min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-amber-500/5 border-b border-amber-500/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-300/80 flex-1">
            This is a simplified portfolio demo for a digital profile and contact sharing experience. It uses mock data only.
          </p>
          <Link href="/projects/digital-name-card" className="ml-4 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0 transition-colors">
            View case study -&gt;
          </Link>
        </div>
      </div>

      <div className="bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-xs text-slate-500">
                <Link href="/projects" className="hover:text-slate-300 transition-colors">Projects</Link>
                <span>/</span>
                <span className="text-blue-400">Digital Name Card</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Digital Name Card Demo</h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Polished interactive digital business card demo for personal branding and quick contact sharing.
              </p>
            </div>
            <button
              type="button"
              onClick={shareCard}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors self-start shrink-0"
            >
              {copied === 'share' ? 'URL Copied!' : 'Share Card'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <section className={`rounded-2xl border bg-gradient-to-br ${selectedTheme.card} p-6 sm:p-8 shadow-2xl shadow-black/30`}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="h-24 w-24 rounded-2xl bg-slate-100 text-slate-950 grid place-items-center text-2xl font-bold shadow-xl">
                {PROFILE.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold uppercase tracking-wider ${selectedTheme.accent}`}>Digital Profile</p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{PROFILE.name}</h2>
                <p className="mt-1 text-slate-300">{PROFILE.role}</p>
                <p className="mt-2 text-sm text-slate-500">{PROFILE.location}</p>
                <p className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
                  {PROFILE.headline}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-2">
              <ActionLink label="Email" href={`mailto:${PROFILE.email}`} theme={selectedTheme.button} />
              <ActionLink label="Phone" href={`tel:${PROFILE.phone}`} theme={selectedTheme.button} />
              <ActionLink label="GitHub" href={PROFILE.github} theme={selectedTheme.button} />
              <ActionLink label="Portfolio" href={portfolioUrl} theme={selectedTheme.button} />
              <button type="button" onClick={downloadVCard} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${selectedTheme.button}`}>
                {copied === 'vcard' ? 'Downloaded!' : 'Download vCard'}
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Theme Controls</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTheme(key)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      theme === key
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {THEMES[key].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Actions</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <PanelButton onClick={() => copyText(PROFILE.email, 'email')} label={copied === 'email' ? 'Copied!' : 'Copy Email'} />
                <PanelButton onClick={() => copyText(PROFILE.phone, 'phone')} label={copied === 'phone' ? 'Copied!' : 'Copy Phone'} />
                <ActionLink label="Open GitHub" href={PROFILE.github} theme="border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" />
                <PanelButton onClick={downloadVCard} label={copied === 'vcard' ? 'vCard downloaded' : 'Download vCard'} />
                <PanelButton onClick={shareCard} label={copied === 'share' ? 'URL Copied!' : 'Share Card'} wide />
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">QR Code</p>
            <div className="mx-auto w-52 rounded-2xl border border-slate-700 bg-slate-100 p-4">
              <QRCode
                value={portfolioUrl}
                size={176}
                bgColor="#f1f5f9"
                fgColor="#020617"
                className="h-auto w-full"
              />
            </div>
            <p className="mt-4 text-center text-sm text-slate-400">Scan to open portfolio</p>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Analytics Preview</p>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Use Cases</p>
            <ul className="space-y-3">
              {USE_CASES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

function ActionLink({ label, href, theme }: { label: string; href: string; theme: string }) {
  const isExternal = href.startsWith('http');
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${theme}`}
    >
      {label}
    </a>
  );
}

function PanelButton({ label, onClick, wide }: { label: string; onClick: () => void; wide?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors ${wide ? 'sm:col-span-2' : ''}`}
    >
      {label}
    </button>
  );
}
