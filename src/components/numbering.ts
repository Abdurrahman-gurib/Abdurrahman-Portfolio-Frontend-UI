import { COPY } from '../content/copy';
import { SERVICES } from '../content/services';
import { CASE_STUDIES } from '../content/work';
import type { CaseStudy, Service } from '../content/types';

/*
 * The site is one numbered document (DESIGN.md §5.4). These helpers are the only place a sub-number is formatted,
 * so a service row reads the same on the home page, /services, a service page and a case study, and a case reads
 * the same on the home page, /work and its own page.
 */

/** "02.1" … "02.13" for a service (or its two-digit `index`). No zero-pad after the point. */
export function serviceNumber(service: Service | string): string {
  const index = typeof service === 'string' ? service : service.index;
  return `02.${Number(index)}`;
}

/** "05.1" … by the case's position in CASE_STUDIES, whatever subset a page shows. Accepts a study or its slug. */
export function caseNumber(study: CaseStudy | string): string {
  const slug = typeof study === 'string' ? study : study.slug;
  const position = CASE_STUDIES.findIndex((c) => c.slug === slug);
  return `05.${position >= 0 ? position + 1 : 1}`;
}

/** Label of a numbered index entry (COPY.nav.index), e.g. "07" -> "Contact". Used for eyebrows. */
export function sectionLabel(n: string): string {
  return COPY.nav.index.find((item) => item.n === n)?.label ?? '';
}

/** Service by slug, for pages that print a related service's number. */
export function findService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
