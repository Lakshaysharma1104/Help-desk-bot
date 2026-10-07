import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './ChatComposer.module.css';

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  disabled = false,
  isStreaming = false,
  placeholder = 'Describe your issue or ask for help…',
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!disabled && !isStreaming && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className={styles.composer}>
      <label htmlFor="chat-input" className="sr-only">
        Message to support assistant
      </label>
      <textarea
        id="chat-input"
        ref={textareaRef}
        className={styles.input}
        rows={1}
        value={value}
        placeholder={placeholder}
        disabled={disabled || isStreaming}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-describedby="chat-input-hint"
      />

      <div className={styles.footer}>
        <p id="chat-input-hint" className={styles.hint}>
          Enter to send · Shift + Enter for a new line
        </p>

        <div className={styles.actions}>
          {isStreaming && onStop ? (
            <Button variant="secondary" size="sm" onClick={onStop}>
              Stop
            </Button>
          ) : null}
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={disabled || isStreaming || !value.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
