import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  body?: string;
  /** Usually a <Button>. */
  action?: ReactNode;
  className?: string;
}

/** Ruled empty state (DESIGN.md §6.18). */
export function EmptyState({ title, body, action, className }: EmptyStateProps) {
  return (
    <div className={['empty', className ?? ''].filter(Boolean).join(' ')}>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}
