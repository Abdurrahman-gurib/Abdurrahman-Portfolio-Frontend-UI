import { Fragment, useEffect, useRef, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useSite } from '../lib/hooks';
import { api, ApiError, type EnquiryInput, type EnquiryKind, type EnquiryResult } from '../lib/api';
import { COPY } from '../content/copy';
import { SERVICES } from '../content/services';
import { PACKAGES } from '../content/packages';
import { whatsappLink } from '../content/site';
import { Button } from './Button';
import { CheckboxField, SelectField, TextAreaField, TextField } from './Fields';
import { Notice } from './Notice';

/*
 * The enquiry form (DESIGN.md §6.6, §6.7, §7.7, §9.12): the segmented "I need" control, the fields, the error summary
 * and the "Received" success state, posting to POST /api/enquiries. It sits at the foot of every public page inside the
 * contact section body, pre-set to the page context, and is the whole form column on /contact.
 *
 *   <EnquiryForm kind="quote" />                                   home, pricing, work, case studies
 *   <EnquiryForm kind="audit" service="cyber-security" />          security and network service pages
 *   <EnquiryForm kind="callback" />                                about
 *   <EnquiryForm fromQuery heading="h2" />                         /contact (reads ?kind=, ?service=, ?package=)
 *
 * One form per page: field ids are f-<name>. The submit button is the page's one .btn--primary, so a page that renders
 * the form should not also render a primary "Request a quote" button in the same section.
 */

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
  consent: boolean;
}

type Prefill = Partial<Pick<Values, 'kind' | 'service' | 'package'>>;

/** Failed-submit summary above the fields: either a list of fields to fix, or one message (429, network). */
type Summary = { type: 'fields'; keys: FieldKey[] } | { type: 'message'; text: string };

/** Document order of the fields, for the error summary. */
const FIELD_ORDER: FieldKey[] = [
  'name',
  'company',
  'email',
  'phone',
  'preferWhatsapp',
  'service',
  'package',
  'budget',
  'timeline',
  'website',
  'message',
  'consent',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_OPTIONS = SERVICES.map((s) => ({ value: s.slug, label: s.name }));
const BUDGET_OPTIONS = C.budgets.map((b) => ({ value: b, label: b }));
const TIMELINE_OPTIONS = C.timelines.map((t) => ({ value: t, label: t }));

export interface EnquiryFormProps {
  /** Pre-sets the segmented "I need" control: quote (default) / audit / callback / contact. */
  kind?: EnquiryKind;
  /** Service slug to pre-select, e.g. "cyber-security". */
  service?: string;
  /** Package slug to pre-select; implies its service. */
  package?: string;
  /** Also read ?kind=, ?service= and ?package= from the URL (the /contact page). URL values win over props. */
  fromQuery?: boolean;
  /** Recorded with the enquiry. Defaults to the current path and query. */
  sourcePage?: string;
  /** Heading above the fields ("Send an enquiry" + one line). 'h3' inside a 07 section body, 'h2' on /contact, 'none' to omit. */
  heading?: 'h2' | 'h3' | 'none';
  className?: string;
}

function isKind(value: string | null | undefined): value is EnquiryKind {
  return KINDS.some((k) => k.value === value);
}

/** Normalises kind / service / package: a valid package implies its service; a package that does not belong to the service is dropped. */
function normalise(kind: string | null | undefined, serviceSlug: string | null | undefined, packageSlug: string | null | undefined): Prefill {
  const out: Prefill = {};
  if (isKind(kind)) out.kind = kind;
  const pkg = PACKAGES.find((p) => p.slug === packageSlug);
  const service = SERVICES.find((s) => s.slug === serviceSlug)?.slug ?? pkg?.serviceSlug;
  if (service) out.service = service;
  if (pkg && (!out.service || pkg.serviceSlug === out.service)) out.package = pkg.slug;
  return out;
}

function readPrefill(props: EnquiryFormProps, params: URLSearchParams): Prefill {
  const fromProps = normalise(props.kind, props.service, props.package);
  if (!props.fromQuery) return fromProps;
  return { ...fromProps, ...normalise(params.get('kind'), params.get('service'), params.get('package')) };
}

function initialValues(prefill: Prefill): Values {
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
    consent: false,
    ...prefill,
  };
}

/** Client-side rules mirror the API: name >= 2, valid email, service, message >= 10, consent. */
function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = V.name;
  if (!EMAIL_RE.test(v.email.trim())) e.email = V.email;
  if (!v.service) e.service = V.service;
  if (v.message.trim().length < 10) e.message = V.message;
  if (!v.consent) e.consent = V.consent;
  return e;
}

function orderedKeys(errors: Errors): FieldKey[] {
  return FIELD_ORDER.filter((k) => errors[k]);
}

function isFieldKey(key: string): key is FieldKey {
  return (FIELD_ORDER as string[]).includes(key);
}

