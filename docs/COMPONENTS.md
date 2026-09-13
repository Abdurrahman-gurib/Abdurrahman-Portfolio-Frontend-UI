# Components and CSS reference (for page owners)

Source of truth for look and feel is `docs/DESIGN.md`. This file tells you what already exists so you do not rebuild it. Everything below is in `frontend-ui/src/components/` (barrel: `import { … } from '../components'`) and `frontend-ui/src/styles/`.

Rules that apply to every page:

- Copy comes from `src/content/*.ts`. If a string is missing, add it to `copy.ts` in the same voice (British English, first person singular, no hype, no exclamation marks, no emoji, no em dashes in prose).
- Prices are written exactly as the content has them (`MUR 15,000`). Never reformat content strings. Wrap numbers, prices, dates, refs and phone numbers in `<span className="mono">`.
- Routes are `/backoffice/…` (DESIGN.md says `/admin/…`; the layouts are the same).
- No images yet except the optional `/portrait.jpg` on `/about` (hide on `onError`). Lay out text-first.
- One `h1` per page, in sentence case. Call `useSeo(title, description)` at the top of every page.
- Do not edit the shell files (`SiteLayout`, `Nav`, `Footer`, `BackofficeShell`, `RequireAuth`, `App.tsx`, `main.tsx`, `styles/*.css` except your own page file).

---

## 1. Page skeleton

Every public page is a stack of `.section`s inside `.container`. The first section has no top rule.

```tsx
import { useSeo } from '../lib/hooks';
import { COPY } from '../content/copy';
import { Breadcrumb, SectionHeader, Button, WhatsAppButton, AvailabilityLine } from '../components';
import '../styles/pages/services.css';

export default function Services() {
  useSeo(COPY.seo.services.title, COPY.seo.services.description);
  return (
    <div className="container page-services">
      <section className="section section--first">
        <Breadcrumb items={[{ label: COPY.services.title }]} />
        <div className="grid">
          <div className="hero__main">
            <span className="eyebrow"><span className="n">02</span> — {COPY.services.title}</span>
            <h1>…</h1>
            <p className="lead">{COPY.services.intro}</p>
            <div className="btn-row">
              <Button as="link" to="/contact" variant="primary">{COPY.nav.cta}</Button>
              <WhatsAppButton />
            </div>
            <AvailabilityLine />
          </div>
          <div className="hero__facts">{/* <DefinitionList …/> */}</div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="grid">
          <SectionHeader index="03" eyebrow="Process" title="…" intro="…" />
          <div className="section__body">{/* rows / prose / table / form */}</div>
        </div>
      </section>
    </div>
  );
}
```

Section rhythm (DESIGN.md §5.2–5.3):

- `.section` = hairline on top + `padding-block: var(--s-24)` (`--s-12` under 768px). `.section--first` for the opening section only.
- Inside a `.grid`: `.section__head` sits in cols 1–3 (sticky at >= 1024px), col 4 is empty, `.section__body` is cols 5–12. `.section__body--wide` spans 1–12 (price sheet, wide tables).
- Vertical rhythm inside a body: `--s-4` between paragraphs, `--s-8` between blocks, `--s-12` between sub-groups. Use `.stack`, `.stack--8`, `.stack--12` or the `mt-*` utilities; never an off-scale margin.
- Bands: at most two per page, both `.band` (pricing sheet, footer). No other background colour.
- The contact form (`<EnquiryForm kind=… />`) sits at the foot of every public page under a hairline, in its own `.section` with eyebrow `07 — Contact`, pre-set to the page's context.
- Section numbers are fixed: 01 Overview, 02 Services (02.1…), 03 Process, 04 Pricing, 05 Work (05.1…), 06 About, 07 Contact. They are in `COPY.nav.index`.

---

## 2. Components

### Shell (do not use inside pages, listed for orientation)

