import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  api,
  ApiError,
  type Enquiry,
  type EnquiryDetail as EnquiryDetailData,
  type EnquiryEvent,
  type EnquiryNote,
  type EnquiryPriority,
  type EnquiryStatus,
} from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatDateTime, timeAgo, useSeo } from '../../lib/hooks';
import { COPY } from '../../content/copy';
import { SERVICE_BY_SLUG } from '../../content/services';
import { getPackage } from '../../content/packages';
import { Button, DefinitionList, EmptyState, Notice, PriorityPill, SelectField, Skeleton, StatusPill, TextAreaField } from '../../components';
import '../../styles/pages/backoffice.css';

const STATUS_ORDER: EnquiryStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];
const PRIORITY_ORDER: EnquiryPriority[] = ['low', 'normal', 'high'];
/** One-tap status actions above the sheet (DESIGN.md §7.11). The current status is left out of the row. */
const ACTION_ORDER: Array<Extract<EnquiryStatus, 'contacted' | 'quoted' | 'won' | 'lost'>> = ['contacted', 'quoted', 'won', 'lost'];

/** Older enquiries and the seed data store short package ids; map them to the slugs in content/packages.ts. */
const PACKAGE_ALIASES: Record<string, string> = {
  fix: 'site-fix',
  repair: 'site-fix',
  refresh: 'site-refresh',
  starter: 'site-starter',
  business: 'site-business',
  catalogue: 'site-catalogue',
  ecommerce: 'site-ecommerce',
  'online-store': 'site-ecommerce',
  basic: 'care-basic',
  standard: 'care-standard',
  plus: 'care-plus',
};

/** Package name for the sheet: exact slug, then alias, then the id humanised ("custom-crm" becomes "Custom crm"). */
function packageName(id: string): string {
  const found = getPackage(id) ?? getPackage(PACKAGE_ALIASES[id.toLowerCase()] ?? '');
  if (found) return found.name;
  const words = id.replace(/[-_]+/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : id;
}

type SaveState = { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved'; at: string } | { kind: 'error'; message: string };

function serviceName(slug: string): string {
  return SERVICE_BY_SLUG[slug]?.name ?? slug;
}

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
}

/** Digits for wa.me. Local Mauritian numbers are written without the country code (8 digits, leading 5): add 230. */
function whatsappDigits(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 8) digits = `230${digits}`;
  return digits;
}

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

/** Turns a stored event row into one human-readable sentence. */
function describeEvent(ev: EnquiryEvent): ReactNode {
  const t = COPY.backoffice.detail.events;
  const meta = ev.meta ?? {};
  const str = (k: string): string => (typeof meta[k] === 'string' ? (meta[k] as string) : '');
  const by = str('by');
  const byLine = by ? <span className="by"> · {fill(t.by, { by })}</span> : null;

  switch (ev.event) {
    case 'created': {
      const kind = str('kind') as keyof typeof COPY.backoffice.kinds;
      const svc = str('service');
      const extras = [COPY.backoffice.kinds[kind], svc ? serviceName(svc) : ''].filter(Boolean).join(' · ');
      return (
        <>
          {t.created}
          {extras && <span className="by"> · {extras}</span>}
        </>
      );
    }
    case 'status_changed': {
      const from = str('from') as EnquiryStatus;
      const to = str('to') as EnquiryStatus;
      return (
        <>
          {fill(t.status_changed, { from: COPY.backoffice.statuses[from] ?? from, to: COPY.backoffice.statuses[to] ?? to })}
          {byLine}
        </>
      );
    }
    case 'priority_changed': {
      const from = str('from') as EnquiryPriority;
      const to = str('to') as EnquiryPriority;
      return (
        <>
          {fill(t.priority_changed, { from: COPY.backoffice.priorities[from] ?? from, to: COPY.backoffice.priorities[to] ?? to })}
          {byLine}
        </>
      );
    }
    case 'note_added':
      return (
        <>
          {t.note_added}
          {byLine}
        </>
      );
    case 'email_sent': {
      const who = [meta.owner ? t.emailOwner : '', meta.client ? t.emailClient : ''].filter(Boolean).join(' · ');
      return (
        <>
          {t.email_sent}
          {who && <span className="by"> · {who}</span>}
        </>
      );
    }
    default:
      return ev.event;
  }
}

