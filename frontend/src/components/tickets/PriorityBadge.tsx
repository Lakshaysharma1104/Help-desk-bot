import type { Priority } from '@/types';
import { Badge } from '@/components/ui/Badge';

const priorityLabels: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

const priorityTone: Record<Priority, 'neutral' | 'info' | 'warning' | 'danger'> = {
  LOW: 'neutral',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'danger',
};

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge tone={priorityTone[priority]}>
      <span aria-hidden="true">◆</span>
      {priorityLabels[priority]}
    </Badge>
  );
}
