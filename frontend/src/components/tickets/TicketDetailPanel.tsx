import type { Ticket } from '@/types';
import { formatDateTime } from '@/utils/formatDate';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import styles from './TicketDetailPanel.module.css';

interface TicketDetailPanelProps {
  ticket: Ticket;
}

export function TicketDetailPanel({ ticket }: TicketDetailPanelProps) {
  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Ticket #{ticket.ticketId}</p>
          <h2>{ticket.summary}</h2>
        </div>
        <div className={styles.badges}>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </header>

      <section className={styles.section}>
        <h3>Description</h3>
        <p>{ticket.description}</p>
      </section>

      <section className={styles.grid}>
        <div>
          <h3>Requester</h3>
          <p>{ticket.email}</p>
        </div>
        <div>
          <h3>Created</h3>
          <p>{formatDateTime(ticket.createdOn)}</p>
        </div>
        <div>
          <h3>Last updated</h3>
          <p>{formatDateTime(ticket.updatedOn)}</p>
        </div>
      </section>
    </div>
  );
}
