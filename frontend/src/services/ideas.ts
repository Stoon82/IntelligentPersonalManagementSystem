import { apiClient } from './api';
import { Idea, IdeaCreate, IdeaUpdate, Tag } from '../types/idea';

export const getIdeas = async (projectId?: number): Promise<Idea[]> => {
    const url = projectId ? `/api/projects/${projectId}/ideas` : '/api/ideas';
    const response = await apiClient.get(url);
    return response.data;
};

export const createIdea = async (ideaData: IdeaCreate): Promise<Idea> => {
    const response = await apiClient.post('/api/ideas', ideaData);
    return response.data;
};

export const updateIdea = async ({ id, ...ideaData }: IdeaUpdate & { id: number }): Promise<Idea> => {
    const response = await apiClient.put(`/api/ideas/${id}`, ideaData);
    return response.data;
};

export const deleteIdea = async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/api/ideas/${id}`);
    return response.data;
};

export const getTags = async (): Promise<Tag[]> => {
    const response = await apiClient.get('/api/ideas/tags');
    return response.data;
};
