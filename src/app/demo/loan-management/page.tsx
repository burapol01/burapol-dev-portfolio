import type { Metadata } from 'next';
import LoanManagementDemo from './LoanManagementDemo';

export const metadata: Metadata = {
  title: 'Loan Management Demo',
  description:
    'Interactive demo of a loan request management system — submit requests, filter by status, and track approval workflows. Built with React and TypeScript.',
};

export default function LoanManagementPage() {
  return <LoanManagementDemo />;
}
