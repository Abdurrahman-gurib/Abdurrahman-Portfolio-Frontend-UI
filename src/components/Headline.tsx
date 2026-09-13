import type { ReactNode } from 'react';

export interface HeadlineProps {
  /** The full heading text. */
  text: string;
  /** How many words at the end get the gradient. Default 3. Pass 0 for none. */
  words?: number;
  /** Put the gradient on the first N words instead of the last N. */
  lead?: boolean;
}

/** Splits a heading so part of it can carry gradient text. Returns inline nodes for use inside an h1/h2. */
export function Headline({ text, words = 3, lead = false }: HeadlineProps): ReactNode {
  const parts = text.trim().split(/\s+/);
  if (words <= 0 || parts.length <= words) return text;
  if (lead) {
    const head = parts.slice(0, words).join(' ');
    const tail = parts.slice(words).join(' ');
    return (
      <>
        <span className="grad">{head}</span> {tail}
      </>
    );
  }
  const head = parts.slice(0, parts.length - words).join(' ');
  const tail = parts.slice(parts.length - words).join(' ');
  return (
    <>
      {head} <span className="grad">{tail}</span>
    </>
  );
}
