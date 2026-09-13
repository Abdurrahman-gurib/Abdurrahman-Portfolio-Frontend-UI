import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { PACKAGES, PACKAGE_GROUPS, PRICING_NOTES, STANDARD_TERMS } from '../content/packages';
import { ContactStrip, CtaBand, Headline, PackageCard, PageHero, Reveal, SectionHeader } from '../components';
import '../styles/pages/pricing.css';

const INDEX_ID = 'package-index';
const P = COPY.pricing;

/** /pricing: every package as a glass card, grouped, with the recommended one highlighted; then terms, notes and a call to action. */
export default function Pricing() {
  useSeo(COPY.seo.pricing.title, COPY.seo.pricing.description);
  const groups = PACKAGE_GROUPS.map((g) => ({ ...g, packages: PACKAGES.filter((p) => p.group === g.key) }));

  return (
    <div className="page-pricing">
      <PageHero breadcrumb={[{ label: P.title }]} eyebrow={P.title} titleId="pricing-title" title={<Headline text={P.headline} words={2} />} lead={P.intro}>
        <nav className="pricing-jump" id={INDEX_ID} aria-label={P.indexLabel}>
          <p className="small">{P.tabsHint}</p>
          <ul className="tag-row">
            {groups.map((g) => (
              <li key={g.key}>
                <a href={`#${g.key}`} className="chip-link">
                  {g.label}
                  <span className="count">
                    {g.packages.length} {P.indexUnit}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {groups.map((g, gi) => (
        <section key={g.key} id={g.key} className={`section pkg-group ${gi % 2 === 0 ? 'band--page' : ''}`} aria-labelledby={`${g.key}-title`}>
          <div className="container">
            <Reveal>
              <SectionHeader eyebrow={g.label} title={P.groupTitles[g.key]} intro={g.blurb} id={`${g.key}-title`} />
            </Reveal>
            <div className="cards cards--3">
              {g.packages.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 70}>
                  <PackageCard pkg={p} />
                </Reveal>
              ))}
            </div>
            <p className="pkg-group__back">
              <a href={`#${INDEX_ID}`} className="link-arrow">
                {P.backToIndex}
              </a>
            </p>
          </div>
        </section>
      ))}

      <section className="section band--dark" id="terms" aria-labelledby="terms-title">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={P.termsEyebrow} title={P.termsTitle} intro={P.termsIntro} id="terms-title" />
          </Reveal>
          <div className="cards cards--3">
            {STANDARD_TERMS.map((t, i) => (
              <Reveal key={t.title} delay={(i % 3) * 70}>
                <div className="card card--dark terms-card">
                  <h3>{t.title}</h3>
                  <p className="mt-2">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section band--page" id="notes" aria-labelledby="notes-title">
        <div className="container">
          <div className="split split--side">
            <Reveal>
              <SectionHeader eyebrow={P.notesEyebrow} title={P.notesTitle} intro={P.notesIntro} id="notes-title" />
              <div className="card card--strong">
                <ul className="checks checks--lg pricing-notes">
                  {PRICING_NOTES.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand id="contact" eyebrow={COPY.contact.title} title={P.contactTitle} body={P.contactIntro} to="/contact?kind=quote">
        <ContactStrip className="mt-6" />
      </CtaBand>
    </div>
  );
}
