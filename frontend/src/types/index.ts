export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type Status = 'OPEN' | 'CLOSED' | 'RESOLVED';

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sent' | 'streaming' | 'error' | 'stopped';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status: MessageStatus;
  errorMessage?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
}

export interface Ticket {
  ticketId: number;
  summary: string;
  description: string;
  priority: Priority;
  email: string;
  status: Status;
  createdOn: string;
  updatedOn: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface StreamOptions {
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  userEmail: string;
  apiBaseUrl: string;
}
