import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  /** Kept for compatibility; numbers are no longer shown. */
  index?: string;
  /** Small gradient pill above the heading, e.g. "Services". */
  eyebrow?: string;
  title: string;
  /** Short line under the title. */
  intro?: string;
  /** Heading level. Default h2. */
  as?: 'h1' | 'h2' | 'h3';
  /** id for the heading (anchor target). */
  id?: string;
  /** Kept for compatibility; heads are no longer sticky. */
  sticky?: boolean;
  /** Centre the head (used above card grids). */
  align?: 'left' | 'center';
  className?: string;
  /** Extra content under the intro: an availability line, a button row. */
  children?: ReactNode;
}

/** The section head: optional pill eyebrow, heading, optional intro. */
export function SectionHeader({ eyebrow, title, intro, as = 'h2', id, align = 'left', className, children }: SectionHeaderProps) {
  const Heading = as;
  const cls = ['section__head', align === 'center' ? 'section__head--center' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <header className={cls}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading id={id}>{title}</Heading>
      {intro && <p>{intro}</p>}
      {children}
    </header>
  );
}
