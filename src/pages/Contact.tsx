import { Fragment, useEffect, useRef, useState } from 'react';
import type { FormEvent, MouseEvent, ReactNode, SyntheticEvent } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSeo, useSite } from '../lib/hooks';
import { api, ApiError, type EnquiryInput, type EnquiryKind, type EnquiryResult } from '../lib/api';
import { COPY, FAQS } from '../content/copy';
import { SERVICES } from '../content/services';
import { PACKAGES } from '../content/packages';
import { OWNER, TEL_LINK, mailtoLink, whatsappLink } from '../content/site';
import {
  AvailabilityLine,
  Button,
  CheckboxField,
  DefinitionList,
  FaqList,
  Headline,
  Notice,
  PageHero,
  Reveal,
  SectionHeader,
  SelectField,
  TextAreaField,
  TextField,
} from '../components';
import '../styles/pages/contact.css';

const C = COPY.contact;
const F = C.fields;
const V = C.validation;
const KINDS = C.kinds;

type FieldKey = keyof typeof F;
type Errors = Partial<Record<FieldKey, string>>;

interface Values {
  kind: EnquiryKind;
  name: string;
  company: string;
  email: string;
  phone: string;
  preferWhatsapp: boolean;
  service: string;
  package: string;
  budget: string;
  timeline: string;
  website: string;
  message: string;
}

/** Failed-submit summary above the fields: either a list of fields to fix, or one message (429, network). */
type Summary = { type: 'fields'; keys: FieldKey[] } | { type: 'message'; text: string };

/** Document order of the fields, for the error summary. The optional ones sit inside "Add details". */
const FIELD_ORDER: FieldKey[] = [
  'name',
  'phone',
  'preferWhatsapp',
  'email',
  'service',
  'message',
  'company',
  'package',
  'budget',
  'timeline',
  'website',
];

/** Fields collapsed under the "Add details (optional)" disclosure. */
const MORE_FIELDS: FieldKey[] = ['company', 'package', 'budget', 'timeline', 'website'];

/** Labels as printed on this page: the number field is "WhatsApp or phone" here. */
function labelFor(key: FieldKey): string {
  return key === 'phone' ? C.phoneLabel : F[key].label;
}

/** Questions shown on this page, in this order (a subset of the site FAQ). */
const CONTACT_FAQ_QUESTIONS = [
  'How do I start?',
  'How do you charge?',
  'How do I pay?',
  'Do you work with businesses outside Mauritius?',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_OPTIONS = SERVICES.map((s) => ({ value: s.slug, label: s.name }));
const BUDGET_OPTIONS = C.budgets.map((b) => ({ value: b, label: b }));
const TIMELINE_OPTIONS = C.timelines.map((t) => ({ value: t, label: t }));

function isKind(value: string | null): value is EnquiryKind {
  return KINDS.some((k) => k.value === value);
}

/** Reads ?kind=, ?service= and ?package= (a valid package implies its service). */
function readPrefill(params: URLSearchParams): Partial<Pick<Values, 'kind' | 'service' | 'package'>> {
  const out: Partial<Pick<Values, 'kind' | 'service' | 'package'>> = {};
  const kind = params.get('kind');
  if (isKind(kind)) out.kind = kind;
  const pkg = PACKAGES.find((p) => p.slug === params.get('package'));
  const service = SERVICES.find((s) => s.slug === params.get('service'))?.slug ?? pkg?.serviceSlug;
  if (service) out.service = service;
  if (pkg && (!out.service || pkg.serviceSlug === out.service)) out.package = pkg.slug;
  return out;
}

function initialValues(params: URLSearchParams): Values {
  return {
    kind: 'quote',
    name: '',
    company: '',
    email: '',
    phone: '',
    preferWhatsapp: false,
    service: '',
    package: '',
    budget: '',
    timeline: '',
    website: '',
    message: '',
    ...readPrefill(params),
  };
}

/** A number I can dial or message: at least seven digits once spaces, dashes and brackets are ignored. */
function looksLikePhone(value: string): boolean {
  return value.replace(/\D/g, '').length >= 7;
}

/** Client-side rules: name >= 2, a reachable number, valid email (the API requires one), service, message >= 10. */
function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = V.name;
  if (!looksLikePhone(v.phone)) e.phone = V.phone;
  if (!EMAIL_RE.test(v.email.trim())) e.email = V.email;
  if (!v.service) e.service = V.service;
  if (v.message.trim().length < 10) e.message = V.message;
  return e;
}

function orderedKeys(errors: Errors): FieldKey[] {
  return FIELD_ORDER.filter((k) => errors[k]);
}

