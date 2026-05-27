interface SummaryCardProps {
  label: string;
  value: string | number;
  sub?: string;
  valueColor?: string;
}

export default function SummaryCard({ label, value, sub, valueColor }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold ${valueColor ?? 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}
