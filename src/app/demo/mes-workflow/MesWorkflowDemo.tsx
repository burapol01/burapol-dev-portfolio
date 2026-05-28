'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import type { UserRole } from './_types';
import DemoTabs, { type DemoTab } from './components/DemoTabs';
import RequestWorkflowTab, { type RequestWorkflowTabHandle } from './components/RequestWorkflowTab';
import TimesheetTab, { type TimesheetTabHandle } from './components/TimesheetTab';

export default function MesWorkflowDemo({ initialTab = 'workflow' }: { initialTab?: DemoTab }) {
  const [activeTab, setActiveTab] = useState<DemoTab>(initialTab);
  const [role, setRole] = useState<UserRole>('Requester');
  const requestTabRef = useRef<RequestWorkflowTabHandle>(null);
  const timesheetTabRef = useRef<TimesheetTabHandle>(null);

  function changeTab(tab: DemoTab) {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    if (tab === 'timesheet') params.set('tab', 'timesheet');
    else params.delete('tab');
    const query = params.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }

  return (
    <main className="pt-16 min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-amber-500/5 border-b border-amber-500/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-300/80 flex-1">
            This is a simplified portfolio demo inspired by real-world internal MES workflow experience.
            It uses mock data only and does not include confidential company information.
          </p>
          <Link
            href="/projects/trr-mes-timesheet"
            className="ml-4 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0 transition-colors"
          >
            View case study -&gt;
          </Link>
        </div>
      </div>

      <div className="bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-xs text-slate-500">
                <Link href="/projects" className="hover:text-slate-300 transition-colors">Projects</Link>
                <span>/</span>
                <span className="text-blue-400">MES Request &amp; Worklog</span>
              </div>
              <h1 className="text-2xl font-bold text-white">MES Request & Worklog System Demo</h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Unified manufacturing workflow demo for request approval, technician execution,
                worklog tracking, and shift-aware OT calculation.
              </p>
            </div>
            {activeTab === 'workflow' && role === 'Requester' && (
              <button
                type="button"
                onClick={() => requestTabRef.current?.openCreateModal()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors self-start shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Request
              </button>
            )}
            {activeTab === 'timesheet' && (
              <button
                type="button"
                onClick={() => timesheetTabRef.current?.openCreateModal()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors self-start shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Log Worklog
              </button>
            )}
          </div>

          <div className="mt-6">
            <DemoTabs activeTab={activeTab} onChange={changeTab} />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'workflow' ? (
          <RequestWorkflowTab
            ref={requestTabRef}
            role={role}
            onRoleChange={setRole}
          />
        ) : (
          <TimesheetTab ref={timesheetTabRef} />
        )}
      </div>
    </main>
  );
}
