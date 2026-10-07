import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Conversation } from '@/types';
import {
  clearStoredConversationId,
  generateConversationId,
  getStoredConversationId,
  setStoredConversationId,
} from '@/utils/conversationId';
import { createId, readJson, writeJson } from '@/utils/storage';

const CONVERSATIONS_KEY = 'helpdesk_conversations';

interface ConversationState {
  activeConversationId: string;
  items: Conversation[];
}

function loadConversations(): Conversation[] {
  return readJson<Conversation[]>(CONVERSATIONS_KEY, []);
}

function persistConversations(items: Conversation[]): void {
  writeJson(CONVERSATIONS_KEY, items);
}

function createConversationRecord(id?: string): Conversation {
  const now = new Date().toISOString();
  return {
    id: id ?? generateConversationId(),
    title: 'New support conversation',
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
    preview: 'No messages yet',
  };
}

function bootstrapActiveConversation(items: Conversation[]): string {
  const stored = getStoredConversationId();
  if (stored && items.some((item) => item.id === stored)) {
    return stored;
  }

  if (items.length > 0) {
    const latest = [...items].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];
    setStoredConversationId(latest.id);
    return latest.id;
  }

  const created = createConversationRecord();
  persistConversations([created]);
  setStoredConversationId(created.id);
  return created.id;
}

const initialItems = loadConversations();
const initialActiveId = bootstrapActiveConversation(initialItems);
const normalizedItems =
  initialItems.length > 0 ? initialItems : [createConversationRecord(initialActiveId)];

const conversationSlice = createSlice({
  name: 'conversations',
  initialState: {
    activeConversationId: initialActiveId,
    items: normalizedItems,
  } satisfies ConversationState,
  reducers: {
    startNewConversation(state) {
      const conversation = createConversationRecord();
      state.items.unshift(conversation);
      state.activeConversationId = conversation.id;
      setStoredConversationId(conversation.id);
      persistConversations(state.items);
    },
    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload;
      setStoredConversationId(action.payload);
    },
    updateConversationMeta(
      state,
      action: PayloadAction<{
        conversationId: string;
        preview: string;
        title?: string;
        incrementCount?: boolean;
      }>,
    ) {
      const { conversationId, preview, title, incrementCount } = action.payload;
      const conversation = state.items.find((item) => item.id === conversationId);
      if (!conversation) {
        return;
      }

      conversation.preview = preview;
      conversation.updatedAt = new Date().toISOString();
      if (title) {
        conversation.title = title;
      }
      if (incrementCount) {
        conversation.messageCount += 1;
      }
      persistConversations(state.items);
    },
    renameConversation(
      state,
      action: PayloadAction<{ conversationId: string; title: string }>,
    ) {
      const conversation = state.items.find((item) => item.id === action.payload.conversationId);
      if (!conversation) {
        return;
      }
      conversation.title = action.payload.title;
      conversation.updatedAt = new Date().toISOString();
      persistConversations(state.items);
    },
    deleteConversation(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);

      if (state.items.length === 0) {
        const fresh = createConversationRecord();
        state.items = [fresh];
        state.activeConversationId = fresh.id;
      } else if (state.activeConversationId === action.payload) {
        state.activeConversationId = state.items[0].id;
      }

      setStoredConversationId(state.activeConversationId);
      persistConversations(state.items);
    },
    ensureConversation(state, action: PayloadAction<string>) {
      const exists = state.items.some((item) => item.id === action.payload);
      if (!exists) {
        state.items.unshift(createConversationRecord(action.payload));
        persistConversations(state.items);
      }
    },
    resetConversationStorage(state) {
      clearStoredConversationId();
      const fresh = createConversationRecord();
      state.items = [fresh];
      state.activeConversationId = fresh.id;
      setStoredConversationId(fresh.id);
      persistConversations(state.items);
    },
  },
});

export const {
  startNewConversation,
  setActiveConversation,
  updateConversationMeta,
  renameConversation,
  deleteConversation,
  ensureConversation,
  resetConversationStorage,
} = conversationSlice.actions;

export default conversationSlice.reducer;

export function deriveConversationTitle(content: string): string {
  const cleaned = content.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return 'New support conversation';
  }
  return cleaned.length > 48 ? `${cleaned.slice(0, 48)}…` : cleaned;
}

export { createId };
