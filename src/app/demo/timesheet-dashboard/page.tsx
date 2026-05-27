import type { Metadata } from 'next';
import TimesheetDemo from './TimesheetDemo';

export const metadata: Metadata = {
  title: 'Timesheet Dashboard Demo',
  description:
    'Interactive demo of a timesheet and OT tracking dashboard — log work hours, auto-calculate overtime, and review monthly summaries. Built with React and TypeScript.',
};

export default function TimesheetDashboardPage() {
  return <TimesheetDemo />;
}
