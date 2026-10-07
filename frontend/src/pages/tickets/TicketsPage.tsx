import { useNavigate } from 'react-router-dom';
import { ticketApiCapabilities } from '@/services/api/ticketApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setComposerDraft } from '@/store/slices/uiSlice';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './TicketsPage.module.css';

export function TicketsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector((state) => state.settings.userEmail);

  const openAssistantWithPrompt = (prompt: string) => {
    dispatch(setComposerDraft(prompt));
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Support tickets</p>
          <h2>My Tickets</h2>
          <p className={styles.description}>
            Tickets are created and managed through Liza, your support assistant.
            {ticketApiCapabilities.list
              ? ''
              : ' A dedicated ticket API is not connected yet, so lookups happen through conversation.'}
          </p>
        </div>
      </header>

      <EmptyState
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 7h10M7 12h10M7 17h6M5 4h14a2 2 0 0 1 2 2v12l-3-2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="No tickets to show here yet"
        description={
          userEmail
            ? `Ask Liza to look up tickets for ${userEmail}, report a new issue, or check the status of an existing request.`
            : 'Add your email in Settings, then ask Liza to look up tickets or create a new support request.'
        }
        actionLabel={userEmail ? 'Check my tickets' : 'Open assistant'}
        onAction={() =>
          openAssistantWithPrompt(
            userEmail
              ? `Please check whether I have any open or unresolved tickets for ${userEmail}.`
              : 'I need help with a support issue.',
          )
        }
        secondaryActionLabel={userEmail ? undefined : 'Go to settings'}
        onSecondaryAction={userEmail ? undefined : () => navigate('/settings')}
      />

      <section className={styles.helpPanel} aria-labelledby="ticket-help-title">
        <h3 id="ticket-help-title">What Liza can do today</h3>
        <ul>
          <li>Check for an existing ticket before creating a duplicate.</li>
          <li>Create a ticket with summary, description, priority, and status.</li>
          <li>Update an existing ticket when you share new details.</li>
          <li>Explain current ticket status in plain language.</li>
        </ul>
      </section>
    </div>
  );
}
