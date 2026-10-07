import type { ChatMessage } from '@/types';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { ChatMessageItem } from './ChatMessage';
import { ChatEmptyState } from './ChatEmptyState';
import styles from './ChatThread.module.css';

interface ChatThreadProps {
  messages: ChatMessage[];
  userEmail?: string;
  onSelectPrompt: (prompt: string) => void;
  onRetry: (messageId: string) => void;
}

export function ChatThread({
  messages,
  userEmail,
  onSelectPrompt,
  onRetry,
}: ChatThreadProps) {
  const scrollRef = useAutoScroll<HTMLDivElement>([messages], true);
  const isEmpty = messages.length === 0;

  return (
    <div ref={scrollRef} className={styles.thread} aria-live="polite">
      {isEmpty ? (
        <ChatEmptyState userEmail={userEmail} onSelectPrompt={onSelectPrompt} />
      ) : (
        <div className={styles.messages}>
          {messages.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              onRetry={
                message.status === 'error' || message.status === 'stopped'
                  ? () => onRetry(message.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
