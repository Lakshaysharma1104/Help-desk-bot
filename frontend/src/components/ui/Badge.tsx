import styles from './Badge.module.css';

interface BadgeProps {
  children: React.ReactNode;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]} ${className}`}>{children}</span>;
}
