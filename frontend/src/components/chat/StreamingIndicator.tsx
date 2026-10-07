import styles from './StreamingIndicator.module.css';

interface StreamingIndicatorProps {
  label?: string;
}

export function StreamingIndicator({ label = 'Liza is responding' }: StreamingIndicatorProps) {
  return (
    <div className={styles.indicator} role="status" aria-live="polite">
      <span className={styles.dots} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
