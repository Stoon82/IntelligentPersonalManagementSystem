export interface LogEntry {
    id: string;
    content: string;
    timestamp: string;
    authorId: string;
    logId: string;
    projectId?: string;
    tags?: string[];
}

export interface Log {
    id: string;
    name: string;
    description: string;
    type: LogType;
    projectId?: string;
    createdAt: string;
    updatedAt: string;
    entries: LogEntry[];
}

export type LogType = 'changelog' | 'devlog' | 'buglog' | 'custom';

export interface CreateLogDto {
    name: string;
    description: string;
    type: LogType;
    projectId?: string;
}

export interface CreateLogEntryDto {
    content: string;
    logId: string;
    projectId?: string;
    tags?: string[];
}
