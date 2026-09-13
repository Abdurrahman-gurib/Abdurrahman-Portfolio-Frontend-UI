import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api, ApiError, apiUrl, type Enquiry, type EnquiryList, type EnquiryStatus } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatDateTime, timeAgo, useSeo } from '../../lib/hooks';
import { COPY } from '../../content/copy';
import { SERVICES, SERVICE_BY_SLUG } from '../../content/services';
import { Button, EmptyState, Notice, PriorityPill, SelectField, Skeleton, StatusPill, Table, TextField } from '../../components';
import '../../styles/pages/backoffice.css';

const STATUS_ORDER: EnquiryStatus[] = ['new', 'contacted', 'quoted', 'won', 'lost', 'archived'];
const PAGE_SIZE = 25;
const DEBOUNCE_MS = 300;

function serviceName(slug: string): string {
  return SERVICE_BY_SLUG[slug]?.name ?? slug;
}

/** Short absolute stamp for list columns (DESIGN.md §6.8): "13 Sep, 09:14". The relative time goes in the title. */
function receivedShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

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

/** Enquiry list (DESIGN.md §7.10): filters in one ruled row, a dense clickable table, a mono pager line. Filters live in the URL. */
export default function Enquiries() {
  useSeo(`${COPY.backoffice.enquiries} · ${COPY.backoffice.title}`);
  const bo = COPY.backoffice;
  const navigate = useNavigate();
  const guard = useSessionGuard();
  const [params, setParams] = useSearchParams();

  const status = params.get('status') ?? 'open';
  const service = params.get('service') ?? '';
  const qParam = params.get('q') ?? '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const [search, setSearch] = useState(qParam);
  const [data, setData] = useState<EnquiryList | null>(null);
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

  // Debounced search: the input is local; the URL (and the fetch) follow after a pause.
  useEffect(() => {
    if (search === qParam) return undefined;
    const t = window.setTimeout(() => update({ q: search.trim(), page: null }), DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [search, qParam, update]);

  const query = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set('status', status);
    if (service) qs.set('service', service);
    if (qParam) qs.set('q', qParam);
    qs.set('page', String(page));
    qs.set('pageSize', String(PAGE_SIZE));
    return qs.toString();
  }, [status, service, qParam, page]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get<EnquiryList>(`/api/admin/enquiries?${query}`)
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
  }, [query, guard, bo.errorGeneric]);

  const filtered = status !== 'open' || service !== '' || qParam !== '';
  const clearFilters = () => {
    setSearch('');
    setParams(new URLSearchParams(), { replace: true });
  };

  const openRow = (e: MouseEvent<HTMLTableRowElement>, enquiry: Enquiry) => {
    if ((e.target as HTMLElement).closest('a')) return; // the real link handles itself
    navigate(`/backoffice/enquiries/${enquiry.id}`);
  };

  const total = data?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(total, page * PAGE_SIZE);
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const statusOptions = [
    { value: 'open', label: bo.filters.open },
    { value: 'all', label: bo.filters.all },
    ...STATUS_ORDER.map((s) => ({ value: s, label: bo.statuses[s] })),
  ];
  const serviceOptions = SERVICES.map((s) => ({ value: s.slug, label: s.name }));

  return (
    <div className="page-bo-enquiries">
      <h1>{bo.enquiries}</h1>

      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()} aria-label={bo.filters.search}>
        <TextField
          className="field--search"
          label={bo.filters.search}
          name="q"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder={bo.filters.searchPlaceholderLong}
          value={search}
          onChange={setSearch}
          required={false}
        />
        <SelectField
          label={bo.filters.status}
          name="status"
          options={statusOptions}
          value={status}
          onChange={(v) => update({ status: v, page: null })}
          required={false}
        />
        <SelectField
          label={bo.filters.service}
          name="service"
          placeholder={bo.filters.allServices}
          options={serviceOptions}
          value={service}
          onChange={(v) => update({ service: v, page: null })}
          required={false}
        />
        <div className="filters__actions">
          <Button as="a" href={apiUrl('/api/admin/enquiries/export.csv')} size="sm" arrow={false} download>
            {bo.filters.exportCsv}
          </Button>
        </div>
      </form>

      {error && (
        <Notice tone="error" title={bo.errorTitle}>
          {error}
        </Notice>
      )}

      {loading && !data ? (
        <Skeleton lines={10} label={bo.loadingEnquiries} />
      ) : data && data.items.length === 0 ? (
        filtered ? (
          <EmptyState
            title={bo.emptyFilteredTitle}
            body={bo.emptyFilteredBody}
            action={
              <Button onClick={clearFilters} arrow={false}>
                {bo.filters.clear}
              </Button>
            }
          />
        ) : (
          <EmptyState title={bo.emptyTitle} body={bo.emptyEnquiries} />
        )
      ) : data ? (
        <>
          <Table caption={bo.enquiries} dense rows sticky className="table--list">
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
            <tbody aria-busy={loading || undefined}>
              {data.items.map((e) => (
                <tr key={e.id} onClick={(ev) => openRow(ev, e)}>
                  <td className="ref">
                    <Link to={`/backoffice/enquiries/${e.id}`}>{e.reference}</Link>
                  </td>
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

          <div className="table-foot">
            <span role="status">{fill(bo.showing, { from, to, total })}</span>
            <div className="btn-row">
              <Button size="sm" arrow={false} disabled={page <= 1} onClick={() => update({ page: page > 2 ? String(page - 1) : null })}>
                {bo.previous}
              </Button>
              <Button size="sm" disabled={page >= lastPage} onClick={() => update({ page: String(page + 1) })}>
                {bo.next}
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
