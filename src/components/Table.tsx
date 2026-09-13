import type { ReactNode } from 'react';

export interface TableProps {
  /** Visually hidden <caption> for screen readers. */
  caption?: string;
  /** <thead> and <tbody> children. */
  children: ReactNode;
  /** Back-office density (.table--dense). */
  dense?: boolean;
  /** Clickable rows: hover band, row cursor (.table--rows). Each row must still contain a real link. */
  rows?: boolean;
  /** Sticky header row (.table--sticky). */
  sticky?: boolean;
  /** Price sheet styling (.sheet): paper on the band, ledger under 768px. */
  sheet?: boolean;
  className?: string;
  /** Wrap in .table-wrap for horizontal scroll. Default true. */
  wrap?: boolean;
}

/** A real <table> in an overflow wrapper (DESIGN.md §6.8). */
export function Table({ caption, children, dense, rows, sticky, sheet, className, wrap = true }: TableProps) {
  const cls = [dense ? 'table--dense' : '', rows ? 'table--rows' : '', sticky ? 'table--sticky' : '', sheet ? 'sheet' : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  const table = (
    <table className={cls || undefined}>
      {caption && <caption className="visually-hidden">{caption}</caption>}
      {children}
    </table>
  );
  return wrap ? <div className="table-wrap">{table}</div> : table;
}
