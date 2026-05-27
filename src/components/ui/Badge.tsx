interface BadgeProps {
  label: string;
  variant?: 'blue' | 'purple' | 'green' | 'orange' | 'slate' | 'red';
  size?: 'sm' | 'md';
}

const variantClasses = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export default function Badge({
  label,
  variant = 'slate',
  size = 'md',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
}
