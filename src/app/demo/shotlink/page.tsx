'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import SummaryCard from '@/components/demo/SummaryCard';
import ActionDropdown, { type ActionItem } from '../mes-workflow/components/ActionDropdown';

type LinkStatus = 'Active' | 'Existing Link';

interface ShotLinkRecord {
  id: string;
  shortCode: string;
  appCode: string;
  signature: string;
  fullUrl: string;
  description: string;
  createdDate: string;
  status: LinkStatus;
  redirectCount: number;
}

interface FormState {
  fullUrl: string;
  appCode: string;
  signature: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  fullUrl: 'https://example.com/apps/document?id=DOC-2026-001&mode=view',
  appCode: 'PORTAL-DEMO',
  signature: 'mock-signature-2026',
  description: 'Document deep link for QR sharing',
};

const INITIAL_LINKS: ShotLinkRecord[] = [
  {
    id: '1',
    shortCode: 'BLK-2026-001',
    appCode: 'PORTAL-DEMO',
    signature: 'mock-signature-2026',
    fullUrl: 'https://example.com/apps/document?id=DOC-2026-001&mode=view',
    description: 'Document deep link for QR sharing',
    createdDate: '2026-05-01',
    status: 'Active',
    redirectCount: 42,
  },
  {
    id: '2',
    shortCode: 'BLK-2026-002',
    appCode: 'MES-DEMO',
    signature: 'mock-signature-mes',
    fullUrl: 'https://example.com/mes/request?requestNo=REQ-2026-008&tab=workflow',
    description: 'Open a request page by request number',
    createdDate: '2026-05-08',
    status: 'Active',
    redirectCount: 17,
  },
  {
    id: '3',
    shortCode: 'BLK-2026-003',
    appCode: 'CARD-DEMO',
    signature: 'mock-signature-card',
    fullUrl: 'https://example.com/profile?user=demo&source=qr',
    description: 'QR-friendly profile link',
    createdDate: '2026-05-14',
    status: 'Active',
    redirectCount: 29,
  },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function shortUrl(shortCode: string) {
  return `https://blink.example.com/${shortCode}`;
}

function parseParams(fullUrl: string) {
  if (!isUrl(fullUrl)) return [];
  const url = new URL(fullUrl);
  return Array.from(url.searchParams.entries());
}

function StatusPill({ status }: { status: LinkStatus }) {
  const cls = status === 'Existing Link'
    ? 'border-blue-500/30 bg-blue-500/15 text-blue-300'
    : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300';
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${cls}`}>{status}</span>;
}

export default function ShotLinkDemoPage() {
  const [links, setLinks] = useState<ShotLinkRecord[]>(INITIAL_LINKS);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [createResult, setCreateResult] = useState<{ status: LinkStatus; shortCode: string } | null>(null);
  const [executeCode, setExecuteCode] = useState('BLK-2026-001');
  const [executeResult, setExecuteResult] = useState<ShotLinkRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<ShotLinkRecord | null>(null);
  const [qrRecord, setQrRecord] = useState<ShotLinkRecord | null>(null);
  const [copied, setCopied] = useState('');

  const stats = useMemo(() => ({
    total: links.length,
    active: links.filter((item) => item.status === 'Active' || item.status === 'Existing Link').length,
    qrReady: links.length,
    redirects: links.reduce((sum, item) => sum + item.redirectCount, 0),
  }), [links]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setCreateResult(null);
  }

  function validate() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullUrl.trim()) nextErrors.fullUrl = 'Full URL required';
    else if (!isUrl(form.fullUrl.trim())) nextErrors.fullUrl = 'Enter a valid URL';
    if (!form.appCode.trim()) nextErrors.appCode = 'Application Code required';
    if (!form.signature.trim()) nextErrors.signature = 'Signature required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function createShortLink() {
    if (!validate()) return;
    const fullUrl = form.fullUrl.trim();
    const existing = links.find((item) => item.fullUrl === fullUrl);
    if (existing) {
      setCreateResult({ status: 'Existing Link', shortCode: existing.shortCode });
      setLinks((current) => current.map((item) => item.id === existing.id ? { ...item, status: 'Existing Link' } : item));
      return;
    }
    const newRecord: ShotLinkRecord = {
      id: String(Date.now()),
      shortCode: `BLK-2026-${String(links.length + 1).padStart(3, '0')}`,
      appCode: form.appCode.trim().toUpperCase(),
      signature: form.signature.trim(),
      fullUrl,
      description: form.description.trim() || 'No description',
      createdDate: today(),
      status: 'Active',
      redirectCount: 0,
    };
    setLinks((current) => [newRecord, ...current]);
    setCreateResult({ status: 'Active', shortCode: newRecord.shortCode });
    setExecuteCode(newRecord.shortCode);
  }

  async function copyShortLink(record: ShotLinkRecord) {
    await navigator.clipboard?.writeText(shortUrl(record.shortCode));
    setCopied(record.shortCode);
    window.setTimeout(() => setCopied(''), 1600);
  }

  function executeRedirect(code = executeCode) {
    const record = links.find((item) => item.shortCode.toLowerCase() === code.trim().toLowerCase());
    setExecuteResult(record ?? null);
    if (!record) return;
    setLinks((current) => current.map((item) => (
      item.id === record.id ? { ...item, redirectCount: item.redirectCount + 1 } : item
    )));
  }

  function actionsFor(record: ShotLinkRecord): ActionItem[] {
    return [
      { label: 'View Details', onClick: () => setDetailRecord(record) },
      { label: copied === record.shortCode ? 'Copied!' : 'Copy Short Link', onClick: () => { void copyShortLink(record); }, color: 'blue' },
      { label: 'Preview QR', onClick: () => setQrRecord(record), color: 'emerald' },
      { label: 'Execute Redirect', onClick: () => { setExecuteCode(record.shortCode); executeRedirect(record.shortCode); }, color: 'amber' },
    ];
  }

  const selectedExecuteUrlIsSafe = executeResult?.fullUrl.startsWith('https://example.com/');

  return (
    <main className="pt-16 min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-amber-500/5 border-b border-amber-500/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-300/80 flex-1">
            This is a simplified portfolio demo inspired by real-world short-link and QR redirect service experience. It uses mock data only and does not include confidential company information.
          </p>
          <Link href="/projects/shotlink-short-link-service" className="ml-4 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 shrink-0 transition-colors">
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
                <span className="text-blue-400">ShotLink</span>
              </div>
              <h1 className="text-2xl font-bold text-white">ShotLink - Short Link & QR Redirect Demo</h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                A simplified short-link service demo that converts long internal URLs into QR-friendly short links and simulates redirect execution using mock data.
              </p>
            </div>
            <button
              type="button"
              onClick={createShortLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors self-start shrink-0"
            >
              Insert Record
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SummaryCard label="Total Links" value={stats.total} valueColor="text-white" />
          <SummaryCard label="Active Links" value={stats.active} valueColor="text-emerald-300" />
          <SummaryCard label="QR Ready" value={stats.qrReady} valueColor="text-blue-300" />
          <SummaryCard label="Redirect Executions" value={stats.redirects} valueColor="text-orange-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Create Short Link</p>
                <p className="text-sm text-slate-400 mt-1">Insert record with app code and signature metadata.</p>
              </div>
            </div>
            <div className="space-y-4">
              <Field label="Full URL" required error={errors.fullUrl}>
                <input value={form.fullUrl} onChange={(e) => setField('fullUrl', e.target.value)} className={`w-full bg-slate-800 border ${errors.fullUrl ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2`} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Application Code" required error={errors.appCode}>
                  <input value={form.appCode} onChange={(e) => setField('appCode', e.target.value)} className={`w-full bg-slate-800 border ${errors.appCode ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2`} />
                </Field>
                <Field label="Signature" required error={errors.signature}>
                  <input value={form.signature} onChange={(e) => setField('signature', e.target.value)} className={`w-full bg-slate-800 border ${errors.signature ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2`} />
                </Field>
              </div>
              <Field label="Optional Description">
                <textarea value={form.description} rows={2} onChange={(e) => setField('description', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 resize-none" />
              </Field>
              <button type="button" onClick={createShortLink} className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
                Insert Record
              </button>
              {createResult && (
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3">
                  <p className="text-xs text-blue-200">{createResult.status}</p>
                  <p className="mt-1 font-mono text-sm text-white">{createResult.shortCode}</p>
                  <p className="mt-1 text-xs text-slate-400">{shortUrl(createResult.shortCode)}</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Execute Blink URL</p>
            <p className="text-sm text-slate-400 mt-1 mb-4">Resolve a short code and preview redirect output. No automatic redirect occurs.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={executeCode} onChange={(e) => setExecuteCode(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2" />
              <button type="button" onClick={() => executeRedirect()} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
                Execute
              </button>
            </div>
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4 min-h-[190px]">
              {!executeResult ? (
                <p className="text-sm text-slate-500">Enter a short code and execute to preview redirect resolution.</p>
              ) : (
                <div className="space-y-3">
                  <Info label="Result Status" value="Resolved - redirect preview only" />
                  <Info label="Short Code" value={executeResult.shortCode} mono />
                  <Info label="Full URL" value={executeResult.fullUrl} />
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Parsed query parameters</p>
                    <ParamList fullUrl={executeResult.fullUrl} />
                  </div>
                  {selectedExecuteUrlIsSafe && (
                    <a href={executeResult.fullUrl} target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 border border-blue-500/70 text-blue-300 hover:text-blue-200 rounded-lg text-sm font-medium">
                      Open Preview URL
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40">
                  {['Actions', 'Short Code', 'Application Code', 'Full URL', 'Description', 'Created Date', 'Status', 'Redirect Count'].map((head) => (
                    <th key={head} className={`px-3 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap ${head === 'Actions' ? 'w-[72px] min-w-[72px]' : ''}`}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center text-sm text-slate-500">No links yet. Insert a mock record to begin.</td>
                  </tr>
                ) : links.map((record) => (
                  <tr key={record.id} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                    <td className="px-3 py-3 w-[72px] min-w-[72px]"><ActionDropdown actions={actionsFor(record)} /></td>
                    <td className="px-3 py-3 font-mono text-xs text-blue-300 whitespace-nowrap">{record.shortCode}</td>
                    <td className="px-3 py-3 text-slate-300 whitespace-nowrap">{record.appCode}</td>
                    <td className="px-3 py-3 text-slate-400 max-w-[320px] truncate" title={record.fullUrl}>{record.fullUrl}</td>
                    <td className="px-3 py-3 text-slate-500 max-w-[220px] truncate" title={record.description}>{record.description}</td>
                    <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{formatDate(record.createdDate)}</td>
                    <td className="px-3 py-3"><StatusPill status={record.status} /></td>
                    <td className="px-3 py-3 font-mono text-slate-300 whitespace-nowrap">{record.redirectCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Service Flow Guide</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['Insert Record', 'Check Existing', 'Return Short Code', 'Generate QR', 'Execute Blink URL', 'Redirect Preview'].map((step, index, items) => (
              <span key={step} className="flex items-center gap-2">
                <span className="inline-flex rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-slate-300">{step}</span>
                {index < items.length - 1 && <span className="text-slate-600">-&gt;</span>}
              </span>
            ))}
          </div>
        </section>
      </div>

      {qrRecord && (
        <Modal title="QR Preview" subtitle={shortUrl(qrRecord.shortCode)} onClose={() => setQrRecord(null)}>
          <div className="mx-auto w-56 rounded-2xl border border-slate-700 bg-slate-100 p-4">
            <QRCode value={shortUrl(qrRecord.shortCode)} size={192} bgColor="#f1f5f9" fgColor="#020617" className="h-auto w-full" />
          </div>
          <p className="text-center text-sm text-slate-400">Scan to open short link</p>
        </Modal>
      )}

      {detailRecord && (
        <Modal title="Link Details" subtitle={detailRecord.shortCode} onClose={() => setDetailRecord(null)}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Info label="Short Code" value={detailRecord.shortCode} mono />
            <Info label="App Code" value={detailRecord.appCode} />
            <Info label="Signature" value={detailRecord.signature} />
            <Info label="Created Date" value={formatDate(detailRecord.createdDate)} />
            <Info label="Status" value={detailRecord.status} />
            <Info label="Redirect Count" value={String(detailRecord.redirectCount)} mono />
          </div>
          <Info label="Full URL" value={detailRecord.fullUrl} />
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
            <p className="text-xs text-slate-500 mb-2">Parsed parameters</p>
            <ParamList fullUrl={detailRecord.fullUrl} />
          </div>
        </Modal>
      )}
    </main>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-sm text-slate-200 break-words ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  );
}

function ParamList({ fullUrl }: { fullUrl: string }) {
  const params = parseParams(fullUrl);
  if (!params.length) return <p className="text-sm text-slate-500">No query parameters.</p>;
  return (
    <div className="space-y-2">
      {params.map(([key, value]) => (
        <div key={`${key}-${value}`} className="flex items-start justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs">
          <span className="font-mono text-blue-300">{key}</span>
          <span className="text-slate-300 text-right break-all">{value}</span>
        </div>
      ))}
    </div>
  );
}

function Modal({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-1 break-all">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close modal" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">{children}</div>
        <div className="px-6 py-4 border-t border-slate-800">
          <button type="button" onClick={onClose} className="w-full px-4 py-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
