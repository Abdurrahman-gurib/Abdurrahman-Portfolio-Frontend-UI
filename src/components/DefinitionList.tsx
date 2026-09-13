import type { ReactNode } from 'react';

export interface DefinitionItem {
  term: string;
  /** Sans value. Wrap numbers, prices and IDs in <span className="mono">. */
  detail: ReactNode;
}

export interface DefinitionListProps {
  items: DefinitionItem[];
  /** Denser rows (back-office enquiry sheet). */
  tight?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** The spec table (DESIGN.md §6.9): mono label column, sans values, one hairline per row. */
export function DefinitionList({ items, tight, className, 'aria-label': ariaLabel }: DefinitionListProps) {
  return (
    <dl className={['spec', tight ? 'spec--tight' : '', className ?? ''].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      {items.map((item) => (
        <div key={item.term}>
          <dt>{item.term}</dt>
          <dd>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
