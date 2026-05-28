'use client';

import type { UserRole } from '../_types';

const ROLES: UserRole[] = ['Requester', 'Request Approver', 'Technician'];

export default function RoleSwitcher({
  value,
  onChange,
}: {
  value: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-1 flex flex-col sm:flex-row gap-1">
      {ROLES.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => onChange(role)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            value === role
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
}
