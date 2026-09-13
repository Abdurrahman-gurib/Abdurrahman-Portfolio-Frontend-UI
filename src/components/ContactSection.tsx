import type { ReactNode } from 'react';
import type { EnquiryKind } from '../lib/api';
import { COPY } from '../content/copy';
import { AvailabilityLine } from './AvailabilityLine';
import { ContactLadder } from './ContactLadder';
import { EnquiryForm } from './EnquiryForm';
import { SectionHeader } from './SectionHeader';
import { sectionLabel } from './numbering';

export interface ContactSectionProps {
  /** Pre-sets the segmented "I need" control: quote (default), audit (security and network pages), callback (about). */
  kind?: EnquiryKind;
  /** Service slug to pre-select in the form. */
  service?: string;
  /** Package slug to pre-select; implies its service. */
  package?: string;
  /** Section title. Defaults to the home page's "Tell me what you need". */
  title?: string;
  /** Short muted line under the title. Defaults to the home page's contact intro. */
  intro?: string;
  /** Pre-filled WhatsApp opening message for the ladder link and button. */
  whatsappMessage?: string;
  /** Recorded with the enquiry. Defaults to the current path and query. */
  sourcePage?: string;
  /** Anything else that belongs in this section (a related link, a short FAQ), rendered under the form in cols 5–12. */
  children?: ReactNode;
  className?: string;
}

/**
 * 07 — Contact, the foot of every public page except /contact (DESIGN.md §7, §9.12): head in cols 1–3, the contact
 * ladder in cols 4–7, the enquiry form in cols 8–12 with its "I need" control pre-set to the page's context.
 * The form's submit is the page's one primary button, so nothing else in the section is .btn--primary.
 *
 *   <ContactSection />                                        home, /services, /pricing, /work, case studies
 *   <ContactSection kind="audit" service="cyber-security" />  security and network service pages
 *   <ContactSection kind="callback" />                        /about
 */
export function ContactSection({ kind, service, package: pkg, title, intro, whatsappMessage, sourcePage, children, className }: ContactSectionProps) {
  const cls = ['section', 'contact-foot', className ?? ''].filter(Boolean).join(' ');
  return (
    <section className={cls} id="contact" aria-labelledby="contact-title">
      <div className="grid">
        <SectionHeader
          index="07"
          eyebrow={sectionLabel('07')}
          title={title ?? COPY.home.contactTitle}
          intro={intro ?? COPY.home.contactIntro}
          id="contact-title"
        >
          <AvailabilityLine />
        </SectionHeader>
        <div className="contact-foot__ladder">
          <ContactLadder message={whatsappMessage} />
        </div>
        <div className="contact-foot__form">
          <EnquiryForm kind={kind} service={service} package={pkg} sourcePage={sourcePage} heading="h3" />
        </div>
        {children && <div className="contact-foot__more">{children}</div>}
      </div>
    </section>
  );
}
