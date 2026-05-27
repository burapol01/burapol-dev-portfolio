const statusStyles: Record<string, string> = {
  draft: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  submitted: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-300 border-red-500/30',
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = statusStyles[status.toLowerCase()] ?? statusStyles.draft;
  return (
    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}
