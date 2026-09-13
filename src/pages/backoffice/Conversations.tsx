import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { adminChatApi, ApiError, type Conversation, type ConversationList, type ConversationStatus } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatDateTime, timeAgo, useSeo } from '../../lib/hooks';
import { COPY } from '../../content/copy';
import { Button, EmptyState, Notice, Skeleton, Table } from '../../components';
import '../../styles/pages/backoffice.css';
import '../../styles/pages/conversations.css';

const PAGE_SIZE = 20;
type Tab = ConversationStatus | 'all';
const TABS: Tab[] = ['open', 'closed', 'all'];

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
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

/** Live chat conversations: open / closed / all tabs (URL ?status=), a dense clickable table, a mono pager line. */
export default function Conversations() {
  const t = COPY.chat.backoffice;
  const bo = COPY.backoffice;
  useSeo(`${t.title} · ${bo.title}`);
  const navigate = useNavigate();
  const guard = useSessionGuard();
  const [params, setParams] = useSearchParams();

  const rawStatus = params.get('status');
  const status: Tab = rawStatus === 'closed' || rawStatus === 'all' ? rawStatus : 'open';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const [data, setData] = useState<ConversationList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params);
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === '') next.delete(k);
        else next.set(k, v);
      }
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    adminChatApi
      .list(status, page, PAGE_SIZE)
      .then((res) => {
        if (!alive) return;
        setData(res);
        setError(null);
      })
      .catch(async (err: unknown) => {
        if (!alive) return;
        if (await guard(err)) return;
        setError(err instanceof ApiError ? err.message : bo.errorGeneric);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [status, page, guard, bo.errorGeneric]);

  const openRow = (e: MouseEvent<HTMLTableRowElement>, cv: Conversation) => {
    if ((e.target as HTMLElement).closest('a')) return; // the real link handles itself
    navigate(`/backoffice/conversations/${cv.id}`);
  };

  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(total, page * PAGE_SIZE);
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="page-bo-conversations">
      <h1>{t.title}</h1>

      <nav className="conv-tabs" aria-label={t.tabsLabel}>
        {TABS.map((tab) => (
          <Link
            key={tab}
            to={tab === 'open' ? '/backoffice/conversations' : `/backoffice/conversations?status=${tab}`}
            replace
            aria-current={status === tab ? 'page' : undefined}
          >
            {t.tabs[tab]}
            {tab === 'open' && data && data.unread > 0 && (
              <span className="conv-badge" aria-label={`${data.unread} ${t.unreadLabel}`}>
                {data.unread}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {error && (
        <Notice tone="error" title={bo.errorTitle}>
          {error}
        </Notice>
      )}

      {loading && !data ? (
        <Skeleton lines={8} label={t.loading} />
      ) : data && data.items.length === 0 ? (
        status !== 'open' ? (
          <EmptyState
            title={t.emptyFilteredTitle}
            body={t.emptyFilteredBody}
            action={
              <Button as="link" to="/backoffice/conversations" arrow={false}>
                {t.tabs.open}
              </Button>
            }
          />
        ) : (
          <EmptyState title={t.emptyTitle} body={t.emptyBody} />
        )
      ) : data ? (
        <>
          <Table caption={t.title} dense rows sticky className="table--list conv-table">
            <thead>
              <tr>
                <th scope="col">{t.columns.who}</th>
                <th scope="col" className="col-page">
                  {t.columns.page}
                </th>
                <th scope="col" className="col-last">
                  {t.columns.last}
                </th>
                <th scope="col">{t.columns.activity}</th>
                <th scope="col" className="num">
                  {t.columns.unread}
                </th>
                <th scope="col">
                  <span className="visually-hidden">{t.columns.open}</span>
                </th>
              </tr>
            </thead>
            <tbody aria-busy={loading || undefined}>
              {data.items.map((cv) => (
                <tr key={cv.id} onClick={(ev) => openRow(ev, cv)} className={cv.unreadForOwner > 0 ? 'is-unread' : undefined}>
                  <td className="who" title={`${cv.name} · ${cv.email}`}>
                    <Link className="name" to={`/backoffice/conversations/${cv.id}`}>
                      {cv.name}
                    </Link>
                    <span className="sub">{cv.email}</span>
                  </td>
                  <td className="col-page" title={cv.page ?? undefined}>
                    {cv.page ?? bo.detail.none}
                  </td>
                  <td className="col-last preview" title={cv.lastMessagePreview}>
                    {cv.lastMessagePreview}
                  </td>
                  <td className="received">
                    <time dateTime={cv.lastMessageAt} title={formatDateTime(cv.lastMessageAt)}>
                      {timeAgo(cv.lastMessageAt)}
                    </time>
                  </td>
                  <td className="num">{cv.unreadForOwner > 0 ? <span className="conv-badge">{cv.unreadForOwner}</span> : null}</td>
                  <td className="open">
                    <Link className="link-arrow link-quiet" to={`/backoffice/conversations/${cv.id}`} aria-label={`${t.columns.open} ${cv.name}`}>
                      {t.columns.open}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {total > PAGE_SIZE && (
            <div className="table-foot">
              <span role="status">{fill(t.showing, { from, to, total })}</span>
              <div className="btn-row">
                <Button size="sm" arrow={false} disabled={page <= 1} onClick={() => update({ page: page > 2 ? String(page - 1) : null })}>
                  {t.previous}
                </Button>
                <Button size="sm" disabled={page >= lastPage} onClick={() => update({ page: String(page + 1) })}>
                  {t.next}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
