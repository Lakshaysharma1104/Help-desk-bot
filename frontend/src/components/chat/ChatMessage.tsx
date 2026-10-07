import type { ChatMessage } from '@/types';
import { formatMessageTime } from '@/utils/formatDate';
import { Button } from '@/components/ui/Button';
import { StreamingIndicator } from './StreamingIndicator';
import styles from './ChatMessage.module.css';

interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
}

function renderContent(content: string) {
  return content.split('\n').map((line, index, array) => (
    <span key={`${index}-${line.slice(0, 12)}`}>
      {line}
      {index < array.length - 1 ? <br /> : null}
    </span>
  ));
}

export function ChatMessageItem({ message, onRetry }: ChatMessageItemProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.status === 'streaming';
  const isError = message.status === 'error';
  const isStopped = message.status === 'stopped';
  const hasContent = message.content.trim().length > 0;

  return (
    <article
      className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}
      aria-label={`${isUser ? 'You' : 'Liza'} at ${formatMessageTime(message.createdAt)}`}
    >
      <div className={styles.meta}>
        <span className={styles.author}>{isUser ? 'You' : 'Liza'}</span>
        <time dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time>
      </div>

      <div className={styles.bubble}>
        {hasContent ? (
          <div className={styles.content}>{renderContent(message.content)}</div>
        ) : null}

        {isStreaming && !hasContent ? <StreamingIndicator /> : null}
        {isStreaming && hasContent ? (
          <span className={styles.cursor} aria-hidden="true" />
        ) : null}

        {isError || isStopped ? (
          <div className={styles.errorBlock} role="alert">
            <p>{message.errorMessage ?? 'This response could not be completed.'}</p>
            <div className={styles.errorActions}>
              {onRetry ? (
                <Button size="sm" variant="secondary" onClick={onRetry}>
                  Try again
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
