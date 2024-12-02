export enum LogType {
  NOTE = "note",
  PROGRESS = "progress",
  ISSUE = "issue",
  DECISION = "decision",
  OTHER = "other"
}

export interface LogEntry {
  id: number;
  content: string;
  log_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface LogEntryCreate {
  content: string;
}

export interface LogEntryUpdate {
  content?: string;
}

export interface Log {
  id: number;
  title: string;
  content: string;
  log_type: LogType;
  project_id?: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  entries: LogEntry[];
}

export interface LogCreate {
  title: string;
  content: string;
  log_type: LogType;
  project_id?: number;
}

export interface LogUpdate {
  title?: string;
  content?: string;
  log_type?: LogType;
  project_id?: number;
}
