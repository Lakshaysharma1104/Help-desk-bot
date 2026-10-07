import type { ApiError } from '@/types';

export class HelpdeskApiError extends Error {
  status?: number;
  code?: string;

  constructor(payload: ApiError) {
    super(payload.message);
    this.name = 'HelpdeskApiError';
    this.status = payload.status;
    this.code = payload.code;
  }
}

export function getApiBaseUrl(override?: string): string {
  const trimmed = override?.trim();
  return trimmed ? trimmed.replace(/\/$/, '') : '';
}

export async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();
    if (!text) {
      return `Request failed with status ${response.status}`;
    }
    return text.length > 200 ? `${text.slice(0, 200)}…` : text;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError || (error instanceof Error && error.message.includes('fetch'));
}
