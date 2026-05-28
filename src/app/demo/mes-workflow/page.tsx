import type { Metadata } from 'next';
import MesWorkflowDemo from './MesWorkflowDemo';
import type { DemoTab } from './components/DemoTabs';

export const metadata: Metadata = {
  title: 'MES Request & Worklog System Demo',
  description:
    'Unified MES portfolio demo showing request approval, technician work execution, worklog tracking, and shift-aware OT calculation using mock data.',
};

export default async function MesWorkflowPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawTab = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const initialTab: DemoTab = rawTab === 'timesheet' ? 'timesheet' : 'workflow';

  return <MesWorkflowDemo initialTab={initialTab} />;
}
