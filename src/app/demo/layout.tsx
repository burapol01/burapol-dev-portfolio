import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Demo | Burapol Ussawawirulrit',
  description:
    'Interactive portfolio demos showcasing full-stack development capabilities — loan management workflows and timesheet systems built with React and TypeScript.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
