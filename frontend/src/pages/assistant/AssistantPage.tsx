import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectMessagesForConversation } from '@/store/slices/chatSlice';
import {
  retryFromScratch,
  sendChatMessage,
  stopStreaming,
} from '@/store/thunks/chatThunks';
import { clearComposerDraft, setComposerDraft } from '@/store/slices/uiSlice';
import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatThread } from '@/components/chat/ChatThread';
import styles from './AssistantPage.module.css';

export function AssistantPage() {
  const dispatch = useAppDispatch();
  const conversationId = useAppSelector((state) => state.conversations.activeConversationId);
  const messages = useAppSelector((state) =>
    selectMessagesForConversation(state, conversationId),
  );
  const isStreaming = useAppSelector((state) => state.chat.isStreaming);
  const userEmail = useAppSelector((state) => state.settings.userEmail);
  const draft = useAppSelector((state) => state.ui.composerDraft);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (draft) {
      setInput(draft);
      dispatch(clearComposerDraft());
    }
  }, [draft, dispatch]);

  const handleSubmit = () => {
    const content = input.trim();
    if (!content || isStreaming) {
      return;
    }

    setInput('');
    dispatch(sendChatMessage({ conversationId, content }));
  };

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
    textareaFocus();
  };

  const textareaFocus = () => {
    requestAnimationFrame(() => {
      document.getElementById('chat-input')?.focus();
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.workspace}>
        <ChatThread
          messages={messages}
          userEmail={userEmail}
          onSelectPrompt={handleSelectPrompt}
          onRetry={(messageId) =>
            dispatch(retryFromScratch(conversationId, messageId))
          }
        />
      </div>

      <div className={styles.composerRegion}>
        <ChatComposer
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          onStop={stopStreaming}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}

export function primeAssistantDraft(message: string) {
  return setComposerDraft(message);
}
