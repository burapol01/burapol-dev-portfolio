'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SummaryCard from '@/components/demo/SummaryCard';
import StatusBadge from '@/components/demo/StatusBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

type LoanStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
type LoanType = 'Personal' | 'Equipment' | 'Business';

interface LoanRequest {
  id: string;
  requestNo: string;
  customerName: string;
  loanType: LoanType;
  amount: number;
  status: LoanStatus;
  createdDate: string;
  remark: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LOANS: LoanRequest[] = [
  { id: '1', requestNo: 'REQ-001', customerName: 'Somchai Kittipong', loanType: 'Personal', amount: 50000, status: 'Approved', createdDate: '2026-04-01', remark: '' },
  { id: '2', requestNo: 'REQ-002', customerName: 'Wanida Thongchai', loanType: 'Equipment', amount: 120000, status: 'Submitted', createdDate: '2026-04-05', remark: 'Awaiting finance review' },
  { id: '3', requestNo: 'REQ-003', customerName: 'Narong Panya', loanType: 'Business', amount: 200000, status: 'Draft', createdDate: '2026-04-08', remark: 'Documents pending' },
  { id: '4', requestNo: 'REQ-004', customerName: 'Malee Sombat', loanType: 'Personal', amount: 30000, status: 'Rejected', createdDate: '2026-04-10', remark: 'Incomplete documentation' },
  { id: '5', requestNo: 'REQ-005', customerName: 'Prasert Chaiwong', loanType: 'Equipment', amount: 75000, status: 'Approved', createdDate: '2026-04-12', remark: '' },
  { id: '6', requestNo: 'REQ-006', customerName: 'Siriporn Mungkorn', loanType: 'Business', amount: 150000, status: 'Submitted', createdDate: '2026-04-15', remark: 'Under committee review' },
  { id: '7', requestNo: 'REQ-007', customerName: 'Kitti Worawit', loanType: 'Personal', amount: 25000, status: 'Draft', createdDate: '2026-04-18', remark: '' },
  { id: '8', requestNo: 'REQ-008', customerName: 'Nattaporn Srisuk', loanType: 'Equipment', amount: 90000, status: 'Approved', createdDate: '2026-04-20', remark: '' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_FILTERS: Array<LoanStatus | 'All'> = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected'];

function fmtAmount(n: number) {
  return '฿' + n.toLocaleString('en-US');
}

const EMPTY_FORM = {
  customerName: '',
  loanType: 'Personal' as LoanType,
  amount: '',
  remark: '',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoanManagementDemo() {
  const [loans, setLoans] = useState<LoanRequest[]>(MOCK_LOANS);
  const [filter, setFilter] = useState<LoanStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const filtered = useMemo(
    () => (filter === 'All' ? loans : loans.filter((l) => l.status === filter)),
    [loans, filter]
  );

  const stats = useMemo(() => ({
    total: loans.length,
    pending: loans.filter((l) => l.status === 'Draft' || l.status === 'Submitted').length,
    approvedAmount: loans
      .filter((l) => l.status === 'Approved')
      .reduce((sum, l) => sum + l.amount, 0),
    rejected: loans.filter((l) => l.status === 'Rejected').length,
  }), [loans]);

  const filterCount = (s: LoanStatus | 'All') =>
    s === 'All' ? loans.length : loans.filter((l) => l.status === s).length;

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleAdd = () => {
    if (!form.customerName.trim()) {
      setFormError('Customer name is required.');
      return;
    }
    const amt = Number(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) {
      setFormError('Enter a valid amount greater than 0.');
      return;
    }
    const next: LoanRequest = {
      id: Date.now().toString(),
      requestNo: `REQ-${String(loans.length + 1).padStart(3, '0')}`,
      customerName: form.customerName.trim(),
      loanType: form.loanType,
      amount: amt,
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      remark: form.remark.trim(),
    };
    setLoans((prev) => [next, ...prev]);
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
            href="/projects/scss-accounting-loan"
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
                <span className="text-blue-400 font-medium">Loan Management Demo</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
                Loan Management Workflow
              </h1>
              <p className="text-sm text-slate-400 max-w-xl">
                Internal loan request management — submit requests, track approval status,
                and view workflow summaries. Demonstrates the kind of system built in the
                SCSS Accounting & Loan Module.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0 self-start"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Request
            </button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Requests"
            value={stats.total}
            sub="All records"
          />
          <SummaryCard
            label="Pending"
            value={stats.pending}
            sub="Draft + Submitted"
            valueColor="text-blue-400"
          />
          <SummaryCard
            label="Approved Amount"
            value={fmtAmount(stats.approvedAmount)}
            sub="Sum of approved"
            valueColor="text-emerald-400"
          />
          <SummaryCard
            label="Rejected"
            value={stats.rejected}
            sub="Declined requests"
            valueColor="text-red-400"
          />
        </div>

        {/* Table card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          {/* Filter tabs + count */}
          <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-800 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  filter === s
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s}
                <span className="ml-1.5 text-slate-500 font-normal">
                  {filterCount(s)}
                </span>
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-500 pl-4 whitespace-nowrap">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Scrollable table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    Request No.
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    Customer Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    Loan Type
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 whitespace-nowrap">
                    Created Date
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
                      colSpan={7}
                      className="text-center py-14 text-slate-500 text-sm"
                    >
                      No records match this filter.
                    </td>
                  </tr>
                )}
                {filtered.map((loan) => (
                  <tr
                    key={loan.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {loan.requestNo}
                    </td>
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                      {loan.customerName}
                    </td>
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                      {loan.loanType}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-right font-mono whitespace-nowrap">
                      {fmtAmount(loan.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {loan.createdDate}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[200px] truncate">
                      {loan.remark || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">New Loan Request</h2>
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
                  Customer Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customerName: e.target.value }))
                  }
                  placeholder="Enter customer name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Loan Type <span className="text-blue-400">*</span>
                  </label>
                  <select
                    value={form.loanType}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, loanType: e.target.value as LoanType }))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Amount (฿) <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, amount: e.target.value }))
                    }
                    placeholder="e.g. 50000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Remark
                </label>
                <input
                  type="text"
                  value={form.remark}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, remark: e.target.value }))
                  }
                  placeholder="Optional note"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2.5 text-xs text-slate-500">
                <svg className="w-3.5 h-3.5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                New requests are saved as{' '}
                <span className="text-slate-300 font-medium">Draft</span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 pb-6">
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
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
