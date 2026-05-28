import type { RequestStatus } from '../_types';

const MAIN_STEPS: RequestStatus[] = [
  'Draft', 'Submitted', 'Approved', 'Started', 'In Progress', 'Job Done', 'Closed',
];

const STEP_DOT: Record<RequestStatus, string> = {
  Draft:          'bg-slate-500',
  Submitted:      'bg-blue-500',
  Approved:       'bg-purple-500',
  Started:        'bg-yellow-500',
  'In Progress':  'bg-orange-500',
  'Job Done':     'bg-emerald-500',
  Closed:         'bg-slate-400',
  Rejected:       'bg-red-500',
};

export default function WorkflowStepper({ activeStatus }: { activeStatus?: RequestStatus }) {
  const activeIdx = activeStatus ? MAIN_STEPS.indexOf(activeStatus) : -1;

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Request Workflow Guide</p>

      <div className="flex items-center flex-wrap gap-1">
        {MAIN_STEPS.map((step, i) => {
          const isActive = step === activeStatus;
          const isPast   = activeIdx > i;
          return (
            <span key={step} className="flex items-center gap-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                isActive
                  ? 'border-blue-500/60 bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20'
                  : isPast
                  ? 'border-slate-600 bg-slate-700/40 text-slate-400'
                  : 'border-slate-700/60 bg-slate-800/40 text-slate-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STEP_DOT[step]}`} />
                {step}
              </span>
              {i < MAIN_STEPS.length - 1 && (
                <svg className={`w-3 h-3 shrink-0 ${isPast || isActive ? 'text-slate-600' : 'text-slate-700'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border border-slate-700/60 text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          Submitted
        </span>
        <svg className="w-3 h-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${
          activeStatus === 'Rejected'
            ? 'border-red-500/60 bg-red-500/15 text-red-300'
            : 'border-slate-700/60 text-slate-500'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          Rejected
        </span>
        <span className="text-xs text-slate-600">— requester may resubmit after correction</span>
      </div>
    </div>
  );
}
