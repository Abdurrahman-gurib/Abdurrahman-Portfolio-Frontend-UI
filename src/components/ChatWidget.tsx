import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ApiError, chatApi, type ChatMessage, type ConversationStatus } from '../lib/api';
import { timeAgo } from '../lib/hooks';
import { whatsappLink } from '../content/site';
import { COPY } from '../content/copy';
import '../styles/chat.css';

/** localStorage key holding { conversationId, token, lastSeenId } for the visitor's current conversation. */
export const CHAT_STORAGE_KEY = 'ag_chat';
const POLL_OPEN_MS = 4000;
const POLL_CLOSED_MS = 20000;
const CLOCK_MS = 60000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface StoredChat {
  conversationId: number;
  token: string;
  /** Highest message id the visitor has seen with the panel open; anything newer from the owner or bot lights the dot. */
  lastSeenId?: number;
}

function readStored(): StoredChat | null {
  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<StoredChat>;
    if (typeof v.conversationId !== 'number' || typeof v.token !== 'string') return null;
    return { conversationId: v.conversationId, token: v.token, lastSeenId: typeof v.lastSeenId === 'number' ? v.lastSeenId : undefined };
  } catch {
    return null;
  }
}

function writeStored(v: StoredChat | null): void {
  try {
    if (v) window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(v));
    else window.localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode); the conversation still works for this page view */
  }
}

/** Optimistic messages carry a negative id until the server answers. */
function isTemp(m: ChatMessage): boolean {
  return m.id < 0;
}

function maxId(list: ChatMessage[]): number {
  return list.reduce((acc, m) => (m.id > acc ? m.id : acc), 0);
}

/** Adds unseen server messages, keeps the list ordered by id and leaves optimistic messages at the end. */
function mergeMessages(prev: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  if (incoming.length === 0) return prev;
  const seen = new Set(prev.map((m) => m.id));
  const added = incoming.filter((m) => !seen.has(m.id));
  if (added.length === 0) return prev;
  const real = [...prev.filter((m) => !isTemp(m)), ...added].sort((a, b) => a.id - b.id);
  return [...real, ...prev.filter(isTemp)];
}

function isGone(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 404 || err.status === 403);
}

function ChatGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M4.5 5.5A2.5 2.5 0 0 1 7 3h10a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 17 16h-5.6l-4.4 3.6V16H7a2.5 2.5 0 0 1-2.5-2.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.5 8.5h7M8.5 11.5h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SendGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Floating live chat for the public site (docs/CHAT-API.md). Step 1 collects name, email and a first message and calls
 * POST /api/chat/start; step 2 shows the thread and polls GET /api/chat/:id/messages. The conversation id and token are
 * kept in localStorage under CHAT_STORAGE_KEY so the thread survives a reload.
 */
