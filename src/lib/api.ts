/**
 * Thin fetch wrapper for the backend API. Same origin in production; proxied by Vite in dev.
 */
export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

/**
 * Base URL for the API. Empty (default) = same origin, which is the case when the backend
 * serves the built site or a hosting rewrite proxies /api. Set VITE_API_URL at build time
 * to call a backend on another origin (the backend must then allow it via CORS_ORIGIN).
 */
export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

/** Resolve an API path (or a raw path such as the CSV export link) against API_BASE. */
export function apiUrl(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(apiUrl(url), {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: API_BASE ? 'include' : 'same-origin',
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : null;
  if (!res.ok) {
    const msg = (data && typeof data.error === 'string' && data.error) || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg, data?.fields);
  }
  return data as T;
}

export const api = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
  put: <T>(url: string, body?: unknown) => request<T>('PUT', url, body),
  patch: <T>(url: string, body?: unknown) => request<T>('PATCH', url, body),
  delete: <T>(url: string) => request<T>('DELETE', url),
};

// ---- Shapes shared with backend-api ----

export type EnquiryKind = 'quote' | 'contact' | 'callback' | 'audit';
export type EnquiryStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'archived';
export type EnquiryPriority = 'low' | 'normal' | 'high';

export interface Enquiry {
  id: number;
  reference: string;
  kind: EnquiryKind;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  preferWhatsapp: boolean;
  service: string;
  package: string | null;
  budget: string | null;
  timeline: string | null;
  website: string | null;
  message: string;
  sourcePage: string | null;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryNote {
  id: number;
  enquiryId: number;
  author: string;
  body: string;
  createdAt: string;
}

export interface EnquiryEvent {
  id: number;
  enquiryId: number;
  event: string;
  meta: Record<string, unknown> | null;
  createdAt: string;
}

export interface EnquiryInput {
  kind: EnquiryKind;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  preferWhatsapp?: boolean;
  service: string;
  package?: string;
  budget?: string;
  timeline?: string;
  website?: string;
  message: string;
  sourcePage?: string;
  companyWebsiteUrl?: string; // honeypot — leave empty
}

export interface EnquiryResult {
  ok: true;
  reference: string;
  responseTime: string;
  whatsapp: string;
}

export interface SiteSettings {
  accepting: boolean;
  availabilityNote: string;
  responseTime: string;
}

export interface SiteInfo {
  owner: {
    name: string;
    email: string;
    phone: string;
    phoneE164: string;
    whatsapp: string;
    linkedin: string;
    location: string;
  };
  settings: SiteSettings;
}

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Stats {
  total: number;
  byStatus: Record<EnquiryStatus, number>;
  byService: Array<{ service: string; count: number }>;
  last30Days: number;
  last7Days: number;
  newToday: number;
  recent: Enquiry[];
}

export interface EnquiryList {
  items: Enquiry[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EnquiryDetail {
  enquiry: Enquiry;
  notes: EnquiryNote[];
  events: EnquiryEvent[];
}
