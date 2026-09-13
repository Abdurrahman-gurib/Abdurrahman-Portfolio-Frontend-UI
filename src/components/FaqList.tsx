import type { ReactNode } from 'react';

export interface FaqItem {
  q: string;
  /** A string becomes one paragraph; pass nodes for several. */
  a: ReactNode;
}

export interface FaqListProps {
  items: FaqItem[];
  className?: string;
}

/** Native <details>/<summary> FAQ (DESIGN.md §6.16). No JS accordion, no animation. */
export function FaqList({ items, className }: FaqListProps) {
  return (
    <div className={['faq', className ?? ''].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <div className="faq__body">{typeof item.a === 'string' ? <p>{item.a}</p> : item.a}</div>
        </details>
      ))}
    </div>
  );
}
