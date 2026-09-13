import type { ReactNode } from 'react';
import type { EnquiryKind } from '../lib/api';
import { COPY } from '../content/copy';
import { AvailabilityLine } from './AvailabilityLine';
import { ContactLadder } from './ContactLadder';
import { EnquiryForm } from './EnquiryForm';
import { Reveal } from './Reveal';
import { SectionHeader } from './SectionHeader';

export interface ContactSectionProps {
  /** Pre-sets the segmented "I need" control: quote (default), audit (security and network pages), callback (about). */
  kind?: EnquiryKind;
  /** Service slug to pre-select in the form. */
  service?: string;
  /** Package slug to pre-select; implies its service. */
  package?: string;
  /** Section title. Defaults to the home page's "Tell me what you need". */
  title?: string;
  /** Short line under the title. Defaults to the home page's contact intro. */
  intro?: string;
  /** Pre-filled WhatsApp opening message for the ladder link and button. */
  whatsappMessage?: string;
  /** Recorded with the enquiry. Defaults to the current path and query. */
  sourcePage?: string;
  /** Anything else that belongs in this section (a related link, a short FAQ), rendered under the form. */
  children?: ReactNode;
  className?: string;
}

/**
 * The contact foot of every public page except /contact: head, the ways to reach me in a glass card,
 * the enquiry form in a glass card, pre-set to the page's context.
 */
export function ContactSection({ kind, service, package: pkg, title, intro, whatsappMessage, sourcePage, children, className }: ContactSectionProps) {
  const cls = ['section', 'contact-foot', className ?? ''].filter(Boolean).join(' ');
  return (
    <section className={cls} id="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal>
          <SectionHeader eyebrow={COPY.contact.title} title={title ?? COPY.home.contactTitle} intro={intro ?? COPY.home.contactIntro} id="contact-title">
            <AvailabilityLine className="mt-4" />
          </SectionHeader>
        </Reveal>
        <div className="contact-foot__grid">
          <Reveal className="contact-foot__ladder">
            <ContactLadder message={whatsappMessage} />
          </Reveal>
          <Reveal className="contact-foot__form card card--strong card--pad-lg" delay={80}>
            <EnquiryForm kind={kind} service={service} package={pkg} sourcePage={sourcePage} heading="h3" />
          </Reveal>
        </div>
        {children && <Reveal className="contact-foot__more">{children}</Reveal>}
      </div>
    </section>
  );
}
