import { COPY } from '../content/copy';
import type { Package } from '../content/types';
import { Button } from './Button';

/** "From MUR 55,000" becomes a small "From" and a big figure; the text itself is unchanged. */
function splitPrice(price: string): { from: string | null; figure: string } {
  const m = /^(From)\s+(.+)$/.exec(price);
  return m && m[1] && m[2] ? { from: m[1], figure: m[2] } : { from: null, figure: price };
}

export function packageRequestHref(pkg: Package): string {
  return `/contact?kind=quote&service=${encodeURIComponent(pkg.serviceSlug)}&package=${encodeURIComponent(pkg.slug)}`;
}

export interface PackageCardProps {
  pkg: Package;
  /** Group name shown as a tag, e.g. "Websites". */
  groupLabel?: string;
  /** Show only the first N included items (home page excerpt). */
  limit?: number;
  /** Show the "Not included" line. Default true when no limit is set. */
  excludes?: boolean;
  className?: string;
}

/** A package as a glass card: name, big price, includes with check marks, Request button. Recommended gets a gradient border. */
export function PackageCard({ pkg, groupLabel, limit, excludes, className }: PackageCardProps) {
  const P = COPY.pricing;
  const { from, figure } = splitPrice(pkg.price);
  const items = limit ? pkg.includes.slice(0, limit) : pkg.includes;
  const showExcludes = (excludes ?? !limit) && pkg.excludes && pkg.excludes.length > 0;
  const titleId = `pkg-${pkg.slug}-title`;
  const cls = ['card', 'card--strong', 'pkg-card', pkg.recommended ? 'pkg-card--recommended' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <article className={cls} id={`pkg-${pkg.slug}`} aria-labelledby={titleId}>
      {(groupLabel || pkg.recommended) && (
        <div className="pkg-card__top">
          {groupLabel && <span className="tag">{groupLabel}</span>}
          {pkg.recommended && <span className="tag tag--gradient">{P.recommended}</span>}
        </div>
      )}
      <div>
        <h3 id={titleId}>{pkg.name}</h3>
        <p className="pkg-card__for">{pkg.bestFor}</p>
      </div>
      <div className="pkg-card__price">
        {from && <span className="from">{from}</span>}
        <b>{figure}</b>
        <span className="unit">{pkg.priceUnit}</span>
      </div>
      {pkg.priceNote && <p className="pkg-card__note">{pkg.priceNote}</p>}
      <span className="pkg-card__delivery">{pkg.delivery}</span>
      <ul className="checks" aria-label={P.columns.includes}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {showExcludes && (
        <p className="pkg-card__excl">
          <span className="k">{P.notIncluded}:</span> {pkg.excludes?.join(' · ')}
        </p>
      )}
      <Button as="link" to={packageRequestHref(pkg)} variant={pkg.recommended ? 'primary' : 'secondary'} aria-label={P.requestAria.replace('{name}', pkg.name)}>
        {P.request}
      </Button>
    </article>
  );
}
