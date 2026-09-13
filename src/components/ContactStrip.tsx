import { OWNER, TEL_LINK, mailtoLink, whatsappLink } from '../content/site';
import { COPY } from '../content/copy';

export interface ContactStripProps {
  /** Pre-filled WhatsApp opening message. */
  message?: string;
  className?: string;
}

/** WhatsApp / email / phone / LinkedIn in one ruled mono row. Used under CTAs on several pages. */
export function ContactStrip({ message, className }: ContactStripProps) {
  const linkedinLabel = OWNER.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return (
    <ul className={['contact-strip', className ?? ''].filter(Boolean).join(' ')} aria-label={COPY.shell.contactStripLabel}>
      <li>
        <span className="k">{COPY.shell.whatsappWord}</span>
        <a className="wa-link" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
          <span className="num">{OWNER.phoneDisplay}</span>
        </a>
      </li>
      <li>
        <span className="k">{COPY.shell.emailLabel}</span>
        <a href={mailtoLink()}>{OWNER.email}</a>
      </li>
      <li>
        <span className="k">{COPY.shell.phoneLabel}</span>
        <a href={TEL_LINK}>{OWNER.phoneDisplay}</a>
      </li>
      <li>
        <span className="k">{COPY.shell.linkedinLabel}</span>
        <a href={OWNER.linkedin} target="_blank" rel="noopener noreferrer">
          {linkedinLabel}
        </a>
      </li>
    </ul>
  );
}
