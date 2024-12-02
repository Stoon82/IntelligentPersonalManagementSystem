import { apiClient } from './api';
import { Log, LogCreate, LogUpdate, LogEntry, LogEntryCreate, LogEntryUpdate } from '../types/log';

export class LogService {
  static async getLogs(projectId?: number): Promise<Log[]> {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get('/api/logs', { params });
    return response.data;
  }

  static async getLog(id: number): Promise<Log> {
    const response = await apiClient.get(`/api/logs/${id}`);
    return response.data;
  }

  static async createLog(data: LogCreate): Promise<Log> {
    const response = await apiClient.post('/api/logs', data);
    return response.data;
  }

  static async updateLog(id: number, data: LogUpdate): Promise<Log> {
    const response = await apiClient.put(`/api/logs/${id}`, data);
    return response.data;
  }

  static async deleteLog(id: number): Promise<void> {
    await apiClient.delete(`/api/logs/${id}`);
  }

  // Log Entry Methods
  static async getLogEntries(logId: number): Promise<LogEntry[]> {
    const response = await apiClient.get(`/api/logs/${logId}/entries`);
    return response.data;
  }

  static async createLogEntry(logId: number, data: LogEntryCreate): Promise<LogEntry> {
    const response = await apiClient.post(`/api/logs/${logId}/entries`, data);
    return response.data;
  }

  static async updateLogEntry(logId: number, entryId: number, data: LogEntryUpdate): Promise<LogEntry> {
    const response = await apiClient.put(`/api/logs/${logId}/entries/${entryId}`, data);
    return response.data;
  }

  static async deleteLogEntry(logId: number, entryId: number): Promise<void> {
    await apiClient.delete(`/api/logs/${logId}/entries/${entryId}`);
  }
}
