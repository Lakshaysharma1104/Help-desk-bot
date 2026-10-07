import { SuggestedPrompts } from './SuggestedPrompts';
import styles from './ChatEmptyState.module.css';

const defaultPrompts = [
  'My laptop will not connect to the company VPN.',
  'Can you check whether I already have an open ticket?',
  'I need to report a billing issue with my account.',
  'What information do you need to create a support ticket?',
];

interface ChatEmptyStateProps {
  userEmail?: string;
  onSelectPrompt: (prompt: string) => void;
}

export function ChatEmptyState({ userEmail, onSelectPrompt }: ChatEmptyStateProps) {
  const prompts = userEmail
    ? [
        `Please check tickets linked to ${userEmail}.`,
        ...defaultPrompts.slice(0, 3),
      ]
    : defaultPrompts;

  return (
    <section className={styles.emptyState} aria-labelledby="assistant-intro-title">
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Support assistant</p>
        <h2 id="assistant-intro-title">Tell Liza what you need help with</h2>
        <p className={styles.description}>
          Liza can troubleshoot common issues, check whether a ticket already exists,
          collect the details needed for a new request, and guide you through next steps
          with xyz Technologies support.
        </p>
      </div>

      <ul className={styles.capabilities}>
        <li>
          <strong>Troubleshoot</strong>
          <span>Walk through fixes before escalating.</span>
        </li>
        <li>
          <strong>Track tickets</strong>
          <span>Look up existing requests by email.</span>
        </li>
        <li>
          <strong>Create tickets</strong>
          <span>Open a new case when one is needed.</span>
        </li>
        <li>
          <strong>Stay informed</strong>
          <span>Understand status, priority, and updates.</span>
        </li>
      </ul>

      <SuggestedPrompts prompts={prompts} onSelect={onSelectPrompt} />
    </section>
  );
}
