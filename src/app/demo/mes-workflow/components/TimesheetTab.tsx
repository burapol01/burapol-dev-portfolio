'use client';

import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import SummaryCard from '@/components/demo/SummaryCard';
import type { Shift, WorklogEntry, WorklogStatus } from '../_types';
import { DEPARTMENTS, EMPLOYEES, INITIAL_WORKLOGS, TASKS, WORK_CENTERS } from '../_data';

const STATUS_TABS: (WorklogStatus | 'All')[] = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected'];
const SHIFTS: Shift[] = ['Morning', 'Afternoon', 'Night'];

const SHIFT_CONFIG: Record<Shift, { label: string; start: string; end: string; normalEndHour: number }> = {
  Morning: { label: '07:00-16:00', start: '07:00', end: '16:00', normalEndHour: 16 },
  Afternoon: { label: '13:00-22:00', start: '13:00', end: '22:00', normalEndHour: 22 },
  Night: { label: '22:00-07:00', start: '22:00', end: '07:00', normalEndHour: 7 },
};

const STATUS_STYLE: Record<WorklogStatus, string> = {
  Draft: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  Submitted: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Rejected: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const SHIFT_STYLE: Record<Shift, string> = {
  Morning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Afternoon: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  Night: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
};

type WorklogForm = {
  workDate: string;
  employeeName: string;
  department: string;
  shift: Shift;
  startTime: string;
  endTime: string;
  workCenter: string;
  task: string;
  remark: string;
};

const EMPTY_FORM: WorklogForm = {
  workDate: '2026-05-28',
  employeeName: '',
  department: '',
  shift: 'Morning',
  startTime: '07:00',
  endTime: '16:00',
  workCenter: '',
  task: '',
  remark: '',
};

function parseTime(value: string): number {
  const [hour, minute] = value.split(':').map(Number);
  return hour + minute / 60;
}

function calcHours(startTime: string, endTime: string, shift: Shift): { workHours: number; otHours: number } {
  if (!startTime || !endTime) return { workHours: 0, otHours: 0 };
  const start = parseTime(startTime);
  let end = parseTime(endTime);
  if (end <= start) end += 24;
  const normalEnd = SHIFT_CONFIG[shift].normalEndHour;
  const normalEndAdjusted = normalEnd <= start ? normalEnd + 24 : normalEnd;
  return {
    workHours: Math.round((end - start) * 100) / 100,
    otHours: Math.round(Math.max(0, end - normalEndAdjusted) * 100) / 100,
  };
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function monthLabel(month: string): string {
  const [year, monthNumber] = month.split('-');
  return new Date(Number(year), Number(monthNumber) - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function StatusPill({ status }: { status: WorklogStatus }) {
  return <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${STATUS_STYLE[status]}`}>{status}</span>;
}

function ShiftPill({ shift }: { shift: Shift }) {
  return <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${SHIFT_STYLE[shift]}`}>{shift}</span>;
}

export interface TimesheetTabHandle {
  openCreateModal: () => void;
}

const TimesheetTab = forwardRef<TimesheetTabHandle>(function TimesheetTab(_, ref) {
  const [entries, setEntries] = useState<WorklogEntry[]>(INITIAL_WORKLOGS);
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<WorklogStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<WorklogForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof WorklogForm, string>>>({});

  const months = useMemo(() => {
    const set = new Set(entries.map((entry) => entry.workDate.slice(0, 7)));
    return [...set].sort().reverse();
  }, [entries]);

  const monthEntries = useMemo(
    () => entries.filter((entry) => entry.workDate.startsWith(selectedMonth)),
    [entries, selectedMonth],
  );

  const stats = useMemo(() => ({
    days: new Set(monthEntries.map((entry) => entry.workDate)).size,
    workHours: monthEntries.reduce((sum, entry) => sum + entry.workHours, 0),
    otHours: monthEntries.reduce((sum, entry) => sum + entry.otHours, 0),
    pending: monthEntries.filter((entry) => entry.status === 'Submitted').length,
    approved: monthEntries.filter((entry) => entry.status === 'Approved').length,
  }), [monthEntries]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return monthEntries
      .filter((entry) => selectedDept === 'All' || entry.department === selectedDept)
      .filter((entry) => selectedStatus === 'All' || entry.status === selectedStatus)
      .filter((entry) => !query || entry.employeeName.toLowerCase().includes(query) || entry.task.toLowerCase().includes(query))
      .sort((a, b) => b.workDate.localeCompare(a.workDate));
  }, [monthEntries, search, selectedDept, selectedStatus]);

  const preview = calcHours(form.startTime, form.endTime, form.shift);

  useImperativeHandle(ref, () => ({
    openCreateModal: () => setShowModal(true),
  }));

  function setField<K extends keyof WorklogForm>(key: K, value: WorklogForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function pickEmployee(name: string) {
    const employee = EMPLOYEES.find((item) => item.name === name);
    setForm((current) => ({ ...current, employeeName: name, department: employee?.dept ?? '' }));
    setErrors((current) => ({ ...current, employeeName: undefined }));
  }

  function pickShift(shift: Shift) {
    setForm((current) => ({
      ...current,
      shift,
      startTime: SHIFT_CONFIG[shift].start,
      endTime: SHIFT_CONFIG[shift].end,
    }));
  }

  function saveWorklog() {
    const nextErrors: Partial<Record<keyof WorklogForm, string>> = {};
    if (!form.workDate) nextErrors.workDate = 'Required';
    if (!form.employeeName) nextErrors.employeeName = 'Required';
    if (!form.startTime) nextErrors.startTime = 'Required';
    if (!form.endTime) nextErrors.endTime = 'Required';
    if (!form.task) nextErrors.task = 'Required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const hours = calcHours(form.startTime, form.endTime, form.shift);
    const entry: WorklogEntry = {
      id: `WL-${String(entries.length + 1).padStart(3, '0')}`,
      workDate: form.workDate,
      employeeName: form.employeeName,
      department: form.department,
      shift: form.shift,
      startTime: form.startTime,
      endTime: form.endTime,
      workHours: hours.workHours,
      otHours: hours.otHours,
      workCenter: form.workCenter,
      task: form.task,
      status: 'Draft',
      remark: form.remark,
    };
    setEntries((current) => [entry, ...current]);
    setSelectedMonth(form.workDate.slice(0, 7));
    setForm(EMPTY_FORM);
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Timesheet dashboard</p>
          <p className="text-sm text-slate-400 mt-1">Shift-aware worklog entry with month, department, status, and text filters.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <SummaryCard label="Working Days" value={stats.days} sub="unique dates" valueColor="text-blue-300" />
        <SummaryCard label="Total Work Hours" value={`${stats.workHours.toFixed(1)} h`} valueColor="text-purple-300" />
        <SummaryCard label="OT Hours" value={`${stats.otHours.toFixed(1)} h`} valueColor="text-orange-300" />
        <SummaryCard label="Pending" value={stats.pending} valueColor="text-yellow-300" />
        <SummaryCard label="Approved" value={stats.approved} valueColor="text-emerald-300" />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2">
            {months.map((month) => <option key={month} value={month}>{monthLabel(month)}</option>)}
          </select>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2">
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee or task"
            className="flex-1 min-w-[220px] bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {STATUS_TABS.map((status) => {
            const count = status === 'All' ? monthEntries.length : monthEntries.filter((entry) => entry.status === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {status} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
          <span className="md:ml-auto text-xs text-slate-500">{filtered.length} record{filtered.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40">
                {['Work Date', 'Employee', 'Department', 'Shift', 'Start Time', 'End Time', 'Work Hours', 'OT Hours', 'Work Center', 'Task', 'Status', 'Remark'].map((head) => (
                  <th key={head} className="px-3 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-14 text-center text-sm text-slate-500">No worklog records match current filters.</td>
                </tr>
              ) : filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                  <td className="px-3 py-3 font-mono text-xs text-slate-300 whitespace-nowrap">{formatDate(entry.workDate)}</td>
                  <td className="px-3 py-3 text-slate-100 font-medium whitespace-nowrap">{entry.employeeName}</td>
                  <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{entry.department}</td>
                  <td className="px-3 py-3"><ShiftPill shift={entry.shift} /></td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-300 whitespace-nowrap">{entry.startTime}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-300 whitespace-nowrap">{entry.endTime}</td>
                  <td className="px-3 py-3 text-slate-200 font-semibold whitespace-nowrap">{entry.workHours.toFixed(1)}</td>
                  <td className={`px-3 py-3 font-semibold whitespace-nowrap ${entry.otHours > 0 ? 'text-orange-300' : 'text-slate-600'}`}>{entry.otHours > 0 ? `+${entry.otHours.toFixed(1)}` : '-'}</td>
                  <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{entry.workCenter || '-'}</td>
                  <td className="px-3 py-3 text-slate-300 max-w-[220px] truncate" title={entry.task}>{entry.task}</td>
                  <td className="px-3 py-3"><StatusPill status={entry.status} /></td>
                  <td className="px-3 py-3 text-slate-500 max-w-[220px] truncate" title={entry.remark}>{entry.remark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Log Worklog Entry</h2>
                <p className="text-xs text-slate-500 mt-1">Saved as Draft with mock data only.</p>
              </div>
              <button type="button" aria-label="Close modal" onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5 space-y-4">
              <FormInput label="Work Date" required type="date" value={form.workDate} error={errors.workDate} onChange={(value) => setField('workDate', value)} />
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Employee <span className="text-red-400">*</span></label>
                  <select value={form.employeeName} onChange={(e) => pickEmployee(e.target.value)} className={`w-full bg-slate-800 border ${errors.employeeName ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2`}>
                    <option value="">Select employee</option>
                    {EMPLOYEES.map((employee) => <option key={employee.name} value={employee.name}>{employee.name}</option>)}
                  </select>
                  {errors.employeeName && <p className="text-xs text-red-400 mt-1">{errors.employeeName}</p>}
                </div>
                <FormInput label="Department" value={form.department} onChange={(value) => setField('department', value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Shift</label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {SHIFTS.map((shift) => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => pickShift(shift)}
                      className={`px-3 py-2 rounded-lg border text-left transition-colors ${
                        form.shift === shift
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{shift}</span>
                      <span className="block text-xs opacity-70">{SHIFT_CONFIG[shift].label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormInput label="Start Time" required type="time" value={form.startTime} error={errors.startTime} onChange={(value) => setField('startTime', value)} />
                <FormInput label="End Time" required type="time" value={form.endTime} error={errors.endTime} onChange={(value) => setField('endTime', value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
                <div>
                  <p className="text-xs text-blue-200">Work hours preview</p>
                  <p className="text-2xl font-bold text-white">{preview.workHours.toFixed(2)} h</p>
                </div>
                <div>
                  <p className="text-xs text-orange-200">OT hours preview</p>
                  <p className={`text-2xl font-bold ${preview.otHours > 0 ? 'text-orange-300' : 'text-slate-500'}`}>{preview.otHours > 0 ? `+${preview.otHours.toFixed(2)} h` : '0.00 h'}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <SelectField label="Project / Work Center" value={form.workCenter} options={WORK_CENTERS} onChange={(value) => setField('workCenter', value)} />
                <SelectField label="Task / Operation" required value={form.task} error={errors.task} options={TASKS} onChange={(value) => setField('task', value)} />
              </div>
              <TextArea label="Remark" value={form.remark} onChange={(value) => setField('remark', value)} />
            </div>
            <div className="px-6 py-4 border-t border-slate-800 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:text-white">Cancel</button>
              <button type="button" onClick={saveWorklog} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white">Save Draft</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TimesheetTab;

function FormInput({
  label,
  value,
  onChange,
  error,
  required,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label} {required && <span className="text-red-400">*</span>}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2`} />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  required,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label} {required && <span className="text-red-400">*</span>}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2`}>
        <option value="">Select</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 resize-none" />
    </div>
  );
}
