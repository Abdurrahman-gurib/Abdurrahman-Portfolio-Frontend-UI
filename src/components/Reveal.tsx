import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type RefObject } from 'react';

/*
 * Reveal-on-scroll. One shared IntersectionObserver adds "is-visible" the first time an element enters the viewport;
 * base.css fades and lifts it into place (no movement when prefers-reduced-motion is set). Siblings stagger via --delay.
 */

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function observe(el: Element, onVisible: () => void): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    onVisible();
    return () => undefined;
  }
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
  }
  callbacks.set(el, onVisible);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

/** Hook form: returns a ref to attach and whether the element has been seen. */
export function useReveal<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return undefined;
    return observe(el, () => setVisible(true));
  }, [visible]);
  return [ref, visible];
}

export interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Element to render. Default div. */
  as?: 'div' | 'section' | 'article' | 'li' | 'ul' | 'ol' | 'header' | 'footer' | 'aside' | 'p';
  /** Stagger delay in milliseconds. */
  delay?: number;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Wrapper that fades and lifts its content into view once. */
export function Reveal({ as = 'div', delay = 0, className, style, children, ...rest }: RevealProps) {
  const [ref, visible] = useReveal<HTMLDivElement>();
  const Tag = as as 'div';
  const cls = ['reveal', visible ? 'is-visible' : '', className ?? ''].filter(Boolean).join(' ');
  const css: CSSProperties = delay ? { ...style, ['--delay' as string]: `${delay}ms` } : { ...style };
  return (
    <Tag ref={ref} className={cls} style={css} {...rest}>
      {children}
    </Tag>
  );
}
