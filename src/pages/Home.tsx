import '../styles/pages/home.css';
import { Link } from 'react-router-dom';
import { useSeo, useSite } from '../lib/hooks';
import { COPY, FAQS } from '../content/copy';
import { SERVICES, SERVICE_GROUPS } from '../content/services';
import { PACKAGES, PACKAGE_GROUPS, PRICING_NOTES, STANDARD_TERMS } from '../content/packages';
import { ABOUT, PROCESS } from '../content/about';
import { CASE_STUDIES, SELECTED_WORK_SLUGS } from '../content/work';
import { OWNER, whatsappLink } from '../content/site';
import type { CaseStudy, Package } from '../content/types';
import {
  AvailabilityLine,
  Button,
  CaseCard,
  ContactSection,
  DefinitionList,
  FaqList,
  Headline,
  PackageCard,
  PageHero,
  ProcessSteps,
  Reveal,
  SectionHeader,
  StatChips,
  WhatsAppButton,
} from '../components';

/** Section labels shared with the footer and drawer. */
function indexLabel(n: string): string {
  return COPY.nav.index.find((item) => item.n === n)?.label ?? '';
}

/** Three entries on the home page; the full list is on /work. */
const SELECTED_WORK: CaseStudy[] = SELECTED_WORK_SLUGS.map((slug) => CASE_STUDIES.find((c) => c.slug === slug))
  .filter((c): c is CaseStudy => c !== undefined)
  .slice(0, 3);

/** One headline package per group: the recommended one, or the first listed. */
const HEADLINE_PACKAGES = PACKAGE_GROUPS.map((group) => ({
  group,
  pkg: PACKAGES.find((p) => p.group === group.key && p.recommended) ?? PACKAGES.find((p) => p.group === group.key),
})).filter((row): row is { group: (typeof PACKAGE_GROUPS)[number]; pkg: Package } => row.pkg !== undefined);

/** Payment and third-party terms shown under the package cards; first two terms if the titles change. */
const PICKED_TERMS = STANDARD_TERMS.filter((t) => t.title.startsWith('50%') || t.title.startsWith('Third-party'));
const SHEET_TERMS = PICKED_TERMS.length === 2 ? PICKED_TERMS : STANDARD_TERMS.slice(0, 2);

/** Four questions here; the full list is on /contact. */
const HOME_FAQS = FAQS.slice(0, 4);

/** A content price string with a muted "From". */
function ServicePrice({ value }: { value: string }) {
  const from = value.startsWith('From ');
  const rest = from ? value.slice(5) : value;
  return (
    <span className="svc-card__price">
      {from && <span className="from">From </span>}
      {rest}
    </span>
  );
}

export default function Home() {
  useSeo(COPY.seo.home.title, COPY.seo.home.description);
  const { settings } = useSite();
  const home = COPY.home;

  return (
    <div className="page-home">
      <PageHero
        home
        eyebrow={home.eyebrow}
        titleId="hero-title"
        title={<Headline text={home.headline} words={3} />}
        lead={home.sub}
        aside={
          <StatChips
            aria-label={indexLabel('01')}
            items={[
              { value: ABOUT.yearsExperience, label: home.facts.experienceValue, grad: true },
              { value: home.facts.replies, label: settings.responseTime },
              { value: OWNER.location, label: home.facts.servingValue },
              { value: home.facts.stack, label: home.facts.stackValue },
            ]}
          />
        }
      >
        <div className="btn-row">
          <Button as="link" to="/contact?kind=quote" variant="primary">
            {home.primaryCta}
          </Button>
          <WhatsAppButton />
        </div>
        <AvailabilityLine />
      </PageHero>

      {/* Sectors */}
      <section className="section--tight band--page sectors" aria-label={home.sectorsLabel}>
        <div className="container">
          <Reveal className="sectors__row">
            <span className="sectors__label">{home.sectorsLabel}</span>
            <ul className="tag-row">
              {home.sectors.map((s) => (
                <li className="tag" key={s.sector}>
                  {s.sector}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section band--page" id="services">
        <div className="container">
          <Reveal className="section__row">
            <SectionHeader eyebrow={indexLabel('02')} title={COPY.services.title} intro={home.servicesIntro} />
            <Button as="link" to="/services">
              {home.allServices}
            </Button>
          </Reveal>
          <div className="cards cards--3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 70}>
                <Link className="card card--hover svc-card" data-group={s.group} to={`/services/${s.slug}`}>
                  <span className="card__accent" aria-hidden="true" />
                  <span className="tag">{SERVICE_GROUPS[s.group].label}</span>
                  <h3>{s.name}</h3>
                  <p>{s.tagline}</p>
                  <span className="svc-card__meta">
                    <ServicePrice value={s.priceFrom} />
                    <span className="svc-card__arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section band--dark" id="process">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={indexLabel('03')} title={home.processTitle} intro={home.processIntro} />
          </Reveal>
          <ProcessSteps steps={PROCESS} outputLabel={home.outputLabel} />
        </div>
      </section>

      {/* Pricing */}
      <section className="section band--page" id="pricing">
        <div className="container">
          <Reveal className="section__row">
            <SectionHeader eyebrow={indexLabel('04')} title={home.pricingTitle} intro={home.pricingIntro} />
            <Button as="link" to="/pricing">
              {home.fullPriceSheet}
            </Button>
          </Reveal>
          <div className="cards cards--4 pricing-cards">
            {HEADLINE_PACKAGES.map(({ group, pkg }, i) => (
              <Reveal key={pkg.slug} delay={i * 70}>
                <PackageCard pkg={pkg} groupLabel={group.label} limit={4} />
              </Reveal>
            ))}
          </div>
          <div className="split home-terms">
            {SHEET_TERMS.map((term, i) => (
              <Reveal className="card" key={term.title} delay={i * 80}>
                <h3>{term.title}</h3>
                <p className="mt-2">{term.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal as="ul" className="notes-list">
            {PRICING_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Work */}
      <section className="section" id="work">
        <div className="container">
          <Reveal className="section__row">
            <SectionHeader eyebrow={indexLabel('05')} title={home.workTitle} intro={home.workIntro} />
            <Button as="link" to="/work">
              {home.allWork}
            </Button>
          </Reveal>
          <div className="cards cards--3">
            {SELECTED_WORK.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <CaseCard study={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section band--page" id="about">
        <div className="container">
          <div className="split split--wide">
            <Reveal>
              <SectionHeader eyebrow={indexLabel('06')} title={home.whyTitle} />
              <div className="prose">
                <p>{home.whyIntro}</p>
                <p>{home.whyBody}</p>
              </div>
              <div className="btn-row mt-8">
                <Button as="link" to="/about">
                  {home.moreAbout}
                </Button>
              </div>
            </Reveal>
            <Reveal className="card card--dark about-card" delay={100}>
              <p className="italic-line">{COPY.about.closingLine}</p>
              <p className="about-phone">
                <a className="wa-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <span className="word">{COPY.shell.whatsappWord}</span>
                  <span className="num">{OWNER.phoneDisplay}</span>
                </a>
              </p>
              <DefinitionList
                className="about-card__facts"
                aria-label={indexLabel('06')}
                items={[
                  { term: home.facts.based, detail: ABOUT.location },
                  { term: home.facts.qualification, detail: home.facts.qualificationValue },
                  { term: home.facts.stack, detail: home.facts.stackValue },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <ContactSection kind="quote" sourcePage="/">
        <h3>{home.faqTitle}</h3>
        <FaqList items={HOME_FAQS} />
      </ContactSection>
    </div>
  );
}
