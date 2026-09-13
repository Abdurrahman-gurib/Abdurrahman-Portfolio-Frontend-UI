import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  adminChatApi,
  ApiError,
  type ChatMessage,
  type ConversationDetail as ConversationDetailData,
  type ConversationStatus,
} from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatDateTime, timeAgo, useSeo } from '../../lib/hooks';
import { COPY } from '../../content/copy';
import { Button, EmptyState, Notice, Skeleton, TextAreaField } from '../../components';
import '../../styles/pages/backoffice.css';
import '../../styles/pages/conversations.css';

const POLL_MS = 5000;

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
}

/** Optimistic replies carry a negative id until the server answers. */
function isTemp(m: ChatMessage): boolean {
  return m.id < 0;
}

/** Adds unseen server messages, keeps the list ordered by id and leaves optimistic replies at the end. */
function mergeMessages(prev: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const seen = new Set(prev.map((m) => m.id));
  const added = incoming.filter((m) => !seen.has(m.id));
  if (added.length === 0) return prev;
  const real = [...prev.filter((m) => !isTemp(m)), ...added].sort((a, b) => a.id - b.id);
  return [...real, ...prev.filter(isTemp)];
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

/** One live chat conversation: header with status and actions, the thread, a reply composer. Polls every 5 s while open. */
export default function ConversationDetail() {
  const t = COPY.chat.backoffice;
  const bo = COPY.backoffice;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const guard = useSessionGuard();

  const [data, setData] = useState<ConversationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [visible, setVisible] = useState(() => (typeof document !== 'undefined' ? document.visibilityState !== 'hidden' : true));
  const threadRef = useRef<HTMLDivElement>(null);

  const conversation = data?.conversation ?? null;
  useSeo(`${conversation ? conversation.name : t.title} · ${bo.title}`);

  const load = useCallback(
    async (quiet = false) => {
      if (!id) return;
      if (!quiet) setLoading(true);
      try {
        const res = await adminChatApi.get(id);
        setData((cur) => (cur && quiet ? { conversation: res.conversation, messages: mergeMessages(cur.messages, res.messages) } : res));
        setNotFound(false);
        setError(null);
      } catch (err) {
        if (await guard(err)) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) setNotFound(true);
        else if (!quiet) setError(err instanceof ApiError ? err.message : bo.errorGeneric);
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [id, guard, bo.errorGeneric],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  // Poll for new visitor messages while the page is open and the tab is visible.
  const hasData = data !== null;
  useEffect(() => {
    if (!hasData || notFound || !visible) return undefined;
    const timer = window.setInterval(() => void load(true), POLL_MS);
    return () => window.clearInterval(timer);
  }, [hasData, notFound, visible, load]);

  // Keep the thread scrolled to the newest message.
  const messageCount = data?.messages.length ?? 0;
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messageCount]);

  const toggleStatus = async () => {
    if (!data || saving) return;
    const before = data.conversation;
    const next: ConversationStatus = before.status === 'open' ? 'closed' : 'open';
    setData({ ...data, conversation: { ...before, status: next } });
    setSaving(true);
    setSaveError(null);
    try {
      const res = await adminChatApi.setStatus(before.id, next);
      setData((cur) => (cur ? { ...cur, conversation: res.conversation } : cur));
    } catch (err) {
      if (await guard(err)) return;
      setData((cur) => (cur ? { ...cur, conversation: before } : cur));
      setSaveError(err instanceof ApiError ? err.message : t.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!data || deleting) return;
    if (!window.confirm(fill(t.confirmDelete, { name: data.conversation.name }))) return;
    setDeleting(true);
    try {
      await adminChatApi.remove(data.conversation.id);
      navigate('/backoffice/conversations', { replace: true });
    } catch (err) {
      if (await guard(err)) return;
      setError(err instanceof ApiError ? err.message : bo.errorGeneric);
      setDeleting(false);
    }
  };

  const sendReply = async () => {
    if (!data || sending) return;
    const body = reply.trim();
    if (!body) return;
    const conversationId = data.conversation.id;
    const temp: ChatMessage = { id: -Date.now(), sender: 'owner', body, createdAt: new Date().toISOString() };
    setData((cur) => (cur ? { ...cur, messages: [...cur.messages, temp] } : cur));
    setReply('');
    setSending(true);
    setReplyError(null);
    try {
      const res = await adminChatApi.reply(conversationId, body.slice(0, 2000));
      setData((cur) => (cur ? { ...cur, messages: mergeMessages(cur.messages.filter((m) => m.id !== temp.id), [res.message]) } : cur));
    } catch (err) {
      setData((cur) => (cur ? { ...cur, messages: cur.messages.filter((m) => m.id !== temp.id) } : cur));
      if (await guard(err)) return;
      setReply(body);
      setReplyError(err instanceof ApiError ? err.message : t.replyFailed);
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void sendReply();
  };

  /** Enter sends, Shift and Enter adds a line (the textarea is rendered by TextAreaField, so the handler sits on the form). */
  const onFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName === 'TEXTAREA') {
      e.preventDefault();
      void sendReply();
    }
  };

  if (loading && !data) {
    return (
      <div className="page-bo-conversation">
        <h1>{t.title}</h1>
        <Skeleton lines={8} label={t.loadingOne} />
      </div>
    );
  }

  if (notFound || !data || !conversation) {
    return (
      <div className="page-bo-conversation">
        <h1>{t.title}</h1>
        {error && (
          <Notice tone="error" title={bo.errorTitle}>
            {error}
          </Notice>
        )}
        {notFound && (
          <EmptyState
            title={t.notFoundTitle}
            body={t.notFound}
            action={
              <Button as="link" to="/backoffice/conversations">
                {t.allConversations}
              </Button>
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className="page-bo-conversation">
      <header className="head">
        <span className="eyebrow">
          <span className="conv-id">#{conversation.id}</span> · {t.started} {formatDateTime(conversation.createdAt)}
        </span>
        <h1>{conversation.name}</h1>
        <div className="cluster">
          <span className={`status status--${conversation.status}`}>{t.statuses[conversation.status]}</span>
          <a href={`mailto:${conversation.email}`}>{conversation.email}</a>
          {conversation.page && (
            <span>
              {t.page} <span className="mono">{conversation.page}</span>
            </span>
          )}
        </div>
        <div className="btn-row actions">
          <Button size="sm" arrow={false} disabled={saving} onClick={() => void toggleStatus()}>
            {saving ? t.saving : conversation.status === 'open' ? t.closeConversation : t.reopen}
          </Button>
          <Button variant="danger" size="sm" arrow={false} disabled={deleting} onClick={() => void remove()}>
            {deleting ? t.deleting : t.deleteConversation}
          </Button>
        </div>
      </header>

      {saveError && (
        <Notice tone="error" title={bo.errorTitle}>
          {saveError}
        </Notice>
      )}
      {error && (
        <Notice tone="error" title={bo.errorTitle}>
          {error}
        </Notice>
      )}

      <section className="conv-section" aria-labelledby="thread-h">
        <h2 id="thread-h">{t.thread}</h2>
        <div ref={threadRef} className="conv-thread">
          {data.messages.length === 0 ? (
            <p className="meta">{t.noMessages}</p>
          ) : (
            <ol className="conv-list" aria-live="polite">
              {data.messages.map((m) => (
                <li key={m.id} className={`conv-msg conv-msg--${m.sender}${isTemp(m) ? ' conv-msg--pending' : ''}`}>
                  <span className="conv-msg__who">{t.senders[m.sender]}</span>
                  <div className="conv-bubble">{m.body}</div>
                  <time className="conv-msg__time" dateTime={m.createdAt} title={formatDateTime(m.createdAt)}>
                    {timeAgo(m.createdAt)}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </div>

        {conversation.status === 'closed' ? (
          <p className="meta">{t.closedReplyNote}</p>
        ) : (
          <form className="conv-reply" onSubmit={onSubmit} onKeyDown={onFormKeyDown} noValidate>
            <TextAreaField
              label={t.replyLabel}
              name="reply"
              rows={4}
              placeholder={t.replyPlaceholder}
              hint={t.replyNote}
              value={reply}
              onChange={setReply}
              error={replyError ?? undefined}
              maxLength={2000}
              disabled={sending}
            />
            <Button type="submit" size="sm" arrow={false} disabled={sending || !reply.trim()}>
              {sending ? t.sending : t.send}
            </Button>
          </form>
        )}
      </section>

      <p className="meta conv-back">
        <Link to="/backoffice/conversations" className="link-arrow">
          {t.allConversations}
        </Link>
      </p>
    </div>
  );
}
