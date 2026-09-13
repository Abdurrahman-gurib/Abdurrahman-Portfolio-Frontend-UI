import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, ApiError, type SiteSettings } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useSeo } from '../../lib/hooks';
import { COPY } from '../../content/copy';
import { Button, CheckboxField, Notice, SectionHeader, Skeleton, TextField } from '../../components';
import '../../styles/pages/backoffice.css';

interface SettingsResponse {
  settings: SiteSettings;
  mailEnabled: boolean;
}

type Outcome = { tone: 'success' | 'error'; title: string; body?: string } | null;

const MIN_PASSWORD = 10;
const NOTE_MAX = 120;
const RESPONSE_MAX = 80;

function clockTime(): string {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** On a 401 the session has gone: re-check it (RequireAuth then redirects) and send the owner to sign in. */
function useSessionGuard() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    async (err: unknown): Promise<boolean> => {
      if (err instanceof ApiError && err.status === 401) {
        await refresh();
        navigate('/backoffice/login', { replace: true, state: { from: `${location.pathname}${location.search}` } });
        return true;
      }
      return false;
    },
    [refresh, navigate, location.pathname, location.search],
  );
}

/** Settings (DESIGN.md §7.12): ruled sections with the head in cols 1 to 3 and the fields in cols 5 to 12; one save per section. */
export default function Settings() {
  useSeo(`${COPY.backoffice.settings} · ${COPY.backoffice.title}`);
  const bo = COPY.backoffice;
  const s = bo.settingsPage;
  const guard = useSessionGuard();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mailEnabled, setMailEnabled] = useState<boolean | null>(null);

  // Availability form
  const [accepting, setAccepting] = useState(true);
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [savingAvail, setSavingAvail] = useState(false);
  const [availOutcome, setAvailOutcome] = useState<Outcome>(null);
  const availNoticeRef = useRef<HTMLDivElement>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwErrors, setPwErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [changing, setChanging] = useState(false);
  const [pwOutcome, setPwOutcome] = useState<Outcome>(null);
  const pwNoticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    api
      .get<SettingsResponse>('/api/admin/settings')
      .then((res) => {
        if (!alive) return;
        setAccepting(res.settings.accepting);
        setAvailabilityNote(res.settings.availabilityNote);
        setResponseTime(res.settings.responseTime);
        setMailEnabled(res.mailEnabled);
        setLoadError(null);
      })
      .catch(async (err: unknown) => {
        if (!alive) return;
        if (await guard(err)) return;
        setLoadError(err instanceof ApiError ? err.message : bo.errorGeneric);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [guard, bo.errorGeneric]);

  const saveAvailability = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (savingAvail) return;
    setSavingAvail(true);
    setAvailOutcome(null);
    try {
      const res = await api.put<{ settings: SiteSettings }>('/api/admin/settings', {
        accepting,
        availabilityNote: availabilityNote.trim(),
        responseTime: responseTime.trim(),
      });
      setAccepting(res.settings.accepting);
      setAvailabilityNote(res.settings.availabilityNote);
      setResponseTime(res.settings.responseTime);
      setAvailOutcome({ tone: 'success', title: `${s.saved} · ${clockTime()}` });
    } catch (err) {
      if (await guard(err)) return;
      setAvailOutcome({ tone: 'error', title: bo.errorTitle, body: err instanceof ApiError ? err.message : bo.errorGeneric });
    } finally {
      setSavingAvail(false);
      window.setTimeout(() => availNoticeRef.current?.focus(), 0);
    }
  };

  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (changing) return;
    const errors: { newPassword?: string; confirmPassword?: string } = {};
    if (newPassword.length < MIN_PASSWORD) errors.newPassword = s.passwordTooShort;
    if (newPassword !== confirmPassword) errors.confirmPassword = s.passwordMismatch;
    setPwErrors(errors);
    setPwOutcome(null);
    if (Object.keys(errors).length > 0) return;
    setChanging(true);
    try {
      await api.post('/api/auth/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwOutcome({ tone: 'success', title: `${s.passwordChanged} · ${clockTime()}` });
    } catch (err) {
      if (await guard(err)) return;
      setPwOutcome({ tone: 'error', title: s.passwordFailed, body: err instanceof ApiError ? err.message : bo.errorGeneric });
    } finally {
      setChanging(false);
      window.setTimeout(() => pwNoticeRef.current?.focus(), 0);
    }
  };

  const previewClass = accepting ? 'avail' : 'avail avail--off';

  return (
    <div className="page-bo-settings">
      <h1>{bo.settings}</h1>

      {loadError && (
        <Notice tone="error" title={bo.errorTitle}>
          {loadError}
        </Notice>
      )}

      {loading ? (
        <Skeleton lines={6} />
      ) : (
        <>
          <section className="bo-section" aria-labelledby="availability-h">
            <div className="grid">
              <SectionHeader as="h2" id="availability-h" title={s.availabilityTitle} intro={s.availabilityIntro} sticky={false} />
              <div className="section__body">
                <form onSubmit={(e) => void saveAvailability(e)} noValidate>
                  {availOutcome && (
                    <Notice tone={availOutcome.tone} title={availOutcome.title} ref={availNoticeRef}>
                      {availOutcome.body}
                    </Notice>
                  )}
                  <CheckboxField label={s.accepting} name="accepting" checked={accepting} onChange={setAccepting} hint={s.acceptingHint} />
                  <TextField
                    label={s.availabilityNote}
                    name="availabilityNote"
                    value={availabilityNote}
                    onChange={setAvailabilityNote}
                    hint={s.availabilityNoteHint}
                    maxLength={NOTE_MAX}
                    autoComplete="off"
                  />
                  <TextField
                    label={s.responseTime}
                    name="responseTime"
                    value={responseTime}
                    onChange={setResponseTime}
                    hint={s.responseTimeHint}
                    maxLength={RESPONSE_MAX}
                    autoComplete="off"
                  />
                  <div className="preview">
                    <span className="k">{s.preview}</span>
                    <p className={previewClass}>
                      {COPY.shell.availabilityLabel}: {availabilityNote.trim() || '…'} · {COPY.shell.availabilityReplies} {responseTime.trim() || '…'}
                    </p>
                  </div>
                  <div className="form-foot">
                    <Button type="submit" arrow={false} disabled={savingAvail || responseTime.trim().length < 3}>
                      {savingAvail ? s.saving : s.save}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section className="bo-section" aria-labelledby="notifications-h">
            <div className="grid">
              <SectionHeader as="h2" id="notifications-h" title={s.notificationsTitle} intro={s.notificationsIntro} sticky={false} />
              <div className="section__body">
                <div className="mail">
                  <span className="k">{s.mailLabel}</span>
                  <p>{mailEnabled ? s.mailOn : s.mailOff}</p>
                  {!mailEnabled && <p className="hint">{s.mailHint}</p>}
                </div>
              </div>
            </div>
          </section>

          <section className="bo-section" aria-labelledby="password-h">
            <div className="grid">
              <SectionHeader as="h2" id="password-h" title={s.passwordTitle} intro={s.passwordIntro} sticky={false} />
              <div className="section__body">
                <form onSubmit={(e) => void changePassword(e)} noValidate>
                  {pwOutcome && (
                    <Notice tone={pwOutcome.tone} title={pwOutcome.title} ref={pwNoticeRef}>
                      {pwOutcome.body}
                    </Notice>
                  )}
                  <TextField
                    label={s.currentPassword}
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                  />
                  <TextField
                    label={s.newPassword}
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={setNewPassword}
                    error={pwErrors.newPassword}
                  />
                  <TextField
                    label={s.confirmPassword}
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    error={pwErrors.confirmPassword}
                  />
                  <div className="form-foot">
                    <Button type="submit" arrow={false} disabled={changing || !currentPassword || !newPassword || !confirmPassword}>
                      {changing ? s.changingPassword : s.changePassword}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
