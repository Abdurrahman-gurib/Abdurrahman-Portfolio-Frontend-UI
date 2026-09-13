import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  /** Section number, e.g. "02" or "02.4". Rendered in ink inside the eyebrow. */
  index?: string;
  /** Eyebrow word(s), e.g. "Services". CSS uppercases it. Format becomes "02 — SERVICES". */
  eyebrow?: string;
  title: string;
  /** Short muted line under the title (14px, 28ch). */
  intro?: string;
  /** Heading level. Default h2. Use h1 on a page's opening section only. */
  as?: 'h1' | 'h2' | 'h3';
  /** id for the heading (anchor target). */
  id?: string;
  /** Sticky in cols 1–3 at >= 1024px by default. Pass false for very short sections. */
  sticky?: boolean;
  className?: string;
  /** Extra content under the intro: marginalia (<dl class="aside">), an availability line, a button row. */
  children?: ReactNode;
}

/** The canonical section head (DESIGN.md §6.3): eyebrow with number, heading, optional intro. Place inside a .grid. */
export function SectionHeader({ index, eyebrow, title, intro, as = 'h2', id, sticky = true, className, children }: SectionHeaderProps) {
  const Heading = as;
  const cls = ['section__head', sticky ? '' : 'section__head--static', className ?? ''].filter(Boolean).join(' ');
  return (
    <header className={cls}>
      {(index || eyebrow) && (
        <span className="eyebrow">
          {index && <span className="n">{index}</span>}
          {index && eyebrow ? ' — ' : ''}
          {eyebrow}
        </span>
      )}
      <Heading id={id}>{title}</Heading>
      {intro && <p>{intro}</p>}
      {children}
    </header>
  );
}
