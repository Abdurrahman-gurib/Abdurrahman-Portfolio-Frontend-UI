import { useState } from 'react';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { ABOUT, AWARDS, CERTIFICATIONS, COMMITMENTS, EDUCATION, TIMELINE } from '../content/about';
import type { Credential } from '../content/types';
import { OWNER, whatsappLink } from '../content/site';
import { AvailabilityLine, Breadcrumb, Button, ContactStrip, DefinitionList, SectionHeader, WhatsAppButton } from '../components';
import '../styles/pages/about.css';

const SECTION_INDEX = '06';

/** Compact ruled credential rows: title, issuer, year (mono). */
function CredentialList({ items, label }: { items: Credential[]; label: string }) {
  return (
    <ul className="about__creds" aria-label={label}>
      {items.map((c) => (
        <li key={`${c.title}-${c.issuer}`}>
          <span>
            <span className="what">{c.title}</span>
            <span className="who">{c.issuer}</span>
          </span>
          {c.year && <span className="yr">{c.year}</span>}
        </li>
      ))}
    </ul>
  );
}

/**
 * /about: headline, bio, facts, timeline, credentials, awards, tools, commitments, contact foot (DESIGN.md §7.6).
 * The opening is three grid items in DOM order intro, facts, prose: below 1024px the facts sit directly under the
 * lead so a phone reader gets BASED / EXPERIENCE / LANGUAGES before six paragraphs; at >= 1024px about.css keeps the
 * facts in cols 9–12 beside the text.
 */
export default function About() {
  useSeo(COPY.seo.about.title, COPY.seo.about.description);
  const [hasPortrait, setHasPortrait] = useState(true);
  const F = COPY.about.facts;
  const S = COPY.about.sections;

  return (
    <div className="container page-about">
      <section className="section section--first">
        <Breadcrumb items={[{ label: COPY.about.title }]} />
        <div className="grid">
          <div className="hero__main">
            <span className="eyebrow">
              <span className="n">{SECTION_INDEX}</span> — {COPY.about.title}
            </span>
            <h1 tabIndex={-1}>{COPY.about.headline}</h1>
            <p className="lead">{COPY.about.lead}</p>
          </div>
          <div className="hero__facts about__facts-col">
            {hasPortrait && (
              <figure className="fig fig--portrait about__portrait">
                <img src="/portrait.jpg" alt={COPY.shell.portraitAlt} onError={() => setHasPortrait(false)} />
                <figcaption>
                  {OWNER.name} · {ABOUT.location}
                </figcaption>
              </figure>
            )}
            <DefinitionList
              className="about__facts"
              aria-label={`${F.location}, ${F.experience}, ${F.languages}`}
              items={[
                { term: F.location, detail: ABOUT.location },
                { term: F.experience, detail: <span className="mono">{ABOUT.yearsExperience}</span> },
                {
                  term: F.languages,
                  detail: ABOUT.languages.map((l) => (
                    <span className="lines" key={l}>
                      {l}
                    </span>
                  )),
                },
              ]}
            />
          </div>
          <div className="about__body">
            <div className="prose about__prose">
              {ABOUT.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="about__closing">
              <p className="italic-line">{COPY.about.closingLine}</p>
              {/* DESIGN.md §6.4: WhatsApp is the word, the number and the green, never an icon */}
              <a className="wa-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <span className="word">{COPY.shell.whatsappWord}</span>
                <span className="num">{OWNER.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="timeline">
        <div className="grid">
          <SectionHeader index={`${SECTION_INDEX}.1`} eyebrow={S.timeline} title={S.timeline} intro={S.timelineIntro} />
          <div className="section__body">
            <ol className="about__timeline">
              {TIMELINE.map((t) => (
                <li key={`${t.period}-${t.org}`}>
                  <span className="when">{t.period}</span>
                  <div>
                    <h3>{t.role}</h3>
                    <p className="org">{t.org}</p>
                    <p>{t.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section" id="education">
        <div className="grid">
          <SectionHeader index={`${SECTION_INDEX}.2`} eyebrow={S.education} title={S.education} intro={S.educationIntro} />
          <div className="section__body">
            <div className="about__subgroup">
              <h3>{S.degrees}</h3>
              <CredentialList items={EDUCATION} label={S.degrees} />
            </div>
            <div className="about__subgroup">
              <h3>{S.certifications}</h3>
              <CredentialList items={CERTIFICATIONS} label={S.certifications} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="awards">
        <div className="grid">
          <SectionHeader index={`${SECTION_INDEX}.3`} eyebrow={S.awards} title={S.awards} intro={S.awardsIntro} />
          <div className="section__body">
            <ul className="about__awards" aria-label={S.awards}>
              {AWARDS.map((a) => (
                <li key={a.title}>
                  <span>{a.title}</span>
                  <span className="yr">{a.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="tools">
        <div className="grid">
          <SectionHeader index={`${SECTION_INDEX}.4`} eyebrow={S.tools} title={S.tools} intro={S.toolsIntro} />
          <div className="section__body">
            <DefinitionList className="about__tools" aria-label={S.tools} items={ABOUT.tools.map((g) => ({ term: g.group, detail: g.items.join(' · ') }))} />
          </div>
        </div>
      </section>

      <section className="section" id="commitments">
        <div className="grid">
          <SectionHeader index={`${SECTION_INDEX}.5`} eyebrow={S.commitments} title={S.commitments} intro={S.commitmentsIntro} />
          <div className="section__body">
            <ol className="about__principles">
              {COMMITMENTS.map((c) => (
                <li key={c.title}>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
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
