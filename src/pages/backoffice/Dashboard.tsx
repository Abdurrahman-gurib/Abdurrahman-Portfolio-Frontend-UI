import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, ApiError, type Enquiry, type EnquiryStatus, type Stats } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatDateTime, timeAgo, useSeo, useSite } from '../../lib/hooks';
import { COPY } from '../../content/copy';
import { SERVICE_BY_SLUG } from '../../content/services';
import { EmptyState, Notice, PriorityPill, Skeleton, StatusPill, Table } from '../../components';
import '../../styles/pages/backoffice.css';

const STATUS_ORDER: EnquiryStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];

function serviceName(slug: string): string {
  return SERVICE_BY_SLUG[slug]?.name ?? slug;
}

/** Short absolute stamp for list columns (DESIGN.md §6.8): "13 Sep, 09:14". The relative time goes in the title. */
function receivedShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
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

/** Dashboard (DESIGN.md §7.9): stat figures as type, the availability line, two small count tables, the latest enquiries. */
export default function Dashboard() {
  useSeo(`${COPY.backoffice.dashboard} · ${COPY.backoffice.title}`);
  const bo = COPY.backoffice;
  const site = useSite();
  const navigate = useNavigate();
  const guard = useSessionGuard();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get<Stats>('/api/admin/stats')
      .then((s) => {
        if (!alive) return;
        setStats(s);
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
  }, [guard, bo.errorGeneric]);

  const openRow = (e: MouseEvent<HTMLTableRowElement>, enquiry: Enquiry) => {
    if ((e.target as HTMLElement).closest('a')) return; // the real link handles itself
    navigate(`/backoffice/enquiries/${enquiry.id}`);
  };

  const availClass = site.settings.accepting ? 'avail' : 'avail avail--off';

  return (
    <div className="page-bo-dashboard">
      <h1>{bo.dashboardTitle}</h1>

      {error && (
        <Notice tone="error" title={bo.errorTitle}>
          {error}
        </Notice>
      )}

      {loading && !stats ? (
        <Skeleton lines={8} label={bo.loadingEnquiries} />
      ) : stats ? (
        <>
          <div className="stat-strip" role="group" aria-label={bo.dashboardTitle}>
            <div>
              <b>{stats.total}</b>
              <span>{bo.stats.total}</span>
            </div>
            <div>
              <b>{stats.byStatus.new ?? 0}</b>
              <span>{bo.stats.new}</span>
            </div>
            <div>
              <b>{stats.last7Days}</b>
              <span>{bo.stats.last7}</span>
            </div>
            <div className="stat-last30">
              <b>{stats.last30Days}</b>
              <span>{bo.stats.last30}</span>
            </div>
            <div>
              <b>{stats.newToday}</b>
              <span>{bo.stats.today}</span>
            </div>
          </div>

          <div className="avail-row">
            <p className={availClass}>
              {COPY.shell.availabilityLabel} — {site.settings.availabilityNote} · {COPY.shell.availabilityReplies} {site.settings.responseTime}
            </p>
            <Link className="link-arrow" to="/backoffice/settings">
              {bo.editAvailability}
            </Link>
          </div>

          {stats.total === 0 ? (
            <EmptyState title={bo.emptyTitle} body={bo.emptyEnquiries} />
          ) : (
            <>
              <div className="split">
                <section aria-labelledby="by-status">
                  <div className="block-head">
                    <h2 id="by-status">{bo.byStatus}</h2>
                  </div>
                  <Table caption={bo.byStatus} dense>
                    <thead>
                      <tr>
                        <th scope="col">{bo.columns.status}</th>
                        <th scope="col" className="num">
                          {bo.columns.count}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {STATUS_ORDER.map((s) => (
                        <tr key={s}>
                          <td>
                            <StatusPill status={s} />
                          </td>
                          <td className="num">{stats.byStatus[s] ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </section>

                <section aria-labelledby="by-service">
                  <div className="block-head">
                    <h2 id="by-service">{bo.byService}</h2>
                  </div>
                  {stats.byService.length === 0 ? (
                    <p className="meta">{bo.detail.none}</p>
                  ) : (
                    <Table caption={bo.byService} dense>
                      <thead>
                        <tr>
                          <th scope="col">{bo.columns.service}</th>
                          <th scope="col" className="num">
                            {bo.columns.count}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.byService.map((row) => (
                          <tr key={row.service}>
                            <td>
                              <Link className="link-quiet" to={`/backoffice/enquiries?service=${encodeURIComponent(row.service)}&status=all`}>
                                {serviceName(row.service)}
                              </Link>
                            </td>
                            <td className="num">{row.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </section>
              </div>

              <section aria-labelledby="latest">
                <div className="block-head">
                  <h2 id="latest">{bo.latest}</h2>
                  <Link className="link-arrow" to="/backoffice/enquiries">
                    {bo.allEnquiries}
                  </Link>
                </div>
                {stats.recent.length === 0 ? (
                  <EmptyState title={bo.emptyTitle} body={bo.emptyEnquiries} />
                ) : (
                  <Table caption={bo.latest} dense rows className="table--list">
                    <thead>
                      <tr>
                        <th scope="col">{bo.columns.ref}</th>
                        <th scope="col">{bo.columns.name}</th>
                        <th scope="col">{bo.columns.received}</th>
                        <th scope="col" className="col-service">
                          {bo.columns.service}
                        </th>
                        <th scope="col" className="col-kind">
                          {bo.columns.kind}
                        </th>
                        <th scope="col">{bo.columns.status}</th>
                        <th scope="col" className="col-priority">
                          {bo.columns.priority}
                        </th>
                        <th scope="col">
                          <span className="visually-hidden">{bo.columns.open}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent.map((e) => (
                        <tr key={e.id} onClick={(ev) => openRow(ev, e)}>
                          <td className="mono ref">{e.reference}</td>
                          <td className="who" title={e.company ? `${e.name} · ${e.company}` : e.name}>
                            <span className="name">{e.name}</span>
                            {e.company && <span className="sub">{e.company}</span>}
                          </td>
                          <td className="mono received">
                            <time dateTime={e.createdAt} title={`${formatDateTime(e.createdAt)} · ${timeAgo(e.createdAt)}`}>
                              {receivedShort(e.createdAt)}
                            </time>
                          </td>
                          <td className="col-service">{serviceName(e.service)}</td>
                          <td className="col-kind kind">{bo.kinds[e.kind]}</td>
                          <td className="status-cell">
                            <StatusPill status={e.status} />
                          </td>
                          <td className="col-priority">
                            <PriorityPill priority={e.priority} />
                          </td>
                          <td className="open">
                            <Link className="link-arrow link-quiet" to={`/backoffice/enquiries/${e.id}`} aria-label={`${bo.columns.open} ${e.reference}`}>
                              {bo.columns.open}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </section>
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
