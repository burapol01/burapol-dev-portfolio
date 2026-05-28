import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://franzforge.dev'),
  title: {
    default: 'Burapol Ussawawirulrit — Full-Stack Developer',
    template: '%s | Burapol Ussawawirulrit',
  },
  description:
    'Full-Stack Developer based in Bangkok, Thailand. Experienced in C#, .NET, React, TypeScript, MS SQL Server, and CI/CD pipelines. Available for full-time roles and freelance projects.',
  keywords: [
    'Full Stack Developer',
    '.NET Developer',
    'React Developer',
    'TypeScript',
    'C#',
    'MS SQL Server',
    'Docker',
    'Azure DevOps',
    'Bangkok',
    'Thailand',
  ],
  authors: [{ name: 'Burapol Ussawawirulrit' }],
  creator: 'Burapol Ussawawirulrit',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Burapol Ussawawirulrit — Full-Stack Developer',
    description:
      'Full-Stack Developer experienced in C#, .NET, React, TypeScript, MS SQL Server, and CI/CD pipelines.',
    siteName: 'Burapol Ussawawirulrit Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burapol Ussawawirulrit — Full-Stack Developer',
    description:
      'Full-Stack Developer experienced in C#, .NET, React, TypeScript, MS SQL Server, and CI/CD pipelines.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
