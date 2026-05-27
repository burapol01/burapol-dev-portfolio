'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SummaryCard from '@/components/demo/SummaryCard';
import StatusBadge from '@/components/demo/StatusBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

type TSStatus = 'Draft' | 'Submitted' | 'Approved';

interface TimesheetEntry {
  id: string;
  workDate: string;
  startTime: string;
  endTime: string;
  project: string;
  task: string;
  otHours: number;
  status: TSStatus;
  remark: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ENTRIES: TimesheetEntry[] = [
  { id: '1',  workDate: '2026-04-28', startTime: '09:00', endTime: '18:00', project: 'Project Alpha', task: 'UI Development',       otHours: 0,   status: 'Approved',  remark: '' },
  { id: '2',  workDate: '2026-04-29', startTime: '09:00', endTime: '20:30', project: 'Project Beta',  task: 'API Integration',      otHours: 2.5, status: 'Approved',  remark: 'Urgent fix' },
  { id: '3',  workDate: '2026-04-30', startTime: '09:00', endTime: '19:00', project: 'Project Alpha', task: 'Testing',              otHours: 1,   status: 'Approved',  remark: '' },
  { id: '4',  workDate: '2026-05-01', startTime: '09:00', endTime: '18:00', project: 'Project Alpha', task: 'Frontend Development', otHours: 0,   status: 'Approved',  remark: '' },
  { id: '5',  workDate: '2026-05-02', startTime: '09:00', endTime: '20:00', project: 'Project Beta',  task: 'API Integration',      otHours: 2,   status: 'Approved',  remark: 'Release deadline' },
  { id: '6',  workDate: '2026-05-05', startTime: '08:30', endTime: '17:00', project: 'Maintenance',   task: 'Bug Fixes',            otHours: 0,   status: 'Approved',  remark: '' },
  { id: '7',  workDate: '2026-05-06', startTime: '09:00', endTime: '19:30', project: 'Project Alpha', task: 'Code Review',          otHours: 1.5, status: 'Approved',  remark: '' },
  { id: '8',  workDate: '2026-05-07', startTime: '09:00', endTime: '18:00', project: 'Internal Dev',  task: 'Documentation',        otHours: 0,   status: 'Submitted', remark: '' },
  { id: '9',  workDate: '2026-05-08', startTime: '09:00', endTime: '18:00', project: 'Project Beta',  task: 'Database Query',       otHours: 0,   status: 'Submitted', remark: '' },
  { id: '10', workDate: '2026-05-09', startTime: '09:00', endTime: '20:00', project: 'Project Alpha', task: 'Feature Development',  otHours: 2,   status: 'Submitted', remark: 'Pending manager review' },
  { id: '11', workDate: '2026-05-12', startTime: '09:00', endTime: '18:00', project: 'Maintenance',   task: 'System Update',        otHours: 0,   status: 'Draft',     remark: '' },
  { id: '12', workDate: '2026-05-13', startTime: '09:00', endTime: '18:00', project: 'Internal Dev',  task: 'Deployment Support',   otHours: 0,   status: 'Draft',     remark: '' },
];

const PROJECTS = ['Project Alpha', 'Project Beta', 'Maintenance', 'Internal Dev'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcOT(endTime: string): number {
  if (!endTime) return 0;
  const [h, m] = endTime.split(':').map(Number);
  const endDecimal = h + m / 60;
  return endDecimal > 18 ? parseFloat((endDecimal - 18).toFixed(2)) : 0;
}

function fmtOT(hours: number) {
  return hours > 0 ? `${hours.toFixed(1)}h` : '—';
}

function getMonthLabel(ym: string) {
  const [y, mo] = ym.split('-').map(Number);
  return new Date(y, mo - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

const EMPTY_FORM = {
  workDate: '',
  startTime: '09:00',
  endTime: '',
  project: 'Project Alpha',
  task: '',
  remark: '',
};

const STATUS_FILTERS: Array<TSStatus | 'All'> = ['All', 'Draft', 'Submitted', 'Approved'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimesheetDemo() {
  const [entries, setEntries] = useState<TimesheetEntry[]>(MOCK_ENTRIES);
  const [monthFilter, setMonthFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<TSStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const monthOptions = useMemo(() => {
    const seen = new Set<string>();
    entries.forEach((e) => seen.add(e.workDate.substring(0, 7)));
    return ['All', ...Array.from(seen).sort().reverse()];
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const monthMatch = monthFilter === 'All' || e.workDate.startsWith(monthFilter);
      const statusMatch = statusFilter === 'All' || e.status === statusFilter;
      return monthMatch && statusMatch;
    });
  }, [entries, monthFilter, statusFilter]);

  const stats = useMemo(() => ({
    totalDays: entries.length,
    totalOT: parseFloat(entries.reduce((s, e) => s + e.otHours, 0).toFixed(2)),
    pending: entries.filter((e) => e.status === 'Submitted').length,
    approved: entries.filter((e) => e.status === 'Approved').length,
  }), [entries]);

  const otPreview = useMemo(() => calcOT(form.endTime), [form.endTime]);

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleAdd = () => {
    if (!form.workDate) { setFormError('Work date is required.'); return; }
    if (!form.startTime) { setFormError('Start time is required.'); return; }
    if (!form.endTime) { setFormError('End time is required.'); return; }
    if (form.endTime <= form.startTime) {
      setFormError('End time must be after start time.');
      return;
    }
    if (!form.task.trim()) { setFormError('Task description is required.'); return; }

    const ot = calcOT(form.endTime);
    const next: TimesheetEntry = {
      id: Date.now().toString(),
      workDate: form.workDate,
      startTime: form.startTime,
      endTime: form.endTime,
      project: form.project,
      task: form.task.trim(),
      otHours: ot,
      status: 'Draft',
      remark: form.remark.trim(),
    };
    setEntries((prev) => [next, ...prev]);
    closeModal();
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Demo notice */}
      <div className="bg-amber-500/8 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-amber-300/80">
            Portfolio demo — all data is fictional mock data. No real records or personal information.
          </p>
          <Link
            href="/projects/trr-mes-timesheet"
            className="ml-auto text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0 transition-colors"
          >
            View case study →
          </Link>
        </div>
      </div>

      {/* Page header */}
      <section className="py-10 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs">
                <Link
                  href="/projects"
                  className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Projects
                </Link>
                <span className="text-slate-700">/</span>
                <span className="text-blue-400 font-medium">Timesheet Dashboard Demo</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
                Timesheet & OT Dashboard
              </h1>
              <p className="text-sm text-slate-400 max-w-xl">
                Work hour logging with automatic OT calculation (hours after 18:00),
                monthly summaries, and approval status tracking. Based on the TRR MES
                Timesheet module.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0 self-start"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Time
            </button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Working Days"
            value={stats.totalDays}
            sub="All log entries"
          />
          <SummaryCard
            label="Total OT Hours"
            value={`${stats.totalOT}h`}
            sub="After 18:00"
            valueColor="text-orange-400"
          />
          <SummaryCard
            label="Pending Approval"
            value={stats.pending}
            sub="Submitted"
            valueColor="text-blue-400"
          />
          <SummaryCard
            label="Approved Logs"
            value={stats.approved}
            sub="Confirmed entries"
            valueColor="text-emerald-400"
          />
        </div>

        {/* Table card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-800">
            {/* Month filter */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Months' : getMonthLabel(m)}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <div className="flex items-center gap-1">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    statusFilter === s
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* OT info */}
            <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              OT calculated after 18:00
              <span className="mx-1 text-slate-700">·</span>
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    Work Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                    Start
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                    End
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    Project
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                    Task
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    OT Hours
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-14 text-slate-500 text-sm"
                    >
                      No records match this filter.
                    </td>
                  </tr>
                )}
                {filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs whitespace-nowrap">
                      {entry.workDate}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">
                      {entry.startTime}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">
                      <span
                        className={entry.otHours > 0 ? 'text-orange-400 font-medium' : 'text-slate-400'}
                      >
                        {entry.endTime}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                      {entry.project}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">
                      {entry.task}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-xs font-mono font-medium ${
                          entry.otHours > 0
                            ? 'text-orange-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {fmtOT(entry.otHours)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[160px] truncate">
                      {entry.remark || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Time Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <h2 className="text-base font-semibold text-white">Log Work Time</h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              {formError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Work Date <span className="text-blue-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.workDate}
                  onChange={(e) => setForm((p) => ({ ...p, workDate: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Start Time <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    End Time <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* OT preview */}
              {form.endTime && (
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs border ${
                    otPreview > 0
                      ? 'bg-orange-500/10 border-orange-500/20 text-orange-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {otPreview > 0 ? (
                    <span>
                      OT detected: <strong>{otPreview.toFixed(2)}h</strong> (after 18:00)
                    </span>
                  ) : (
                    <span>No OT — end time is 18:00 or earlier</span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Project <span className="text-blue-400">*</span>
                </label>
                <select
                  value={form.project}
                  onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  {PROJECTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Task Description <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.task}
                  onChange={(e) => setForm((p) => ({ ...p, task: e.target.value }))}
                  placeholder="e.g. Frontend Development"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Remark
                </label>
                <input
                  type="text"
                  value={form.remark}
                  onChange={(e) => setForm((p) => ({ ...p, remark: e.target.value }))}
                  placeholder="Optional note"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2.5 text-xs text-slate-500">
                <svg className="w-3.5 h-3.5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                New entries are saved as{' '}
                <span className="text-slate-300 font-medium ml-1">Draft</span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6 sticky bottom-0 bg-slate-900 pt-2">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white font-medium transition-colors"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
