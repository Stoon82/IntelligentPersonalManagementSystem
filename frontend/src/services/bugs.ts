import { apiClient } from './api';

export interface BugReport {
  title: string;
  description: string;
  systemInfo: string;
  errorLogs?: string[];
}

export const reportBug = async (bugReport: BugReport): Promise<void> => {
  await apiClient.post('/api/bugs/report', bugReport);
};
