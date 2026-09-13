/**
 * Static facts about the owner. Single source of truth for contact details in the UI.
 * (The API also exposes these at /api/site so emails and the SPA never disagree.)
 */
export const OWNER = {
  name: 'Abdurrahman Gurib',
  firstName: 'Abdurrahman',
  title: 'Senior Software Engineer & IT Consultant',
  location: 'Mauritius',
  email: 'abdurrahmangurib@gmail.com',
  phoneDisplay: '+230 5908 6131',
  phoneE164: '+23059086131',
  linkedin: 'https://www.linkedin.com/in/abdurrahman-g-863ab7238/',
} as const;

export const WHATSAPP_BASE = 'https://wa.me/23059086131';

/** Build a WhatsApp deep link with a pre-filled opening message. */
export function whatsappLink(message?: string): string {
  const text = message ?? `Hello ${OWNER.firstName}, I found your website and would like to discuss a project.`;
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

export function mailtoLink(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const qs = params.toString();
  return `mailto:${OWNER.email}${qs ? `?${qs}` : ''}`;
}

export const TEL_LINK = `tel:${OWNER.phoneE164}`;