export function ChatWidget() {
  const c = COPY.chat;
  const [conv, setConv] = useState<StoredChat | null>(() => (typeof window !== 'undefined' ? readStored() : null));
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConversationStatus>('open');
  const [loaded, setLoaded] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [visible, setVisible] = useState(() => (typeof document !== 'undefined' ? document.visibilityState !== 'hidden' : true));
  const [, setClock] = useState(0);

  // Step 1 form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [first, setFirst] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // Step 2 composer
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const panelRef = useRef<HTMLElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const lastIdRef = useRef(0);

  useEffect(() => {
    lastIdRef.current = maxId(messages);
  }, [messages]);

  // Tab visibility: polling stops while hidden.
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  // Relative timestamps tick over while the panel is open.
  useEffect(() => {
    if (!open) return undefined;
    const t = window.setInterval(() => setClock((n) => n + 1), CLOCK_MS);
    return () => window.clearInterval(t);
  }, [open]);

  const resetConversation = useCallback((why: string | null) => {
    writeStored(null);
    loadedRef.current = false;
    setConv(null);
    setMessages([]);
    setLoaded(false);
    setStatus('open');
    setText('');
    setSendError(null);
    setNote(why);
  }, []);

  // Poll for new messages: every 4 s while open, every 20 s while closed (unread dot), never while the tab is hidden.
  // Keyed on id and token only, so bumping lastSeenId does not restart the timer.
  const conversationId = conv?.conversationId;
  const token = conv?.token;
  useEffect(() => {
    if (conversationId === undefined || token === undefined || !visible) return undefined;
    let alive = true;
    let timer: number | undefined;

    const tick = async () => {
      try {
        const after = loadedRef.current && lastIdRef.current > 0 ? lastIdRef.current : undefined;
        const res = await chatApi.poll(conversationId, token, after);
        if (!alive) return;
        setStatus(res.status);
        setMessages((prev) => mergeMessages(prev, res.messages));
        if (!loadedRef.current) {
          loadedRef.current = true;
          setLoaded(true);
        }
      } catch (err) {
        if (!alive) return;
        if (isGone(err)) {
          resetConversation(c.goneNote);
          return;
        }
        // transient network error: keep polling
      }
      if (alive) timer = window.setTimeout(() => void tick(), open ? POLL_OPEN_MS : POLL_CLOSED_MS);
    };

    const delay = open || !loadedRef.current ? 0 : POLL_CLOSED_MS;
    timer = window.setTimeout(() => void tick(), delay);
    return () => {
      alive = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [conversationId, token, open, visible, resetConversation, c.goneNote]);

  // While the panel is open everything on screen counts as seen.
  useEffect(() => {
    if (!open || !conv) return;
    const top = maxId(messages);
    if (top > (conv.lastSeenId ?? 0)) {
      const next = { ...conv, lastSeenId: top };
      writeStored(next);
      setConv(next);
    }
  }, [open, conv, messages]);

  // Keep the thread scrolled to the newest message.
  useEffect(() => {
    if (!open) return;
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages, loaded]);

  // Move focus into the panel when it opens (and when the step changes), not on every lastSeenId update.
  const hasConv = conv !== null;
  useEffect(() => {
    if (!open) return undefined;
    const id = window.setTimeout(() => {
      const target = hasConv ? composerRef.current : nameRef.current;
      (target ?? panelRef.current)?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(id);
  }, [open, hasConv]);

  const unread = !open && conv !== null && messages.some((m) => m.sender !== 'visitor' && m.id > (conv.lastSeenId ?? 0));

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  const onPanelKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  const start = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (starting) return;
    const n = name.trim();
    const em = email.trim();
    const msg = first.trim();
    const errs: typeof errors = {};
    if (n.length < 2) errs.name = c.validation.name;
    if (!EMAIL_RE.test(em)) errs.email = c.validation.email;
    if (msg.length < 2) errs.message = c.validation.message;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStarting(true);
    setStartError(null);
    setNote(null);
    try {
      const res = await chatApi.start({ name: n.slice(0, 80), email: em, message: msg.slice(0, 2000), page: window.location.pathname });
      const stored: StoredChat = { conversationId: res.conversationId, token: res.token, lastSeenId: maxId(res.messages) };
      writeStored(stored);
      loadedRef.current = true;
      setMessages(res.messages);
      setLoaded(true);
      setStatus('open');
      setConv(stored);
      setFirst('');
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setErrors({ name: err.fields.name, email: err.fields.email, message: err.fields.message });
      }
      setStartError(err instanceof ApiError ? err.message : c.startFailed);
    } finally {
      setStarting(false);
    }
  };

  const send = async () => {
    const body = text.trim();
    if (!body || !conv || sending || status === 'closed') return;
    const temp: ChatMessage = { id: -Date.now(), sender: 'visitor', body, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, temp]);
    setText('');
    setSending(true);
    setSendError(null);
    try {
      const res = await chatApi.send(conv.conversationId, conv.token, body.slice(0, 2000));
      setMessages((prev) => mergeMessages(prev.filter((m) => m.id !== temp.id), res.messages));
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      if (isGone(err)) {
        resetConversation(c.goneNote);
        return;
      }
      setText(body);
      setSendError(err instanceof ApiError ? err.message : c.sendFailed);
    } finally {
      setSending(false);
      window.setTimeout(() => composerRef.current?.focus(), 0);
    }
  };

  const onComposerKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const startNew = () => {
    if (!window.confirm(c.confirmNew)) return;
    resetConversation(null);
    window.setTimeout(() => nameRef.current?.focus(), 0);
  };

  const senderLabel = (m: ChatMessage): string => (m.sender === 'owner' ? c.ownerShort : m.sender === 'bot' ? c.assistant : c.you);

  return (
    <div className="chat">
      {open && (
        <section
          ref={panelRef}
          id="chat-panel"
          className="chat-panel"
          role="dialog"
          aria-label={c.dialogLabel}
          tabIndex={-1}
          onKeyDown={onPanelKeyDown}
        >
          <header className="chat-head">
            <span className="chat-avatar" aria-hidden="true">
              AG
            </span>
            <div className="chat-head__text">
              <strong>{c.ownerName}</strong>
              <span>{c.tagline}</span>
            </div>
            <button type="button" className="chat-close" onClick={close} aria-label={c.close}>
              <CloseGlyph />
            </button>
          </header>

          {conv ? (
            <div className="chat-body">
              {note && (
                <p className="chat-note" role="status">
                  {note}
                </p>
              )}
              <div ref={threadRef} className="chat-thread" aria-label={c.backoffice.thread}>
                {!loaded && messages.length === 0 && (
                  <p className="chat-loading" role="status">
                    {c.loadingThread}
                  </p>
                )}
                <ol className="chat-list" aria-live="polite">
                  {messages.map((m) => (
                    <li key={m.id} className={`chat-msg chat-msg--${m.sender}${isTemp(m) ? ' chat-msg--pending' : ''}`}>
                      <span className="chat-msg__who">{senderLabel(m)}</span>
                      <div className="chat-bubble">{m.body}</div>
                      <time className="chat-msg__time" dateTime={m.createdAt}>
                        {timeAgo(m.createdAt)}
                      </time>
                    </li>
                  ))}
                </ol>
              </div>
              {status === 'closed' ? (
                <p className="chat-note" role="status">
                  {c.closedNote}
                </p>
              ) : (
                <form
                  className="chat-composer"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send();
                  }}
                >
                  <label className="chat-sr" htmlFor="chat-composer">
                    {c.composerLabel}
                  </label>
                  <textarea
                    id="chat-composer"
                    ref={composerRef}
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onComposerKeyDown}
                    placeholder={c.composerPlaceholder}
                    maxLength={2000}
                    disabled={sending}
                  />
                  <button type="submit" className="chat-send" disabled={sending || !text.trim()} aria-label={sending ? c.sending : c.send}>
                    <SendGlyph />
                  </button>
                </form>
              )}
              {sendError && (
                <p className="chat-error" role="alert">
                  {sendError}
                </p>
              )}
              <p className="chat-hint">{c.emailFollowUp}</p>
            </div>
          ) : (
            <form className="chat-body chat-start" onSubmit={(e) => void start(e)} noValidate>
              {note && (
                <p className="chat-note" role="status">
                  {note}
                </p>
              )}
              <p className="chat-intro">{c.intro}</p>
              <div className={`chat-field${errors.name ? ' is-invalid' : ''}`}>
                <label htmlFor="chat-name">{c.fields.name}</label>
                <input
                  id="chat-name"
                  ref={nameRef}
                  type="text"
                  name="name"
                  autoComplete="name"
                  maxLength={80}
                  placeholder={c.fields.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'chat-name-err' : undefined}
                />
                {errors.name && (
                  <span className="chat-field__error" id="chat-name-err">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className={`chat-field${errors.email ? ' is-invalid' : ''}`}>
                <label htmlFor="chat-email">{c.fields.email}</label>
                <input
                  id="chat-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={c.fields.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'chat-email-err' : undefined}
                />
                {errors.email && (
                  <span className="chat-field__error" id="chat-email-err">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className={`chat-field${errors.message ? ' is-invalid' : ''}`}>
                <label htmlFor="chat-first">{c.fields.message}</label>
                <textarea
                  id="chat-first"
                  name="message"
                  rows={3}
                  maxLength={2000}
                  placeholder={c.fields.messagePlaceholder}
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'chat-first-err' : undefined}
                />
                {errors.message && (
                  <span className="chat-field__error" id="chat-first-err">
                    {errors.message}
                  </span>
                )}
              </div>
              {startError && (
                <p className="chat-error" role="alert">
                  {startError}
                </p>
              )}
              <button type="submit" className="chat-btn" disabled={starting}>
                {starting ? c.starting : c.start}
              </button>
            </form>
          )}

          <footer className="chat-foot">
            {conv && (
              <button type="button" className="chat-link" onClick={startNew}>
                {c.newConversation}
              </button>
            )}
            <a className="chat-link chat-link--wa" href={whatsappLink(c.whatsappMessage)} target="_blank" rel="noopener noreferrer">
              {c.whatsapp}
            </a>
          </footer>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="chat-launcher"
        aria-expanded={open}
        aria-controls={open ? 'chat-panel' : undefined}
        aria-label={open ? c.launcherClose : c.launcherOpen}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? <CloseGlyph /> : <ChatGlyph />}
        {unread && (
          <span className="chat-launcher__dot">
            <span className="chat-sr">{c.unreadHint}</span>
          </span>
        )}
      </button>
    </div>
  );
}

export default ChatWidget;