| Component | What it does |
|---|---|
| `SiteLayout` | Skip link, `<Nav/>`, `<main id="main">` with `<Outlet/>`, `<Footer/>`, mobile bar (hidden on `/contact`). Scroll restoration, h1 focus on route change, `body.has-bar`. |
| `Nav` | Sticky bar, links from `COPY.nav.items`, WhatsApp link, secondary "Request a quote" button, accessible drawer (button with `aria-expanded`, Escape, focus trap, scroll lock, closes on route change). `variant="backoffice"` renders brand only, for `/backoffice/login`. |
| `Footer` | Brand + availability, numbered index, all 13 service links, contact channels, legal row with the back-office link. |
| `BackofficeShell` | `.bo` grid: paper sidebar (01 Dashboard, 02 Enquiries, 03 Settings, View site), signed-in email + Sign out, `.bo-head` breadcrumb, `<main class="bo-main">` with `<Outlet/>`. |
| `RequireAuth` | Waits for the session check, then renders children or redirects to `/backoffice/login` with `state.from`. |

### Building blocks

**`Button`** — the one button. Sentence-case label; the arrow comes from CSS.

```tsx
<Button as="link" to="/contact" variant="primary">Request a quote</Button>
<Button as="a" href={mailtoLink()} variant="secondary" size="sm">Email me</Button>
<Button type="submit" disabled={sending} arrow={false}>{sending ? COPY.contact.submitting : COPY.contact.submit}</Button>
<Button as="link" to="/work" variant="text">All work</Button>   // plain arrow link, not a .btn
```
Props: `as: 'link' | 'a' | 'button'` (default button), `to` / `href` / `type`, `variant: 'primary' | 'secondary' | 'text' | 'whatsapp' | 'danger'` (default secondary), `size?: 'sm'`, `block?`, `arrow?` (false = no arrow, for "Sign in", "Save"), `disabled?`, `onClick?`, `target?`, `state?`, `id?`, `aria-*`. At most one `primary` per viewport.

**`WhatsAppButton`** — `{ message?, label?, size?, block? }`. Filled green, label `WhatsApp +230 5908 6131` (number in mono), opens `whatsappLink(message)` in a new tab.

**`AvailabilityLine`** — `{ className? }`. Dot + mono sentence from `useSite()`: `Availability — <note> · replies within one business day`. Put it under the hero CTA row and in the contact head.

**`ContactStrip`** — `{ message?, className? }`. WhatsApp / Email / Phone / LinkedIn in one ruled mono row.

**`SectionHeader`** — `{ index?, eyebrow?, title, intro?, as?: 'h1'|'h2'|'h3', id?, sticky?, className?, children? }`. Renders `<header class="section__head">` with the eyebrow (`02 — SERVICES`), heading and a small muted intro. Put marginalia (`<dl className="aside">`) or a button row in `children`. Must be a direct child of `.grid`.

**`Breadcrumb`** — `{ items: { label, to? }[] }`. "Home" is prepended automatically. Last item is the current page (no `to`).

**Fields** — every control gets a visible label, `aria-describedby` for hint and error, `aria-invalid` on error. `required` defaults to true; `required={false}` shows "(optional)".

```tsx
<TextField label={COPY.contact.fields.name.label} name="name" value={v.name} onChange={(x) => set('name', x)}
           placeholder={COPY.contact.fields.name.placeholder} autoComplete="name" error={errors.name} />
<TextField label="Phone" name="phone" type="tel" inputMode="tel" required={false} hint="…" value=… onChange=… />
<TextAreaField label="What do you need" name="message" rows={6} value=… onChange=… error=… />
<SelectField label="Service" name="service" placeholder="Choose a service" options={SERVICES.map(s => ({ value: s.slug, label: s.name }))} value=… onChange=… />
<CheckboxField label={COPY.contact.fields.preferWhatsapp.label} name="preferWhatsapp" checked={v.preferWhatsapp} onChange={(b) => …} hint="…" />
<CheckboxField type="radio" name="contactVia" value="whatsapp" label="WhatsApp" checked={…} onChange={…} />   // wrap radios in <div className="check-row">
```
Two fields side by side: `<div className="form-row">…two fields…</div>`. Ruled choice lists ("What do you need", 9 checkboxes) use the raw `.choice-list` markup from DESIGN.md §6.7. The segmented "I need" control uses `.segmented` markup from §6.7.

