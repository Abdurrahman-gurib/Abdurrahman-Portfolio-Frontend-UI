import type { ReactNode } from 'react';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

/** The three softly animated colour blobs behind a dark hero. Pure decoration. */
export function HeroBlobs() {
  return (
    <>
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />
      <div className="hero__blob hero__blob--3" aria-hidden="true" />
    </>
  );
}

export interface StatChipItem {
  value: ReactNode;
  label: ReactNode;
  /** Gradient text on the value. */
  grad?: boolean;
  /** Span the full width of the chip grid. */
  wide?: boolean;
}

export interface StatChipsProps {
  items: StatChipItem[];
  columns?: 2 | 3;
  className?: string;
  'aria-label'?: string;
}

/** Glass stat chips (years, response time, based in Mauritius) used in heroes. */
export function StatChips({ items, columns = 2, className, 'aria-label': ariaLabel }: StatChipsProps) {
  const cls = ['stat-chips', columns === 3 ? 'stat-chips--3' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <ul className={cls} aria-label={ariaLabel} style={{ listStyle: 'none' }}>
      {items.map((item, i) => (
        <li
          key={i}
          className={['stat-chip', item.wide ? 'stat-chip--wide' : '', typeof item.value === 'string' && item.value.length > 12 ? 'stat-chip--long' : '']
            .filter(Boolean)
            .join(' ')}
        >
          <b className={item.grad ? 'grad' : undefined}>{item.value}</b>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export interface PageHeroProps {
  /** Items after "Home". */
  breadcrumb?: BreadcrumbItem[];
  eyebrow?: string;
  title: ReactNode;
  titleId?: string;
  lead?: ReactNode;
  /** Rendered under the lead: button rows, availability line. */
  children?: ReactNode;
  /** Right-hand column: stat chips, a card. */
  aside?: ReactNode;
  /** The tall home variant. Default false (inner page). */
  home?: boolean;
  className?: string;
}

/** Dark gradient page opening with animated blobs, gradient-ready title and an optional aside. */
export function PageHero({ breadcrumb, eyebrow, title, titleId, lead, children, aside, home = false, className }: PageHeroProps) {
  const cls = ['hero', home ? '' : 'hero--page', className ?? ''].filter(Boolean).join(' ');
  return (
    <section className={cls} aria-labelledby={titleId}>
      <HeroBlobs />
      <div className="container hero__inner">
        <div className={aside ? 'hero__grid' : undefined}>
          <div className="hero__main">
            {breadcrumb && <Breadcrumb items={breadcrumb} />}
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 id={titleId}>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
            {children}
          </div>
          {aside && <div className="hero__aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
