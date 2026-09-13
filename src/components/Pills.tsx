import type { EnquiryPriority, EnquiryStatus } from '../lib/api';
import { COPY } from '../content/copy';

/* Status and priority as soft coloured pills: new indigo, contacted cyan, quoted amber, won emerald, lost rose, archived slate. */

export interface StatusPillProps {
  status: EnquiryStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  return <span className={['pill', `pill--${status}`, className ?? ''].filter(Boolean).join(' ')}>{COPY.backoffice.statuses[status]}</span>;
}

export interface PriorityPillProps {
  priority: EnquiryPriority;
  className?: string;
}

export function PriorityPill({ priority, className }: PriorityPillProps) {
  return (
    <span className={['pill', `pill--priority-${priority}`, className ?? ''].filter(Boolean).join(' ')}>{COPY.backoffice.priorities[priority]}</span>
  );
}
