import { Link } from 'react-router-dom';
import { COPY } from '../content/copy';
import { SERVICES } from '../content/services';
import { OWNER, TEL_LINK, mailtoLink, whatsappLink } from '../content/site';
import { AvailabilityLine } from './AvailabilityLine';

/** The site footer (DESIGN.md §6.14): band, strong top rule, brand / index / services / contact, legal row.
 *  Legal row: copyright left, the back-office link right. No colophon; a Privacy link is added only once a policy page exists. */
export function Footer() {
  const year = new Date().getFullYear();
  const linkedinLabel = OWNER.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">
          <div className="footer__brand">
            <div className="name">{OWNER.name}</div>
            <p>{COPY.footer.line}</p>
            <div className="addr">
              {OWNER.title} · {OWNER.location}
            </div>
            <AvailabilityLine />
          </div>

          <div className="footer__col footer__col--index">
            <h4>{COPY.footer.indexHeading}</h4>
            <ul>
              {COPY.nav.index.map((item) => (
                <li key={item.n}>
                  <Link to={item.to}>
                    <span className="n">{item.n}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col footer__col--services">
            <h4>{COPY.footer.servicesHeading}</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col footer__col--contact">
            <h4>{COPY.footer.contactHeading}</h4>
            <ul>
              <li>
                <a className="wa-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <span className="word">{COPY.shell.whatsappWord}</span>
                  <span className="num">{OWNER.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={mailtoLink()}>{OWNER.email}</a>
              </li>
              <li>
                <a href={TEL_LINK}>
                  <span className="mono">{OWNER.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={OWNER.linkedin} target="_blank" rel="noopener noreferrer">
                  {linkedinLabel}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__legal">
            <span>{COPY.footer.copyright.replace('{year}', String(year))}</span>
            <Link to="/backoffice">{COPY.footer.backofficeLink}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
