import type { ReactNode } from 'react';

export interface DefinitionItem {
  term: string;
  /** Value. Wrap numbers, prices and IDs in <span className="mono"> if they should read as data. */
  detail: ReactNode;
}

export interface DefinitionListProps {
  items: DefinitionItem[];
  /** Denser rows (back-office enquiry sheet). */
  tight?: boolean;
  /** Label above value on every row. */
  stack?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** Clean key / value rows. */
export function DefinitionList({ items, tight, stack, className, 'aria-label': ariaLabel }: DefinitionListProps) {
  return (
    <dl className={['kv', tight ? 'kv--tight' : '', stack ? 'kv--stack' : '', className ?? ''].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      {items.map((item) => (
        <div key={item.term}>
          <dt>{item.term}</dt>
          <dd>{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
