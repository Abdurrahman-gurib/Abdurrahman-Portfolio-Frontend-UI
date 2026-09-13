import type { ReactNode } from 'react';
import { COPY } from '../content/copy';
import { AvailabilityLine } from './AvailabilityLine';
import { Button } from './Button';
import { Reveal } from './Reveal';
import { WhatsAppButton } from './WhatsAppButton';

export interface CtaBandProps {
  eyebrow?: string;
  title: string;
  body?: string;
  /** Primary button target. Default /contact. */
  to?: string;
  /** Primary button label. Default "Request a quote". */
  label?: string;
  /** Pre-filled WhatsApp opening message. */
  whatsappMessage?: string;
  /** Extra content under the text (a contact strip, a link). */
  children?: ReactNode;
  id?: string;
  className?: string;
}

/** Dark gradient call-to-action card with the primary and WhatsApp buttons. */
export function CtaBand({ eyebrow, title, body, to = '/contact', label, whatsappMessage, children, id, className }: CtaBandProps) {
  return (
    <section className={['section', className ?? ''].filter(Boolean).join(' ')} id={id}>
      <div className="container">
        <Reveal className="cta-band on-dark">
          <div className="cta-band__grid">
            <div>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              <h2>{title}</h2>
              {body && <p className="mt-4">{body}</p>}
              <AvailabilityLine />
              {children}
            </div>
            <div className="btn-row">
              <Button as="link" to={to} variant="primary">
                {label ?? COPY.nav.cta}
              </Button>
              <WhatsAppButton message={whatsappMessage} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
