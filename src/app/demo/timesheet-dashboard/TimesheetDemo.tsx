'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type WorklogStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
type Shift = 'Morning' | 'Afternoon' | 'Night';

interface WorklogEntry {
  id: string;
  workDate: string;
  employeeName: string;
  department: string;
  shift: Shift;
  startTime: string;
  endTime: string;
  workHours: number;
  otHours: number;
  workCenter: string;
  task: string;
  status: WorklogStatus;
  remark: string;
}

interface AddForm {
  workDate: string;
  employeeName: string;
  department: string;
  shift: Shift;
  startTime: string;
  endTime: string;
  workCenter: string;
  task: string;
  remark: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPLOYEES: { name: string; dept: string }[] = [
  { name: 'Alex Chen',      dept: 'Engineering' },
  { name: 'Maria Santos',   dept: 'IT Support'  },
  { name: 'David Lee',      dept: 'Engineering' },
  { name: 'Sarah Kim',      dept: 'Operations'  },
  { name: 'James Wilson',   dept: 'Maintenance' },
  { name: 'Emma Rodriguez', dept: 'IT Support'  },
];

const DEPARTMENTS = ['Engineering', 'IT Support', 'Operations', 'Maintenance'];

const WORK_CENTERS = ['Facility A', 'Facility B', 'Control Room', 'Server Room'];

const TASKS = [
  'Preventive Maintenance',
  'Corrective Repair',
  'System Inspection',
  'Equipment Calibration',
  'Software Deployment',
  'Network Setup',
];

const SHIFT_CONFIG: Record<Shift, { label: string; normalEndHour: number }> = {
  Morning:   { label: '07:00 – 16:00', normalEndHour: 16 },
  Afternoon: { label: '13:00 – 22:00', normalEndHour: 22 },
  Night:     { label: '22:00 – 07:00', normalEndHour: 7  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ENTRIES: WorklogEntry[] = [
  // May 2026
  { id: 'WL-001', workDate: '2026-05-01', employeeName: 'Alex Chen',      department: 'Engineering', shift: 'Morning',   startTime: '07:00', endTime: '18:30', workHours: 11.5, otHours: 2.5, workCenter: 'Facility A',   task: 'Preventive Maintenance', status: 'Approved',  remark: 'Monthly PM — production line 1'  },
  { id: 'WL-002', workDate: '2026-05-02', employeeName: 'Maria Santos',   department: 'IT Support',  shift: 'Morning',   startTime: '08:00', endTime: '17:00', workHours: 9,    otHours: 1,   workCenter: 'Server Room',    task: 'Software Deployment',    status: 'Approved',  remark: 'OS patch deployment'              },
  { id: 'WL-003', workDate: '2026-05-05', employeeName: 'David Lee',      department: 'Engineering', shift: 'Morning',   startTime: '07:00', endTime: '20:00', workHours: 13,   otHours: 4,   workCenter: 'Facility B',    task: 'Corrective Repair',      status: 'Approved',  remark: 'Emergency pump repair'            },
  { id: 'WL-004', workDate: '2026-05-06', employeeName: 'Sarah Kim',      department: 'Operations',  shift: 'Afternoon', startTime: '13:00', endTime: '22:00', workHours: 9,    otHours: 0,   workCenter: 'Control Room',  task: 'System Inspection',      status: 'Approved',  remark: ''                                 },
  { id: 'WL-005', workDate: '2026-05-07', employeeName: 'James Wilson',   department: 'Maintenance', shift: 'Morning',   startTime: '07:30', endTime: '19:00', workHours: 11.5, otHours: 3,   workCenter: 'Facility A',   task: 'Equipment Calibration',  status: 'Submitted', remark: 'Annual calibration cycle'         },
  { id: 'WL-006', workDate: '2026-05-08', employeeName: 'Emma Rodriguez', department: 'IT Support',  shift: 'Morning',   startTime: '09:00', endTime: '18:00', workHours: 9,    otHours: 2,   workCenter: 'Server Room',   task: 'Network Setup',          status: 'Submitted', remark: 'Network restructure phase 2'      },
  { id: 'WL-007', workDate: '2026-05-12', employeeName: 'Alex Chen',      department: 'Engineering', shift: 'Night',     startTime: '22:00', endTime: '07:00', workHours: 9,    otHours: 0,   workCenter: 'Facility B',    task: 'Preventive Maintenance', status: 'Submitted', remark: 'Night shift scheduled PM'         },
  { id: 'WL-008', workDate: '2026-05-13', employeeName: 'David Lee',      department: 'Engineering', shift: 'Morning',   startTime: '07:00', endTime: '16:00', workHours: 9,    otHours: 0,   workCenter: 'Facility A',   task: 'System Inspection',      status: 'Draft',     remark: ''                                 },
  { id: 'WL-009', workDate: '2026-05-14', employeeName: 'Maria Santos',   department: 'IT Support',  shift: 'Morning',   startTime: '08:00', endTime: '17:30', workHours: 9.5,  otHours: 1.5, workCenter: 'Server Room',   task: 'Software Deployment',    status: 'Draft',     remark: 'Staging environment'              },
  { id: 'WL-010', workDate: '2026-05-15', employeeName: 'Sarah Kim',      department: 'Operations',  shift: 'Morning',   startTime: '07:00', endTime: '16:00', workHours: 9,    otHours: 0,   workCenter: 'Control Room',  task: 'System Inspection',      status: 'Rejected',  remark: 'Incomplete documentation'         },
  // April 2026
  { id: 'WL-011', workDate: '2026-04-01', employeeName: 'James Wilson',   department: 'Maintenance', shift: 'Morning',   startTime: '07:00', endTime: '19:00', workHours: 12,   otHours: 3,   workCenter: 'Facility A',   task: 'Preventive Maintenance', status: 'Approved',  remark: 'Q2 scheduled PM'                  },
  { id: 'WL-012', workDate: '2026-04-03', employeeName: 'Alex Chen',      department: 'Engineering', shift: 'Morning',   startTime: '07:00', endTime: '18:00', workHours: 11,   otHours: 2,   workCenter: 'Facility B',    task: 'Equipment Calibration',  status: 'Approved',  remark: ''                                 },
  { id: 'WL-013', workDate: '2026-04-07', employeeName: 'Emma Rodriguez', department: 'IT Support',  shift: 'Morning',   startTime: '08:00', endTime: '20:00', workHours: 12,   otHours: 4,   workCenter: 'Server Room',   task: 'Network Setup',          status: 'Approved',  remark: 'Critical network upgrade'         },
  { id: 'WL-014', workDate: '2026-04-10', employeeName: 'David Lee',      department: 'Engineering', shift: 'Afternoon', startTime: '13:00', endTime: '22:00', workHours: 9,    otHours: 0,   workCenter: 'Facility A',   task: 'Corrective Repair',      status: 'Approved',  remark: ''                                 },
  { id: 'WL-015', workDate: '2026-04-14', employeeName: 'Sarah Kim',      department: 'Operations',  shift: 'Morning',   startTime: '07:00', endTime: '17:30', workHours: 10.5, otHours: 1.5, workCenter: 'Control Room',  task: 'System Inspection',      status: 'Approved',  remark: ''                                 },
  { id: 'WL-016', workDate: '2026-04-17', employeeName: 'Maria Santos',   department: 'IT Support',  shift: 'Morning',   startTime: '08:00', endTime: '19:00', workHours: 11,   otHours: 3,   workCenter: 'Server Room',   task: 'Software Deployment',    status: 'Approved',  remark: 'Major version upgrade'            },
  { id: 'WL-017', workDate: '2026-04-21', employeeName: 'Alex Chen',      department: 'Engineering', shift: 'Morning',   startTime: '07:00', endTime: '16:00', workHours: 9,    otHours: 0,   workCenter: 'Facility A',   task: 'Preventive Maintenance', status: 'Approved',  remark: ''                                 },
  { id: 'WL-018', workDate: '2026-04-24', employeeName: 'James Wilson',   department: 'Maintenance', shift: 'Night',     startTime: '22:00', endTime: '07:00', workHours: 9,    otHours: 0,   workCenter: 'Facility B',    task: 'Equipment Calibration',  status: 'Approved',  remark: 'Night shift calibration'          },
  { id: 'WL-019', workDate: '2026-04-28', employeeName: 'Emma Rodriguez', department: 'IT Support',  shift: 'Morning',   startTime: '09:00', endTime: '20:00', workHours: 11,   otHours: 4,   workCenter: 'Server Room',   task: 'Network Setup',          status: 'Approved',  remark: 'DR setup completion'              },
  { id: 'WL-020', workDate: '2026-04-30', employeeName: 'David Lee',      department: 'Engineering', shift: 'Morning',   startTime: '07:00', endTime: '18:00', workHours: 11,   otHours: 2,   workCenter: 'Facility B',    task: 'Corrective Repair',      status: 'Approved',  remark: 'End-of-month repair log'          },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

function calcHours(start: string, end: string, shift: Shift): { workHours: number; otHours: number } {
  if (!start || !end) return { workHours: 0, otHours: 0 };
  const s = parseTime(start);
  let e = parseTime(end);
  if (e <= s) e += 24;
  const total = e - s;
  const normalEnd = SHIFT_CONFIG[shift].normalEndHour;
  const normalEndAdj = normalEnd <= s ? normalEnd + 24 : normalEnd;
  const ot = Math.max(0, e - normalEndAdj);
  return {
    workHours: Math.round(total * 100) / 100,
    otHours:   Math.round(ot   * 100) / 100,
  };
}

function fmtDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-');
  return new Date(+y, +m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_STYLE: Record<WorklogStatus, string> = {
  Draft:     'text-slate-400   bg-slate-500/10   border-slate-500/20',
  Submitted: 'text-blue-400    bg-blue-500/10    border-blue-500/20',
  Approved:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Rejected:  'text-red-400     bg-red-500/10     border-red-500/20',
};

function StatusBadge({ status }: { status: WorklogStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLE[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {status}
    </span>
  );
}

const SHIFT_STYLE: Record<Shift, string> = {
  Morning:   'text-amber-400  bg-amber-500/10  border-amber-500/20',
  Afternoon: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Night:     'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
};

function ShiftBadge({ shift }: { shift: Shift }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${SHIFT_STYLE[shift]}`}>
      {shift}
    </span>
  );
}

function StatCard({ label, value, sub, color = 'text-white', icon }: {
  label: string; value: string | number; sub?: string; color?: string; icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-start gap-3">
      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 truncate">{label}</p>
        <p className={`text-xl font-bold leading-tight ${color}`}>{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconCalendar = <svg className="w-4 h-4 text-blue-400"    fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconClock    = <svg className="w-4 h-4 text-purple-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconZap      = <svg className="w-4 h-4 text-orange-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconAlert    = <svg className="w-4 h-4 text-yellow-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconCheck    = <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM: AddForm = {
  workDate: '', employeeName: '', department: '',
  shift: 'Morning', startTime: '', endTime: '',
  workCenter: '', task: '', remark: '',
};

const STATUS_TABS: (WorklogStatus | 'All')[] = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected'];

const TABLE_COLS = ['Work Date', 'Employee', 'Department', 'Shift', 'Start', 'End', 'Work Hrs', 'OT Hrs', 'Work Center', 'Task', 'Status', 'Remark'];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TimesheetDemo() {
  const [entries, setEntries]           = useState<WorklogEntry[]>(INITIAL_ENTRIES);
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<WorklogStatus | 'All'>('All');
  const [search, setSearch]             = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState<AddForm>(EMPTY_FORM);
  const [errors, setErrors]             = useState<Partial<Record<keyof AddForm, string>>>({});

  const months = useMemo(() => {
    const s = new Set(entries.map((e) => e.workDate.slice(0, 7)));
    return [...s].sort().reverse();
  }, [entries]);

  const monthEntries = useMemo(
    () => entries.filter((e) => e.workDate.startsWith(selectedMonth)),
    [entries, selectedMonth],
  );

  const stats = useMemo(() => ({
    days:      new Set(monthEntries.map((e) => e.workDate)).size,
    workHours: monthEntries.reduce((s, e) => s + e.workHours, 0),
    otHours:   monthEntries.reduce((s, e) => s + e.otHours,   0),
    pending:   monthEntries.filter((e) => e.status === 'Submitted').length,
    approved:  monthEntries.filter((e) => e.status === 'Approved').length,
  }), [monthEntries]);

  const filtered = useMemo(() => {
    return monthEntries
      .filter((e) => selectedDept   === 'All' || e.department === selectedDept)
      .filter((e) => selectedStatus === 'All' || e.status     === selectedStatus)
      .filter((e) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return e.employeeName.toLowerCase().includes(q) || e.task.toLowerCase().includes(q);
      })
      .sort((a, b) => b.workDate.localeCompare(a.workDate));
  }, [monthEntries, selectedDept, selectedStatus, search]);

  const preview = useMemo(
    () => form.startTime && form.endTime ? calcHours(form.startTime, form.endTime, form.shift) : null,
    [form.startTime, form.endTime, form.shift],
  );

  const setField = useCallback(<K extends keyof AddForm>(k: K, v: AddForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }, []);

  const pickEmployee = useCallback((name: string) => {
    const emp = EMPLOYEES.find((e) => e.name === name);
    setForm((f) => ({ ...f, employeeName: name, department: emp?.dept ?? '' }));
    setErrors((e) => ({ ...e, employeeName: undefined }));
  }, []);

  function validate() {
    const e: Partial<Record<keyof AddForm, string>> = {};
    if (!form.workDate)     e.workDate     = 'Required';
    if (!form.employeeName) e.employeeName = 'Required';
    if (!form.startTime)    e.startTime    = 'Required';
    if (!form.endTime)      e.endTime      = 'Required';
    if (!form.task)         e.task         = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleSave() {
    if (!validate()) return;
    const { workHours, otHours } = calcHours(form.startTime, form.endTime, form.shift);
    const newEntry: WorklogEntry = {
      id:           `WL-${String(entries.length + 1).padStart(3, '0')}`,
      workDate:     form.workDate,
      employeeName: form.employeeName,
      department:   form.department,
      shift:        form.shift,
      startTime:    form.startTime,
      endTime:      form.endTime,
      workHours,
      otHours,
      workCenter:   form.workCenter,
      task:         form.task,
      status:       'Draft',
      remark:       form.remark,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setSelectedMonth(form.workDate.slice(0, 7));
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function closeModal() {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="pt-16 min-h-screen bg-slate-950">

      {/* Disclaimer bar */}
      <div className="bg-amber-500/5 border-b border-amber-500/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-300/80 flex-1">
            This is a simplified portfolio demo inspired by real-world internal system experience.
            It uses mock data only and does not include confidential company information.
          </p>
          <Link
            href="/projects/trr-mes-timesheet"
            className="ml-4 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0 transition-colors"
          >
            View case study →
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div className="bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-xs text-slate-500">
                <Link href="/projects" className="hover:text-slate-300 transition-colors">Projects</Link>
                <span>/</span>
                <span className="text-blue-400">MES Timesheet & Worklog</span>
              </div>
              <h1 className="text-2xl font-bold text-white">MES Timesheet & Worklog Demo</h1>
              <p className="text-sm text-slate-400 mt-1 max-w-lg">
                Worklog entry with shift-aware OT calculation, department filtering,
                and multi-step approval workflow. Inspired by real MES experience.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors self-start shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Worklog
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            label="Working Days" value={stats.days} sub="unique dates"
            color="text-blue-400" icon={IconCalendar}
          />
          <StatCard
            label="Total Work Hours"
            value={`${stats.workHours.toFixed(1)} h`}
            sub={`avg ${stats.days ? (stats.workHours / stats.days).toFixed(1) : '0'} h/day`}
            color="text-purple-400" icon={IconClock}
          />
          <StatCard
            label="OT Hours" value={`${stats.otHours.toFixed(1)} h`} sub="after shift end"
            color="text-orange-400" icon={IconZap}
          />
          <StatCard
            label="Pending Approval" value={stats.pending} sub="submitted"
            color="text-yellow-400" icon={IconAlert}
          />
          <StatCard
            label="Approved" value={stats.approved} sub="confirmed"
            color="text-emerald-400" icon={IconCheck}
          />
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <input
              type="text"
              placeholder="Search employee or task…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[180px] bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {STATUS_TABS.map((s) => {
              const count = s === 'All' ? monthEntries.length : monthEntries.filter((e) => e.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedStatus === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                  }`}
                >
                  {s} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
            <span className="ml-auto text-xs text-slate-500 self-center">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  {TABLE_COLS.map((col) => (
                    <th key={col} className="px-3 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-14 text-center text-slate-500 text-sm">
                      No records match current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                      <td className="px-3 py-3 text-slate-300 font-mono text-xs whitespace-nowrap">{fmtDate(e.workDate)}</td>
                      <td className="px-3 py-3 text-slate-200 font-medium whitespace-nowrap">{e.employeeName}</td>
                      <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{e.department}</td>
                      <td className="px-3 py-3 whitespace-nowrap"><ShiftBadge shift={e.shift} /></td>
                      <td className="px-3 py-3 text-slate-300 font-mono text-xs whitespace-nowrap">{e.startTime}</td>
                      <td className={`px-3 py-3 font-mono text-xs whitespace-nowrap ${e.otHours > 0 ? 'text-orange-400 font-semibold' : 'text-slate-300'}`}>
                        {e.endTime}
                      </td>
                      <td className="px-3 py-3 text-slate-200 font-semibold whitespace-nowrap">{e.workHours.toFixed(1)}</td>
                      <td className={`px-3 py-3 font-semibold whitespace-nowrap ${e.otHours > 0 ? 'text-orange-400' : 'text-slate-600'}`}>
                        {e.otHours > 0 ? `+${e.otHours.toFixed(1)}` : '—'}
                      </td>
                      <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{e.workCenter || '—'}</td>
                      <td className="px-3 py-3 text-slate-300 whitespace-nowrap">{e.task}</td>
                      <td className="px-3 py-3 whitespace-nowrap"><StatusBadge status={e.status} /></td>
                      <td className="px-3 py-3 text-slate-500 text-xs max-w-[160px] truncate">{e.remark || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>Showing {filtered.length} of {monthEntries.length} records — {monthLabel(selectedMonth)}</span>
              <span className="text-orange-400">
                {filtered.filter((e) => e.otHours > 0).length} entries with OT
              </span>
            </div>
          )}
        </div>

        {/* Workflow guide */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Approval Workflow</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {(['Draft', 'Submitted', 'Approved'] as WorklogStatus[]).map((s, i, arr) => (
              <span key={s} className="flex items-center gap-2">
                <StatusBadge status={s} />
                {i < arr.length - 1 && (
                  <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            ))}
            <span className="text-slate-600 mx-1">|</span>
            <StatusBadge status="Rejected" />
            <span className="text-slate-500 ml-1">→ returns to Draft for revision</span>
          </div>
        </div>

      </div>

      {/* Add Worklog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-white">Log Worklog Entry</h2>
                <p className="text-xs text-slate-500 mt-0.5">Saved as Draft — submit for approval afterward</p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

              {/* Work Date */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Work Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.workDate}
                  onChange={(e) => setField('workDate', e.target.value)}
                  className={`w-full bg-slate-800 border ${errors.workDate ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500`}
                />
                {errors.workDate && <p className="text-xs text-red-400 mt-1">{errors.workDate}</p>}
              </div>

              {/* Employee + Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Employee <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.employeeName}
                    onChange={(e) => pickEmployee(e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.employeeName ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500`}
                  >
                    <option value="">Select…</option>
                    {EMPLOYEES.map((emp) => (
                      <option key={emp.name} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                  {errors.employeeName && <p className="text-xs text-red-400 mt-1">{errors.employeeName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Department</label>
                  <input
                    readOnly
                    value={form.department}
                    placeholder="Auto-filled"
                    className="w-full bg-slate-800/50 border border-slate-700 text-slate-400 text-sm rounded-lg px-3 py-2 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Shift */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Shift <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Morning', 'Afternoon', 'Night'] as Shift[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setField('shift', s)}
                      className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                        form.shift === s
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                      <span className="block text-[10px] opacity-60 mt-0.5">{SHIFT_CONFIG[s].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start + End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Start Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setField('startTime', e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.startTime ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500`}
                  />
                  {errors.startTime && <p className="text-xs text-red-400 mt-1">{errors.startTime}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    End Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setField('endTime', e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.endTime ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500`}
                  />
                  {errors.endTime && <p className="text-xs text-red-400 mt-1">{errors.endTime}</p>}
                </div>
              </div>

              {/* Real-time preview */}
              {preview && (
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-500">Work Hours</p>
                    <p className="text-lg font-bold text-white">{preview.workHours.toFixed(2)} h</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">OT Hours</p>
                    <p className={`text-lg font-bold ${preview.otHours > 0 ? 'text-orange-400' : 'text-slate-500'}`}>
                      {preview.otHours > 0 ? `+${preview.otHours.toFixed(2)} h` : '—'}
                    </p>
                    {preview.otHours > 0 && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        after {SHIFT_CONFIG[form.shift].normalEndHour}:00
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Work Center + Task */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Work Center</label>
                  <select
                    value={form.workCenter}
                    onChange={(e) => setField('workCenter', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select…</option>
                    {WORK_CENTERS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Task / Operation <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.task}
                    onChange={(e) => setField('task', e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.task ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500`}
                  >
                    <option value="">Select…</option>
                    {TASKS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.task && <p className="text-xs text-red-400 mt-1">{errors.task}</p>}
                </div>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Remark</label>
                <textarea
                  rows={2}
                  value={form.remark}
                  onChange={(e) => setField('remark', e.target.value)}
                  placeholder="Optional notes…"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex gap-2 shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Save as Draft
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
