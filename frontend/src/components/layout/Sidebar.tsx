import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startNewConversation } from '@/store/slices/conversationSlice';
import { setMobileNavOpen } from '@/store/slices/uiSlice';
import styles from './Sidebar.module.css';

const navItems = [
  {
    to: '/',
    label: 'AI Assistant',
    end: true,
    description: 'Chat with Liza',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3c4.97 0 9 3.582 9 8s-4.03 8-9 8c-.96 0-1.89-.13-2.76-.38L3 21l1.55-4.04C3.57 15.66 3 14.38 3 13c0-4.418 4.03-8 9-8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/tickets',
    label: 'My Tickets',
    description: 'Track support requests',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 7h10M7 12h10M7 17h6M5 4h14a2 2 0 0 1 2 2v12l-3-2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/new-ticket',
    label: 'New Ticket',
    description: 'Report a new issue',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'History',
    description: 'Past conversations',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 8v5l3 2M12 22a10 10 0 1 0-10-10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    description: 'Preferences',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M19.4 15a7.7 7.7 0 0 0 .1-2l2-1.2-2-3.4-2.3.7a7.5 7.5 0 0 0-1.7-1L15 4h-6l-.5 2.1a7.5 7.5 0 0 0-1.7 1l-2.3-.7-2 3.4 2 1.2a7.7 7.7 0 0 0 .1 2l-2 1.2 2 3.4 2.3-.7a7.5 7.5 0 0 0 1.7 1L9 20h6l.5-2.1a7.5 7.5 0 0 0 1.7-1l2.3.7 2-3.4-2-1.2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

interface SidebarProps {
  mobile?: boolean;
}

export function Sidebar({ mobile = false }: SidebarProps) {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(
    (state) => state.conversations.activeConversationId,
  );

  const handleNewConversation = () => {
    dispatch(startNewConversation());
    dispatch(setMobileNavOpen(false));
  };

  return (
    <aside className={`${styles.sidebar} ${mobile ? styles.mobile : ''}`} aria-label="Main">
      <div className={styles.brand}>
        <div className={styles.logoMark} aria-hidden="true">
          HD
        </div>
        <div>
          <p className={styles.brandName}>xyz Help Desk</p>
          <p className={styles.brandTagline}>Support, guided by Liza</p>
        </div>
      </div>

      <button type="button" className={styles.newChatButton} onClick={handleNewConversation}>
        <span aria-hidden="true">+</span>
        New conversation
      </button>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            onClick={() => dispatch(setMobileNavOpen(false))}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navCopy}>
              <span className={styles.navLabel}>{item.label}</span>
              <span className={styles.navDescription}>{item.description}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <p className={styles.footerLabel}>Active conversation</p>
        <code className={styles.conversationId} title={activeConversationId}>
          {activeConversationId.slice(0, 8)}…
        </code>
      </div>
    </aside>
  );
}
