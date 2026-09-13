import type { ReactNode, Ref } from 'react';

export interface NoticeProps {
  tone: 'info' | 'success' | 'error';
  /** The mono uppercase key line, e.g. "Sign-in failed", "Saved · 14:32", "Please check 2 fields". */
  title?: string;
  children?: ReactNode;
  id?: string;
  /** Pass a ref and call .focus() after a failed submit (the element gets tabIndex -1). */
  ref?: Ref<HTMLDivElement>;
  className?: string;
}

/** Inline notice (DESIGN.md §6.17): a strong rule, a key line, text. Never a toast, never fixed. */
export function Notice({ tone, title, children, id, ref, className }: NoticeProps) {
  const role = tone === 'error' ? 'alert' : 'status';
  return (
    <div ref={ref} id={id} role={role} tabIndex={-1} className={['notice', `notice--${tone}`, className ?? ''].filter(Boolean).join(' ')}>
      {title && <span className="k">{title}</span>}
      {children}
    </div>
  );
}