**`EnquiryForm`** — `{ kind?, service?, package?, fromQuery?, sourcePage?, heading?: 'h2'|'h3'|'none', className? }`. The whole enquiry form: segmented "I need" control, fields, error summary, "Received" success state, POST `/api/enquiries`. Render it in the 07 section body of every public page, pre-set to the page (`kind="quote"` on home / pricing / work / case studies, `kind="audit" service="cyber-security"` on security and network service pages, `kind="callback"` on about); on `/contact` pass `fromQuery heading="h2"` so `?kind=`, `?service=`, `?package=` prefill it. Its submit button is the page's one `.btn--primary`, so do not put a primary "Request a quote" button in the same section; keep the WhatsApp button and the ladder beside it.

**`ContactSection`** — `{ kind?, service?, package?, title?, intro?, whatsappMessage?, sourcePage?, children?, className? }`. The whole 07 section for every public page except `/contact`: `<section class="section contact-foot" id="contact">` with the `07 — Contact` head (title/intro default to `COPY.home.contactTitle/contactIntro`, availability line beneath), the **`ContactLadder`** (dl.spec: WhatsApp, phone, email, LinkedIn, reply time, location, then the green WhatsApp block button) in cols 4–7 and `<EnquiryForm heading="h3">` in cols 8–12. Replace the page's whole 07 section with one of: `<ContactSection />` (home, services, pricing, work, case studies), `<ContactSection kind="audit" service="cyber-security" />` (security and network pages), `<ContactSection kind="callback" />` (about). Do not put a primary "Request a quote" button anywhere in it; the form's submit is the page's one primary. `children` render under the form in cols 5–12 (a related link, a short FAQ).

**Numbering helpers** — `serviceNumber(service | index)` returns `02.1` … `02.13` (never `02.01`), `caseNumber(study | slug)` returns `05.n` by the case's position in `CASE_STUDIES` (so the same case is `05.3` on the home page, `/work` and its own page), `sectionLabel('07')` returns `Contact` from `COPY.nav.index`. Use them everywhere a number is printed; never format `02.${index}` inline.

**`FaqList`** — `{ items: { q: string; a: ReactNode }[] }`. Native `<details>`.

**`StatusPill`** `{ status }` / **`PriorityPill`** `{ priority }` — dot + word, labels from `COPY.backoffice`. Types from `lib/api.ts`.

**`Notice`** — `{ tone: 'info'|'success'|'error', title?, children?, id?, ref?, className? }`. Inline, never fixed. For a failed submit: render `<Notice tone="error" title="Please check 2 fields" ref={noticeRef}><ul><li><a href="#f-phone">…</a></li></ul></Notice>` and call `noticeRef.current?.focus()`.

**`EmptyState`** — `{ title, body?, action? }`. **`Skeleton`** — `{ lines?, label? }` static ruled rows. **`LoadingLine`** — `{ label? }` one mono line (`Loading enquiries…`).

**`DefinitionList`** — `{ items: { term, detail: ReactNode }[], tight?, aria-label? }` renders `<dl class="spec">`. Used for hero facts, service header facts, case dossiers, the contact ladder, the enquiry sheet.

**`Table`** — `{ caption?, children, dense?, rows?, sticky?, sheet?, wrap? }`. You supply `<thead>`/`<tbody>`. Use `<th scope="col">`, `td.num` for prices (right-aligned mono), `td .sub` for the second line, and a real `<a>` (`Open →`) in the last cell of clickable rows.

---

## 3. CSS class index (one line each)

**Layout (`layout.css`)**
`.container` max-width 1200px + the only side gutter · `.grid` 4/6/12 columns · `.section` hairline top + section padding · `.section--first` no top rule · `.section__head` cols 1–3, sticky ≥1024 · `.section__head--static` not sticky · `.section__body` cols 5–12 · `.section__body--wide` cols 1–12 · `.hero__main` cols 1–7 · `.hero__facts` cols 9–12 · `.band` flat band with top/bottom hairlines · `.stack` / `.stack--8` / `.stack--12` vertical rhythm · `.cluster` wrapping flex row · `.measure` / `.measure-lead` prose widths · `.mt-2/4/6/8/12`, `.mb-4/6/8` scale margins · `.split` two-up inside a body column · `.fig`, `.fig--portrait`, `.fig--screen` framed figures with mono caption.

