import type { Status } from '@/types';
import { Badge } from '@/components/ui/Badge';

const statusLabels: Record<Status, string> = {
  OPEN: 'Open',
  CLOSED: 'Closed',
  RESOLVED: 'Resolved',
};

const statusTone: Record<Status, 'info' | 'success' | 'neutral'> = {
  OPEN: 'info',
  RESOLVED: 'success',
  CLOSED: 'neutral',
};

const statusIcon: Record<Status, string> = {
  OPEN: '●',
  RESOLVED: '✓',
  CLOSED: '■',
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge tone={statusTone[status]}>
      <span aria-hidden="true">{statusIcon[status]}</span>
      {statusLabels[status]}
    </Badge>
  );
}
