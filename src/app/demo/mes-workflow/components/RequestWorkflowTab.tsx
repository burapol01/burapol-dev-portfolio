'use client';

import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import SummaryCard from '@/components/demo/SummaryCard';
import type { MesRequest, Priority, RequestStatus, UserRole } from '../_types';
import { INITIAL_REQUESTS } from '../_data';
import ActionDropdown, { type ActionItem } from './ActionDropdown';
import RoleSwitcher from './RoleSwitcher';
import WorkflowStepper from './WorkflowStepper';

const STATUS_STYLE: Record<RequestStatus, string> = {
  Draft: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  Submitted: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Approved: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  Started: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'In Progress': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Job Done': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Closed: 'bg-slate-600/20 text-slate-300 border-slate-500/30',
  Rejected: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

type RequestForm = {
  title: string;
  costCenter: string;
  machine: string;
  priority: Priority;
  description: string;
  remark: string;
};

type WorkForm = {
  workDate: string;
  startTime: string;
  endTime: string;
  detail: string;
  remark: string;
};

const EMPTY_REQUEST: RequestForm = {
  title: '',
  costCenter: '',
  machine: '',
  priority: 'Medium',
  description: '',
  remark: '',
};

const EMPTY_WORK: WorkForm = {
  workDate: '2026-05-28',
  startTime: '',
  endTime: '',
  detail: '',
  remark: '',
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function parseTime(value: string): number {
  const [hour, minute] = value.split(':').map(Number);
  return hour + minute / 60;
}

function calcHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const start = parseTime(startTime);
  let end = parseTime(endTime);
  if (end <= start) end += 24;
  return Math.round((end - start) * 100) / 100;
}

function StatusPill({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

function Modal({
  title,
  subtitle,
  children,
  footer,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4">{children}</div>
        <div className="px-6 py-4 border-t border-slate-800 flex gap-2 justify-end">{footer}</div>
      </div>
    </div>
  );
}

export interface RequestWorkflowTabHandle {
  openCreateModal: () => void;
}

const RequestWorkflowTab = forwardRef<RequestWorkflowTabHandle, {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}>(function RequestWorkflowTab({
  role,
  onRoleChange,
}, ref) {
  const [requests, setRequests] = useState<MesRequest[]>(INITIAL_REQUESTS);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState<RequestForm>(EMPTY_REQUEST);
  const [requestErrors, setRequestErrors] = useState<Partial<Record<keyof RequestForm, string>>>({});
  const [viewRequest, setViewRequest] = useState<MesRequest | null>(null);
  const [workRequest, setWorkRequest] = useState<MesRequest | null>(null);
  const [workForm, setWorkForm] = useState<WorkForm>(EMPTY_WORK);
  const [workErrors, setWorkErrors] = useState<Partial<Record<keyof WorkForm, string>>>({});

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((r) => r.status === 'Submitted').length,
    inProgress: requests.filter((r) => r.status === 'Started' || r.status === 'In Progress').length,
    done: requests.filter((r) => r.status === 'Job Done').length,
    closed: requests.filter((r) => r.status === 'Closed').length,
  }), [requests]);

  useImperativeHandle(ref, () => ({
    openCreateModal: () => setShowRequestModal(true),
  }));

  function transition(id: string, status: RequestStatus, action: string, by: string, note?: string) {
    setRequests((items) => items.map((item) => (
      item.id === id
        ? {
            ...item,
            status,
            updatedDate: today(),
            technician: item.technician || (role === 'Technician' ? 'James Wilson' : item.technician),
            timeline: [...item.timeline, { date: today(), action, by, note }],
          }
        : item
    )));
  }

  function actionsFor(row: MesRequest): ActionItem[] {
    const actions: ActionItem[] = [{ label: 'View Details', onClick: () => setViewRequest(row), color: 'default' }];
    if (role === 'Requester') {
      if (row.status === 'Draft') actions.push({ label: 'Edit Details', onClick: () => setViewRequest(row), color: 'blue' }, { label: 'Submit', onClick: () => transition(row.id, 'Submitted', 'Submitted', 'Sarah Kim'), color: 'emerald' });
      if (row.status === 'Rejected') actions.push({ label: 'Edit Details', onClick: () => setViewRequest(row), color: 'blue' }, { label: 'Resubmit', onClick: () => transition(row.id, 'Submitted', 'Resubmitted', 'Sarah Kim'), color: 'emerald' });
      if (row.status === 'Job Done') actions.push({ label: 'Close Job', onClick: () => transition(row.id, 'Closed', 'Closed', 'Sarah Kim'), color: 'emerald' });
    }
    if (role === 'Request Approver' && row.status === 'Submitted') {
      actions.push(
        { label: 'Approve', onClick: () => transition(row.id, 'Approved', 'Approved', 'Manager Chen'), color: 'emerald' },
        { label: 'Reject', onClick: () => transition(row.id, 'Rejected', 'Rejected', 'Manager Chen', 'Rejected in demo review'), color: 'red' },
      );
    }
    if (role === 'Technician') {
      if (row.status === 'Approved') actions.push({ label: 'Start Job', onClick: () => transition(row.id, 'Started', 'Started', 'James Wilson'), color: 'amber' });
      if (row.status === 'Started') actions.push({ label: 'Record Work Hours', onClick: () => { setWorkRequest(row); setWorkForm(EMPTY_WORK); }, color: 'orange' });
      if (row.status === 'In Progress') actions.push(
        { label: 'Record Work Hours', onClick: () => { setWorkRequest(row); setWorkForm(EMPTY_WORK); }, color: 'orange' },
        { label: 'Mark Job Done', onClick: () => transition(row.id, 'Job Done', 'Job Done', 'James Wilson'), color: 'emerald' },
      );
    }
    return actions;
  }

  function setRequestField<K extends keyof RequestForm>(key: K, value: RequestForm[K]) {
    setRequestForm((form) => ({ ...form, [key]: value }));
    setRequestErrors((errors) => ({ ...errors, [key]: undefined }));
  }

  function saveRequest() {
    const errors: Partial<Record<keyof RequestForm, string>> = {};
    if (!requestForm.title.trim()) errors.title = 'Required title';
    if (!requestForm.costCenter.trim()) errors.costCenter = 'Required cost center';
    if (!requestForm.machine.trim()) errors.machine = 'Required machine / work center';
    setRequestErrors(errors);
    if (Object.keys(errors).length) return;
    const date = today();
    const newRequest: MesRequest = {
      id: `REQ-${String(requests.length + 1).padStart(3, '0')}`,
      title: requestForm.title,
      costCenter: requestForm.costCenter,
      requester: 'Sarah Kim',
      technician: '',
      status: 'Draft',
      priority: requestForm.priority,
      machine: requestForm.machine,
      description: requestForm.description,
      remark: requestForm.remark,
      createdDate: date,
      updatedDate: date,
      timeline: [{ date, action: 'Created', by: 'Sarah Kim' }],
      worklogs: [],
    };
    setRequests((items) => [newRequest, ...items]);
    setRequestForm(EMPTY_REQUEST);
    setShowRequestModal(false);
  }

  function setWorkField<K extends keyof WorkForm>(key: K, value: WorkForm[K]) {
    setWorkForm((form) => ({ ...form, [key]: value }));
    setWorkErrors((errors) => ({ ...errors, [key]: undefined }));
  }

  function saveWorklog() {
    if (!workRequest) return;
    const errors: Partial<Record<keyof WorkForm, string>> = {};
    if (!workForm.workDate) errors.workDate = 'Required';
    if (!workForm.startTime) errors.startTime = 'Required';
    if (!workForm.endTime) errors.endTime = 'Required';
    if (!workForm.detail.trim()) errors.detail = 'Required';
    setWorkErrors(errors);
    if (Object.keys(errors).length) return;
    const hours = calcHours(workForm.startTime, workForm.endTime);
    setRequests((items) => items.map((item) => {
      if (item.id !== workRequest.id) return item;
      return {
        ...item,
        status: item.status === 'Started' ? 'In Progress' : item.status,
        updatedDate: today(),
        worklogs: [
          ...item.worklogs,
          { id: `WRK-${item.id}-${item.worklogs.length + 1}`, date: workForm.workDate, technician: 'James Wilson', hours, note: workForm.detail },
        ],
        remark: workForm.remark || item.remark,
        timeline: [
          ...item.timeline,
          { date: workForm.workDate, action: item.status === 'Started' ? 'In Progress' : 'Work Recorded', by: 'James Wilson', note: workForm.detail },
        ],
      };
    }));
    setWorkRequest(null);
    setWorkForm(EMPTY_WORK);
  }

  const workPreview = calcHours(workForm.startTime, workForm.endTime);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Simulated role</p>
          <RoleSwitcher value={role} onChange={onRoleChange} />
        </div>
        {role !== 'Requester' && (
          <p className="max-w-sm text-sm text-slate-500 lg:text-right">
            Creation is available to Requester role. Use row actions for current role workflow steps.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <SummaryCard label="Total Requests" value={stats.total} valueColor="text-white" />
        <SummaryCard label="Pending Approval" value={stats.pending} valueColor="text-blue-300" />
        <SummaryCard label="In Progress" value={stats.inProgress} valueColor="text-orange-300" />
        <SummaryCard label="Job Done" value={stats.done} valueColor="text-emerald-300" />
        <SummaryCard label="Closed" value={stats.closed} valueColor="text-slate-300" />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <WorkflowStepper />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40">
                {['Actions', 'Request No.', 'Request Title', 'Cost Center', 'Requester', 'Technician', 'Status', 'Created Date', 'Updated Date', 'Remark'].map((head) => (
                  <th key={head} className={`px-3 py-3 text-left text-xs font-semibold text-slate-400 whitespace-nowrap ${head === 'Actions' ? 'w-[72px] min-w-[72px]' : ''}`}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                  <td className="px-3 py-3 w-[72px] min-w-[72px]"><ActionDropdown actions={actionsFor(row)} /></td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-300 whitespace-nowrap">{row.id}</td>
                  <td className="px-3 py-3 text-slate-100 font-medium max-w-[260px] truncate" title={row.title}>{row.title}</td>
                  <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{row.costCenter}</td>
                  <td className="px-3 py-3 text-slate-300 whitespace-nowrap">{row.requester}</td>
                  <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{row.technician || 'Unassigned'}</td>
                  <td className="px-3 py-3"><StatusPill status={row.status} /></td>
                  <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{formatDate(row.createdDate)}</td>
                  <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{formatDate(row.updatedDate)}</td>
                  <td className="px-3 py-3 text-slate-500 max-w-[220px] truncate" title={row.remark}>{row.remark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRequestModal && (
        <Modal
          title="Create MES Request"
          subtitle="Saved as Draft with mock data only."
          onClose={() => setShowRequestModal(false)}
          footer={(
            <>
              <button type="button" onClick={() => setShowRequestModal(false)} className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:text-white">Cancel</button>
              <button type="button" onClick={saveRequest} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white">Save Draft</button>
            </>
          )}
        >
          <FormInput label="Request Title" required value={requestForm.title} error={requestErrors.title} onChange={(value) => setRequestField('title', value)} />
          <div className="grid sm:grid-cols-2 gap-3">
            <FormInput label="Cost Center" required value={requestForm.costCenter} error={requestErrors.costCenter} onChange={(value) => setRequestField('costCenter', value)} />
            <FormInput label="Machine / Work Center" required value={requestForm.machine} error={requestErrors.machine} onChange={(value) => setRequestField('machine', value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
            <select value={requestForm.priority} onChange={(e) => setRequestField('priority', e.target.value as Priority)} className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2">
              {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </div>
          <FormTextArea label="Description" value={requestForm.description} onChange={(value) => setRequestField('description', value)} />
          <FormTextArea label="Remark" value={requestForm.remark} onChange={(value) => setRequestField('remark', value)} />
        </Modal>
      )}

      {viewRequest && (
        <Modal
          title={viewRequest.id}
          subtitle={viewRequest.title}
          onClose={() => setViewRequest(null)}
          footer={<button type="button" onClick={() => setViewRequest(null)} className="px-4 py-2 rounded-lg bg-slate-800 text-sm text-slate-200 hover:bg-slate-700">Close</button>}
        >
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Status" value={<StatusPill status={viewRequest.status} />} />
            <Info label="Priority" value={viewRequest.priority} />
            <Info label="Cost Center" value={viewRequest.costCenter} />
            <Info label="Machine / Work Center" value={viewRequest.machine} />
            <Info label="Requester" value={viewRequest.requester} />
            <Info label="Technician" value={viewRequest.technician || 'Unassigned'} />
          </div>
          <Info label="Description" value={viewRequest.description} wide />
          <Info label="Remark" value={viewRequest.remark || '-'} wide />
          <WorkflowStepper activeStatus={viewRequest.status} />
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Timeline</p>
            <div className="space-y-2">
              {viewRequest.timeline.map((event, index) => (
                <div key={`${event.date}-${event.action}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2">
                  <p className="text-sm text-slate-200">{event.action} <span className="text-slate-500">by {event.by}</span></p>
                  <p className="text-xs text-slate-500">{formatDate(event.date)}{event.note ? ` - ${event.note}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Worklog Records</p>
            {viewRequest.worklogs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">No worklog records yet.</div>
            ) : (
              <div className="space-y-2">
                {viewRequest.worklogs.map((log) => (
                  <div key={log.id} className="rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-2">
                    <p className="text-sm text-slate-200">{log.technician} - {log.hours.toFixed(1)} h</p>
                    <p className="text-xs text-slate-500">{formatDate(log.date)} - {log.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {workRequest && (
        <Modal
          title="Record Work Hours"
          subtitle={`${workRequest.id} - ${workRequest.title}`}
          onClose={() => setWorkRequest(null)}
          footer={(
            <>
              <button type="button" onClick={() => setWorkRequest(null)} className="px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:text-white">Cancel</button>
              <button type="button" onClick={saveWorklog} className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm font-semibold text-white">Save Worklog</button>
            </>
          )}
        >
          <FormInput label="Work Date" required type="date" value={workForm.workDate} error={workErrors.workDate} onChange={(value) => setWorkField('workDate', value)} />
          <div className="grid sm:grid-cols-2 gap-3">
            <FormInput label="Start Time" required type="time" value={workForm.startTime} error={workErrors.startTime} onChange={(value) => setWorkField('startTime', value)} />
            <FormInput label="End Time" required type="time" value={workForm.endTime} error={workErrors.endTime} onChange={(value) => setWorkField('endTime', value)} />
          </div>
          {(workForm.startTime && workForm.endTime) && (
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
              <p className="text-xs text-orange-200">Work hours preview</p>
              <p className="text-2xl font-bold text-white">{workPreview.toFixed(2)} h</p>
            </div>
          )}
          <FormTextArea label="Work Detail" required value={workForm.detail} error={workErrors.detail} onChange={(value) => setWorkField('detail', value)} />
          <FormTextArea label="Remark" value={workForm.remark} onChange={(value) => setWorkField('remark', value)} />
        </Modal>
      )}
    </div>
  );
});

export default RequestWorkflowTab;

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
      <label className="block text-xs font-medium text-slate-400 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function FormTextArea({
  label,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-slate-200 text-sm rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-blue-500`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function Info({
  label,
  value,
  wide,
}: {
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-slate-800 bg-slate-950/30 p-3 ${wide ? 'sm:col-span-2' : ''}`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className="text-sm text-slate-200">{value}</div>
    </div>
  );
}
