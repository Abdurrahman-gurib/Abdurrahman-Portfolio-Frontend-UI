import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useScrollRestoration } from '../lib/hooks';
import { COPY } from '../content/copy';
import { Nav } from './Nav';
import { Footer } from './Footer';

/** Public-site shell: skip link, sticky glass nav, <main id="main">, footer. */
export function SiteLayout() {
  useScrollRestoration();
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  // Route change: move focus to the page h1. Not on first load, so the skip link stays first in tab order.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }
    const id = window.setTimeout(() => {
      const h1 = document.querySelector<HTMLElement>('main h1');
      if (!h1) return;
      if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        {COPY.shell.skipLink}
      </a>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
