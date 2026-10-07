import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteConversation,
  setActiveConversation,
} from '@/store/slices/conversationSlice';
import { formatDateTime, formatRelativeTime } from '@/utils/formatDate';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import styles from './HistoryPage.module.css';

export function HistoryPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((state) => state.conversations.items);
  const activeConversationId = useAppSelector(
    (state) => state.conversations.activeConversationId,
  );

  if (conversations.length === 0) {
    return (
      <div className={styles.page}>
        <EmptyState
          title="No conversations yet"
          description="Your support conversations will appear here once you start chatting with Liza."
          actionLabel="Open assistant"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Conversation archive</p>
          <h2>History</h2>
          <p className={styles.description}>
            Resume a previous support conversation or remove ones you no longer need.
          </p>
        </div>
      </header>

      <ul className={styles.list}>
        {[...conversations]
          .sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .map((conversation) => {
            const isActive = conversation.id === activeConversationId;

            return (
              <li key={conversation.id} className={styles.item}>
                <button
                  type="button"
                  className={`${styles.openButton} ${isActive ? styles.active : ''}`}
                  onClick={() => {
                    dispatch(setActiveConversation(conversation.id));
                    navigate('/');
                  }}
                >
                  <div className={styles.itemHeader}>
                    <h3>{conversation.title}</h3>
                    <span>{formatRelativeTime(conversation.updatedAt)}</span>
                  </div>
                  <p>{conversation.preview}</p>
                  <div className={styles.meta}>
                    <span>{conversation.messageCount} messages</span>
                    <span>{formatDateTime(conversation.updatedAt)}</span>
                    {isActive ? <span className={styles.activeTag}>Active</span> : null}
                  </div>
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={styles.deleteButton}
                  onClick={() => dispatch(deleteConversation(conversation.id))}
                >
                  Delete
                </Button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
