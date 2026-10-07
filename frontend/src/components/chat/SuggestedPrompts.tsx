import styles from './SuggestedPrompts.module.css';

interface SuggestedPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ prompts, onSelect }: SuggestedPromptsProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Suggested starting points</p>
      <div className={styles.grid}>
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className={styles.prompt}
            onClick={() => onSelect(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
