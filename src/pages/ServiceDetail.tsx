import { Link, useParams } from 'react-router-dom';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { SERVICES, SERVICE_GROUPS, getService } from '../content/services';
import { PACKAGES, PRICING_NOTES } from '../content/packages';
import { PROCESS } from '../content/about';
import type { Package, Service } from '../content/types';
import { Breadcrumb, SectionHeader, Button, WhatsAppButton, AvailabilityLine, DefinitionList, Table, FaqList } from '../components';
import '../styles/pages/services.css';

const S = COPY.services;
const D = COPY.services.detail;

/** Sub-number in the 02 section, DESIGN.md §5.4 format: "02.1" … "02.13" (no zero-pad). */
function serviceNumber(service: Service): string {
  return `02.${Number(service.index)}`;
}

/** Label of a numbered index entry (COPY.nav.index), e.g. "07" -> "Contact". */
function indexLabel(n: string): string {
  return COPY.nav.index.find((item) => item.n === n)?.label ?? '';
}

/** /contact pre-filled for this service (and optionally one package). */
function contactHref(service: Service, pkg?: Package): string {
  const params = new URLSearchParams({ kind: service.enquiryKind, service: service.slug });
  if (pkg) params.set('package', pkg.slug);
  return `/contact?${params.toString()}`;
}

/** Row in the prev/next list at the foot of the page. */
function ServiceNavRow({ service, direction }: { service: Service; direction: string }) {
  return (
    <li>
      <Link className="row-link" to={`/services/${service.slug}`}>
        <span className="idx">{serviceNumber(service)}</span>
        <span>
          <span className="svc-nav__dir">{direction}</span>
          <h3>{service.name}</h3>
          <p>{service.tagline}</p>
        </span>
        <span className="price">{service.priceFrom}</span>
        <span className="arrow" aria-hidden="true">
          →
        </span>
      </Link>
    </li>
  );
}

