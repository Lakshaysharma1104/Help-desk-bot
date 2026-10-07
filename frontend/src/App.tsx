import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AssistantPage } from '@/pages/assistant/AssistantPage';
import { HistoryPage } from '@/pages/history/HistoryPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { NewTicketPage } from '@/pages/tickets/NewTicketPage';
import { TicketsPage } from '@/pages/tickets/TicketsPage';

const routeMeta: Record<string, { title: string; subtitle?: string }> = {
  '/': {
    title: 'AI Assistant',
    subtitle: 'Chat with Liza for troubleshooting, ticket updates, and support guidance.',
  },
  '/tickets': {
    title: 'My Tickets',
    subtitle: 'Review support requests and continue work with your assistant.',
  },
  '/new-ticket': {
    title: 'New Ticket',
    subtitle: 'Report an issue with the details Liza needs to help quickly.',
  },
  '/history': {
    title: 'History',
    subtitle: 'Browse and resume previous support conversations.',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Manage preferences, email, theme, and local conversation data.',
  },
};

function AppLayout() {
  const location = useLocation();
  const meta = routeMeta[location.pathname] ?? routeMeta['/'];

  return <AppShell title={meta.title} subtitle={meta.subtitle} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<AssistantPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="new-ticket" element={<NewTicketPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
