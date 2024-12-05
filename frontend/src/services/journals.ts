import { apiClient } from './api';

export interface Journal {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    user_id: number;
}

export interface JournalCreate {
    title: string;
    content: string;
}

export interface JournalUpdate extends Partial<JournalCreate> {
    id: number;
}

export const getJournals = async (): Promise<Journal[]> => {
    const response = await apiClient.get('/api/journals');
    return response.data;
};

export const getJournal = async (id: number): Promise<Journal> => {
    const response = await apiClient.get(`/api/journals/${id}`);
    return response.data;
};

export const createJournal = async (data: JournalCreate): Promise<Journal> => {
    const response = await apiClient.post('/api/journals', data);
    return response.data;
};

export const updateJournal = async (data: JournalUpdate): Promise<Journal> => {
    const response = await apiClient.put(`/api/journals/${data.id}`, data);
    return response.data;
};

export const deleteJournal = async (id: number): Promise<void> => {
    await apiClient.delete(`/api/journals/${id}`);
};
