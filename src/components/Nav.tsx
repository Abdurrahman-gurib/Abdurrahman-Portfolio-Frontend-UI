import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { COPY } from '../content/copy';
import { OWNER, TEL_LINK, mailtoLink, whatsappLink } from '../content/site';

export interface NavProps {
  /** 'site' (default): sticky glass bar with links, WhatsApp link, CTA and the mobile drawer. 'backoffice': brand only (login page). */
  variant?: 'site' | 'backoffice';
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** The sticky glass nav and its mobile drawer. The <header> landmark for the public site. */
export function Nav({ variant = 'site' }: NavProps) {
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Body scroll lock, Escape to close, focus return to the button.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      document.body.classList.add('drawer-open');
      const onKey = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.classList.remove('drawer-open');
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      buttonRef.current?.focus();
    }
    return undefined;
  }, [open]);

  // Trap Tab inside the header (menu button + drawer) while the drawer is open.
  const onHeaderKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!open || e.key !== 'Tab' || !headerRef.current) return;
    const nodes = Array.from(headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === buttonRef.current);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (variant === 'backoffice') {
    return (
      <header className="nav nav--bare">
        <div className="nav__bar">
          <div className="container nav__inner">
            <Link className="nav__brand" to="/">
              <span className="nav__dot" aria-hidden="true" />
              {OWNER.name}
              <span className="tagline">{COPY.shell.backofficeTagline}</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="nav" ref={headerRef} onKeyDown={onHeaderKeyDown}>
      <div className="nav__bar">
        <div className="container nav__inner">
          <Link className="nav__brand" to="/">
            <span className="nav__dot" aria-hidden="true" />
            {OWNER.name}
          </Link>

          <nav className="nav__links" aria-label={COPY.shell.mainNavLabel}>
            <ul>
              {COPY.nav.items.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__cta">
            <a className="nav__wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <span className="word">{COPY.shell.whatsappWord}</span>
              <span className="num">{OWNER.phoneDisplay}</span>
            </a>
            <Link className="btn btn--primary btn--sm" to="/contact">
              {COPY.nav.cta}
            </Link>
          </div>

          <button
            ref={buttonRef}
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="site-drawer"
            aria-label={open ? COPY.shell.menuClose : COPY.shell.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav__bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div className="drawer" id="site-drawer" hidden={!open}>
        <nav aria-label={COPY.shell.drawerLabel}>
          <ul>
            {COPY.nav.items.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="drawer__foot">
          <a className="btn btn--wa btn--block btn--noarrow" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            {COPY.shell.whatsappWord} <span className="mono">{OWNER.phoneDisplay}</span>
          </a>
          <Link className="btn btn--primary btn--block" to="/contact">
            {COPY.nav.cta}
          </Link>
          <div className="drawer__contact">
            <a href={TEL_LINK}>{OWNER.phoneDisplay}</a>
            <a href={mailtoLink()}>{OWNER.email}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
