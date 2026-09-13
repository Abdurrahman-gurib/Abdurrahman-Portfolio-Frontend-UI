import { Link } from 'react-router-dom';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { CASE_STUDIES } from '../content/work';
import type { CaseStudy } from '../content/types';
import { AvailabilityLine, Breadcrumb, Button, ContactStrip, DefinitionList, SectionHeader, WhatsAppButton } from '../components';
import '../styles/pages/work.css';

const SECTION_INDEX = '05';

/**
 * One work entry (DESIGN.md §7.5), text only. DOM order is index, title, dossier, text so phones read the
 * project name before its metadata; at >= 1024px work.css places index + dossier in cols 1–3 and title + text
 * in cols 5–12. `n` is the entry's position in CASE_STUDIES, so the number matches the home page and the case page.
 */
function WorkEntry({ study, n }: { study: CaseStudy; n: number }) {
  const L = COPY.work.labels;
  const index = `${SECTION_INDEX}.${n}`;
  const titleId = `work-${study.slug}`;
  return (
    <li className="grid work__entry" aria-labelledby={titleId}>
      <span className="eyebrow work__index">
        <span className="n">{index}</span>
      </span>
      <h3 className="work__title" id={titleId}>
        <Link to={`/work/${study.slug}`}>{study.title}</Link>
      </h3>
      <div className="work__dossier">
        <DefinitionList
          aria-label={`${study.title}: ${L.context}, ${L.period}, ${L.stack}`}
          items={[
            { term: L.context, detail: study.context },
            { term: L.period, detail: <span className="mono">{study.period}</span> },
            { term: L.stack, detail: study.stack.join(' · ') },
          ]}
        />
      </div>
      <div className="work__body">
        <div className="work__text">
          <p>
            <span className="work__label">{L.problem}</span>
            {study.problem}
          </p>
          <p>
            <span className="work__label">{L.approach}</span>
            {study.approach}
          </p>
          <p>
            <span className="work__label">{L.outcome}</span>
            {study.outcome}
          </p>
        </div>
        {study.facts && study.facts.length > 0 && (
          <DefinitionList
            className="work__facts"
            tight
            aria-label={`${study.title}: ${L.facts}`}
            items={study.facts.map((f) => ({ term: f.label, detail: f.value }))}
          />
        )}
        <Button as="link" to={`/work/${study.slug}`} variant="text" className="work__more" aria-label={`${COPY.work.readCase}: ${study.title}`}>
          {COPY.work.readCase}
        </Button>
      </div>
    </li>
  );
}

/** /work: the numbered editorial list of case studies (05.1 …), then the contact foot. */
export default function Work() {
  useSeo(COPY.seo.work.title, COPY.seo.work.description);
  return (
    <div className="container page-work">
      <section className="section section--first">
        <Breadcrumb items={[{ label: COPY.work.title }]} />
        <div className="grid">
          <div className="hero__main">
            <span className="eyebrow">
              <span className="n">{SECTION_INDEX}</span> — {COPY.work.title}
            </span>
            <h1 tabIndex={-1}>{COPY.work.headline}</h1>
            <p className="lead">{COPY.work.intro}</p>
          </div>
          <div className="hero__facts">
            <dl className="aside">
              <dt>{COPY.work.noteLabel}</dt>
              <dd>{COPY.work.note}</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="section work__section" aria-label={COPY.work.headline}>
        <ol className="work__list">
          {CASE_STUDIES.map((study) => (
            <WorkEntry key={study.slug} study={study} n={CASE_STUDIES.indexOf(study) + 1} />
          ))}
        </ol>
      </section>

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
          </div>
        </div>
      </section>
    </div>
  );
}
