import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage, MessageStatus } from '@/types';
import { readJson, writeJson } from '@/utils/storage';

const MESSAGES_KEY = 'helpdesk_messages';

type MessagesByConversation = Record<string, ChatMessage[]>;

function loadMessages(): MessagesByConversation {
  return readJson<MessagesByConversation>(MESSAGES_KEY, {});
}

function persistMessages(messages: MessagesByConversation): void {
  writeJson(MESSAGES_KEY, messages);
}

interface ChatState {
  messagesByConversation: MessagesByConversation;
  isStreaming: boolean;
  streamAbortKey: string | null;
}

const initialState: ChatState = {
  messagesByConversation: loadMessages(),
  isStreaming: false,
  streamAbortKey: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(
      state,
      action: PayloadAction<{ conversationId: string; message: ChatMessage }>,
    ) {
      const { conversationId, message } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(message);
      persistMessages(state.messagesByConversation);
    },
    appendToMessage(
      state,
      action: PayloadAction<{ conversationId: string; messageId: string; chunk: string }>,
    ) {
      const { conversationId, messageId, chunk } = action.payload;
      const messages = state.messagesByConversation[conversationId];
      const message = messages?.find((item) => item.id === messageId);
      if (message) {
        message.content += chunk;
        persistMessages(state.messagesByConversation);
      }
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        status: MessageStatus;
        errorMessage?: string;
      }>,
    ) {
      const { conversationId, messageId, status, errorMessage } = action.payload;
      const message = state.messagesByConversation[conversationId]?.find(
        (item) => item.id === messageId,
      );
      if (message) {
        message.status = status;
        message.errorMessage = errorMessage;
        persistMessages(state.messagesByConversation);
      }
    },
    setMessageContent(
      state,
      action: PayloadAction<{ conversationId: string; messageId: string; content: string }>,
    ) {
      const { conversationId, messageId, content } = action.payload;
      const message = state.messagesByConversation[conversationId]?.find(
        (item) => item.id === messageId,
      );
      if (message) {
        message.content = content;
        persistMessages(state.messagesByConversation);
      }
    },
    setStreaming(state, action: PayloadAction<{ isStreaming: boolean; key?: string | null }>) {
      state.isStreaming = action.payload.isStreaming;
      state.streamAbortKey = action.payload.key ?? null;
    },
    clearConversationMessages(state, action: PayloadAction<string>) {
      delete state.messagesByConversation[action.payload];
      persistMessages(state.messagesByConversation);
    },
    resetAllMessages(state) {
      state.messagesByConversation = {};
      persistMessages(state.messagesByConversation);
    },
  },
});

export const {
  addMessage,
  appendToMessage,
  updateMessageStatus,
  setMessageContent,
  setStreaming,
  clearConversationMessages,
  resetAllMessages,
} = chatSlice.actions;

export default chatSlice.reducer;

export function selectMessagesForConversation(
  state: { chat: ChatState },
  conversationId: string,
): ChatMessage[] {
  return state.chat.messagesByConversation[conversationId] ?? [];
}
