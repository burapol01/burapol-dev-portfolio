import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
}

export default function Section({
  children,
  className = '',
  id,
  tight = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${tight ? 'py-12' : 'py-20'} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
