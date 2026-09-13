/**
 * Content model for the public website. All marketing copy lives in typed data modules
 * under src/content so the pages stay free of hard-coded text and the owner can edit
 * prices, services and wording in one place.
 */

export type ServiceGroup = 'web' | 'software' | 'it' | 'security' | 'infrastructure' | 'growth';

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  /** URL slug, e.g. "web-design". Used in routes and stored on enquiries. */
  slug: string;
  /** Two-digit index for section numbering, e.g. "01". */
  index: string;
  group: ServiceGroup;
  /** Short name for nav/lists, e.g. "Websites & web apps". */
  name: string;
  /** One line under the name (max ~90 chars). */
  tagline: string;
  /** Two or three short paragraphs. Plain prose, British English. */
  intro: string[];
  /** Concrete things the client receives. 5 to 9 items, each a short phrase. */
  deliverables: string[];
  /** Situations where this service fits. 3 to 5 items, each a short phrase starting with a noun or "You…". */
  goodFor: string[];
  /** Technologies/vendors used, for the sidebar. */
  tools: string[];
  /** Indicative price wording, e.g. "From MUR 15,000" or "Quoted after a free site visit". */
  priceFrom: string;
  /** Typical lead time wording, e.g. "2 to 4 weeks". */
  typicalTimeline: string;
  /** Which enquiry kind the CTA should pre-select. */
  enquiryKind: 'quote' | 'audit' | 'callback' | 'contact';
  /** CTA label, e.g. "Request a quote" / "Book a free security audit". */
  ctaLabel: string;
  faqs: ServiceFaq[];
  /** Slugs of related packages (from packages.ts). */
  relatedPackages: string[];
  /** SEO */
  metaTitle: string;
  metaDescription: string;
}

export interface Package {
  slug: string;
  /** Group tab on the pricing page. */
  group: 'websites' | 'support' | 'software' | 'it';
  name: string;
  /** e.g. "MUR 15,000", the headline one-off price. */
  price: string;
  /** e.g. "one-off" | "per month" | "per visit" */
  priceUnit: string;
  /** Optional second line, e.g. "+ MUR 1,500 / month optional support". */
  priceNote?: string;
  /** Who this is for, one sentence. */
  bestFor: string;
  /** Delivery time, e.g. "2 to 3 weeks". */
  delivery: string;
  includes: string[];
  /** Items explicitly not included (keeps quotes honest). */
  excludes?: string[];
  /** Mark exactly one package per group as the recommended default. */
  recommended?: boolean;
  /** Service slug this package belongs to. */
  serviceSlug: string;
}

export interface ProcessStep {
  index: string;
  title: string;
  /** One or two sentences. */
  body: string;
  /** What the client gets at the end of the step. */
  output: string;
}

export interface Commitment {
  title: string;
  body: string;
}

export interface CaseStudy {
  slug: string;
  /** e.g. "Garage management platform" */
  title: string;
  /** Sector + context line, e.g. "Leisure & hospitality group · Mauritius". Do not name employers the owner wants private. */
  context: string;
  /** Year or range, e.g. "2026". */
  period: string;
  problem: string;
  approach: string;
  outcome: string;
  /** 3 to 6 tags: technologies or capabilities. */
  stack: string[];
  /** Optional 2 to 4 short factual metrics, e.g. { label: "Operational areas", value: "6" }. Only real facts. */
  facts?: Array<{ label: string; value: string }>;
}

export interface TimelineEntry {
  period: string;
  role: string;
  /** Organisation or anonymised descriptor. */
  org: string;
  summary: string;
}

export interface Credential {
  title: string;
  issuer: string;
  year?: string;
}

export interface Award {
  title: string;
  year: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface SectorExample {
  /** e.g. "Garages & workshops" */
  sector: string;
  /** What you'd typically build for them, one short line. */
  example: string;
}
