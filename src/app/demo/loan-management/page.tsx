import type { Metadata } from 'next';
import LoanManagementDemo from './LoanManagementDemo';

export const metadata: Metadata = {
  title: 'SCSS Loan & Accounting Workflow Demo',
  description:
    'Interactive portfolio demo of an enterprise loan request and approval system — add requests, submit for review, approve or reject with reasons, and track workflow status. Inspired by real internal system experience. Built with React and TypeScript.',
};

export default function LoanManagementPage() {
  return <LoanManagementDemo />;
}
