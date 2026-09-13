import { Link } from 'react-router-dom';
import { useMediaQuery, useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { PACKAGES, PACKAGE_GROUPS, PRICING_NOTES, STANDARD_TERMS } from '../content/packages';
import type { Package } from '../content/types';
import { AvailabilityLine, Breadcrumb, Button, ContactStrip, SectionHeader, Table, WhatsAppButton } from '../components';
import '../styles/pages/pricing.css';

const INDEX_ID = 'package-index';

/** "From MUR 55,000" -> the word set small above the figure; the text itself is left exactly as the content has it. */
function splitPrice(price: string): { from: string | null; figure: string } {
  const m = /^(From)\s+(.+)$/.exec(price);
  return m && m[1] && m[2] ? { from: m[1], figure: m[2] } : { from: null, figure: price };
}

function requestHref(p: Package): string {
  return `/contact?kind=quote&service=${encodeURIComponent(p.serviceSlug)}&package=${encodeURIComponent(p.slug)}`;
}

/** The includes list, the exclusions line and, on the table, the price note as a ".sub" line (DESIGN.md §6.8).
    On the mobile ledger the list sits behind a native details/summary and the note moves under the price line instead. */
function IncludesList({ p, note }: { p: Package; note: boolean }) {
  return (
    <>
      <ul className="pkg__list">
        {p.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {p.excludes && p.excludes.length > 0 && (
        <p className="pkg__excl">
          <span className="k">{COPY.pricing.notIncluded}</span> — {p.excludes.join(' · ')}
        </p>
      )}
      {note && p.priceNote && <span className="sub">{p.priceNote}</span>}
    </>
  );
}

function RateCard({ groupLabel, packages, ledger }: { groupLabel: string; packages: Package[]; ledger: boolean }) {
  const c = COPY.pricing.columns;
  return (
    <Table sheet caption={`${COPY.pricing.title}: ${groupLabel}`}>
      <thead>
        <tr>
          <th scope="col" className="th-pkg">
            {c.package}
          </th>
          <th scope="col" className="th-inc">
            {c.includes}
          </th>
          <th scope="col" className="th-del">
            {c.delivery}
          </th>
          <th scope="col" className="num th-price">
            {c.price}
          </th>
          <th scope="col" className="th-cta">
            <span className="visually-hidden">{c.request}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {packages.map((p) => {
          const { from, figure } = splitPrice(p.price);
          return (
            <tr key={p.slug} id={`pkg-${p.slug}`}>
              <td className="pkg">
                <span className="pkg__name">{p.name}</span>
                <p className="pkg__for">{p.bestFor}</p>
              </td>
              <td className="includes" data-label={c.includes}>
                {ledger ? (
                  <details className="pkg__more">
                    <summary>{COPY.pricing.moreLabel}</summary>
                    <IncludesList p={p} note={false} />
                  </details>
                ) : (
                  <IncludesList p={p} note />
                )}
              </td>
              <td className="delivery" data-label={c.delivery}>
                {p.delivery}
              </td>
              {/* PRICE holds only the figure and its unit. Ledger label is the billing basis ("ONE-OFF ......... From MUR 55,000");
                  "From" stays inside .val so it never parts from the figure. The price note follows the line, left-aligned, on the ledger only. */}
              <td className="num" data-label={p.priceUnit}>
                <span className="val">
                  {from && <span className="from">{from}</span>}
                  {figure}
                </span>
                <span className="unit">{p.priceUnit}</span>
                {ledger && p.priceNote && <span className="sub">{p.priceNote}</span>}
              </td>
              <td className="cta">
                <Link to={requestHref(p)} className="link-arrow" aria-label={COPY.pricing.requestAria.replace('{name}', p.name)}>
                  {COPY.pricing.request}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default function Pricing() {
  useSeo(COPY.seo.pricing.title, COPY.seo.pricing.description);
  const ledger = useMediaQuery('(max-width: 767px)');
  const groups = PACKAGE_GROUPS.map((g, i) => ({
    ...g,
    n: `04.${i + 1}`,
    packages: PACKAGES.filter((p) => p.group === g.key),
  }));
  const termsIndex = `04.${groups.length + 1}`;
  const notesIndex = `04.${groups.length + 2}`;

  return (
    <div className="page-pricing">
      {/* 04 — Pricing: page head with the package index in the facts column */}
      <div className="container">
        <section className="section section--first">
          <Breadcrumb items={[{ label: COPY.pricing.title }]} />
          <div className="grid">
            <div className="hero__main">
              <span className="eyebrow">
                <span className="n">04</span> — {COPY.pricing.title}
              </span>
              <h1>{COPY.pricing.headline}</h1>
              <p className="lead">{COPY.pricing.intro}</p>
            </div>
            <nav className="hero__facts" id={INDEX_ID} aria-label={COPY.pricing.indexLabel}>
              <p className="meta">{COPY.pricing.tabsHint}</p>
              <ol className="pricing-index">
                {groups.map((g) => (
                  <li key={g.key}>
                    <a href={`#${g.key}`} className="link-quiet">
                      <span className="n">{g.n}</span>
                      <span>{g.label}</span>
                      <span className="count">
                        {g.packages.length} {COPY.pricing.indexUnit}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>
      </div>

      {/* The price sheet: one band, one rate card per group. Eyebrow names the group ("04.1 — WEBSITES"). */}
      <div className="band">
        <div className="container">
          {groups.map((g) => (
            <section key={g.key} id={g.key} className="section pkg-group" aria-labelledby={`${g.key}-title`}>
              <div className="grid">
                <SectionHeader index={g.n} eyebrow={g.label} title={COPY.pricing.groupTitles[g.key]} intro={g.blurb} id={`${g.key}-title`} sticky={false} />
                <div className="section__body section__body--wide">
                  <RateCard groupLabel={g.label} packages={g.packages} ledger={ledger} />
                  <p className="pkg-group__back">
                    <a href={`#${INDEX_ID}`} className="link-quiet">
                      {COPY.pricing.backToIndex}
                    </a>
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Standard terms */}
        <section className="section" id="terms" aria-labelledby="terms-title">
          <div className="grid">
            <SectionHeader index={termsIndex} eyebrow={COPY.pricing.termsEyebrow} title={COPY.pricing.termsTitle} intro={COPY.pricing.termsIntro} id="terms-title" />
            <div className="section__body">
              <ol className="steps">
                {STANDARD_TERMS.map((t) => (
                  <li key={t.title}>
                    <div>
                      <h4>{t.title}</h4>
                      <p>{t.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="section" id="notes" aria-labelledby="notes-title">
          <div className="grid">
            <SectionHeader index={notesIndex} eyebrow={COPY.pricing.notesEyebrow} title={COPY.pricing.notesTitle} intro={COPY.pricing.notesIntro} id="notes-title" sticky={false} />
            <div className="section__body">
              <ul className="pricing-notes">
                {PRICING_NOTES.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 07 — Contact */}
        <section className="section" id="contact" aria-labelledby="contact-title">
          <div className="grid">
            <SectionHeader index="07" eyebrow={COPY.contact.title} title={COPY.pricing.contactTitle} id="contact-title" sticky={false} />
            <div className="section__body">
              <p>{COPY.pricing.contactIntro}</p>
              <div className="btn-row mt-8">
                <Button as="link" to="/contact?kind=quote" variant="primary">
                  {COPY.nav.cta}
                </Button>
                <WhatsAppButton />
              </div>
              <AvailabilityLine />
              <ContactStrip className="mt-8" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
