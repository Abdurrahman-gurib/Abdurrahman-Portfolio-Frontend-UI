import { Link } from 'react-router-dom';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { Button, PageHero, Reveal } from '../components';

/** 404: a short page opening and cards for the pages that do exist. */
export default function NotFound() {
  useSeo(COPY.notFound.seoTitle);
  const pages = [{ label: COPY.shell.homeLabel, to: '/' }, ...COPY.nav.items];
  return (
    <div className="page-notfound">
      <PageHero eyebrow={COPY.notFound.eyebrow} titleId="nf-title" title={COPY.notFound.title} lead={COPY.notFound.body}>
        <div className="btn-row">
          <Button as="link" to="/contact" variant="primary">
            {COPY.notFound.contact}
          </Button>
          <Button as="link" to="/">
            {COPY.notFound.home}
          </Button>
        </div>
      </PageHero>

      <section className="section band--page">
        <div className="container">
          <div className="cards cards--3">
            {pages.map((item, i) => (
              <Reveal key={item.to} delay={(i % 3) * 60}>
                <Link className="card card--hover svc-card" to={item.to}>
                  <span className="card__accent" aria-hidden="true" />
                  <h3>{item.label}</h3>
                  <span className="svc-card__meta">
                    <span />
                    <span className="svc-card__arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
