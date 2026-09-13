import { useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useSeo } from '../../lib/hooks';
import { useAuth } from '../../lib/auth';
import { ApiError } from '../../lib/api';
import { COPY } from '../../content/copy';
import { Nav } from '../../components/Nav';
import { Button, LoadingLine, Notice, TextField } from '../../components';
import '../../styles/pages/backoffice.css';

interface FromState {
  from?: string;
}

/** Back-office sign-in (DESIGN.md §7.8): brand-only nav, eyebrow, h1, intro, error notice, two fields, one button, cols 1–5. */
export default function Login() {
  useSeo(`${COPY.backoffice.loginTitle} · ${COPY.backoffice.title}`);
  const { user, loading, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  const state = (location.state ?? null) as FromState | null;
  const from = state?.from && state.from.startsWith('/backoffice') && state.from !== '/backoffice/login' ? state.from : '/backoffice';

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    // Validate on submit (the button stays enabled): an empty field shows the same error notice as a failed attempt.
    if (!email.trim() || !password) {
      setError(COPY.backoffice.loginMissing);
      window.setTimeout(() => noticeRef.current?.focus(), 0);
      return;
    }
    setSending(true);
    setError(null);
    try {
      await login(email.trim(), password);
      // The redirect happens above once `user` is set.
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COPY.backoffice.errorGeneric);
      setSending(false);
      window.setTimeout(() => noticeRef.current?.focus(), 0);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        {COPY.shell.skipLink}
      </a>
      <Nav variant="backoffice" />
      <main id="main" className="container page-bo-login">
        <section className="section section--first">
          <div className="grid">
            <div className="login">
              <span className="eyebrow">{COPY.backoffice.eyebrow}</span>
              <h1>{COPY.backoffice.loginTitle}</h1>
              <p>{COPY.backoffice.loginIntro}</p>
              {loading ? (
                <LoadingLine label={COPY.backoffice.checkingSession} />
              ) : (
                <form onSubmit={(e) => void onSubmit(e)} noValidate>
                  {error && (
                    <Notice tone="error" title={COPY.backoffice.loginFailed} ref={noticeRef}>
                      {error}
                    </Notice>
                  )}
                  <TextField
                    label={COPY.backoffice.emailLabel}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    value={email}
                    onChange={setEmail}
                    autoFocus
                  />
                  <TextField
                    label={COPY.backoffice.passwordLabel}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={setPassword}
                  />
                  <Button type="submit" disabled={sending} arrow={false}>
                    {sending ? COPY.backoffice.signingIn : COPY.backoffice.signIn}
                  </Button>
                </form>
              )}
              <p className="meta view-site">
                <Link className="link-arrow" to="/">
                  {COPY.backoffice.viewSite}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
