const CONVERSATION_ID_KEY = 'helpdesk_active_conversation_id';

export function generateConversationId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function getStoredConversationId(): string | null {
  try {
    return localStorage.getItem(CONVERSATION_ID_KEY);
  } catch {
    return null;
  }
}

export function setStoredConversationId(id: string): void {
  try {
    localStorage.setItem(CONVERSATION_ID_KEY, id);
  } catch {
    // Storage unavailable — conversation still works for the session.
  }
}

export function clearStoredConversationId(): void {
  try {
    localStorage.removeItem(CONVERSATION_ID_KEY);
  } catch {
    // Ignore storage errors.
  }
}
