import '../styles/pages/home.css';
import { Link } from 'react-router-dom';
import { useSeo, useSite } from '../lib/hooks';
import { COPY, FAQS } from '../content/copy';
import { SERVICES, SERVICE_GROUPS } from '../content/services';
import { PACKAGES, PACKAGE_GROUPS, PRICING_NOTES, STANDARD_TERMS } from '../content/packages';
import { ABOUT, PROCESS } from '../content/about';
import { CASE_STUDIES, SELECTED_WORK_SLUGS } from '../content/work';
import { OWNER, whatsappLink } from '../content/site';
import type { CaseStudy, Package, ServiceGroup } from '../content/types';
import {
  AvailabilityLine,
  Button,
  ContactSection,
  DefinitionList,
  FaqList,
  SectionHeader,
  Table,
  WhatsAppButton,
} from '../components';

/** Section names come from the shared numbered index (DESIGN.md §5.4) so the eyebrows match the drawer and footer. */
function indexLabel(n: string): string {
  return COPY.nav.index.find((item) => item.n === n)?.label ?? '';
}

const GROUP_ORDER = Object.keys(SERVICE_GROUPS) as ServiceGroup[];

/** Two entries on the home page (DESIGN.md §7.1); the full list is on /work. */
const SELECTED_WORK: CaseStudy[] = SELECTED_WORK_SLUGS.map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
  .filter((c): c is CaseStudy => c !== undefined)
  .slice(0, 2);

/** One headline package per group: the recommended one, or the first listed. */
const HEADLINE_PACKAGES = PACKAGE_GROUPS.map((group) => ({
  group,
  pkg: PACKAGES.find((p) => p.group === group.key && p.recommended) ?? PACKAGES.find((p) => p.group === group.key),
})).filter((row): row is { group: (typeof PACKAGE_GROUPS)[number]; pkg: Package } => row.pkg !== undefined);

/** Payment and third-party terms shown under the sheet excerpt (DESIGN.md §6.8 sheet-notes); first two terms if the titles change. */
const PICKED_TERMS = STANDARD_TERMS.filter((t) => t.title.startsWith('50%') || t.title.startsWith('Third-party'));
const SHEET_TERMS = PICKED_TERMS.length === 2 ? PICKED_TERMS : STANDARD_TERMS.slice(0, 2);

/** Four questions here; the full list is on /contact. */
const HOME_FAQS = FAQS.slice(0, 4);

/**
 * Renders a content price string with its characters unchanged: a leading "From" is styled muted and a trailing
 * "per device" / "per day" unit sits on its own mono line so the figure fits the 11rem price column.
 */
function ServicePrice({ value }: { value: string }) {
  const from = value.startsWith('From ');
  const rest = from ? value.slice(5) : value;
  const unitAt = rest.indexOf(' per ');
  const figure = unitAt === -1 ? rest : rest.slice(0, unitAt);
  const unit = unitAt === -1 ? null : rest.slice(unitAt + 1);
  return (
    <span className="price">
      {from && <span className="from">From </span>}
      {figure}
      {unit && <span className="unit">{unit}</span>}
    </span>
  );
}