/** Enquiry detail (DESIGN.md §7.11): message, notes and activity in cols 1 to 8; contact, status controls and the spec sheet in cols 9 to 12. */
export default function EnquiryDetail() {
  const bo = COPY.backoffice;
  const d = bo.detail;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const guard = useSessionGuard();

  const [data, setData] = useState<EnquiryDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [save, setSave] = useState<SaveState>({ kind: 'idle' });
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState<string | undefined>(undefined);
  const [addingNote, setAddingNote] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const enquiry = data?.enquiry ?? null;
  useSeo(`${enquiry ? enquiry.reference : bo.enquiries} · ${bo.title}`);

  const load = useCallback(
    async (quiet = false) => {
      if (!id) return;
      if (!quiet) setLoading(true);
      try {
        const res = await api.get<EnquiryDetailData>(`/api/admin/enquiries/${encodeURIComponent(id)}`);
        setData(res);
        setNotFound(false);
        setError(null);
      } catch (err) {
        if (await guard(err)) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) setNotFound(true);
        else setError(err instanceof ApiError ? err.message : bo.errorGeneric);
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [id, guard, bo.errorGeneric],
  );

  useEffect(() => {
    void load();
  }, [load]);

  /** PATCH status or priority: apply locally first, confirm with the server, reload the activity quietly. */
  const patch = async (change: { status?: EnquiryStatus; priority?: EnquiryPriority }) => {
    if (!data) return;
    const before = data.enquiry;
    setData({ ...data, enquiry: { ...before, ...change } });
    setSave({ kind: 'saving' });
    try {
      const res = await api.patch<{ enquiry: Enquiry }>(`/api/admin/enquiries/${before.id}`, change);
      setData((cur) => (cur ? { ...cur, enquiry: res.enquiry } : cur));
      setSave({ kind: 'saved', at: clockTime() });
      void load(true);
    } catch (err) {
      if (await guard(err)) return;
      setData((cur) => (cur ? { ...cur, enquiry: before } : cur));
      setSave({ kind: 'error', message: err instanceof ApiError ? err.message : d.saveFailed });
    }
  };

  const addNote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data || addingNote) return;
    const body = note.trim();
    if (!body) {
      setNoteError(d.notePlaceholder);
      return;
    }
    setAddingNote(true);
    setNoteError(undefined);
    try {
      const res = await api.post<{ note: EnquiryNote }>(`/api/admin/enquiries/${data.enquiry.id}/notes`, { body });
      setData((cur) => (cur ? { ...cur, notes: [res.note, ...cur.notes] } : cur));
      setNote('');
      void load(true);
    } catch (err) {
      if (await guard(err)) return;
      setNoteError(err instanceof ApiError ? err.message : bo.errorGeneric);
    } finally {
      setAddingNote(false);
    }
  };

  const removeNote = async (n: EnquiryNote) => {
    if (!data) return;
    if (!window.confirm(d.confirmDeleteNote)) return;
    try {
      await api.delete(`/api/admin/enquiries/${data.enquiry.id}/notes/${n.id}`);
      setData((cur) => (cur ? { ...cur, notes: cur.notes.filter((x) => x.id !== n.id) } : cur));
    } catch (err) {
      if (await guard(err)) return;
      setError(err instanceof ApiError ? err.message : bo.errorGeneric);
    }
  };

  const removeEnquiry = async () => {
    if (!data || deleting) return;
    if (!window.confirm(fill(d.confirmDelete, { reference: data.enquiry.reference }))) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/enquiries/${data.enquiry.id}`);
      navigate('/backoffice/enquiries', { replace: true });
    } catch (err) {
      if (await guard(err)) return;
      setError(err instanceof ApiError ? err.message : bo.errorGeneric);
      setDeleting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="page-bo-enquiry">
        <h1>{bo.enquiries}</h1>
        <Skeleton lines={8} label={bo.loadingEnquiries} />
      </div>
    );
  }

  if (notFound || !enquiry) {
    return (
      <div className="page-bo-enquiry">
        <h1>{bo.enquiries}</h1>
        {error && (
          <Notice tone="error" title={bo.errorTitle}>
            {error}
          </Notice>
        )}
        {notFound && (
          <EmptyState
            title={d.notFoundTitle}
            body={d.notFound}
            action={
              <Button as="link" to="/backoffice/enquiries">
                {bo.allEnquiries}
              </Button>
            }
          />
        )}
      </div>
    );
  }

  const title = enquiry.company ? `${enquiry.name}, ${enquiry.company}` : enquiry.name;
  const waMessage = fill(d.whatsappMessage, { name: enquiry.name, reference: enquiry.reference });
  const waHref = enquiry.phone ? `https://wa.me/${whatsappDigits(enquiry.phone)}?text=${encodeURIComponent(waMessage)}` : null;
  const mailHref = `mailto:${enquiry.email}?subject=${encodeURIComponent(fill(d.emailSubject, { reference: enquiry.reference }))}`;
  const telHref = enquiry.phone ? `tel:${enquiry.phone.replace(/[^\d+]/g, '')}` : null;
  const pkg = enquiry.package ? packageName(enquiry.package) : null;

  const contactItems = [
    { term: d.email, detail: <a href={mailHref}>{enquiry.email}</a> },
    {
      term: d.phone,
      detail: enquiry.phone && telHref ? <a href={telHref} className="mono">{enquiry.phone}</a> : d.none,
    },
    {
      term: COPY.shell.whatsappWord,
      detail: waHref ? (
        <a className="wa-link link-arrow" href={waHref} target="_blank" rel="noopener noreferrer">
          {d.whatsapp}
        </a>
      ) : (
        d.none
      ),
    },
  ];

  const specItems = [
    { term: d.fields.kind, detail: bo.kinds[enquiry.kind] },
    { term: d.fields.service, detail: serviceName(enquiry.service) },
    { term: d.fields.package, detail: pkg ?? d.none },
    { term: d.fields.budget, detail: enquiry.budget ? <span className="mono">{enquiry.budget}</span> : d.none },
    { term: d.fields.timeline, detail: enquiry.timeline ?? d.none },
    {
      term: d.fields.website,
      detail: enquiry.website ? (
        <a href={/^https?:\/\//i.test(enquiry.website) ? enquiry.website : `https://${enquiry.website}`} target="_blank" rel="noopener noreferrer">
          {enquiry.website}
        </a>
      ) : (
        d.none
      ),
    },
    { term: d.fields.preferWhatsapp, detail: enquiry.preferWhatsapp ? d.yes : d.no },
    { term: d.fields.sourcePage, detail: enquiry.sourcePage ? <span className="mono">{enquiry.sourcePage}</span> : d.none },
    { term: d.fields.userAgent, detail: enquiry.userAgent ? <span className="ua">{enquiry.userAgent}</span> : d.none },
  ];

  const saveLine = save.kind === 'saving' ? `${d.saving}…` : '';

  return (
    <div className="page-bo-enquiry">
      <header className="head">
        <span className="eyebrow">
          <span className="n">{enquiry.reference}</span> · {d.received} {formatDateTime(enquiry.createdAt)}
        </span>
        <h1>{title}</h1>
        <div className="cluster">
          <StatusPill status={enquiry.status} />
          <PriorityPill priority={enquiry.priority} />
          <span>
            {d.updated}{' '}
            <time dateTime={enquiry.updatedAt} title={formatDateTime(enquiry.updatedAt)}>
              {timeAgo(enquiry.updatedAt)}
            </time>
          </span>
        </div>
        <div className="btn-row actions" role="group" aria-label={d.statusLabel}>
          {ACTION_ORDER.filter((s) => s !== enquiry.status).map((s) => (
            <Button key={s} size="sm" arrow={false} disabled={save.kind === 'saving'} onClick={() => void patch({ status: s })}>
              {d.actions[s]}
            </Button>
          ))}
        </div>
      </header>

      {save.kind === 'saved' && (
        <Notice tone="success" title={`${d.saved} · ${save.at}`} className="save-notice">
          {d.savedBody}
        </Notice>
      )}
      {save.kind === 'error' && (
        <Notice tone="error" title={bo.errorTitle} className="save-notice">
          {save.message}
        </Notice>
      )}

      {error && (
        <Notice tone="error" title={bo.errorTitle}>
          {error}
        </Notice>
      )}

      <div className="bo-split">
        <aside className="bo-split__side side" aria-label={enquiry.reference}>
          <DefinitionList tight items={contactItems} aria-label={COPY.shell.contactStripLabel} />

          <div>
            <SelectField
              label={d.statusLabel}
              name="status"
              value={enquiry.status}
              options={STATUS_ORDER.map((s) => ({ value: s, label: bo.statuses[s] }))}
              onChange={(v) => void patch({ status: v as EnquiryStatus })}
              disabled={save.kind === 'saving'}
            />
            <SelectField
              label={d.priorityLabel}
              name="priority"
              value={enquiry.priority}
              options={PRIORITY_ORDER.map((p) => ({ value: p, label: bo.priorities[p] }))}
              onChange={(v) => void patch({ priority: v as EnquiryPriority })}
              disabled={save.kind === 'saving'}
            />
            <p className="save-state" role="status" aria-live="polite">
              {saveLine}
            </p>
          </div>

          <DefinitionList tight items={specItems} aria-label={enquiry.reference} />
        </aside>

        <div className="main">
          <section aria-labelledby="msg-h">
            <h2 id="msg-h">{d.message}</h2>
            <blockquote className="msg">{enquiry.message}</blockquote>
          </section>

          <section aria-labelledby="notes-h">
            <h2 id="notes-h">{d.notes}</h2>
            <form className="note-form" onSubmit={(e) => void addNote(e)} noValidate>
              <TextAreaField label={d.noteLabel} name="note" rows={4} placeholder={d.notePlaceholder} value={note} onChange={setNote} error={noteError} maxLength={4000} />
              <Button type="submit" size="sm" arrow={false} disabled={addingNote || !note.trim()}>
                {addingNote ? d.addingNote : d.addNote}
              </Button>
            </form>
            <ul className="notes">
              {data && data.notes.length === 0 && (
                <li>
                  <span className="empty-line">{d.noNotes}</span>
                </li>
              )}
              {data?.notes.map((n) => (
                <li key={n.id}>
                  <div className="note-meta">
                    <span>{n.author}</span>
                    <time dateTime={n.createdAt}>{formatDateTime(n.createdAt)}</time>
                    <button type="button" className="link-btn" onClick={() => void removeNote(n)}>
                      {d.deleteNote}
                    </button>
                  </div>
                  <p className="note-body">{n.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="activity-h">
            <h2 id="activity-h">{d.activity}</h2>
            <ol className="timeline">
              {data?.events.map((ev) => (
                <li key={ev.id}>
                  <time dateTime={ev.createdAt}>{formatDateTime(ev.createdAt)}</time>
                  <span>{describeEvent(ev)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="bo-split__foot">
          <Button variant="danger" size="sm" arrow={false} disabled={deleting} onClick={() => void removeEnquiry()}>
            {deleting ? d.deleting : d.deleteEnquiry}
          </Button>
          <p className="meta mt-4">
            <Link to="/backoffice/enquiries" className="link-arrow">
              {bo.allEnquiries}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
