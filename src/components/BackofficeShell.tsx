import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { adminChatApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useScrollRestoration } from '../lib/hooks';
import { COPY } from '../content/copy';
import '../styles/pages/conversations.css';

const UNREAD_POLL_MS = 30000;

function sectionLabel(pathname: string): string | null {
  if (pathname.startsWith('/backoffice/enquiries')) return COPY.backoffice.enquiries;
  if (pathname.startsWith('/backoffice/conversations')) return COPY.chat.backoffice.title;
  if (pathname.startsWith('/backoffice/settings')) return COPY.backoffice.settings;
  return COPY.backoffice.dashboard;
}

/** Number of conversations with unread visitor messages: fetched on every route change and every 30 s while the tab is visible. */
function useUnreadConversations(pathname: string): number {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    let alive = true;
    const fetchUnread = () =>
      adminChatApi
        .unread()
        .then((r) => {
          if (alive) setUnread(r.unread);
        })
        .catch(() => {
          /* the badge is a convenience; errors are surfaced on the Messages page itself */
        });
    void fetchUnread();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'hidden') void fetchUnread();
    }, UNREAD_POLL_MS);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [pathname]);
  return unread;
}

/** Paper back-office shell (DESIGN.md §6.19): sidebar with numbered links, head with breadcrumb, <main class="bo-main">. */
export function BackofficeShell() {
  useScrollRestoration();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const section = sectionLabel(pathname);
  const unread = useUnreadConversations(pathname);

  const signOut = async () => {
    await logout();
    navigate('/backoffice/login', { replace: true });
  };

  return (
    <div className="bo">
      <a className="skip-link" href="#main">
        {COPY.shell.skipLink}
      </a>
      <aside className="bo-side">
        <div className="brand">
          {COPY.shell.brand}
          <span>{COPY.backoffice.title}</span>
        </div>
        <nav aria-label={COPY.backoffice.navLabel}>
          <h5>{COPY.backoffice.groupEnquiries}</h5>
          <NavLink to="/backoffice" end>
            
            {COPY.backoffice.dashboard}
          </NavLink>
          <NavLink to="/backoffice/enquiries">
            
            {COPY.backoffice.enquiries}
          </NavLink>
          <NavLink to="/backoffice/conversations">
            
            {COPY.chat.backoffice.nav}
            {unread > 0 && (
              <span className="conv-badge" aria-label={`${unread} ${COPY.chat.backoffice.unreadLabel}`}>
                {unread}
              </span>
            )}
          </NavLink>
          <h5>{COPY.backoffice.groupSite}</h5>
          <NavLink to="/backoffice/settings">
            
            {COPY.backoffice.settings}
          </NavLink>
          <a className="link-arrow" href="/" target="_blank" rel="noopener noreferrer">
            {COPY.backoffice.viewSite}
          </a>
        </nav>
        <div className="user">
          {user && (
            <span className="email">
              <span className="visually-hidden">{COPY.backoffice.signedInAs} </span>
              {user.email}
            </span>
          )}
          <button type="button" className="link-btn" onClick={() => void signOut()}>
            {COPY.backoffice.signOut}
          </button>
        </div>
      </aside>

      <div className="bo-body">
        <div className="bo-head">
          <nav className="breadcrumb" aria-label={COPY.shell.breadcrumbLabel}>
            <ol>
              <li>
                <Link to="/backoffice">{COPY.backoffice.title}</Link>
              </li>
              {section && <li aria-current="page">{section}</li>}
            </ol>
          </nav>
        </div>
        <main className="bo-main" id="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
