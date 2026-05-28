export type RequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Approved'
  | 'Started'
  | 'In Progress'
  | 'Job Done'
  | 'Closed'
  | 'Rejected';

export type UserRole = 'Requester' | 'Request Approver' | 'Technician';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Shift = 'Morning' | 'Afternoon' | 'Night';
export type WorklogStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

export interface TimelineEvent {
  date: string;
  action: string;
  by: string;
  note?: string;
}

export interface RequestWorklogEntry {
  id: string;
  date: string;
  technician: string;
  hours: number;
  note: string;
}

export interface MesRequest {
  id: string;
  title: string;
  costCenter: string;
  requester: string;
  technician: string;
  status: RequestStatus;
  priority: Priority;
  machine: string;
  description: string;
  remark: string;
  createdDate: string;
  updatedDate: string;
  timeline: TimelineEvent[];
  worklogs: RequestWorklogEntry[];
}

export interface WorklogEntry {
  id: string;
  workDate: string;
  employeeName: string;
  department: string;
  shift: Shift;
  startTime: string;
  endTime: string;
  workHours: number;
  otHours: number;
  workCenter: string;
  task: string;
  status: WorklogStatus;
  remark: string;
}
