import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
  className?: string;
  download?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const variantClasses = {
  primary:
    'bg-blue-600 hover:bg-blue-500 text-white border border-blue-600 hover:border-blue-500',
  secondary:
    'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500',
  outline:
    'bg-transparent hover:bg-blue-600/10 text-blue-400 border border-blue-500 hover:border-blue-400',
  ghost:
    'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-transparent',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  external = false,
  className = '',
  download = false,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    if (external || download) {
      return (
        <a
          href={href}
          className={classes}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          download={download}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
