import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { COPY } from '../content/copy';
import { OWNER, TEL_LINK, mailtoLink, whatsappLink } from '../content/site';

export interface NavProps {
  /** 'site' (default): sticky bar with links, WhatsApp link, CTA and the mobile drawer. 'backoffice': brand only (login page). */
  variant?: 'site' | 'backoffice';
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function numberFor(to: string): string {
  return COPY.nav.index.find((i) => i.to === to)?.n ?? '';
}

/** The single sticky nav bar and its mobile drawer (DESIGN.md §6.13). The <header> landmark for the public site. */
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
    const nodes = Array.from(headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === buttonRef.current,
    );
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
        <div className="container">
          <div className="grid">
            <Link className="nav__brand" to="/">
              {COPY.shell.brand}
              <span>{COPY.shell.backofficeTagline}</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="nav" ref={headerRef} onKeyDown={onHeaderKeyDown}>
      <div className="container">
        <div className="grid">
          <Link className="nav__brand" to="/">
            {COPY.shell.brand}
            <span>{COPY.shell.brandTagline}</span>
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
            <a className="wa-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <span className="word">{COPY.shell.whatsappWord}</span>
              <span className="num">{OWNER.phoneDisplay}</span>
            </a>
            <Link className="btn" to="/contact">
              {COPY.nav.cta}
            </Link>
          </div>

          <button
            ref={buttonRef}
            type="button"
            className="nav__menu"
            aria-expanded={open}
            aria-controls="site-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? COPY.shell.menuClose : COPY.shell.menuOpen}
          </button>
        </div>
      </div>

      <div className="drawer" id="site-drawer" hidden={!open}>
        <nav aria-label={COPY.shell.drawerLabel}>
          <ul>
            {COPY.nav.items.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>
                  <span className="n">{numberFor(item.to)}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="contact">
          <div>
            <a className="wa-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <span className="word">{COPY.shell.whatsappWord}</span>
              <span className="num">{OWNER.phoneDisplay}</span>
            </a>
          </div>
          <div>
            <a href={TEL_LINK}>{OWNER.phoneDisplay}</a>
          </div>
          <div>
            <a href={mailtoLink()}>{OWNER.email}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
