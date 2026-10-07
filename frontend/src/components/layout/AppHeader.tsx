import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMobileNavOpen } from '@/store/slices/uiSlice';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const dispatch = useAppDispatch();
  const isMobileNavOpen = useAppSelector((state) => state.ui.isMobileNavOpen);

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMobileNavOpen}
        onClick={() => dispatch(setMobileNavOpen(!isMobileNavOpen))}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={styles.copy}>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </header>
  );
}
