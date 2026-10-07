import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setComposerDraft } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import styles from './NewTicketPage.module.css';

const checklist = [
  'What is going wrong, and when did it start?',
  'Which device, app, or account is affected?',
  'Have you already tried any troubleshooting steps?',
  'How urgent is the impact on your work?',
  'The email address that should be linked to the ticket.',
];

export function NewTicketPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector((state) => state.settings.userEmail);

  const startTicketFlow = () => {
    const prompt = userEmail
      ? `I'd like to report a new support issue. My email is ${userEmail}.`
      : 'I need to create a new support ticket. Please ask me for the details you need.';

    dispatch(setComposerDraft(prompt));
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Create a request</p>
        <h2>Report a new issue</h2>
        <p className={styles.description}>
          Liza will gather the details, check for duplicates, and create a ticket only when
          needed. You will receive a confirmation with ticket ID, priority, and status.
        </p>
      </header>

      <section className={styles.panel}>
        <h3>Liza will ask for</h3>
        <ul>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Button onClick={startTicketFlow}>Start with Liza</Button>
          <Button variant="secondary" onClick={() => navigate('/settings')}>
            {userEmail ? 'Update email' : 'Add email first'}
          </Button>
        </div>
      </section>

      <p className={styles.note}>
        Ticket creation happens through the assistant because the backend exposes AI tooling rather
        than a direct create-ticket endpoint.
      </p>
    </div>
  );
}
