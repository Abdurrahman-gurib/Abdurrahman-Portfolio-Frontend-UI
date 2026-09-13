import { Link } from 'react-router-dom';
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { Button } from '../components/Button';

/** 404. Text-first, hangs from column 1, lists the numbered index so the visitor can find the real page. */
export default function NotFound() {
  useSeo(COPY.notFound.seoTitle);
  return (
    <div className="container page-notfound">
      <section className="section section--first">
        <div className="grid">
          <div className="hero__main">
            <span className="eyebrow">
              <span className="n">404</span> — {COPY.notFound.eyebrow}
            </span>
            <h1>{COPY.notFound.title}</h1>
            <p className="lead">{COPY.notFound.body}</p>
            <div className="btn-row">
              <Button as="link" to="/">
                {COPY.notFound.home}
              </Button>
              <Button as="link" to="/contact" variant="primary">
                {COPY.notFound.contact}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid">
          <div className="section__body section__body--wide">
            <ul className="rows">
              {COPY.nav.index.map((item) => (
                <li key={item.n}>
                  <Link className="row-link" to={item.to}>
                    <span className="idx">{item.n}</span>
                    <h3>{item.label}</h3>
                    <span className="arrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
