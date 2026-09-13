import { Link, useParams } from 'react-router-dom';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { SERVICES, SERVICE_GROUPS, getService } from '../content/services';
import { PACKAGES, PRICING_NOTES } from '../content/packages';
import { PROCESS } from '../content/about';
import type { Package, Service } from '../content/types';
import {
  AvailabilityLine,
  Button,
  CtaBand,
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
import '../styles/pages/services.css';

const S = COPY.services;
const D = COPY.services.detail;

function indexLabel(n: string): string {
  return COPY.nav.index.find((item) => item.n === n)?.label ?? '';
}

/** /contact pre-filled for this service (and optionally one package). */
function contactHref(service: Service, pkg?: Package): string {
  const params = new URLSearchParams({ kind: service.enquiryKind, service: service.slug });
  if (pkg) params.set('package', pkg.slug);
  return `/contact?${params.toString()}`;
}

/** Card in the previous / next pair at the foot of the page. */
function ServiceNavCard({ service, direction }: { service: Service; direction: string }) {
  return (
    <Link className="card card--hover svc-card" data-group={service.group} to={`/services/${service.slug}`}>
      <span className="card__accent" aria-hidden="true" />
      <span className="tag tag--brand">{direction}</span>
      <h3>{service.name}</h3>
      <p>{service.tagline}</p>
      <span className="svc-card__meta">
        <span className="svc-card__price">{service.priceFrom}</span>
        <span className="svc-card__arrow" aria-hidden="true">
          &rarr;
        </span>
      </span>
    </Link>
  );
}

/** Unknown slug: a not-found page in the same layout, with the way back to the index. Never throws. */
function ServiceNotFound() {
  return (
    <div className="page-service">
      <PageHero breadcrumb={[{ label: S.title, to: '/services' }, { label: COPY.notFound.eyebrow }]} eyebrow={COPY.notFound.eyebrow} title={D.notFoundTitle} lead={D.notFoundBody}>
        <div className="btn-row">
          <Button as="link" to="/services" variant="primary">
            {D.notFoundLink}
          </Button>
        </div>
      </PageHero>
    </div>
  );
}

/** /services/:slug: scope, what you get, good for, how it goes, typical cost, questions, other services, ask about this. */
export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const service = getService(slug);
  useSeo(service ? service.metaTitle : D.notFoundSeoTitle, service?.metaDescription);

  if (!service) return <ServiceNotFound />;

  const group = SERVICE_GROUPS[service.group];
  const position = SERVICES.findIndex((item) => item.slug === service.slug);
  const prev = position > 0 ? SERVICES[position - 1] : undefined;
  const next = position >= 0 && position < SERVICES.length - 1 ? SERVICES[position + 1] : undefined;

  const related = service.relatedPackages
    .map((pkgSlug) => PACKAGES.find((pkg) => pkg.slug === pkgSlug))
    .filter((pkg): pkg is Package => pkg !== undefined);
  const monthly = related.find((pkg) => pkg.priceUnit === 'per month');

  const whatsappMessage = D.whatsappMessage.replace('{service}', service.name);
  const faqs = service.faqs.map((faq) => ({ q: faq.q, a: faq.a }));

  return (
    <div className="page-service">
      <PageHero
        breadcrumb={[{ label: S.title, to: '/services' }, { label: service.name }]}
        eyebrow={group.label}
        titleId="service-title"
        title={<Headline text={service.name} words={1} />}
        lead={service.tagline}
        aside={
          <StatChips
            aria-label={S.factsLabel}
            items={[
              { value: service.priceFrom, label: D.facts.from, grad: true },
              { value: service.typicalTimeline, label: D.facts.timeline },
              ...(monthly ? [{ value: monthly.price, label: `${D.facts.monthly} · ${monthly.name}` }] : []),
              { value: group.label, label: D.facts.group },
            ]}
          />
        }
      >
        <div className="btn-row">
          <Button as="link" to={contactHref(service)} variant="primary">
            {service.ctaLabel}
          </Button>
          <WhatsAppButton message={whatsappMessage} />
        </div>
        <AvailabilityLine />
      </PageHero>

      <section className="section band--page" id="scope">
        <div className="container">
          <div className="split split--side">
            <Reveal>
              <SectionHeader eyebrow={D.scopeTitle} title={D.scopeTitle} />
              <div className="prose">
                {service.intro.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
            <Reveal className="card card--strong svc-facts" delay={100}>
              <DefinitionList
                stack
                aria-label={S.factsLabel}
                items={[
                  { term: D.facts.timeline, detail: service.typicalTimeline },
                  { term: D.facts.from, detail: service.priceFrom },
                  {
                    term: D.facts.stack,
                    detail: (
                      <ul className="tag-row">
                        {service.tools.map((tool) => (
                          <li className="tag" key={tool}>
                            {tool}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="deliverables">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={D.deliverablesTitle} title={D.deliverablesTitle} />
          </Reveal>
          <Reveal className="card card--strong card--pad-lg">
            <ul className="checks checks--lg checks--grid">
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section band--page" id="good-for">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={D.goodForTitle} title={D.goodForTitle} />
          </Reveal>
          <div className="cards cards--3">
            {service.goodFor.map((item, i) => (
              <Reveal key={item} delay={(i % 3) * 70}>
                <div className="card goodfor-card">
                  <span className="card__accent" aria-hidden="true" />
                  <p>{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section band--dark" id="process">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={indexLabel('03')} title={D.processTitle} intro={S.processIntro} />
          </Reveal>
          <ProcessSteps steps={PROCESS} outputLabel={S.outputLabel} as="h4" />
        </div>
      </section>

      <section className="section band--page" id="cost">
        <div className="container">
          <Reveal className="section__row">
            <SectionHeader eyebrow={D.costTitle} title={D.costTitle} intro={D.costIntro} />
            <Button as="link" to="/pricing">
              {D.allPrices}
            </Button>
          </Reveal>
          {related.length > 0 && (
            <div className={`cards ${related.length >= 3 ? 'cards--3' : 'cards--2'}`}>
              {related.map((pkg, i) => (
                <Reveal key={pkg.slug} delay={(i % 3) * 70}>
                  <PackageCard pkg={pkg} />
                </Reveal>
              ))}
            </div>
          )}
          <p className="meta mt-8">{PRICING_NOTES[0]}</p>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section" id="questions">
          <div className="container">
            <div className="split split--side">
              <Reveal>
                <SectionHeader eyebrow={D.faqEyebrow} title={D.faqTitle} />
                <FaqList items={faqs} />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {(prev || next) && (
        <section className="section band--page" id="other-services">
          <div className="container">
            <Reveal className="section__row">
              <SectionHeader eyebrow={D.otherTitle} title={D.otherTitle} intro={D.otherIntro} />
              <Button as="link" to="/services">
                {D.allServices}
              </Button>
            </Reveal>
            <div className="cards cards--2">
              {prev && (
                <Reveal>
                  <ServiceNavCard service={prev} direction={D.previous} />
                </Reveal>
              )}
              {next && (
                <Reveal delay={80}>
                  <ServiceNavCard service={next} direction={D.next} />
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      <CtaBand id="contact" eyebrow={indexLabel('07')} title={D.askTitle} body={D.askBody} to={contactHref(service)} label={service.ctaLabel} whatsappMessage={whatsappMessage} />
    </div>
  );
}