function optional(value: string): string | undefined {
  const t = value.trim();
  return t ? t : undefined;
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

export function EnquiryForm(props: EnquiryFormProps) {
  const { heading = 'h3', className } = props;
  const site = useSite();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState<Values>(() => initialValues(readPrefill(props, searchParams)));
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState<Summary | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<EnquiryResult | null>(null);

  const noticeRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Links such as "Request a quote" can change the query, or a page can re-render with another service: re-apply the prefill.
  const prefillKey = `${props.fromQuery ? searchParams.toString() : ''}|${props.kind ?? ''}|${props.service ?? ''}|${props.package ?? ''}`;
  useEffect(() => {
    const pre = readPrefill(props, searchParams);
    if (Object.keys(pre).length === 0) return;
    setValues((v) => ({ ...v, ...pre }));
  }, [prefillKey]);

  // Failed submit: focus the error summary. Success: focus the "Received" heading (DESIGN.md §8.1).
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
      document.getElementById(`f-${key}`)?.focus();
    };
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
      phone: optional(values.phone),
      preferWhatsapp: values.preferWhatsapp,
      service: values.service,
      package: optional(values.package),
      budget: optional(values.budget),
      timeline: optional(values.timeline),
      website: optional(values.website),
      message: values.message.trim(),
      sourcePage: props.sourcePage ?? `${location.pathname}${location.search}`,
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
    setValues(initialValues(readPrefill(props, searchParams)));
    window.setTimeout(() => document.getElementById('f-name')?.focus(), 0);
  }

  const selectedKind = KINDS.find((k) => k.value === values.kind) ?? KINDS[0];
  const packagesForService = values.service ? PACKAGES.filter((p) => p.serviceSlug === values.service) : PACKAGES;
  const packageOptions = packagesForService.map((p) => ({ value: p.slug, label: `${p.name} · ${p.price}` }));

  const summaryTitle =
    summary?.type === 'fields'
      ? summary.keys.length === 1
        ? C.errorsOne
        : C.errorsMany.replace('{count}', String(summary.keys.length))
      : undefined;

  const Heading = heading === 'none' ? null : heading;
  const wrapCls = ['enquiry', className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={wrapCls}>
      {Heading && (
        <div className="enquiry__head">
          <span className="eyebrow">{C.formEyebrow}</span>
          <Heading>{C.formTitle}</Heading>
          <p className="small enquiry__intro">{C.formIntro}</p>
        </div>
      )}

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
        <form className="enquiry-form contact-form" noValidate onSubmit={onSubmit} aria-busy={sending || undefined}>
          {summary && (
            <Notice tone="error" title={summaryTitle} ref={noticeRef} id="contact-errors">
              {summary.type === 'fields' ? (
                <ul>
                  {summary.keys.map((k) => (
                    <li key={k}>
                      <a href={`#f-${k}`} onClick={focusField(k)}>
                        {F[k].label}
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

          <div className="form-row">
            <TextField
              label={F.name.label}
              name="name"
              value={values.name}
              onChange={(x) => set('name', x)}
              placeholder={F.name.placeholder}
              autoComplete="name"
              error={errors.name}
            />
            <TextField
              label={F.company.label}
              name="company"
              required={false}
              value={values.company}
              onChange={(x) => set('company', x)}
              placeholder={F.company.placeholder}
              autoComplete="organization"
              error={errors.company}
            />
          </div>

          <div className="form-row">
            <TextField
              label={F.email.label}
              name="email"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={(x) => set('email', x)}
              placeholder={F.email.placeholder}
              autoComplete="email"
              error={errors.email}
            />
            <TextField
              label={F.phone.label}
              name="phone"
              type="tel"
              inputMode="tel"
              required={false}
              value={values.phone}
              onChange={(x) => set('phone', x)}
              placeholder={F.phone.placeholder}
              hint={F.phone.hint}
              autoComplete="tel"
              error={errors.phone}
            />
          </div>

          <CheckboxField
            label={F.preferWhatsapp.label}
            name="preferWhatsapp"
            checked={values.preferWhatsapp}
            onChange={(b) => set('preferWhatsapp', b)}
            hint={F.preferWhatsapp.hint}
            error={errors.preferWhatsapp}
          />

          <SelectField
            label={F.service.label}
            name="service"
            value={values.service}
            onChange={setService}
            options={SERVICE_OPTIONS}
            placeholder={F.service.placeholder}
            hint={F.service.hint}
            error={errors.service}
          />

          {packageOptions.length > 0 && (
            <SelectField
              label={F.package.label}
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
              label={F.budget.label}
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
              label={F.timeline.label}
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
            label={F.website.label}
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

          <TextAreaField
            label={F.message.label}
            name="message"
            rows={6}
            value={values.message}
            onChange={(x) => set('message', x)}
            placeholder={F.message.placeholder}
            hint={F.message.hint}
            error={errors.message}
          />

          <CheckboxField
            label={F.consent.label}
            name="consent"
            required
            checked={values.consent}
            onChange={(b) => set('consent', b)}
            error={errors.consent}
          />

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
    </div>
  );
}
