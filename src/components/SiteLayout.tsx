import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useScrollRestoration } from '../lib/hooks';
import { COPY } from '../content/copy';
import { whatsappLink } from '../content/site';
import { Nav } from './Nav';
import { Footer } from './Footer';

/** Public-site shell: skip link, sticky nav, <main id="main">, footer, and the two-cell mobile bar (hidden on /contact). */
export function SiteLayout() {
  useScrollRestoration();
  const { pathname } = useLocation();
  const showBar = !pathname.startsWith('/contact');
  const firstRender = useRef(true);

  // The mobile bar needs room under the footer.
  useEffect(() => {
    document.body.classList.toggle('has-bar', showBar);
    return () => {
      document.body.classList.remove('has-bar');
    };
  }, [showBar]);

  // Under 768px the fixed bar duplicates any primary button already on screen: the hero's own "Request a quote" and
  // "WhatsApp" pair, and the enquiry form's submit at the foot of the page. Hide it while the hero button row or any
  // primary button in <main> is in view (DESIGN.md §6.1: at most one primary button per viewport). Body padding stays,
  // so nothing shifts when the bar returns.
  useEffect(() => {
    const body = document.body;
    if (!showBar || typeof IntersectionObserver === 'undefined') {
      body.classList.remove('bar-hidden');
      return undefined;
    }
    let observer: IntersectionObserver | undefined;
    const onScreen = new Set<Element>();
    const id = window.setTimeout(() => {
      const targets = document.querySelectorAll('main .section--first .btn-row, main .btn--primary');
      if (targets.length === 0) return;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        body.classList.toggle('bar-hidden', onScreen.size > 0);
      });
      targets.forEach((t) => observer?.observe(t));
    }, 0);
    return () => {
      window.clearTimeout(id);
      observer?.disconnect();
      body.classList.remove('bar-hidden');
    };
  }, [pathname, showBar]);

  // Route change: move focus to the page h1 (DESIGN.md §8.1). Not on first load, so the skip link stays first in tab order.
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
      {showBar && (
        <div className="mobile-bar">
          <a className="btn btn--wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            {COPY.shell.mobileBarWhatsapp}
          </a>
          <Link className="btn btn--primary" to="/contact">
            {COPY.shell.mobileBarQuote}
          </Link>
        </div>
      )}
    </>
  );
}
