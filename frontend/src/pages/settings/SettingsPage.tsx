import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resetConversationStorage,
  startNewConversation,
} from '@/store/slices/conversationSlice';
import { resetAllMessages } from '@/store/slices/chatSlice';
import {
  resetSettings,
  setApiBaseUrl,
  setTheme,
  setUserEmail,
} from '@/store/slices/settingsSlice';
import { Button } from '@/components/ui/Button';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const conversationId = useAppSelector((state) => state.conversations.activeConversationId);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset all local conversations and preferences? This cannot be undone.',
    );
    if (!confirmed) {
      return;
    }

    dispatch(resetAllMessages());
    dispatch(resetConversationStorage());
    dispatch(resetSettings());
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Preferences</p>
        <h2>Settings</h2>
        <p className={styles.description}>
          Personalize your support experience and manage local conversation data.
        </p>
      </header>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
      >
        <section className={styles.section}>
          <label htmlFor="user-email">Support email</label>
          <p className={styles.help}>
            Used in quick prompts when asking Liza to find or create tickets.
          </p>
          <input
            id="user-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={settings.userEmail}
            onChange={(event) => dispatch(setUserEmail(event.target.value))}
          />
        </section>

        <section className={styles.section}>
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={settings.theme}
            onChange={(event) =>
              dispatch(setTheme(event.target.value as 'light' | 'dark' | 'system'))
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </section>

        <section className={styles.section}>
          <label htmlFor="api-base">API base URL</label>
          <p className={styles.help}>
            This is the backend used by the assistant. You can override it for local development.
          </p>
          <input
            id="api-base"
            type="url"
            placeholder="https://help-desk-bot.onrender.com"
            value={settings.apiBaseUrl}
            onChange={(event) => dispatch(setApiBaseUrl(event.target.value))}
          />
        </section>

        <section className={styles.section}>
          <h3>Conversation</h3>
          <p className={styles.help}>
            Active conversation ID: <code>{conversationId}</code>
          </p>
          <div className={styles.inlineActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => dispatch(startNewConversation())}
            >
              Start new conversation
            </Button>
          </div>
        </section>

        <div className={styles.actions}>
          <Button type="submit">Save preferences</Button>
          {saved ? <span className={styles.saved}>Saved</span> : null}
          <Button type="button" variant="danger" onClick={handleReset}>
            Reset local data
          </Button>
        </div>
      </form>
    </div>
  );
}
