import { Fragment, type ReactNode } from 'react';
import { useSite } from '../lib/hooks';
import { COPY } from '../content/copy';
import { OWNER, TEL_LINK, mailtoLink, whatsappLink } from '../content/site';
import { Button } from './Button';
import { DefinitionList } from './DefinitionList';

const C = COPY.contact;

export interface ContactLadderProps {
  /** Pre-filled WhatsApp opening message for the link and the button. */
  message?: string;
  /** Render the filled WhatsApp block button under the ladder (DESIGN.md §7.7). Default true. */
  button?: boolean;
  className?: string;
}

/** Channel hrefs come from site.ts; labels, values and hints from copy.ts. Every value is mono (a number, an address or a URL). */
function channelHref(label: string, message?: string): { href: string; external: boolean; wa: boolean } {
  switch (label) {
    case 'WhatsApp':
      return { href: whatsappLink(message), external: true, wa: true };
    case 'Phone':
      return { href: TEL_LINK, external: false, wa: false };
    case 'LinkedIn':
      return { href: OWNER.linkedin, external: true, wa: false };
    default:
      return { href: mailtoLink(), external: false, wa: false };
  }
}

/** An address or URL with a break opportunity after each "@" and "/", so a narrow column never splits a word. */
function withBreaks(value: string): ReactNode {
  const parts: string[] = [];
  let start = 0;
  for (let i = 0; i < value.length; i += 1) {
    if ((value[i] === '@' || value[i] === '/') && i + 1 < value.length) {
      parts.push(value.slice(start, i + 1));
      start = i + 1;
    }
  }
  parts.push(value.slice(start));
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {part}
    </Fragment>
  ));
}

/**
 * The contact ladder (DESIGN.md §6.9 "Contact ladder"): dl.spec with WhatsApp (green link, "fastest"), phone, email,
 * LinkedIn, reply time and location, then the filled WhatsApp block button. Sits beside the enquiry form in the
 * 07 section of every public page.
 */
export function ContactLadder({ message, button = true, className }: ContactLadderProps) {
  const site = useSite();
  const items = [
    ...C.channels.map((ch) => {
      const link = channelHref(ch.label, message);
      return {
        term: ch.label,
        detail: (
          <>
            <a
              className={link.wa ? 'wa-link' : undefined}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              <span className={link.wa ? 'num' : 'mono'}>{withBreaks(ch.value)}</span>
            </a>
            <span className="small ladder__hint">{ch.hint}</span>
          </>
        ),
      };
    }),
    { term: C.replyTimeLabel, detail: site.settings.responseTime },
    { term: C.locationLabel, detail: site.owner.location },
  ];

  return (
    <div className={['contact-ladder', className ?? ''].filter(Boolean).join(' ')}>
      <DefinitionList className="ladder" items={items} aria-label={COPY.shell.contactStripLabel} />
      {button && (
        <Button as="a" href={whatsappLink(message)} target="_blank" variant="whatsapp" block>
          {COPY.shell.whatsappWord} <span className="mono">{OWNER.phoneDisplay}</span>
        </Button>
      )}
    </div>
  );
}
