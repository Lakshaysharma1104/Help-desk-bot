import type { StreamOptions } from '@/types';
import {
  getApiBaseUrl,
  HelpdeskApiError,
  isNetworkError,
  parseErrorMessage,
} from './client';

function buildHeaders(conversationId: string): HeadersInit {
  return {
    'Content-Type': 'text/plain; charset=UTF-8',
    Accept: 'text/event-stream, text/plain, */*',
    conversationId,
  };
}

function decodeChunk(chunk: string): string {
  const trimmed = chunk.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed) as string;
    } catch {
      return chunk;
    }
  }

  return chunk;
}

function extractSsePayloads(buffer: string): { payloads: string[]; remainder: string } {
  const payloads: string[] = [];
  const events = buffer.split('\n\n');
  const remainder = events.pop() ?? '';

  for (const event of events) {
    const dataLines = event
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart());

    if (dataLines.length > 0) {
      const payload = dataLines.join('\n');
      if (payload && payload !== '[DONE]') {
        payloads.push(decodeChunk(payload));
      }
      continue;
    }

    const plain = event.trim();
    if (plain && !plain.startsWith('event:') && !plain.startsWith(':')) {
      payloads.push(decodeChunk(plain));
    }
  }

  return { payloads, remainder };
}

async function consumeStream(
  response: Response,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new HelpdeskApiError({ message: 'The server returned an empty response stream.' });
  }

  const decoder = new TextDecoder();
  let buffer = '';
  const contentType = response.headers.get('content-type') ?? '';
  const isEventStream = contentType.includes('text/event-stream');

  while (true) {
    if (signal?.aborted) {
      await reader.cancel();
      throw new DOMException('Stream aborted', 'AbortError');
    }

    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunkText = decoder.decode(value, { stream: true });
    if (!chunkText) {
      continue;
    }

    if (isEventStream || chunkText.includes('data:')) {
      buffer += chunkText;
      const { payloads, remainder } = extractSsePayloads(buffer);
      buffer = remainder;
      payloads.forEach(onChunk);
    } else {
      onChunk(decodeChunk(chunkText));
    }
  }

  if (buffer.trim()) {
    const { payloads } = extractSsePayloads(`${buffer}\n\n`);
    payloads.forEach(onChunk);
  }
}

export async function streamHelpdeskResponse(
  query: string,
  conversationId: string,
  apiBaseUrl: string,
  options: StreamOptions,
): Promise<void> {
  const url = `${getApiBaseUrl(apiBaseUrl)}/api/v1/helpdesk/stream`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(conversationId),
      body: query,
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new HelpdeskApiError({
      message: isNetworkError(error)
        ? 'Unable to reach the help desk server. Check your connection and try again.'
        : 'Something went wrong while contacting support.',
      code: 'NETWORK_ERROR',
    });
  }

  if (!response.ok) {
    throw new HelpdeskApiError({
      message: await parseErrorMessage(response),
      status: response.status,
      code: 'HTTP_ERROR',
    });
  }

  await consumeStream(response, options.onChunk, options.signal);
}

export async function sendHelpdeskMessage(
  query: string,
  conversationId: string,
  apiBaseUrl: string,
): Promise<string> {
  const url = `${getApiBaseUrl(apiBaseUrl)}/api/v1/helpdesk`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(conversationId),
      body: query,
    });
  } catch (error) {
    throw new HelpdeskApiError({
      message: isNetworkError(error)
        ? 'Unable to reach the help desk server. Check your connection and try again.'
        : 'Something went wrong while contacting support.',
      code: 'NETWORK_ERROR',
    });
  }

  if (!response.ok) {
    throw new HelpdeskApiError({
      message: await parseErrorMessage(response),
      status: response.status,
      code: 'HTTP_ERROR',
    });
  }

  return response.text();
}
