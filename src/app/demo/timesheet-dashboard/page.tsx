import { redirect } from 'next/navigation';

export default function TimesheetDashboardPage() {
  redirect('/demo/mes-workflow?tab=timesheet');
}
