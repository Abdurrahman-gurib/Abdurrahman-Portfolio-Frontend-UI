import { Link } from 'react-router-dom';
import { useSeo, useSite } from '../lib/hooks';
import { COPY } from '../content/copy';
import { SERVICES, SERVICE_GROUPS } from '../content/services';
import { PROCESS } from '../content/about';
import { OWNER } from '../content/site';
import type { ServiceGroup } from '../content/types';
import { AvailabilityLine, Button, CtaBand, Headline, PageHero, ProcessSteps, Reveal, SectionHeader, StatChips, WhatsAppButton } from '../components';
import '../styles/pages/services.css';

const S = COPY.services;
const GROUP_ORDER = Object.keys(SERVICE_GROUPS) as ServiceGroup[];

function indexLabel(n: string): string {
  return COPY.nav.index.find((item) => item.n === n)?.label ?? '';
}

/** /services: every service as a glass card, grouped by category, then the process and a call to action. */
export default function Services() {
  useSeo(COPY.seo.services.title, COPY.seo.services.description);
  const { settings } = useSite();

  return (
    <div className="page-services">
      <PageHero
        breadcrumb={[{ label: S.title }]}
        eyebrow={S.title}
        titleId="services-title"
        title={<Headline text={S.headline} words={4} />}
        lead={S.intro}
        aside={
          <StatChips
            aria-label={S.factsLabel}
            items={[
              { value: SERVICES.length, label: S.factServices, grad: true },
              { value: S.factRepliesPrefix, label: settings.responseTime },
              { value: OWNER.location, label: S.factBased },
              { value: S.factPricing, label: S.factPricingValue },
            ]}
          />
        }
      >
        <div className="btn-row">
          <Button as="link" to="/contact" variant="primary">
            {COPY.nav.cta}
          </Button>
          <WhatsAppButton />
        </div>
        <AvailabilityLine />
      </PageHero>

      <section className="section band--page" id="services">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={S.title} title={S.listTitle} intro={COPY.home.servicesIntro} />
          </Reveal>
          {GROUP_ORDER.map((key) => {
            const group = SERVICE_GROUPS[key];
            const list = SERVICES.filter((service) => service.group === key);
            if (list.length === 0) return null;
            const headingId = `group-${key}`;
            return (
              <div className="svc-group" key={key}>
                <Reveal className="svc-group__head">
                  <h3 id={headingId}>{group.label}</h3>
                  <p>{group.blurb}</p>
                </Reveal>
                <div className="cards cards--3" role="list" aria-labelledby={headingId}>
                  {list.map((service, i) => (
                    <Reveal key={service.slug} delay={(i % 3) * 70} role="listitem">
                      <Link className="card card--hover svc-card" data-group={key} to={`/services/${service.slug}`}>
                        <span className="card__accent" aria-hidden="true" />
                        <h4>{service.name}</h4>
                        <p>{service.tagline}</p>
                        <ul className="tag-row" aria-label={S.detail.facts.stack}>
                          {service.tools.slice(0, 3).map((tool) => (
                            <li className="tag" key={tool}>
                              {tool}
                            </li>
                          ))}
                        </ul>
                        <span className="svc-card__meta">
                          <span className="svc-card__price">{service.priceFrom}</span>
                          <span className="svc-card__arrow" aria-hidden="true">
                            &rarr;
                          </span>
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section band--dark" id="process">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={indexLabel('03')} title={COPY.home.processTitle} intro={S.processIntro} />
          </Reveal>
          <ProcessSteps steps={PROCESS} outputLabel={S.outputLabel} as="h4" />
        </div>
      </section>

      <CtaBand id="contact" eyebrow={COPY.contact.title} title={COPY.home.contactTitle} body={S.contactBody} />
    </div>
  );
}
