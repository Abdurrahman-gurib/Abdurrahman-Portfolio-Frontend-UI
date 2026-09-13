import { useState } from 'react';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { ABOUT, AWARDS, CERTIFICATIONS, COMMITMENTS, EDUCATION, TIMELINE } from '../content/about';
import type { Credential } from '../content/types';
import { OWNER, whatsappLink } from '../content/site';
import { ContactStrip, CtaBand, DefinitionList, Headline, PageHero, Reveal, SectionHeader, StatChips } from '../components';
import '../styles/pages/about.css';

/** Credential rows: title, issuer, year. */
function CredentialList({ items, label }: { items: Credential[]; label: string }) {
  return (
    <ul className="creds" aria-label={label}>
      {items.map((c) => (
        <li key={`${c.title}-${c.issuer}`}>
          <span>
            <span className="what">{c.title}</span>
            <span className="who">{c.issuer}</span>
          </span>
          {c.year && <span className="tag">{c.year}</span>}
        </li>
      ))}
    </ul>
  );
}

/** /about: headline, bio, facts, timeline, credentials, awards, tools, commitments, call to action. */
export default function About() {
  useSeo(COPY.seo.about.title, COPY.seo.about.description);
  const [hasPortrait, setHasPortrait] = useState(true);
  const F = COPY.about.facts;
  const S = COPY.about.sections;

  return (
    <div className="page-about">
      <PageHero
        breadcrumb={[{ label: COPY.about.title }]}
        eyebrow={COPY.about.title}
        titleId="about-title"
        title={<Headline text={COPY.about.headline} words={3} />}
        lead={COPY.about.lead}
        aside={
          <div className="about-aside">
            {hasPortrait && (
              <figure className="fig fig--portrait about__portrait">
                <img src="/portrait.jpg" alt={COPY.shell.portraitAlt} onError={() => setHasPortrait(false)} />
                <figcaption>
                  {OWNER.name} · {ABOUT.location}
                </figcaption>
              </figure>
            )}
            <StatChips
              aria-label={`${F.location}, ${F.experience}, ${F.languages}`}
              items={[
                { value: ABOUT.yearsExperience, label: F.experience, grad: true },
                { value: OWNER.location, label: ABOUT.location },
                { value: F.languages, label: ABOUT.languages.join(' · '), wide: true },
              ]}
            />
          </div>
        }
      />

      <section className="section band--page" id="bio">
        <div className="container">
          <div className="split split--wide">
            <Reveal className="prose about__prose">
              {ABOUT.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
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
                aria-label={`${F.location}, ${F.experience}, ${F.languages}`}
                items={[
                  { term: F.location, detail: ABOUT.location },
                  { term: F.experience, detail: ABOUT.yearsExperience },
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
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="timeline">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={S.timeline} title={S.timeline} intro={S.timelineIntro} />
          </Reveal>
          <ol className="tl">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" key={`${t.period}-${t.org}`} delay={Math.min(i, 3) * 60}>
                <span className="tl__when">{t.period}</span>
                <div className="card card--strong tl__body">
                  <h3>{t.role}</h3>
                  <p className="tl__org">{t.org}</p>
                  <p>{t.summary}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section band--page" id="education">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={S.education} title={S.education} intro={S.educationIntro} />
          </Reveal>
          <div className="split">
            <Reveal className="card card--strong">
              <h3>{S.degrees}</h3>
              <CredentialList items={EDUCATION} label={S.degrees} />
            </Reveal>
            <Reveal className="card card--strong" delay={80}>
              <h3>{S.certifications}</h3>
              <CredentialList items={CERTIFICATIONS} label={S.certifications} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section band--dark" id="awards">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={S.awards} title={S.awards} intro={S.awardsIntro} />
          </Reveal>
          <ul className="cards cards--2 awards" aria-label={S.awards}>
            {AWARDS.map((a, i) => (
              <Reveal as="li" key={a.title} delay={(i % 2) * 70}>
                <div className="card card--dark award">
                  <span className="tag">{a.year}</span>
                  <p>{a.title}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section band--page" id="tools">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={S.tools} title={S.tools} intro={S.toolsIntro} />
          </Reveal>
          <div className="cards cards--3">
            {ABOUT.tools.map((g, i) => (
              <Reveal key={g.group} delay={(i % 3) * 70}>
                <div className="card tools-card">
                  <span className="card__accent" aria-hidden="true" />
                  <h3>{g.group}</h3>
                  <ul className="tag-row mt-4">
                    {g.items.map((item) => (
                      <li className="tag" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="commitments">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow={S.commitments} title={S.commitments} intro={S.commitmentsIntro} />
          </Reveal>
          <div className="cards cards--3">
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 70}>
                <div className="card card--strong principle">
                  <span className="card__accent" aria-hidden="true" />
                  <h3>{c.title}</h3>
                  <p className="mt-2">{c.body}</p>
                </div>
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
