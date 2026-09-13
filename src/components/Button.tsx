import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'whatsapp' | 'danger';

interface CommonProps {
  /** Default 'secondary' (ink outline). At most one 'primary' per viewport. 'text' renders a plain arrow link, not a .btn. */
  variant?: ButtonVariant;
  size?: 'sm';
  /** Full width. */
  block?: boolean;
  /** The trailing arrow comes from CSS (::after). Pass false for labels that must not carry one, e.g. "Sign in", "Save". */
  arrow?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  children: ReactNode;
}

type LinkButtonProps = CommonProps & { as: 'link'; to: string; state?: unknown; replace?: boolean };
type AnchorButtonProps = CommonProps & { as: 'a'; href: string; target?: '_blank'; rel?: string; download?: boolean };
type NativeButtonProps = CommonProps & {
  as?: 'button';
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  form?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
};

export type ButtonProps = LinkButtonProps | AnchorButtonProps | NativeButtonProps;

const VARIANT_CLASS: Record<Exclude<ButtonVariant, 'text'>, string> = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  whatsapp: 'btn--wa',
  danger: 'btn--danger',
};

function classes(p: CommonProps, isButtonEl: boolean): string {
  const variant = p.variant ?? 'secondary';
  const list: string[] = [];
  if (variant === 'text') {
    list.push('link-arrow');
    if (isButtonEl) list.push('link-btn');
  } else {
    list.push('btn', VARIANT_CLASS[variant]);
    if (p.size === 'sm') list.push('btn--sm');
    if (p.block) list.push('btn--block');
    if (p.arrow === false) list.push('btn--noarrow');
  }
  if (p.className) list.push(p.className);
  return list.join(' ');
}

/** The one button. Sentence-case label, arrow from CSS, 44px tall. */
export function Button(props: ButtonProps) {
  const aria = { id: props.id, 'aria-label': props['aria-label'], 'aria-describedby': props['aria-describedby'] };
  if (props.as === 'link') {
    return (
      <Link to={props.to} state={props.state} replace={props.replace} className={classes(props, false)} {...aria}>
        {props.children}
      </Link>
    );
  }
  if (props.as === 'a') {
    const rel = props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined);
    return (
      <a href={props.href} target={props.target} rel={rel} download={props.download} className={classes(props, false)} {...aria}>
        {props.children}
      </a>
    );
  }
  return (
    <button
      type={props.type ?? 'button'}
      disabled={props.disabled}
      onClick={props.onClick}
      form={props.form}
      aria-expanded={props['aria-expanded']}
      aria-controls={props['aria-controls']}
      className={classes(props, true)}
      {...aria}
    >
      {props.children}
    </button>
  );
}
