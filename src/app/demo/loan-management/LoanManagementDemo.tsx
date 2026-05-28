'use client';

// Selected workflow: Loan Request & Approval
// Reason: clearest business flow for a general audience — CRUD + multi-step
// approval, visible status transitions, amount tracking. No industry jargon
// needed to understand it. Inspired by SCSS Accounting & Loan Module (read-only
// reference only). All data is mock; no confidential company information included.

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import SummaryCard from '@/components/demo/SummaryCard';
import StatusBadge from '@/components/demo/StatusBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

type LoanStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
type LoanType   = 'Seasonal Loan' | 'Equipment Loan' | 'Emergency Loan' | 'Short-term Loan';

interface LoanRequest {
  id:          string;
  requestNo:   string;
  farmerName:  string;
  contractNo:  string;
  loanType:    LoanType;
  amount:      number;
  purpose:     string;
  status:      LoanStatus;
  createdDate: string;
  reviewer:    string;
  remark:      string;
}

interface AddForm {
  farmerName:  string;
  contractNo:  string;
  loanType:    LoanType;
  amount:      string;
  purpose:     string;
  remark:      string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOAN_TYPES: LoanType[] = [
  'Seasonal Loan', 'Equipment Loan', 'Emergency Loan', 'Short-term Loan',
];

const STATUS_TABS: (LoanStatus | 'All')[] = [
  'All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected',
];

const EMPTY_FORM: AddForm = {
  farmerName: '', contractNo: '', loanType: 'Seasonal Loan',
  amount: '', purpose: '', remark: '',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_REQUESTS: LoanRequest[] = [
  // May 2026
  { id: '1',  requestNo: 'LR-2026-05-001', farmerName: 'Somchai Wattana',    contractNo: 'CTR-2026-031', loanType: 'Seasonal Loan',   amount: 80000,  purpose: 'Farming supply purchase',    status: 'Approved',     createdDate: '2026-05-01', reviewer: 'Finance Officer A', remark: '' },
  { id: '2',  requestNo: 'LR-2026-05-002', farmerName: 'Wanida Promma',      contractNo: 'CTR-2026-032', loanType: 'Equipment Loan',  amount: 150000, purpose: 'Tractor purchase',           status: 'Under Review', createdDate: '2026-05-02', reviewer: 'Committee Board',  remark: 'Pending collateral verification' },
  { id: '3',  requestNo: 'LR-2026-05-003', farmerName: 'Narong Srisuk',      contractNo: 'CTR-2026-033', loanType: 'Short-term Loan', amount: 35000,  purpose: 'Working capital',            status: 'Submitted',    createdDate: '2026-05-05', reviewer: 'Finance Officer B', remark: '' },
  { id: '4',  requestNo: 'LR-2026-05-004', farmerName: 'Malee Chaiwong',     contractNo: 'CTR-2026-034', loanType: 'Emergency Loan',  amount: 20000,  purpose: 'Medical expense',            status: 'Approved',     createdDate: '2026-05-06', reviewer: 'Branch Manager',   remark: '' },
  { id: '5',  requestNo: 'LR-2026-05-005', farmerName: 'Prasert Kittipong',  contractNo: 'CTR-2026-035', loanType: 'Seasonal Loan',   amount: 120000, purpose: 'Land preparation',           status: 'Rejected',     createdDate: '2026-05-07', reviewer: 'Finance Officer A', remark: 'Insufficient collateral' },
  { id: '6',  requestNo: 'LR-2026-05-006', farmerName: 'Siriporn Boonmee',   contractNo: 'CTR-2026-036', loanType: 'Equipment Loan',  amount: 95000,  purpose: 'Irrigation equipment',       status: 'Under Review', createdDate: '2026-05-08', reviewer: 'Committee Board',  remark: '' },
  { id: '7',  requestNo: 'LR-2026-05-007', farmerName: 'Kitti Thongchai',    contractNo: 'CTR-2026-037', loanType: 'Short-term Loan', amount: 45000,  purpose: 'Harvest expense',            status: 'Submitted',    createdDate: '2026-05-09', reviewer: 'Finance Officer B', remark: '' },
  { id: '8',  requestNo: 'LR-2026-05-008', farmerName: 'Nattaporn Mungkorn', contractNo: 'CTR-2026-038', loanType: 'Seasonal Loan',   amount: 60000,  purpose: 'Crop input supply',          status: 'Draft',        createdDate: '2026-05-12', reviewer: '',                 remark: '' },
  { id: '9',  requestNo: 'LR-2026-05-009', farmerName: 'Pornpimol Sombat',   contractNo: 'CTR-2026-039', loanType: 'Emergency Loan',  amount: 15000,  purpose: 'Equipment repair',           status: 'Draft',        createdDate: '2026-05-13', reviewer: '',                 remark: 'Documents under preparation' },
  { id: '10', requestNo: 'LR-2026-05-010', farmerName: 'Thawatchai Panya',   contractNo: 'CTR-2026-040', loanType: 'Seasonal Loan',   amount: 200000, purpose: 'Large-scale farm expansion', status: 'Approved',     createdDate: '2026-05-14', reviewer: 'Branch Manager',   remark: '' },
  { id: '11', requestNo: 'LR-2026-05-011', farmerName: 'Benjamas Worawit',   contractNo: 'CTR-2026-041', loanType: 'Equipment Loan',  amount: 180000, purpose: 'Heavy machinery',            status: 'Rejected',     createdDate: '2026-05-15', reviewer: 'Finance Officer A', remark: 'Credit score below threshold' },
  { id: '12', requestNo: 'LR-2026-05-012', farmerName: 'Surachai Nakorn',    contractNo: 'CTR-2026-042', loanType: 'Short-term Loan', amount: 55000,  purpose: 'Post-harvest cost',          status: 'Submitted',    createdDate: '2026-05-19', reviewer: 'Finance Officer B', remark: '' },
  // April 2026
  { id: '13', requestNo: 'LR-2026-04-001', farmerName: 'Pairoj Thongbai',    contractNo: 'CTR-2026-019', loanType: 'Seasonal Loan',   amount: 90000,  purpose: 'Seasonal preparation',       status: 'Approved',     createdDate: '2026-04-01', reviewer: 'Finance Officer A', remark: '' },
  { id: '14', requestNo: 'LR-2026-04-002', farmerName: 'Ratana Sukjai',      contractNo: 'CTR-2026-020', loanType: 'Equipment Loan',  amount: 250000, purpose: 'Combine harvester',          status: 'Approved',     createdDate: '2026-04-03', reviewer: 'Committee Board',  remark: '' },
  { id: '15', requestNo: 'LR-2026-04-003', farmerName: 'Chanon Buathong',    contractNo: 'CTR-2026-021', loanType: 'Short-term Loan', amount: 40000,  purpose: 'Bridge financing',           status: 'Approved',     createdDate: '2026-04-07', reviewer: 'Finance Officer B', remark: '' },
  { id: '16', requestNo: 'LR-2026-04-004', farmerName: 'Ladda Intarapong',   contractNo: 'CTR-2026-022', loanType: 'Emergency Loan',  amount: 25000,  purpose: 'Crop damage recovery',       status: 'Rejected',     createdDate: '2026-04-10', reviewer: 'Finance Officer A', remark: 'Not eligible this season' },
  { id: '17', requestNo: 'LR-2026-04-005', farmerName: 'Mongkol Sriwan',     contractNo: 'CTR-2026-023', loanType: 'Seasonal Loan',   amount: 110000, purpose: 'Annual farm inputs',         status: 'Approved',     createdDate: '2026-04-14', reviewer: 'Branch Manager',   remark: '' },
  { id: '18', requestNo: 'LR-2026-04-006', farmerName: 'Porntip Chinapat',   contractNo: 'CTR-2026-024', loanType: 'Equipment Loan',  amount: 320000, purpose: 'Warehouse construction',     status: 'Approved',     createdDate: '2026-04-17', reviewer: 'Committee Board',  remark: '' },
  { id: '19', requestNo: 'LR-2026-04-007', farmerName: 'Apirak Wongsak',     contractNo: 'CTR-2026-025', loanType: 'Short-term Loan', amount: 30000,  purpose: 'Operational cost',           status: 'Approved',     createdDate: '2026-04-21', reviewer: 'Finance Officer B', remark: '' },
  { id: '20', requestNo: 'LR-2026-04-008', farmerName: 'Suchada Petcharat',  contractNo: 'CTR-2026-026', loanType: 'Seasonal Loan',   amount: 75000,  purpose: 'Pre-season preparation',     status: 'Approved',     createdDate: '2026-04-28', reviewer: 'Finance Officer A', remark: '' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtAmount(n: number) {
  return '฿' + n.toLocaleString('en-US');
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function monthLabel(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(+y, +m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

const TABLE_COLS = [
  'Actions', 'Request No.', 'Farmer / Customer', 'Contract No.',
  'Loan Type', 'Amount', 'Status', 'Created Date', 'Reviewer', 'Remark',
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LoanManagementDemo() {
  const [requests, setRequests]         = useState<LoanRequest[]>(INITIAL_REQUESTS);
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [selectedType, setSelectedType] = useState<LoanType | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<LoanStatus | 'All'>('All');
  const [search, setSearch]             = useState('');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewRequest, setViewRequest]   = useState<LoanRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Form state
  const [form, setForm]     = useState<AddForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AddForm, string>>>({});

  // ── Derived data ────────────────────────────────────────────────────────────

  const months = useMemo(() => {
    const s = new Set(requests.map((r) => r.createdDate.slice(0, 7)));
    return [...s].sort().reverse();
  }, [requests]);

  const stats = useMemo(() => {
    const thisMonth = requests.filter((r) => r.createdDate.startsWith('2026-05'));
    return {
      total:          requests.length,
      pending:        requests.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length,
      approvedAmount: requests.filter((r) => r.status === 'Approved').reduce((s, r) => s + r.amount, 0),
      rejected:       requests.filter((r) => r.status === 'Rejected').length,
      thisMonth:      thisMonth.length,
    };
  }, [requests]);

  const filtered = useMemo(() => {
    return requests
      .filter((r) => r.createdDate.startsWith(selectedMonth))
      .filter((r) => selectedType   === 'All' || r.loanType === selectedType)
      .filter((r) => selectedStatus === 'All' || r.status   === selectedStatus)
      .filter((r) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          r.requestNo.toLowerCase().includes(q)  ||
          r.farmerName.toLowerCase().includes(q)  ||
          r.contractNo.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.createdDate.localeCompare(a.createdDate));
  }, [requests, selectedMonth, selectedType, selectedStatus, search]);

  const monthTabCount = useCallback(
    (s: LoanStatus | 'All') => {
      const base = requests.filter((r) => r.createdDate.startsWith(selectedMonth));
      return s === 'All' ? base.length : base.filter((r) => r.status === s).length;
    },
    [requests, selectedMonth],
  );

  // ── Actions ─────────────────────────────────────────────────────────────────

  function transition(id: string, status: LoanStatus, patch?: Partial<LoanRequest>) {
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, status, ...patch } : r),
    );
  }

  function handleRejectConfirm() {
    if (!rejectTarget) return;
    transition(rejectTarget, 'Rejected', { remark: rejectReason.trim() || 'Rejected by reviewer' });
    setRejectTarget(null);
    setRejectReason('');
  }

  // ── Add form ─────────────────────────────────────────────────────────────────

  const setField = useCallback(<K extends keyof AddForm>(k: K, v: AddForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }, []);

  function validate() {
    const e: Partial<Record<keyof AddForm, string>> = {};
    if (!form.farmerName.trim())  e.farmerName  = 'Required';
    if (!form.contractNo.trim())  e.contractNo  = 'Required';
    if (!form.loanType)           e.loanType    = 'Required';
    const amt = Number(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Must be greater than 0';
    setErrors(e);
    return !Object.keys(e).length;
  }

  function handleAddSave() {
    if (!validate()) return;
    const newReq: LoanRequest = {
      id:          Date.now().toString(),
      requestNo:   `LR-${selectedMonth}-${String(requests.length + 1).padStart(3, '0')}`,
      farmerName:  form.farmerName.trim(),
      contractNo:  form.contractNo.trim().toUpperCase(),
      loanType:    form.loanType,
      amount:      Number(form.amount),
      purpose:     form.purpose.trim(),
      status:      'Draft',
      createdDate: new Date().toISOString().slice(0, 10),
      reviewer:    '',
      remark:      form.remark.trim(),
    };
    setRequests((prev) => [newReq, ...prev]);
    setShowAddModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function closeAdd() {
    setShowAddModal(false);
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
            href="/projects/scss-accounting-loan"
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
                <span className="text-blue-400">SCSS Loan & Accounting</span>
              </div>
              <h1 className="text-2xl font-bold text-white">SCSS Loan & Accounting Workflow Demo</h1>
              <p className="text-sm text-slate-400 mt-1 max-w-lg">
                Loan request submission and multi-step approval workflow. Demonstrates
                request management, status transitions, and accounting summary views
                inspired by real enterprise system experience.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors self-start shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Request
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <SummaryCard label="Total Requests"   value={stats.total}                   sub="All records"       />
          <SummaryCard label="Pending Review"   value={stats.pending}                 sub="Submitted + Review" valueColor="text-amber-400"   />
          <SummaryCard label="Approved Amount"  value={fmtAmount(stats.approvedAmount)} sub="Sum of approved"  valueColor="text-emerald-400" />
          <SummaryCard label="Rejected"         value={stats.rejected}                sub="Declined requests" valueColor="text-red-400"     />
          <SummaryCard label="This Month"       value={stats.thisMonth}               sub="May 2026"          valueColor="text-blue-400"    />
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as LoanType | 'All')}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Loan Types</option>
              {LOAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <input
              type="text"
              placeholder="Search by request no, name, contract…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {STATUS_TABS.map((s) => {
              const count = monthTabCount(s);
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
                    <th key={col} className={`px-3 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap ${col === 'Actions' ? 'w-[72px] min-w-[72px]' : ''}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={TABLE_COLS.length} className="px-4 py-14 text-center text-slate-500 text-sm">
                      No records match current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((req) => (
                    <tr key={req.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                      <td className="px-3 py-3 w-[72px] min-w-[72px] whitespace-nowrap">
                        <ActionButtons
                          req={req}
                          onView={() => setViewRequest(req)}
                          onSubmit={() => transition(req.id, 'Submitted')}
                          onReview={() => transition(req.id, 'Under Review', { reviewer: 'Finance Officer A' })}
                          onApprove={() => transition(req.id, 'Approved', { reviewer: 'Branch Manager' })}
                          onReject={() => { setRejectTarget(req.id); setRejectReason(''); }}
                        />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-blue-400 whitespace-nowrap">{req.requestNo}</td>
                      <td className="px-3 py-3 text-slate-200 font-medium whitespace-nowrap">{req.farmerName}</td>
                      <td className="px-3 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">{req.contractNo}</td>
                      <td className="px-3 py-3 text-slate-300 whitespace-nowrap">{req.loanType}</td>
                      <td className="px-3 py-3 font-mono text-sm text-slate-200 text-right whitespace-nowrap">{fmtAmount(req.amount)}</td>
                      <td className="px-3 py-3 whitespace-nowrap"><StatusBadge status={req.status} /></td>
                      <td className="px-3 py-3 text-slate-400 text-xs whitespace-nowrap">{fmtDate(req.createdDate)}</td>
                      <td className="px-3 py-3 text-slate-400 text-xs whitespace-nowrap">{req.reviewer || '—'}</td>
                      <td className="px-3 py-3 text-slate-500 text-xs max-w-[160px] truncate">{req.remark || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
              Showing {filtered.length} of {requests.filter((r) => r.createdDate.startsWith(selectedMonth)).length} records — {monthLabel(selectedMonth)}
            </div>
          )}
        </div>

        {/* Workflow guide */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Approval Workflow</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {(['Draft', 'Submitted', 'Under Review', 'Approved'] as LoanStatus[]).map((s, i, arr) => (
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
            <span className="text-slate-500 ml-1">→ can be resubmitted</span>
          </div>
        </div>

      </div>

      {/* ── View Modal ───────────────────────────────────────────────────────── */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setViewRequest(null)} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
              <div>
                <p className="text-xs font-mono text-blue-400">{viewRequest.requestNo}</p>
                <h2 className="text-base font-semibold text-white">{viewRequest.farmerName}</h2>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={viewRequest.status} />
                <button onClick={() => setViewRequest(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto px-6 py-5 flex-1 space-y-4">
              <Section title="Request Information">
                <Field label="Contract No."    value={viewRequest.contractNo} mono />
                <Field label="Created Date"    value={fmtDate(viewRequest.createdDate)} />
                <Field label="Reviewer"        value={viewRequest.reviewer || '—'} />
              </Section>
              <Section title="Loan Details">
                <Field label="Loan Type"       value={viewRequest.loanType} />
                <Field label="Requested Amount" value={fmtAmount(viewRequest.amount)} mono />
                <Field label="Purpose"         value={viewRequest.purpose || '—'} />
              </Section>
              {viewRequest.remark && (
                <Section title="Remark">
                  <p className="text-sm text-slate-300">{viewRequest.remark}</p>
                </Section>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-800 shrink-0">
              <button
                onClick={() => setViewRequest(null)}
                className="w-full px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ──────────────────────────────────────────────────────── */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setRejectTarget(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">Reject Request</h2>
              <p className="text-xs text-slate-500 mt-0.5">Provide a reason for rejection</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Insufficient collateral…"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => setRejectTarget(null)}
                className="flex-1 px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Request Modal ─────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeAdd} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-white">New Loan Request</h2>
                <p className="text-xs text-slate-500 mt-0.5">Saved as Draft — submit for review afterward</p>
              </div>
              <button onClick={closeAdd} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

              {/* Farmer / Customer Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Farmer / Customer Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.farmerName}
                  onChange={(e) => setField('farmerName', e.target.value)}
                  placeholder="Enter full name"
                  className={`w-full bg-slate-800 border ${errors.farmerName ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-blue-500`}
                />
                {errors.farmerName && <p className="text-xs text-red-400 mt-1">{errors.farmerName}</p>}
              </div>

              {/* Contract No. */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Contract No. <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.contractNo}
                  onChange={(e) => setField('contractNo', e.target.value)}
                  placeholder="e.g. CTR-2026-043"
                  className={`w-full bg-slate-800 border ${errors.contractNo ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono`}
                />
                {errors.contractNo && <p className="text-xs text-red-400 mt-1">{errors.contractNo}</p>}
              </div>

              {/* Loan Type + Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Loan Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.loanType}
                    onChange={(e) => setField('loanType', e.target.value as LoanType)}
                    className={`w-full bg-slate-800 border ${errors.loanType ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500`}
                  >
                    {LOAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Amount (฿) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={(e) => setField('amount', e.target.value)}
                    placeholder="e.g. 50000"
                    className={`w-full bg-slate-800 border ${errors.amount ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-blue-500`}
                  />
                  {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount}</p>}
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Purpose</label>
                <input
                  type="text"
                  value={form.purpose}
                  onChange={(e) => setField('purpose', e.target.value)}
                  placeholder="e.g. Farming supply purchase"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
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

            <div className="px-6 py-4 border-t border-slate-800 flex gap-2 shrink-0">
              <button
                onClick={closeAdd}
                className="flex-1 px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSave}
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

// ─── Helper sub-components ────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
      <div className="rounded-lg border border-slate-800 bg-slate-800/40 px-4 py-3 space-y-2">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className={`text-slate-200 text-right ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

interface ActionButtonsProps {
  req:       LoanRequest;
  onView:    () => void;
  onSubmit:  () => void;
  onReview:  () => void;
  onApprove: () => void;
  onReject:  () => void;
}

type MenuVariant = 'neutral' | 'blue' | 'amber' | 'emerald' | 'red';

const MENU_ITEM_CLS: Record<MenuVariant, string> = {
  neutral: 'text-slate-300  hover:bg-slate-800   hover:text-white',
  blue:    'text-blue-400   hover:bg-blue-500/10  hover:text-blue-300',
  amber:   'text-amber-400  hover:bg-amber-500/10 hover:text-amber-300',
  emerald: 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300',
  red:     'text-red-400    hover:bg-red-500/10   hover:text-red-300',
};

interface MenuItem {
  label:    string;
  variant:  MenuVariant;
  onClick:  () => void;
}

function buildMenu(
  status: LoanStatus,
  onView: () => void,
  onSubmit: () => void,
  onReview: () => void,
  onApprove: () => void,
  onReject: () => void,
): MenuItem[] {
  const view: MenuItem = { label: 'View Details', variant: 'neutral', onClick: onView };
  switch (status) {
    case 'Draft':
      return [view, { label: 'Submit',       variant: 'blue',    onClick: onSubmit  }];
    case 'Submitted':
      return [view, { label: 'Start Review', variant: 'amber',   onClick: onReview  }];
    case 'Under Review':
      return [view, { label: 'Approve',      variant: 'emerald', onClick: onApprove },
                    { label: 'Reject',       variant: 'red',     onClick: onReject  }];
    default:
      return [view];
  }
}

const MENU_WIDTH = 192;

function ActionButtons({ req, onView, onSubmit, onReview, onApprove, onReject }: ActionButtonsProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0 });
  const btnRef          = useRef<HTMLButtonElement>(null);
  const menuRef         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouse  = (e: MouseEvent)    => {
      if (!menuRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node))
        setOpen(false);
    };
    const onKey    = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown',   onKey);
    window.addEventListener('scroll',      onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown',   onKey);
      window.removeEventListener('scroll',      onScroll, true);
    };
  }, [open]);

  function handleToggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const top  = r.bottom + 8;
      // Right-align with button, clamped to viewport edges
      const left = Math.min(
        Math.max(8, r.right - MENU_WIDTH),
        window.innerWidth - MENU_WIDTH - 8,
      );
      setPos({ top, left });
    }
    setOpen((o) => !o);
  }

  const items = buildMenu(req.status, onView, onSubmit, onReview, onApprove, onReject);

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        aria-label={`Open actions for ${req.requestNo}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="5"  cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="19" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: MENU_WIDTH, zIndex: 60 }}
          className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/60"
        >
          <div className="flex flex-col p-1">
            {items.map((item) => (
              <button
                key={item.label}
                role="menuitem"
                onClick={() => { item.onClick(); setOpen(false); }}
                className={`flex w-full items-center justify-start rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${MENU_ITEM_CLS[item.variant]}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
