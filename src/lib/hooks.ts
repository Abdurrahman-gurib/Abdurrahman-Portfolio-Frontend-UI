import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, type SiteInfo } from './api';
import { OWNER, WHATSAPP_BASE } from '../content/site';

const FALLBACK_SITE: SiteInfo = {
  owner: {
    name: OWNER.name,
    email: OWNER.email,
    phone: OWNER.phoneDisplay,
    phoneE164: OWNER.phoneE164,
    whatsapp: WHATSAPP_BASE,
    linkedin: OWNER.linkedin,
    location: OWNER.location,
  },
  settings: {
    accepting: true,
    availabilityNote: 'Taking on new projects this month',
    responseTime: 'within one business day',
  },
};

let cachedSite: SiteInfo | null = null;
let inflight: Promise<SiteInfo> | null = null;

/** Live site info (availability, response time) from the API, with a static fallback so the page never blocks. */
export function useSite(): SiteInfo {
  const [site, setSite] = useState<SiteInfo>(cachedSite ?? FALLBACK_SITE);
  useEffect(() => {
    if (cachedSite) return;
    if (!inflight) {
      inflight = api
        .get<SiteInfo>('/api/site')
        .then((s) => {
          cachedSite = s;
          return s;
        })
        .catch(() => FALLBACK_SITE);
    }
    let alive = true;
    inflight.then((s) => {
      if (alive) setSite(s);
    });
    return () => {
      alive = false;
    };
  }, []);
  return site;
}

/** Sets document.title and the meta description for the current page. */
export function useSeo(title: string, description?: string): void {
  useEffect(() => {
    document.title = title;
    if (description !== undefined) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}

/** Scrolls to the top on route change, or to the hash target if present. */
export function useScrollRestoration(): void {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
}

/** Simple media-query hook. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

/** Formats an ISO date for the back office, e.g. "13 Sep 2026, 14:52". */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Relative time, e.g. "3 h ago", "2 d ago". */
export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} d ago`;
  return formatDate(iso);
}
