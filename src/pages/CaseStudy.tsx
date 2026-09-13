import { Link, useParams } from 'react-router-dom';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { CASE_STUDIES } from '../content/work';
import { getService } from '../content/services';
import { OWNER } from '../content/site';
import { AvailabilityLine, Breadcrumb, Button, ContactStrip, DefinitionList, SectionHeader, WhatsAppButton } from '../components';
import '../styles/pages/work.css';

const SECTION_INDEX = '05';

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

/** /work/:slug: the case-study dossier and ruled sections (DESIGN.md §7.5 detail), text only. */
export default function CaseStudy() {
  const { slug = '' } = useParams<{ slug: string }>();
  const position = CASE_STUDIES.findIndex((c) => c.slug === slug);
  const study = position >= 0 ? CASE_STUDIES[position] : undefined;
  const service = study ? getService(RELATED_SERVICE[study.slug] ?? '') : undefined;
  const L = COPY.work.labels;
  const S = COPY.work.sections;

  useSeo(study ? `${study.title} · ${OWNER.name}` : COPY.notFound.seoTitle, study ? study.problem : undefined);

  if (!study) {
    return (
      <div className="container page-work">
        <section className="section section--first">
          <Breadcrumb items={[{ label: COPY.work.title, to: '/work' }, { label: COPY.notFound.eyebrow }]} />
          <div className="grid">
            <div className="hero__main case__missing">
              <span className="eyebrow">
                <span className="n">{SECTION_INDEX}</span> — {COPY.work.title}
              </span>
              <h1 tabIndex={-1}>{COPY.work.notFoundTitle}</h1>
              <p className="lead">{COPY.work.notFoundBody}</p>
              <div className="btn-row">
                <Button as="link" to="/work">
                  {COPY.work.allWork}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const index = `${SECTION_INDEX}.${position + 1}`;
  const dossier = [
    { term: L.stack, detail: study.stack.join(' · ') },
    ...(study.facts ?? []).map((f) => ({ term: f.label, detail: f.value })),
  ];

  return (
    <div className="container page-work">
      <section className="section section--first">
        <Breadcrumb items={[{ label: COPY.work.title, to: '/work' }, { label: study.title }]} />
        <div className="grid">
          <div className="hero__main">
            <span className="eyebrow">
              <span className="n">{index}</span> — {COPY.work.title}
            </span>
            <h1 tabIndex={-1}>{study.title}</h1>
            <p className="meta case__meta">
              {study.context} · {study.period}
            </p>
          </div>
          <div className="hero__facts">
            <DefinitionList aria-label={`${study.title}: ${L.stack}, ${L.facts}`} items={dossier} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid">
          <SectionHeader index={index} eyebrow={S.context} title={S.context} />
          <div className="section__body prose case__prose">
            <p>{study.problem}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid">
          <SectionHeader index={index} eyebrow={S.built} title={S.built} />
          <div className="section__body prose case__prose">
            <p>{study.approach}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid">
          <SectionHeader index={index} eyebrow={S.result} title={S.result} />
          <div className="section__body prose case__prose">
            <p>{study.outcome}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid">
          <SectionHeader index={index} eyebrow={S.stack} title={S.stack} />
          <div className="section__body">
            <DefinitionList
              className="case__stack"
              aria-label={S.stack}
              items={study.stack.map((item, i) => ({ term: String(i + 1).padStart(2, '0'), detail: item }))}
            />
          </div>
        </div>
      </section>

      {service && (
        <section className="section">
          <div className="grid">
            <SectionHeader index={index} eyebrow={S.related} title={S.related} intro={COPY.work.relatedIntro} />
            <div className="section__body">
              <ul className="rows">
                <li>
                  <Link className="row-link" to={`/services/${service.slug}`}>
                    <span className="idx">02.{service.index}</span>
                    <div>
                      <h3>{service.name}</h3>
                      <p>{service.tagline}</p>
                      <span className="stack">{service.typicalTimeline}</span>
                    </div>
                    <span className="price">{service.priceFrom}</span>
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="section" id="contact">
        <div className="grid">
          <SectionHeader index="07" eyebrow={COPY.contact.title} title={COPY.home.contactTitle} intro={COPY.home.contactIntro} />
          <div className="section__body">
            <div className="btn-row">
              <Button as="link" to="/contact" variant="primary">
                {COPY.nav.cta}
              </Button>
              <WhatsAppButton />
            </div>
            <AvailabilityLine />
            <ContactStrip className="mt-8" />
            <p className="mt-8">
              <Link className="link-arrow" to="/work">
                {COPY.work.allWork}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
