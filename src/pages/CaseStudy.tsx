import { Link, useParams } from 'react-router-dom';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { CASE_STUDIES } from '../content/work';
import { getService } from '../content/services';
import { OWNER } from '../content/site';
import { Button, ContactStrip, CtaBand, DefinitionList, Headline, PageHero, Reveal, SectionHeader, StatChips } from '../components';
import '../styles/pages/work.css';

/**
 * Which service each case study falls under (slugs from services.ts). Structural, not copy:
 * the content model has no relatedService field, so the mapping lives here until it is added there.
 */
const RELATED_SERVICE: Record<string, string> = {
  'garage-management-platform': 'software-development',
  'whatsapp-ai-concierge': 'automation-ai',
  'temenos-t24-payments': 'software-development',
  'uk-payroll-hr-features': 'software-development',
  'public-finance-applications': 'software-development',
  'web-vulnerability-scanner': 'cyber-security',
};

/** /work/:slug: the case study in three parts, with the stack and facts in a side card, then the related service. */
export default function CaseStudy() {
  const { slug = '' } = useParams<{ slug: string }>();
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  const service = study ? getService(RELATED_SERVICE[study.slug] ?? '') : undefined;
  const L = COPY.work.labels;
  const S = COPY.work.sections;

  useSeo(study ? `${study.title} · ${OWNER.name}` : COPY.notFound.seoTitle, study ? study.problem : undefined);

  if (!study) {
    return (
      <div className="page-work">
        <PageHero breadcrumb={[{ label: COPY.work.title, to: '/work' }, { label: COPY.notFound.eyebrow }]} eyebrow={COPY.work.title} title={COPY.work.notFoundTitle} lead={COPY.work.notFoundBody}>
          <div className="btn-row">
            <Button as="link" to="/work" variant="primary">
              {COPY.work.allWork}
            </Button>
          </div>
        </PageHero>
      </div>
    );
  }

  const facts = study.facts ?? [];

  return (
    <div className="page-work">
      <PageHero
        breadcrumb={[{ label: COPY.work.title, to: '/work' }, { label: study.title }]}
        eyebrow={COPY.work.title}
        titleId="case-title"
        title={<Headline text={study.title} words={2} />}
        lead={`${study.context} · ${study.period}`}
        aside={facts.length > 0 ? <StatChips aria-label={L.facts} items={facts.map((f, i) => ({ value: f.value, label: f.label, grad: i === 0 }))} /> : undefined}
      />

      <section className="section band--page">
        <div className="container">
          <div className="split split--side case-layout">
            <div className="case-main">
              <Reveal>
                <SectionHeader eyebrow={S.context} title={S.context} />
                <p className="prose">{study.problem}</p>
              </Reveal>
              <Reveal>
                <SectionHeader eyebrow={S.built} title={S.built} />
                <p className="prose">{study.approach}</p>
              </Reveal>
              <Reveal>
                <SectionHeader eyebrow={S.result} title={S.result} />
                <p className="prose">{study.outcome}</p>
              </Reveal>
            </div>
            <Reveal className="card card--strong case-side" delay={100}>
              <h3>{S.stack}</h3>
              <ul className="tag-row mt-4" aria-label={L.stack}>
                {study.stack.map((item) => (
                  <li className="tag tag--brand" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              {facts.length > 0 && (
                <DefinitionList className="mt-8" aria-label={`${study.title}: ${L.facts}`} items={facts.map((f) => ({ term: f.label, detail: f.value }))} />
              )}
              <DefinitionList
                className="mt-4"
                items={[
                  { term: L.context, detail: study.context },
                  { term: L.period, detail: study.period },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {service && (
        <section className="section">
          <div className="container">
            <div className="split split--side">
              <Reveal>
                <SectionHeader eyebrow={S.related} title={S.related} intro={COPY.work.relatedIntro} />
                <Link className="card card--hover svc-card" data-group={service.group} to={`/services/${service.slug}`}>
                  <span className="card__accent" aria-hidden="true" />
                  <h3>{service.name}</h3>
                  <p>{service.tagline}</p>
                  <span className="tag">{service.typicalTimeline}</span>
                  <span className="svc-card__meta">
                    <span className="svc-card__price">{service.priceFrom}</span>
                    <span className="svc-card__arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <CtaBand id="contact" eyebrow={COPY.contact.title} title={COPY.home.contactTitle} body={COPY.home.contactIntro}>
        <ContactStrip className="mt-6" />
        <p className="mt-6">
          <Link className="link-arrow" to="/work">
            {COPY.work.allWork}
          </Link>
        </p>
      </CtaBand>
    </div>
  );
}
