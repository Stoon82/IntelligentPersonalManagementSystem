import { apiClient } from './api';
import { Log, LogCreate, LogUpdate } from '../types/log';

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
};
