import type { Metadata } from 'next';
import TimesheetDemo from './TimesheetDemo';

export const metadata: Metadata = {
  title: 'MES Timesheet & Worklog Demo',
  description:
    'Interactive portfolio demo of a Manufacturing Execution System timesheet module — log worklogs by shift, auto-calculate OT, filter by department and status, and track multi-step approval workflow. Built with React and TypeScript.',
};

export default function TimesheetDashboardPage() {
  return <TimesheetDemo />;
}
