import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { CASE_STUDIES } from '../content/work';
import { CaseCard, ContactStrip, CtaBand, Headline, PageHero, Reveal } from '../components';
import '../styles/pages/work.css';

/** /work: the case studies as glass cards, then the call to action. */
export default function Work() {
  useSeo(COPY.seo.work.title, COPY.seo.work.description);
  return (
    <div className="page-work">
      <PageHero
        breadcrumb={[{ label: COPY.work.title }]}
        eyebrow={COPY.work.title}
        titleId="work-title"
        title={<Headline text={COPY.work.headline} words={1} />}
        lead={COPY.work.intro}
        aside={
          <div className="card card--dark work-note">
            <span className="tag">{COPY.work.noteLabel}</span>
            <p className="mt-4">{COPY.work.note}</p>
          </div>
        }
      />

      <section className="section band--page work__section" aria-label={COPY.work.headline}>
        <div className="container">
          <div className="cards cards--2">
            {CASE_STUDIES.map((study, i) => (
              <Reveal key={study.slug} delay={(i % 2) * 80}>
                <CaseCard study={study} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand id="contact" eyebrow={COPY.contact.title} title={COPY.home.contactTitle} body={COPY.home.contactIntro}>
        <ContactStrip className="mt-6" />
      </CtaBand>
    </div>
  );
}
