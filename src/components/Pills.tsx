import type { EnquiryPriority, EnquiryStatus } from '../lib/api';
import { COPY } from '../content/copy';

/* Status and priority are a 7px dot plus a word (DESIGN.md §6.10). Never a coloured pill. */

export interface StatusPillProps {
  status: EnquiryStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  return <span className={['status', `status--${status}`, className ?? ''].filter(Boolean).join(' ')}>{COPY.backoffice.statuses[status]}</span>;
}

export interface PriorityPillProps {
  priority: EnquiryPriority;
  className?: string;
}

export function PriorityPill({ priority, className }: PriorityPillProps) {
  return (
    <span className={['status', `priority--${priority}`, className ?? ''].filter(Boolean).join(' ')}>{COPY.backoffice.priorities[priority]}</span>
  );
}