export default function Home() {
  useSeo(COPY.seo.home.title, COPY.seo.home.description);
  const { settings } = useSite();
  const home = COPY.home;

  return (
    <div className="page-home">
      <div className="container">
        {/* 01 — Overview */}
        <section className="section section--first" id="overview">
          <div className="grid">
            <div className="hero__main">
              <span className="eyebrow">
                <span className="n">01</span> — {indexLabel('01')}
              </span>
              <h1 className="hero-h1">{home.headline}</h1>
              <p className="lead">{home.sub}</p>
              <div className="btn-row">
                <Button as="link" to="/contact?kind=quote" variant="primary">
                  {home.primaryCta}
                </Button>
                <WhatsAppButton />
              </div>
              <AvailabilityLine />
            </div>
            <div className="hero__facts">
              <DefinitionList
                aria-label={indexLabel('01')}
                items={[
                  { term: home.facts.based, detail: ABOUT.location },
                  { term: home.facts.serving, detail: home.facts.servingValue },
                  {
                    term: home.facts.experience,
                    detail: (
                      <>
                        <span className="mono">{ABOUT.yearsExperience}</span> {home.facts.experienceValue}
                      </>
                    ),
                  },
                  { term: home.facts.qualification, detail: home.facts.qualificationValue },
                  { term: home.facts.response, detail: `${home.facts.replies} ${settings.responseTime}` },
                  { term: home.facts.pricing, detail: home.facts.pricingValue },
                  { term: home.facts.stack, detail: home.facts.stackValue },
                ]}
              />
            </div>
          </div>
        </section>

        <div className="sector-line">
          <b>{home.sectorsLabel}</b> — {home.sectors.map((s) => s.sector).join(' · ')}
        </div>

        {/* 02 — Services */}
        <section className="section" id="services">
          <div className="grid">
            <SectionHeader index="02" eyebrow={indexLabel('02')} title={COPY.services.title} intro={home.servicesIntro} />
            <div className="section__body">
              {GROUP_ORDER.map((key) => {
                const group = SERVICE_GROUPS[key];
                const list = SERVICES.filter((s) => s.group === key);
                if (list.length === 0) return null;
                return (
                  <div className="svc-group" key={key}>
                    <p className="eyebrow">{group.label}</p>
                    <p className="small mb-4">{group.blurb}</p>
                    <ul className="rows">
                      {list.map((s) => (
                        <li key={s.slug}>
                          <Link className="row-link" to={`/services/${s.slug}`}>
                            <span className="idx">02.{s.index}</span>
                            <span>
                              <h3>{s.name}</h3>
                              <p>{s.tagline}</p>
                            </span>
                            <ServicePrice value={s.priceFrom} />
                            <span className="arrow" aria-hidden="true">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <div className="btn-row mt-8">
                <Button as="link" to="/services">
                  {home.allServices}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — Process */}
        <section className="section" id="process">
          <div className="grid">
            <SectionHeader index="03" eyebrow={indexLabel('03')} title={home.processTitle} intro={home.processIntro} />
            <div className="section__body">
              <ol className="steps">
                {PROCESS.map((step) => (
                  <li key={step.index}>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                      <p className="out">
                        {home.outputLabel} — {step.output}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>

      {/* 04 — Pricing: the one band on the page */}
      <div className="band">
        <div className="container">
          <section className="section" id="pricing">
            <div className="grid">
              <SectionHeader index="04" eyebrow={indexLabel('04')} title={home.pricingTitle} />
              <div className="section__body">
                <p className="pricing-intro">{home.pricingIntro}</p>
                <Table sheet caption={home.sheet.caption}>
                  <thead>
                    <tr>
                      <th scope="col">{home.sheet.package}</th>
                      <th scope="col">{home.sheet.bestFor}</th>
                      <th scope="col">{home.sheet.delivery}</th>
                      <th scope="col" className="num">
                        {home.sheet.price}
                      </th>
                      <th scope="col">
                        <span className="visually-hidden">{home.sheet.request}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEADLINE_PACKAGES.map(({ group, pkg }) => (
                      <PackageRows key={pkg.slug} groupLabel={group.label} pkg={pkg} />
                    ))}
                  </tbody>
                </Table>
                <ol className="footnotes">
                  {PRICING_NOTES.map((note, i) => (
                    <li key={note}>
                      <span className="mono">{i + 1}</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ol>
                <div className="sheet-notes">
                  {SHEET_TERMS.map((term) => (
                    <div key={term.title}>
                      {/* h3, not the spec's h4: the section title is an h2 and the outline must not skip a level */}
                      <h3>{term.title}</h3>
                      <p>{term.body}</p>
                    </div>
                  ))}
                </div>
                <div className="btn-row mt-8">
                  <Button as="link" to="/pricing">
                    {home.fullPriceSheet}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="container">
        {/* 05 — Work */}
        <section className="section" id="work">
          <div className="grid">
            <SectionHeader index="05" eyebrow={indexLabel('05')} title={home.workTitle} intro={home.workIntro} />
            <div className="section__body">
              <div className="cases">
                {SELECTED_WORK.map((c, i) => (
                  <CaseEntry key={c.slug} n={`05.${i + 1}`} study={c} />
                ))}
              </div>
              <div className="btn-row mt-8">
                <Button as="link" to="/work">
                  {home.allWork}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 06 — About */}
        <section className="section" id="about">
          <div className="grid">
            <SectionHeader index="06" eyebrow={indexLabel('06')} title={home.whyTitle} />
            <div className="section__body">
              {/* Two paragraphs (DESIGN.md §7.1); the commitments list, timeline and credentials stay on /about. */}
              <div className="prose">
                <p>{home.whyIntro}</p>
                <p>{home.whyBody}</p>
              </div>
              {/* The About closing line (DESIGN.md §7.1, §9.13): italic sentence, number beneath as the green WhatsApp link */}
              <p className="italic-line about-close">{COPY.about.closingLine}</p>
              <p className="about-phone">
                <a className="wa-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <span className="word">{COPY.shell.whatsappWord}</span>
                  <span className="num">{OWNER.phoneDisplay}</span>
                </a>
              </p>
              <div className="btn-row mt-8">
                <Button as="link" to="/about">
                  {home.moreAbout}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — Contact: the shared foot (head, ladder, enquiry form pre-set to a quote; DESIGN.md §7.1, §9.12).
            The form's submit is this section's one primary button; the four FAQs sit under the form. */}
        <ContactSection kind="quote" sourcePage="/">
          <h3>{home.faqTitle}</h3>
          <FaqList className="mt-6" items={HOME_FAQS} />
        </ContactSection>
      </div>
    </div>
  );
}

/** A group row plus the group's headline package, in the price-sheet markup from DESIGN.md §6.8. */
function PackageRows({ groupLabel, pkg }: { groupLabel: string; pkg: Package }) {
  const sheet = COPY.home.sheet;
  const requestTo = `/contact?kind=quote&service=${encodeURIComponent(pkg.serviceSlug)}&package=${encodeURIComponent(pkg.slug)}`;
  return (
    <>
      <tr className="group">
        <td colSpan={5}>{groupLabel}</td>
      </tr>
      <tr>
        <td className="pkg">
          {pkg.name}
          {pkg.priceNote && <span className="sub">{pkg.priceNote}</span>}
        </td>
        <td className="includes" data-label={sheet.bestFor}>
          {pkg.bestFor}
        </td>
        <td className="delivery" data-label={sheet.delivery}>
          {pkg.delivery}
        </td>
        <td className="num" data-label={sheet.price}>
          <span className="from">{pkg.priceUnit}</span>
          <span className="val">{pkg.price}</span>
        </td>
        <td className="cta">
          <Link className="link-arrow" to={requestTo}>
            {sheet.request}
            <span className="visually-hidden"> — {pkg.name}</span>
          </Link>
        </td>
      </tr>
    </>
  );
}

/**
 * One selected-work entry, text only: a short dossier (context, period, stack) on the left; title, problem / what I did
 * / result and the entry's facts on the right. The facts carry the long keys ("Operational areas", "SWIFT message
 * types"), so they sit in the wide text column as a tight spec list, the same split as /work.
 */
function CaseEntry({ n, study }: { n: string; study: CaseStudy }) {
  const labels = COPY.home.caseLabels;
  const dossier = [
    { term: labels.context, detail: study.context },
    { term: labels.period, detail: <span className="mono">{study.period}</span> },
    { term: labels.stack, detail: study.stack.join(' · ') },
  ];
  const facts = study.facts ?? [];
  return (
    <article className="case" aria-labelledby={`case-${study.slug}`}>
      <div className="case__side">
        <span className="eyebrow">
          <span className="n">{n}</span>
        </span>
        <DefinitionList aria-label={`${study.title}: ${labels.context}, ${labels.period}, ${labels.stack}`} items={dossier} />
      </div>
      <div className="case__main">
        <h3 id={`case-${study.slug}`}>{study.title}</h3>
        <div className="case__text">
          <p>
            <span className="k">{labels.problem}</span> {study.problem}
          </p>
          <p>
            <span className="k">{labels.approach}</span> {study.approach}
          </p>
          <p>
            <span className="k">{labels.outcome}</span> {study.outcome}
          </p>
        </div>
        {facts.length > 0 && (
          <DefinitionList
            className="case__facts"
            tight
            aria-label={`${study.title}: ${labels.facts}`}
            items={facts.map((f) => ({ term: f.label, detail: f.value }))}
          />
        )}
        <p className="case__more">
          <Link className="link-arrow" to={`/work/${study.slug}`}>
            {labels.read}
          </Link>
        </p>
      </div>
    </article>
  );
}
