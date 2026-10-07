import type { Ticket } from '@/types';
import { HelpdeskApiError } from './client';

/**
 * Ticket REST endpoints are not exposed by the backend yet.
 * Tickets are currently created and managed through the AI assistant tools.
 * These functions document the intended contract for future integration.
 */

export async function fetchTickets(_email?: string): Promise<Ticket[]> {
  throw new HelpdeskApiError({
    message:
      'Ticket listing is not available yet. Ask Liza, your support assistant, to look up tickets by email.',
    code: 'NOT_IMPLEMENTED',
  });
}

export async function fetchTicketById(_ticketId: number): Promise<Ticket> {
  throw new HelpdeskApiError({
    message:
      'Direct ticket lookup is not available yet. Ask Liza to check the status of a specific ticket.',
    code: 'NOT_IMPLEMENTED',
  });
}

export const ticketApiCapabilities = {
  list: false,
  detail: false,
  create: false,
  update: false,
} as const;
