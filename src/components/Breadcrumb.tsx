import { Link } from 'react-router-dom';
import { COPY } from '../content/copy';

export interface BreadcrumbItem {
  label: string;
  /** Omit on the last (current) item. */
  to?: string;
}

export interface BreadcrumbProps {
  /** Items after "Home", which is always prepended. */
  items: BreadcrumbItem[];
  className?: string;
}

/** Mono breadcrumb (DESIGN.md §6.3): "Home / Services / Cyber security". */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const all: BreadcrumbItem[] = [{ label: COPY.shell.homeLabel, to: '/' }, ...items];
  return (
    <nav className={['breadcrumb', className ?? ''].filter(Boolean).join(' ')} aria-label={COPY.shell.breadcrumbLabel}>
      <ol>
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${item.label}-${i}`} aria-current={last ? 'page' : undefined}>
              {item.to && !last ? <Link to={item.to}>{item.label}</Link> : item.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
