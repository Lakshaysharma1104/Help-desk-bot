import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMobileNavOpen } from '@/store/slices/uiSlice';
import { useThemeEffect } from '@/hooks/useAutoScroll';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import styles from './AppShell.module.css';

interface AppShellProps {
  title: string;
  subtitle?: string;
}

export function AppShell({ title, subtitle }: AppShellProps) {
  const dispatch = useAppDispatch();
  const isMobileNavOpen = useAppSelector((state) => state.ui.isMobileNavOpen);
  const theme = useAppSelector((state) => state.settings.theme);

  useThemeEffect(theme);

  return (
    <div className={styles.shell}>
      <Sidebar />

      {isMobileNavOpen ? (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close navigation menu"
            onClick={() => dispatch(setMobileNavOpen(false))}
          />
          <div className={styles.mobileNav}>
            <Sidebar mobile />
          </div>
        </>
      ) : null}

      <div className={styles.mainColumn}>
        <AppHeader title={title} subtitle={subtitle} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
