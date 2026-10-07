import type { AppDispatch, RootState } from '@/store';
import { streamHelpdeskResponse } from '@/services/api/helpdeskApi';
import {
  addMessage,
  appendToMessage,
  setMessageContent,
  setStreaming,
  updateMessageStatus,
} from '@/store/slices/chatSlice';
import {
  deriveConversationTitle,
  updateConversationMeta,
} from '@/store/slices/conversationSlice';
import type { ChatMessage } from '@/types';
import { createId } from '@/utils/storage';

const activeControllers = new Map<string, AbortController>();

export function stopStreaming(): void {
  activeControllers.forEach((controller) => controller.abort());
  activeControllers.clear();
}

interface SendMessageArgs {
  conversationId: string;
  content: string;
}

export function sendChatMessage({ conversationId, content }: SendMessageArgs) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }

    const { settings } = getState();
    const { isStreaming } = getState().chat;

    if (isStreaming) {
      return;
    }

    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: createId('msg'),
      role: 'user',
      content: trimmed,
      createdAt: now,
      status: 'sent',
    };

    const assistantMessage: ChatMessage = {
      id: createId('msg'),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      status: 'streaming',
    };

    dispatch(addMessage({ conversationId, message: userMessage }));
    dispatch(addMessage({ conversationId, message: assistantMessage }));

    const existingMessages = getState().chat.messagesByConversation[conversationId] ?? [];
    const isFirstExchange = existingMessages.length <= 2;

    dispatch(
      updateConversationMeta({
        conversationId,
        preview: trimmed,
        title: isFirstExchange ? deriveConversationTitle(trimmed) : undefined,
        incrementCount: true,
      }),
    );

    const controller = new AbortController();
    const streamKey = `${conversationId}:${assistantMessage.id}`;
    activeControllers.set(streamKey, controller);

    dispatch(setStreaming({ isStreaming: true, key: streamKey }));

    try {
      await streamHelpdeskResponse(trimmed, conversationId, settings.apiBaseUrl, {
        signal: controller.signal,
        onChunk: (chunk) => {
          dispatch(
            appendToMessage({
              conversationId,
              messageId: assistantMessage.id,
              chunk,
            }),
          );
        },
      });

      dispatch(
        updateMessageStatus({
          conversationId,
          messageId: assistantMessage.id,
          status: 'sent',
        }),
      );

      const finalContent =
        getState().chat.messagesByConversation[conversationId]?.find(
          (message) => message.id === assistantMessage.id,
        )?.content ?? '';

      if (finalContent) {
        dispatch(
          updateConversationMeta({
            conversationId,
            preview: finalContent.replace(/\s+/g, ' ').slice(0, 120),
          }),
        );
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        dispatch(
          updateMessageStatus({
            conversationId,
            messageId: assistantMessage.id,
            status: 'stopped',
            errorMessage: 'Response stopped.',
          }),
        );
      } else {
        const message =
          error instanceof Error
            ? error.message
            : 'We could not complete this response. Please try again.';

        dispatch(
          updateMessageStatus({
            conversationId,
            messageId: assistantMessage.id,
            status: 'error',
            errorMessage: message,
          }),
        );
      }
    } finally {
      activeControllers.delete(streamKey);
      dispatch(setStreaming({ isStreaming: false, key: null }));
    }
  };
}

export function retryAssistantMessage(conversationId: string, assistantMessageId: string) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const messages = getState().chat.messagesByConversation[conversationId] ?? [];
    const assistantIndex = messages.findIndex((message) => message.id === assistantMessageId);

    if (assistantIndex <= 0) {
      return;
    }

    const userMessage = messages[assistantIndex - 1];
    if (userMessage.role !== 'user') {
      return;
    }

    const preservedPrefix = messages[assistantIndex].content;

    dispatch(
      updateMessageStatus({
        conversationId,
        messageId: assistantMessageId,
        status: 'streaming',
        errorMessage: undefined,
      }),
    );

    if (!preservedPrefix) {
      dispatch(
        appendToMessage({
          conversationId,
          messageId: assistantMessageId,
          chunk: '',
        }),
      );
    }

    const { settings } = getState();
    const controller = new AbortController();
    const streamKey = `${conversationId}:${assistantMessageId}`;
    activeControllers.set(streamKey, controller);
    dispatch(setStreaming({ isStreaming: true, key: streamKey }));

    try {
      await streamHelpdeskResponse(userMessage.content, conversationId, settings.apiBaseUrl, {
        signal: controller.signal,
        onChunk: (chunk) => {
          dispatch(
            appendToMessage({
              conversationId,
              messageId: assistantMessageId,
              chunk,
            }),
          );
        },
      });

      dispatch(
        updateMessageStatus({
          conversationId,
          messageId: assistantMessageId,
          status: 'sent',
        }),
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        dispatch(
          updateMessageStatus({
            conversationId,
            messageId: assistantMessageId,
            status: 'stopped',
            errorMessage: 'Response stopped.',
          }),
        );
      } else {
        dispatch(
          updateMessageStatus({
            conversationId,
            messageId: assistantMessageId,
            status: 'error',
            errorMessage:
              error instanceof Error ? error.message : 'Retry failed. Please try again.',
          }),
        );
      }
    } finally {
      activeControllers.delete(streamKey);
      dispatch(setStreaming({ isStreaming: false, key: null }));
    }
  };
}

export function retryFromScratch(conversationId: string, assistantMessageId: string) {
  return (dispatch: AppDispatch) => {
    dispatch(
      setMessageContent({
        conversationId,
        messageId: assistantMessageId,
        content: '',
      }),
    );
    dispatch(
      updateMessageStatus({
        conversationId,
        messageId: assistantMessageId,
        status: 'streaming',
        errorMessage: undefined,
      }),
    );
    dispatch(retryAssistantMessage(conversationId, assistantMessageId));
  };
}