**Type (`base.css`)**
`h1`–`h4` per DESIGN §4.1 · `h1.hero-h1` home hero size · `.lead` 20px muted lead · `.prose` 17px long-form (with `ul`/`ol` dash and numbered styles from `components.css`) · `.meta` 13px mono muted · `.mono` mono family · `.num-lg` 40px mono figure · `.italic-line` the italic closing line · `.small` 14px muted · `.link-quiet` no underline until hover · `.link-arrow` trailing → · `.wa-link` the green WhatsApp link (`.num` inside for the number) · `.link-btn` a `<button>` that looks like a text link · `.skip-link` · `.visually-hidden`.

**Components (`components.css`)**
`.btn` `.btn--primary` `.btn--secondary` `.btn--wa` `.btn--danger` `.btn--sm` `.btn--block` `.btn--noarrow` `.btn-row` · `.eyebrow` (+ `.n`) · `.breadcrumb` · `.mobile-bar` · `.avail` (+ `.avail--off`) · `.field` `.field__label` (+ `.opt`) `.field__help` `.field__error` `.input` `.is-invalid` `.form-row` `.form-success` (+ `.ref`) `.form-foot` (+ `.note`) · `.choice-list` (+ `.n`) · `.check` `.check-row` · `.segmented` (+ `.segmented__label`) · `table`, `thead th`, `td.num`, `td.mono`, `td .sub`, `.table-wrap`, `.sheet` (+ `tr.group`, `td.pkg`, `td.num .from/.val`, `td.includes`, `td.delivery`, `td.cta`, `data-label`), `sup.fn`, `.footnotes`, `.sheet-notes`, `.table--dense` `.table--rows` `.table--sticky` `.table-foot` · `.spec` `.spec--tight` (+ `dd .mono`) · `.status` `.status--new|contacted|quoted|won|lost|archived` · `.priority--low|normal|high` (use with `.status`) · `.tag` `.tag-row` · `.rows` > `li` > `.row-link` (+ `.idx`, `h3`, `p`, `.stack`, `.price` (+ `.from`), `.arrow`) · `.steps` (+ `h4`, `p`, `.out`, `.when`) · `.prose ul/ol` · `.aside` marginalia dl · `.sector-line` (+ `b`) · `.contact-strip` · `.metrics` (+ `b small`, `span`) · `.nav` `.nav--bare` `.nav__brand` `.nav__links` `.nav__cta` `.nav__menu` `.drawer` (+ `.contact`) · `.footer` `.footer__brand` (+ `.name`, `.addr`) `.footer__col` `.footer__col--index|services|contact` `.footer__legal` · `.quote` (+ `footer`) · `.faq` (+ `.faq__body`) · `.notice` `.notice--info|success|error` (+ `.k`) · `.loading` `.placeholder-rows` `.empty` · `.bo` `.bo-side` (+ `.brand`, `h5`, `.user`, `.email`) `.bo-body` `.bo-head` `.bo-head__actions` `.bo-main` `.bo-split` (+ `.bo-split__side`) `.bo-section` `.stat-strip` `.filters` (+ `.field--search`) `.msg` `.timeline`.

Reference markup for the price sheet, choice list, segmented control, steps and metrics is in DESIGN.md §6; copy it verbatim and fill it from the content modules.

---

## 4. Adding page-specific CSS

1. Create `frontend-ui/src/styles/pages/<page>.css` (e.g. `home.css`, `pricing.css`, `backoffice-enquiries.css`).
2. Import it at the top of the page file: `import '../styles/pages/<page>.css';`.
3. Put a page class on the page's outer element: `<div className="container page-<name>">` (back-office pages: on the outer `<div className="page-bo-<name>">` inside `.bo-main`).
4. Every selector in that file starts with `.page-<name>` — nothing global, no token overrides, no new colours, no radius, no shadow, no transitions beyond the allowlist.
5. Prefer the existing classes; a page file should mostly be grid placements (`grid-column`), not new components.

Typecheck: `cd frontend-ui && npx tsc -p tsconfig.app.json --noEmit`. Build: `npm run build -w frontend-ui` from the repo root.
