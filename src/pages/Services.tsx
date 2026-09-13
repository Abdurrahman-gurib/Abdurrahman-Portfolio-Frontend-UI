import { Link } from 'react-router-dom';
import { useSeo, useSite } from '../lib/hooks';
import { COPY } from '../content/copy';
import { SERVICES, SERVICE_GROUPS } from '../content/services';
import { PROCESS } from '../content/about';
import { OWNER } from '../content/site';
import type { ServiceGroup } from '../content/types';
import { Breadcrumb, SectionHeader, Button, WhatsAppButton, AvailabilityLine, DefinitionList } from '../components';
import '../styles/pages/services.css';

const S = COPY.services;
const GROUP_ORDER = Object.keys(SERVICE_GROUPS) as ServiceGroup[];

/** Sub-number in the 02 section, DESIGN.md §5.4 format: "02.1" … "02.13" (no zero-pad). */
function serviceNumber(index: string): string {
  return `02.${Number(index)}`;
}

/** Label of a numbered index entry (COPY.nav.index), e.g. "03" -> "Process". */
function indexLabel(n: string): string {
  return COPY.nav.index.find((item) => item.n === n)?.label ?? '';
}

/**
 * /services — the 02 section of the document: one sticky head, every service as a numbered ruled row,
 * grouped under the SERVICE_GROUPS headings. Then 03 Process and 07 Contact.
 */
export default function Services() {
  useSeo(COPY.seo.services.title, COPY.seo.services.description);
  const { settings } = useSite();

  const facts = [
    { term: S.factServices, detail: <span className="mono">{SERVICES.length}</span> },
    { term: S.factResponse, detail: `${S.factRepliesPrefix} ${settings.responseTime}` },
    { term: S.factPricing, detail: S.factPricingValue },
    { term: S.factBased, detail: OWNER.location },
  ];

  return (
    <div className="container page-services">
      <section className="section section--first">
        <Breadcrumb items={[{ label: S.title }]} />
        <div className="grid">
          <div className="hero__main">
            <span className="eyebrow">
              <span className="n">02</span> — {S.title}
            </span>
            <h1>{S.headline}</h1>
            <p className="lead">{S.intro}</p>
            <div className="btn-row">
              <Button as="link" to="/contact" variant="primary">
                {COPY.nav.cta}
              </Button>
              <WhatsAppButton />
            </div>
            <AvailabilityLine />
          </div>
          <div className="hero__facts">
            <DefinitionList items={facts} aria-label={S.factsLabel} />
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="grid">
          <SectionHeader title={S.listTitle} intro={COPY.home.servicesIntro} />
          <div className="section__body stack--12">
            {GROUP_ORDER.map((key) => {
              const group = SERVICE_GROUPS[key];
              const list = SERVICES.filter((service) => service.group === key);
              if (list.length === 0) return null;
              const headingId = `group-${key}`;
              return (
                <div className="svc-group" key={key}>
                  <h3 id={headingId}>{group.label}</h3>
                  <p className="small">{group.blurb}</p>
                  <ul className="rows" aria-labelledby={headingId}>
                    {list.map((service) => (
                      <li key={service.slug}>
                        <Link className="row-link" to={`/services/${service.slug}`}>
                          <span className="idx">{serviceNumber(service.index)}</span>
                          <span>
                            <h4>{service.name}</h4>
                            <p>{service.tagline}</p>
                            <span className="stack">{service.tools.slice(0, 3).join(' · ')}</span>
                          </span>
                          <span className="price">{service.priceFrom}</span>
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
          </div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="grid">
          <SectionHeader index="03" eyebrow={indexLabel('03')} title={COPY.home.processTitle} intro={S.processIntro} />
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

      <section className="section" id="contact">
        <div className="grid">
          <SectionHeader index="07" eyebrow={indexLabel('07')} title={COPY.home.contactTitle} />
          <div className="section__body">
            <p className="measure">{S.contactBody}</p>
            <div className="btn-row mt-8">
              <Button as="link" to="/contact" variant="primary">
                {COPY.nav.cta}
              </Button>
              <WhatsAppButton />
            </div>
            <AvailabilityLine />
          </div>
        </div>
      </section>
    </div>
  );
}