/** Unknown slug: a not-found page in the same layout, with the way back to the index. Never throws. */
function ServiceNotFound() {
  return (
    <div className="container page-service">
      <section className="section section--first">
        <Breadcrumb items={[{ label: S.title, to: '/services' }, { label: COPY.notFound.eyebrow }]} />
        <div className="grid">
          <div className="hero__main">
            <span className="eyebrow">
              <span className="n">404</span> — {COPY.notFound.eyebrow}
            </span>
            <h1>{D.notFoundTitle}</h1>
            <p className="lead">{D.notFoundBody}</p>
            <div className="btn-row">
              <Button as="link" to="/services">
                {D.notFoundLink}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * /services/:slug — the 02.n entry: header with facts dl, scope, what you get, good for,
 * how it goes (03), typical cost (rate card from packages.ts), questions, other services, ask about this (07).
 */
export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const service = getService(slug);
  useSeo(service ? service.metaTitle : D.notFoundSeoTitle, service?.metaDescription);

  if (!service) return <ServiceNotFound />;

  const group = SERVICE_GROUPS[service.group];
  const position = SERVICES.findIndex((item) => item.slug === service.slug);
  const prev = position > 0 ? SERVICES[position - 1] : undefined;
  const next = position >= 0 && position < SERVICES.length - 1 ? SERVICES[position + 1] : undefined;

  // Related packages in the order the service lists them; unknown slugs are simply skipped.
  const related = service.relatedPackages
    .map((pkgSlug) => PACKAGES.find((pkg) => pkg.slug === pkgSlug))
    .filter((pkg): pkg is Package => pkg !== undefined);
  const monthly = related.find((pkg) => pkg.priceUnit === 'per month');

  const facts = [
    { term: D.facts.stack, detail: <span className="mono">{service.tools.join(' · ')}</span> },
    { term: D.facts.timeline, detail: <span className="mono">{service.typicalTimeline}</span> },
    { term: D.facts.from, detail: <span className="mono">{service.priceFrom}</span> },
    ...(monthly
      ? [
          {
            term: D.facts.monthly,
            detail: (
              <>
                <span className="mono">{monthly.price}</span> {monthly.priceUnit} · {monthly.name}
              </>
            ),
          },
        ]
      : []),
    { term: D.facts.group, detail: group.label },
  ];

  const number = serviceNumber(service);
  const whatsappMessage = D.whatsappMessage.replace('{service}', service.name);
  const faqs = service.faqs.map((faq) => ({ q: faq.q, a: faq.a }));

  return (
    <div className="container page-service">
      <section className="section section--first">
        <Breadcrumb items={[{ label: S.title, to: '/services' }, { label: service.name }]} />
        <div className="grid">
          <div className="hero__main">
            <span className="eyebrow">
              <span className="n">{number}</span> — {group.label}
            </span>
            <h1>{service.name}</h1>
            <p className="lead">{service.tagline}</p>
            <div className="btn-row">
              <Button as="link" to={contactHref(service)} variant="primary">
                {service.ctaLabel}
              </Button>
              <WhatsAppButton message={whatsappMessage} />
            </div>
            <AvailabilityLine />
          </div>
          <div className="hero__facts">
            <DefinitionList items={facts} aria-label={S.factsLabel} />
          </div>
        </div>
      </section>

      <section className="section" id="scope">
        <div className="grid">
          <SectionHeader index={number} eyebrow={D.scopeTitle} title={D.scopeTitle}>
            <dl className="aside">
              <dt>{D.facts.timeline}</dt>
              <dd>{service.typicalTimeline}</dd>
              <dt>{D.facts.from}</dt>
              <dd>{service.priceFrom}</dd>
            </dl>
          </SectionHeader>
          <div className="section__body prose">
            {service.intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="deliverables">
        <div className="grid">
          <SectionHeader index={number} eyebrow={D.deliverablesTitle} title={D.deliverablesTitle} />
          <div className="section__body prose">
            <ol>
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section" id="good-for">
        <div className="grid">
          <SectionHeader index={number} eyebrow={D.goodForTitle} title={D.goodForTitle} />
          <div className="section__body prose">
            <ul>
              {service.goodFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="grid">
          <SectionHeader index="03" eyebrow={indexLabel('03')} title={D.processTitle} intro={S.processIntro} />
          <div className="section__body">
            <ol className="steps">
              {PROCESS.map((step) => (
                <li key={step.index}>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                    <p className="out">
                      {S.outputLabel} — {step.output}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section" id="cost">
        <div className="grid">
          <SectionHeader index={number} eyebrow={D.costTitle} title={D.costTitle} intro={D.costIntro} />
          <div className="section__body">
            {related.length > 0 && (
              <Table sheet caption={`${D.costTitle} · ${service.name}`}>
                <thead>
                  <tr>
                    <th scope="col">{D.costCols.package}</th>
                    <th scope="col">{D.costCols.bestFor}</th>
                    <th scope="col">{D.costCols.delivery}</th>
                    <th scope="col" className="num">
                      {D.costCols.price}
                    </th>
                    <th scope="col">
                      <span className="visually-hidden">{D.costCols.request}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {related.map((pkg) => (
                    <tr key={pkg.slug}>
                      <td className="pkg">
                        {pkg.name}
                        {pkg.priceNote && <span className="sub">{pkg.priceNote}</span>}
                      </td>
                      <td className="includes" data-label={D.costCols.bestFor}>
                        {pkg.bestFor}
                      </td>
                      <td className="delivery" data-label={D.costCols.delivery}>
                        <span className="mono">{pkg.delivery}</span>
                      </td>
                      <td className="num" data-label={D.costCols.price}>
                        <span className="val">
                          {pkg.price}
                          <span className="unit">{pkg.priceUnit}</span>
                        </span>
                      </td>
                      <td className="cta">
                        <Link className="link-arrow" to={contactHref(service, pkg)}>
                          {D.costCols.request}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <div className="svc-sheet-foot">
              <p className="meta">{PRICING_NOTES[0]}</p>
              <Button as="link" to="/pricing">
                {D.allPrices}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section" id="questions">
          <div className="grid">
            <SectionHeader index={number} eyebrow={D.faqEyebrow} title={D.faqTitle} />
            <div className="section__body">
              <FaqList items={faqs} />
            </div>
          </div>
        </section>
      )}

      {(prev || next) && (
        <section className="section" id="other-services">
          <div className="grid">
            <SectionHeader index="02" eyebrow={D.otherTitle} title={D.otherTitle} intro={D.otherIntro} sticky={false} />
            <div className="section__body">
              <ul className="rows">
                {prev && <ServiceNavRow service={prev} direction={D.previous} />}
                {next && <ServiceNavRow service={next} direction={D.next} />}
              </ul>
              <p className="mt-6">
                <Link className="link-arrow" to="/services">
                  {D.allServices}
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="section" id="contact">
        <div className="grid">
          <SectionHeader index="07" eyebrow={indexLabel('07')} title={D.askTitle} />
          <div className="section__body">
            <p className="measure">{D.askBody}</p>
            <div className="btn-row mt-8">
              <Button as="link" to={contactHref(service)} variant="primary">
                {service.ctaLabel}
              </Button>
              <WhatsAppButton message={whatsappMessage} />
            </div>
            <AvailabilityLine />
          </div>
        </div>
      </section>
    </div>
  );
}