function isFieldKey(key: string): key is FieldKey {
  return (FIELD_ORDER as string[]).includes(key);
}

function hasMoreErrors(errors: Errors): boolean {
  return MORE_FIELDS.some((k) => errors[k]);
}

function optional(value: string): string | undefined {
  const t = value.trim();
  return t ? t : undefined;
}

/** Channel hrefs come from site.ts; labels, values and hints from copy.ts. */
function channelHref(label: string): { href: string; external: boolean; wa: boolean } {
  switch (label) {
    case 'WhatsApp':
      return { href: whatsappLink(), external: true, wa: true };
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

/** "Your reference is {reference}. I will reply {responseTime}. …" with the reference set in mono. */
function SuccessBody({ reference, responseTime }: { reference: string; responseTime: string }) {
  const parts = C.successBody.replace('{responseTime}', responseTime).split('{reference}');
  return (
    <p>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mono">{reference}</span>}
          {part}
        </Fragment>
      ))}
    </p>
  );
}

export default function Contact() {
  useSeo(COPY.seo.contact.title, COPY.seo.contact.description);
  const site = useSite();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState<Values>(() => initialValues(searchParams));
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState<Summary | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<EnquiryResult | null>(null);
  // "Add details (optional)" starts open only when a package was pre-selected from a price-sheet link, so the choice is visible.
  const [moreOpen, setMoreOpen] = useState(() => Boolean(readPrefill(searchParams).package));

  const noticeRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Links such as "Request a quote" can change the query while this page is open: re-apply the prefill.
  useEffect(() => {
    const pre = readPrefill(searchParams);
    if (Object.keys(pre).length === 0) return;
    setValues((v) => ({ ...v, ...pre }));
    if (pre.package) setMoreOpen(true);
  }, [searchParams]);

  // Failed submit: focus the error summary. Success: focus the "Received" heading.
  useEffect(() => {
    if (summary) noticeRef.current?.focus();
  }, [summary]);
  useEffect(() => {
    if (result) successRef.current?.focus();
  }, [result]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (isFieldKey(key) && errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  }

  function setService(slug: string) {
    setValues((v) => {
      const pkg = PACKAGES.find((p) => p.slug === v.package);
      return { ...v, service: slug, package: pkg && pkg.serviceSlug === slug ? v.package : '' };
    });
    if (errors.service) {
      setErrors((e) => {
        const next = { ...e };
        delete next.service;
        return next;
      });
    }
  }

  function focusField(key: FieldKey) {
    return (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (MORE_FIELDS.includes(key)) setMoreOpen(true);
      // Next tick, so a field inside the disclosure is rendered open before it takes focus.
      window.setTimeout(() => document.getElementById(`f-${key}`)?.focus(), 0);
    };
  }

  function onMoreToggle(e: SyntheticEvent<HTMLDetailsElement>) {
    setMoreOpen(e.currentTarget.open);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const clientErrors = validate(values);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setSummary({ type: 'fields', keys: orderedKeys(clientErrors) });
      return;
    }

    setErrors({});
    setSummary(null);
    setSending(true);

    const payload: EnquiryInput = {
      kind: values.kind,
      name: values.name.trim(),
      company: optional(values.company),
      email: values.email.trim(),
      phone: values.phone.trim(),
      preferWhatsapp: values.preferWhatsapp,
      service: values.service,
      package: optional(values.package),
      budget: optional(values.budget),
      timeline: optional(values.timeline),
      website: optional(values.website),
      message: values.message.trim(),
      sourcePage: `${location.pathname}${location.search}`,
      companyWebsiteUrl: honeypotRef.current?.value ?? '',
    };

    try {
      const res = await api.post<EnquiryResult>('/api/enquiries', payload);
      setResult(res);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.fields) {
          // Prefer the site's own wording where it exists; otherwise show the API's message.
          const ownWording: Partial<Record<FieldKey, string>> = V;
          const mapped: Errors = {};
          for (const [key, message] of Object.entries(err.fields)) {
            if (isFieldKey(key)) mapped[key] = ownWording[key] ?? message;
          }
          const keys = orderedKeys(mapped);
          setErrors(mapped);
          if (hasMoreErrors(mapped)) setMoreOpen(true);
          setSummary(keys.length > 0 ? { type: 'fields', keys } : { type: 'message', text: err.message });
        } else {
          // 429 and any other API failure: show the server's message.
          setSummary({ type: 'message', text: err.message });
        }
      } else {
        setSummary({ type: 'message', text: C.errorGeneric });
      }
    } finally {
      setSending(false);
    }
  }

  function sendAnother() {
    setResult(null);
    setErrors({});
    setSummary(null);
    setValues(initialValues(searchParams));
    setMoreOpen(Boolean(readPrefill(searchParams).package));
    window.setTimeout(() => document.getElementById('f-name')?.focus(), 0);
  }

  const selectedKind = KINDS.find((k) => k.value === values.kind) ?? KINDS[0];
  const packagesForService = values.service ? PACKAGES.filter((p) => p.serviceSlug === values.service) : PACKAGES;
  const packageOptions = packagesForService.map((p) => ({ value: p.slug, label: `${p.name} · ${p.price}` }));
  // A field error inside the disclosure keeps it open until the error is cleared.
  const moreIsOpen = moreOpen || hasMoreErrors(errors);

  const ladder = [
    ...C.channels.map((ch) => {
      const link = channelHref(ch.label);
      const value = <span className={link.wa ? 'num' : 'mono'}>{withBreaks(ch.value)}</span>;
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
              {value}
            </a>
            <span className="small contact-ladder__hint">{ch.hint}</span>
          </>
        ),
      };
    }),
    { term: C.replyTimeLabel, detail: site.settings.responseTime },
    { term: C.locationLabel, detail: site.owner.location },
  ];

  const faqItems = CONTACT_FAQ_QUESTIONS.map((q) => FAQS.find((f) => f.q === q)).filter((f) => f !== undefined);
  const faqs = faqItems.length > 0 ? faqItems : FAQS.slice(0, 4);

  const summaryTitle =
    summary?.type === 'fields'
      ? summary.keys.length === 1
        ? C.errorsOne
        : C.errorsMany.replace('{count}', String(summary.keys.length))
      : undefined;

  return (
    <div className="page-contact">
      <PageHero breadcrumb={[{ label: C.title }]} eyebrow={C.title} titleId="contact-title" title={<Headline text={C.headline} words={3} />} lead={C.intro}>
        <AvailabilityLine />
      </PageHero>

      <section className="section band--page contact-main">
        <div className="container">
          <div className="contact-foot__grid">
            <Reveal className="contact-ladder card card--strong">
              <DefinitionList className="ladder" items={ladder} aria-label={COPY.shell.contactStripLabel} />
              <Button as="a" href={whatsappLink()} target="_blank" variant="whatsapp" block arrow={false}>
                {COPY.shell.whatsappWord} <span className="mono">{OWNER.phoneDisplay}</span>
              </Button>
            </Reveal>

            <Reveal className="contact-form-col card card--strong card--pad-lg" delay={80}>
              <span className="eyebrow">{C.formEyebrow}</span>
              <h2>{C.formTitle}</h2>
              <p className="small contact-form-intro">{C.formIntro}</p>

              {result ? (
                <div className="form-success">
                  <h3 ref={successRef} tabIndex={-1}>
                    {C.successTitle}
                  </h3>
                  <span className="ref">{result.reference}</span>
                  <SuccessBody reference={result.reference} responseTime={result.responseTime || site.settings.responseTime} />
                  <div className="btn-row">
                    <Button as="a" href={result.whatsapp || whatsappLink()} target="_blank" variant="whatsapp">
                      {C.successWhatsapp}
                    </Button>
                    <Button variant="text" onClick={sendAnother}>
                      {C.sendAnother}
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="contact-form" noValidate onSubmit={onSubmit} aria-busy={sending || undefined}>
                  {summary && (
                    <Notice tone="error" title={summaryTitle} ref={noticeRef} id="contact-errors">
                      {summary.type === 'fields' ? (
                        <ul>
                          {summary.keys.map((k) => (
                            <li key={k}>
                              <a href={`#f-${k}`} onClick={focusField(k)}>
                                {labelFor(k)}
                              </a>
                              : {errors[k]}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          <p>{summary.text}</p>
                          <p>
                            <a className="wa-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                              {C.whatsappFallback}
                            </a>
                          </p>
                        </>
                      )}
                    </Notice>
                  )}

                  <fieldset className="contact-kind">
                    <legend className="segmented__label">{C.kindLegend}</legend>
                    <div className="segmented">
                      {KINDS.map((k) => (
                        <Fragment key={k.value}>
                          <input
                            type="radio"
                            id={`f-kind-${k.value}`}
                            name="kind"
                            value={k.value}
                            checked={values.kind === k.value}
                            onChange={() => set('kind', k.value)}
                            aria-describedby="f-kind-help"
                          />
                          <label htmlFor={`f-kind-${k.value}`}>{k.short}</label>
                        </Fragment>
                      ))}
                    </div>
                    <p className="field__help" id="f-kind-help">
                      {selectedKind.hint}
                    </p>
                  </fieldset>

                  <TextField
                    label={labelFor('name')}
                    name="name"
                    value={values.name}
                    onChange={(x) => set('name', x)}
                    placeholder={F.name.placeholder}
                    autoComplete="name"
                    error={errors.name}
                  />

                  <div className="form-row">
                    <TextField
                      label={labelFor('phone')}
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      value={values.phone}
                      onChange={(x) => set('phone', x)}
                      placeholder={F.phone.placeholder}
                      hint={F.phone.hint}
                      autoComplete="tel"
                      error={errors.phone}
                    />
                    <TextField
                      label={labelFor('email')}
                      name="email"
                      type="email"
                      inputMode="email"
                      value={values.email}
                      onChange={(x) => set('email', x)}
                      placeholder={F.email.placeholder}
                      autoComplete="email"
                      error={errors.email}
                    />
                  </div>

                  <CheckboxField
                    label={labelFor('preferWhatsapp')}
                    name="preferWhatsapp"
                    checked={values.preferWhatsapp}
                    onChange={(b) => set('preferWhatsapp', b)}
                    hint={F.preferWhatsapp.hint}
                    error={errors.preferWhatsapp}
                  />

                  <SelectField
                    label={labelFor('service')}
                    name="service"
                    value={values.service}
                    onChange={setService}
                    options={SERVICE_OPTIONS}
                    placeholder={F.service.placeholder}
                    hint={F.service.hint}
                    error={errors.service}
                  />

                  <TextAreaField
                    label={labelFor('message')}
                    name="message"
                    rows={6}
                    value={values.message}
                    onChange={(x) => set('message', x)}
                    placeholder={F.message.placeholder}
                    hint={F.message.hint}
                    error={errors.message}
                  />

                  {/* Optional detail behind a native disclosure. */}
                  <details className="contact-more" open={moreIsOpen} onToggle={onMoreToggle}>
                    <summary>
                      <span>{C.moreSummary}</span>
                      <span className="small contact-more__hint">{C.moreHint}</span>
                    </summary>
                    <div className="contact-more__body">
                      <TextField
                        label={labelFor('company')}
                        name="company"
                        required={false}
                        value={values.company}
                        onChange={(x) => set('company', x)}
                        placeholder={F.company.placeholder}
                        autoComplete="organization"
                        error={errors.company}
                      />

                      {packageOptions.length > 0 && (
                        <SelectField
                          label={labelFor('package')}
                          name="package"
                          required={false}
                          value={values.package}
                          onChange={(x) => set('package', x)}
                          options={packageOptions}
                          placeholder={F.package.placeholder}
                          error={errors.package}
                        />
                      )}

                      <div className="form-row">
                        <SelectField
                          label={labelFor('budget')}
                          name="budget"
                          required={false}
                          value={values.budget}
                          onChange={(x) => set('budget', x)}
                          options={BUDGET_OPTIONS}
                          placeholder={F.budget.placeholder}
                          hint={F.budget.hint}
                          error={errors.budget}
                        />
                        <SelectField
                          label={labelFor('timeline')}
                          name="timeline"
                          required={false}
                          value={values.timeline}
                          onChange={(x) => set('timeline', x)}
                          options={TIMELINE_OPTIONS}
                          placeholder={F.timeline.placeholder}
                          error={errors.timeline}
                        />
                      </div>

                      <TextField
                        label={labelFor('website')}
                        name="website"
                        type="url"
                        inputMode="url"
                        required={false}
                        value={values.website}
                        onChange={(x) => set('website', x)}
                        placeholder={F.website.placeholder}
                        hint={F.website.hint}
                        autoComplete="url"
                        error={errors.website}
                      />
                    </div>
                  </details>

                  {/* Honeypot: off-screen, out of the tab order, never filled by people. Not display:none, so bots still see it. */}
                  <div className="visually-hidden" aria-hidden="true">
                    <label htmlFor="f-companyWebsiteUrl">{C.honeypotLabel}</label>
                    <input ref={honeypotRef} id="f-companyWebsiteUrl" name="companyWebsiteUrl" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </div>

                  <div className="form-foot">
                    <Button type="submit" variant="primary" disabled={sending}>
                      {sending ? C.submitting : (C.submitByKind[values.kind] ?? C.submit)}
                    </Button>
                    <p className="note">{C.privacyNote}</p>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="questions">
        <div className="container">
          <div className="split split--side">
            <Reveal>
              <SectionHeader eyebrow={C.questionsEyebrow} title={C.questionsTitle} />
              <FaqList items={faqs} />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
