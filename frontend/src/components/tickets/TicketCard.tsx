import type { Ticket } from '@/types';
import { formatDateTime, formatRelativeTime } from '@/utils/formatDate';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import styles from './TicketCard.module.css';

interface TicketCardProps {
  ticket: Ticket;
  onOpen?: (ticketId: number) => void;
}

export function TicketCard({ ticket, onOpen }: TicketCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.id}>Ticket #{ticket.ticketId}</p>
          <h3>{ticket.summary}</h3>
        </div>
        <div className={styles.badges}>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <p className={styles.description}>{ticket.description}</p>

      <div className={styles.meta}>
        <span>{ticket.email}</span>
        <span>Updated {formatRelativeTime(ticket.updatedOn)}</span>
        <span>{formatDateTime(ticket.createdOn)}</span>
      </div>

      {onOpen ? (
        <button type="button" className={styles.linkButton} onClick={() => onOpen(ticket.ticketId)}>
          View details
        </button>
      ) : null}
    </article>
  );
}
