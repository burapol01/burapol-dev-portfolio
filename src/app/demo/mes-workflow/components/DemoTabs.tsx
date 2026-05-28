'use client';

export type DemoTab = 'workflow' | 'timesheet';

const TABS: { id: DemoTab; label: string }[] = [
  { id: 'workflow', label: 'Request Workflow' },
  { id: 'timesheet', label: 'Timesheet & Worklog' },
];

export default function DemoTabs({
  activeTab,
  onChange,
}: {
  activeTab: DemoTab;
  onChange: (tab: DemoTab) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full sm:min-w-0 rounded-xl border border-slate-800 bg-slate-950/50 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
