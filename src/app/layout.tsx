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
    default: 'Burapol Ussawawirulrit | Backend / .NET Developer',
    template: '%s | Burapol Ussawawirulrit',
  },
  description:
    'Backend-focused .NET developer based in Bangkok, Thailand. Experienced in C#, .NET 8, SQL Server integration, REST APIs, React, and CI/CD workflows.',
  keywords: [
    'Backend Developer',
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
    title: 'Burapol Ussawawirulrit | Backend / .NET Developer',
    description:
      'Backend-focused .NET developer experienced in C#, .NET 8, SQL Server integration, REST APIs, React, and CI/CD workflows.',
    siteName: 'Burapol Ussawawirulrit Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burapol Ussawawirulrit | Backend / .NET Developer',
    description:
      'Backend-focused .NET developer experienced in C#, .NET 8, SQL Server integration, REST APIs, React, and CI/CD workflows.',
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
