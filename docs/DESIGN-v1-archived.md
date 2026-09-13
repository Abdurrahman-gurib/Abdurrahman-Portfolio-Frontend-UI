# GURIB / DATASHEET — Design System

**Client:** Abdurrahman Gurib — Senior Software Engineer & IT Consultant, Mauritius (+230)
**Stack:** React + Vite SPA, hand-written CSS, Google Fonts
**Status:** FINAL. This is the only design reference. If something is not in this file, use the nearest rule in this file; if there is no nearest rule, ask before inventing.
**Revision:** 2026.09 — synthesised from four judged directions. Base = GURIB / DATASHEET; grafts from The Rate Card, The Ledger Practice and SPEC SHEET are listed in Appendix C.

---

## 0. How to read this file

1. Paste §2 into `src/styles/tokens.css` as-is.
2. Paste §3 into `index.html` `<head>`.
3. Build the components in §6 as plain CSS classes. Class names are canonical — use them verbatim in JSX so QA can grep for drift.
4. Lay pages out from the wireframes in §7. Column numbers refer to the 12-column grid in §5.
5. Run every page through the QA checklist in §10 before calling it done.

Units: `rem` everywhere except 1px hairlines, 2px focus rings and the 7px status dot. Root font size is 16px and is never changed.

---

## 1. Concept

The whole site is one calm, ruled technical datasheet for a single accountable engineer: numbered sections, hairline rules instead of boxes, key/value spec tables instead of marketing copy, and a price sheet with footnotes that reads as audited rather than advertised. Everything hangs from the left edge of a 12-column grid on warm paper; there are two typefaces (IBM Plex Sans for words, IBM Plex Mono for data), one signal colour reserved for things you can click, and one green reserved for WhatsApp. Trust comes from information density — real rupee prices, real hardware model numbers, real sector counts, a real portrait, first-person copy — not from decoration.

### What this must never look like

- Any gradient — background, text, border, button, overlay, hero glow, mesh, blurred blob.
- Glassmorphism, `backdrop-filter`, translucent panels, frosted headers, any `box-shadow`.
- Purple, violet, indigo, "AI blue" (#6366F1 family), blue-to-pink, neon teal. The only chromatic colours are `--accent` and `--wa`.
- Card grids: rounded boxes with padding + border + shadow arranged 3-up; feature tiles with an icon in a coloured circle; pricing "plans" in columns with a highlighted "Most popular" box; testimonial cards with round avatars.
- A centred hero, centred section headings, centred paragraphs, centred CTAs. Only text inside a button is centred.
- Icon libraries (Lucide, Font Awesome, Heroicons), decorative icons next to headings, tick-mark lists in pricing, emoji anywhere including the WhatsApp message template.
- Stock photography (laptops, handshakes, server racks with blue LEDs), 3D renders, isometric illustrations, abstract "tech" imagery, dotted-grid or circuit backgrounds, a self-drawing network diagram.
- Logo walls, star ratings, "Trusted by 500+" counters, count-up numbers, skill bars, testimonial carousels, timelines with dots.
- Scroll-triggered fade/slide reveals, parallax, hover lift/scale, typewriter text, marquees, skeleton shimmer, cursor effects, animated backgrounds.
- A floating round WhatsApp bubble; a live ticking clock in the header; a "REV" stamp; crop marks; a giant faded wordmark in the footer; "Set in …" colophons; print in-jokes.
- Border-radius above 0 on the public site (2px allowed on back-office inputs; the 7px status dot is the only circle).
- Inter, Roboto, Poppins, Montserrat, Open Sans, Fraunces, Newsreader, any third typeface, all-caps headings, letter-spaced sans headings, weights above 600 or below 400.
- Pure `#FFFFFF` page backgrounds, pure `#000000` text, light grey (#999) secondary text.
- Copy that could sit on any SaaS page: "Transforming your business", "Cutting-edge solutions", "Unlock your potential", "Seamless", "Next-gen", "We are a team of" (he is one person — write in the first person), "Get started", "Learn more", "Lorem ipsum".
- Prices hidden behind "Contact us", prices in USD by default, "MUR 18 500" with thin spaces. Prices are always visible and always written `Rs 18,500`.
- Promises the owner cannot keep ("replies within 2 hours"). The only reply promise on the site is "within one working day".
- A dark mode toggle. It is a paper document.
- Toasts, notification bells, badge counts, coloured status pills, a dark navy admin sidebar with white icons, a "Download as PDF" button.

---

## 2. Design tokens — paste into `:root`

```css
:root {
  /* ---------- Colour (hex only, no alpha, no gradients) ---------- */
  --paper:        #F4F3EF; /* page background everywhere, input background, price sheet surface */
  --band:         #E9E7E0; /* the ONLY alternate background: pricing band, footer, row hover, active sidebar item */
  --ink:          #121417; /* all headings and body text, strong rules, secondary button border */
  --muted:        #5F636A; /* secondary text, mono metadata, captions, eyebrows, placeholders (5.44:1 on paper, 4.88:1 on band) */
  --rule:         #D3D1C9; /* 1px hairlines: section tops, rows, table rows, figure frames. Decorative only, never text. */
  --edge:         #7E8187; /* input/select/textarea border at rest (3.52:1 on paper, 3.16:1 on band — passes non-text contrast) */
  --accent:       #A63A0F; /* interactive only: primary button fill, link hover underline, focus ring, active nav, "new" status dot */
  --accent-hover: #7F2C0B; /* primary button hover fill */
  --wa:           #0E6B5F; /* WhatsApp only (+ the availability dot): WhatsApp button fill, WhatsApp text links, mobile bar cell */
  --wa-hover:     #0A5247; /* WhatsApp button hover fill */
  --error:        #A8281C; /* form validation text/borders, destructive back-office actions. Nothing else. */
  --on-fill:      #F4F3EF; /* text on --accent / --wa / --error / --ink fills. Never pure white. */

  /* ---------- Fonts ---------- */
  --font-sans: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", "SF Mono", Menlo, Consolas, monospace;

  /* ---------- Type scale (size / line-height) ---------- */
  --fs-2xs:  0.75rem;   --lh-2xs:  1.4;   /* 12px mono eyebrows, table headers, tags, footer legal */
  --fs-xs:   0.8125rem; --lh-xs:   1.5;   /* 13px mono meta, captions, form labels, footnotes */
  --fs-sm:   0.875rem;  --lh-sm:   1.5;   /* 14px nav links, helper text, table cells, back-office UI, button labels */
  --fs-base: 1rem;      --lh-base: 1.55;  /* 16px body */
  --fs-read: 1.0625rem; --lh-read: 1.6;   /* 17px long-form prose (case studies, about, service scope) */
  --fs-md:   1.25rem;   --lh-md:   1.4;   /* 20px lead paragraphs, service row titles, h4 */
  --fs-lg:   1.625rem;  --lh-lg:   1.25;  /* 26px h3 */
  --fs-xl:   2.125rem;  --lh-xl:   1.15;  /* 34px h2 */
  --fs-2xl:  2.75rem;   --lh-2xl:  1.08;  /* 44px page h1 */
  --fs-3xl:  3.5rem;    --lh-3xl:  1.02;  /* 56px home hero h1 at >= 1200px only */
  --fs-num:  2.5rem;    --lh-num:  1;     /* 40px large mono figures: case metrics, dashboard stats, success ref, mobile ledger totals */

  --ls-tight: -0.015em; /* h1, h2 */
  --ls-label: 0.08em;   /* mono uppercase eyebrows, table headers, tags */
  --ls-form:  0.06em;   /* mono uppercase form labels */

  /* ---------- Spacing (4px base) ---------- */
  --s-1:  0.25rem;
  --s-2:  0.5rem;
  --s-3:  0.75rem;
  --s-4:  1rem;
  --s-5:  1.25rem;
  --s-6:  1.5rem;
  --s-8:  2rem;
  --s-10: 2.5rem;
  --s-12: 3rem;
  --s-16: 4rem;
  --s-20: 5rem;
  --s-24: 6rem;
  --s-32: 8rem;

  /* ---------- Radii ---------- */
  --radius:     0;    /* public site: everything */
  --radius-bo:  2px;  /* back-office inputs only */
  --radius-dot: 50%;  /* the 7px status dot only */

  /* ---------- Borders ---------- */
  --hairline:  1px solid var(--rule);
  --strong:    1px solid var(--ink);
  --edge-line: 1px solid var(--edge);

  /* ---------- Shadows ---------- */
  --shadow: none; /* there are no shadows. Do not add another token. */

  /* ---------- Sizes ---------- */
  --container:    75rem;                       /* 1200px */
  --gutter:       clamp(1.25rem, 4vw, 3rem);   /* side padding, set once on .container */
  --col-gap:      1.5rem;
  --measure:      62ch;                        /* max prose measure */
  --measure-lead: 52ch;
  --nav-h:        3.5rem;
  --sticky-top:   5rem;                        /* nav-h + 1.5rem; top offset of sticky section heads */
  --control-h:    2.75rem;                     /* 44px: buttons, inputs, selects, nav rows, mobile bar cells */
  --bo-sidebar:   15rem;
  --spec-label:   11rem;                       /* label column of <dl class="spec"> (7rem under 768px) */

  /* ---------- Breakpoints (documentation only: custom properties cannot be used inside @media) ---------- */
  /* 480px   buttons in CTA rows go full width                                              */
  /* 768px   4 -> 6 columns; mobile bar hides above; price table switches from ledger to table */
  /* 1024px  6 -> 12 columns; nav expands; sticky section heads switch on                   */
  /* 1200px  hero h1 to --fs-3xl; nav shows full WhatsApp number                            */

  /* ---------- Z-index ---------- */
  --z-skip:   40; /* skip-to-content link */
  --z-drawer: 30; /* mobile nav drawer */
  --z-nav:    20; /* sticky nav */
  --z-bar:    10; /* mobile WhatsApp / quote bar */
  --z-sticky:  1; /* sticky section heads, back-office sidebar */
}
```

### Base reset — paste after the tokens

```css
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font: 400 var(--fs-base) / var(--lh-base) var(--font-sans);
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
}
img, svg, video { display: block; max-width: 100%; height: auto; }
h1, h2, h3, h4, p, dl, dd, figure, blockquote { margin: 0; }
ul, ol { margin: 0; padding: 0; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Scoped radius reset (not *{}, so native date pickers and iOS selects keep their chrome) */
.btn, .input, .field select, .field textarea, .tag, .fig img, .sheet, .segmented label, .choice-list input {
  border-radius: var(--radius);
}

/* Motion allowlist: only these properties transition, only this fast */
a, .btn, .input, .field select, .field textarea, .row-link, .nav a, .bo-side a, .filters button, .drawer a {
  transition-property: color, background-color, border-color, text-decoration-color, opacity;
  transition-duration: 120ms;
  transition-timing-function: ease-out;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0ms !important; animation: none !important; scroll-behavior: auto !important; }
}

.skip-link { position: absolute; top: -100%; left: var(--gutter); z-index: var(--z-skip); background: var(--ink); color: var(--on-fill); padding: var(--s-2) var(--s-4); }
.skip-link:focus { top: var(--s-2); }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
```

---

## 3. Google Fonts

Exactly these three tags in `index.html`, nothing else. Two families, six font files. No Fraunces, no Newsreader, no third family — ever.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

Weights available: Sans 400, 400 italic, 500, 600. Mono 400, 500. If a rule below asks for a weight not listed here, the rule is wrong — use the nearest listed weight.

---

## 4. Typography

### 4.1 Roles

| Element | Font / weight | Size / line-height | Tracking | Case | Colour | Notes |
|---|---|---|---|---|---|---|
| Home hero h1 | Sans 500 | `--fs-3xl`/1.02 at ≥1200px; `--fs-2xl`/1.08 below; `2.125rem` below 768px | −0.015em | Sentence | `--ink` | ≤ 60 characters, `max-width: 20ch`, cols 1–7. Never more than 3 lines at desktop. |
| Page h1 | Sans 500 | `--fs-2xl`/1.08; `2.125rem` below 768px | −0.015em | Sentence | `--ink` | `max-width: 22ch`. One per page. |
| h2 (section title) | Sans 500 | `--fs-xl`/1.15; `1.625rem` below 768px | −0.015em | Sentence | `--ink` | Always preceded by an `.eyebrow` with the section number. `max-width: 24ch`. |
| h3 | Sans 600 | `--fs-lg`/1.25 | −0.005em | Sentence | `--ink` | Case-study titles, service sub-sections, back-office page titles. |
| h4 | Sans 600 | `--fs-md`/1.4 | 0 | Sentence | `--ink` | Step titles, package names in the mobile ledger, FAQ summaries. |
| Lead paragraph | Sans 400 | `--fs-md`/1.4 | 0 | Sentence | `--muted` | `max-width: var(--measure-lead)`. One per page, directly under the h1. |
| Body | Sans 400 | `--fs-base`/1.55 | 0 | Sentence | `--ink` | `max-width: var(--measure)`. Paragraph gap `--s-4`. |
| Long-form prose | Sans 400 | `--fs-read`/1.6 | 0 | Sentence | `--ink` | Case studies, About, service Scope. Same measure. |
| Small / helper | Sans 400 | `--fs-sm`/1.5 | 0 | Sentence | `--muted` | Form helper, table cells, footer links (`--ink`). |
| Nav link | Sans 500 | `--fs-sm`/1 | 0 | Sentence | `--ink` | Underline on hover only. |
| Emphasis | Sans 500 | inherit | 0 | — | inherit | Never 600 in running text, never `<b>`. |
| Italic | Sans 400 italic | inherit | 0 | — | inherit | Only: client quotes, the About closing line, at most one phrase in the hero. |
| Eyebrow / section index | Mono 500 | `--fs-2xs`/1.4 | 0.08em | UPPERCASE | `--muted` | Format `02 — SERVICES`. |
| Table header | Mono 500 | `--fs-2xs`/1.4 | 0.08em | UPPERCASE | `--muted` | Bottom rule `--strong`. |
| Form label | Mono 500 | `--fs-xs`/1.5 | 0.06em | UPPERCASE | `--ink` | 13px and ink, not muted — older eyes on cheap phones. |
| Mono metadata | Mono 400 | `--fs-xs`/1.5 | 0 | Sentence | `--muted` | Captions, footnotes, timestamps, stack lines, marginalia. No tracking at 13px+. |
| Tag | Mono 500 | `--fs-2xs`/1 | 0.08em | UPPERCASE | `--muted` | 1px `--rule` border, no fill. |
| Numerals (inline) | Mono 400 | inherit | 0 | — | inherit | Every price, date, metric, ref, phone number. Tabular. |
| Numerals (large) | Mono 500 | `--fs-num`/1 | −0.02em | — | `--ink` | Case metrics, dashboard stats, success-state ref, mobile ledger totals. |
| Button label | Sans 500 | `--fs-sm`/1 | 0 | Sentence | see §6.1 | Sentence-case sans, never mono uppercase. |
| Price in tables | Mono 400 | `--fs-sm` | 0 | — | `--ink` | Written `Rs 18,500`, right-aligned, `white-space: nowrap`. |

### 4.2 Rules

1. **Two families, three jobs.** Sans for words, Mono for data and labels. If it is a number, an ID, a date, a label, a caption or a footnote, it is Mono. If it is a sentence, it is Sans. No exceptions.
2. **Nothing is uppercase except mono labels** (eyebrows, table headers, form labels, tags, footer legal). Headings and buttons are sentence case.
3. **Tracking** only on uppercase mono at 12–13px and negative tracking on h1/h2. Body text, buttons and sentence-case mono have `letter-spacing: 0`.
4. **Measure**: body 45–62ch, lead 52ch, mono meta 60ch, marginalia 28ch. Set `max-width` in `ch` on `p`, `li`, `dd` — never on the container.
5. **Prices**: `Rs 18,500` everywhere (public site and back-office). Comma thousands, no decimals unless non-zero. "MUR" appears once per page in the price footnote ("All prices in Mauritian rupees (MUR), excluding VAT"). Never "MUR 18 500", never thin spaces, never "₨". Monthly figures: `Rs 2,500 / month`.
6. **Typographic characters**: en dash for ranges (`2–3 weeks`), middle dot for inline lists (`React · NestJS · Cloudflare`), em dash with spaces in eyebrows (`04 — PRICING`), the arrow `→` from the font as the only "icon". True apostrophes.
7. **Headings are never coloured, never underlined, never followed by a decorative line.** Hierarchy is size, weight and the mono/sans contrast.
8. **Heading length**: h1 ≤ 60 characters, h2 ≤ 40, h3 ≤ 70. A manual `<br>` in an h1 is allowed only to avoid a one-word last line.
9. **Copy register**: first person singular, plain English, one fact per sentence (a place, a price, a tool, a timeline, a model number). CTAs say what happens: "Request a quote", "Request a free audit", "Message on WhatsApp", "Ask for a call-back", "Send request".
10. **Font loading**: `display=swap` is in the URL. Do not add `font-display: optional`, do not self-host, do not preload individual files.

---

## 5. Layout system

### 5.1 Container and grid

```css
.container { max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
.grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: var(--s-4); row-gap: 0; }
@media (min-width: 768px)  { .grid { grid-template-columns: repeat(6, minmax(0, 1fr)); column-gap: var(--col-gap); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(12, minmax(0, 1fr)); } }
```

- The side gutter is set **once**, on `.container`, with `padding-inline`. No other element adds horizontal padding. Never use a `padding` shorthand that zeroes the sides.
- Bands that run edge to edge are `width: 100%` wrappers with a `.container` inside.
- Nothing has `min-width` wider than the viewport; only `.table-wrap` may scroll horizontally.

### 5.2 The canonical section

Every section on every public page uses the same asymmetric split. This split replaces every card grid.

```
col:  1    2    3    4    5    6    7    8    9    10   11   12
      [ head: eyebrow + h2 ]  .   [ body: rows / prose / table / form ................ ]
      sticky top 5rem         gap
```

```css
.section { border-top: var(--hairline); padding-block: var(--s-24); }
.section--first { border-top: 0; }                  /* the hero only */
.section__head { grid-column: 1 / -1; margin-bottom: var(--s-8); }
.section__body { grid-column: 1 / -1; }
@media (min-width: 1024px) {
  .section__head { grid-column: 1 / span 3; position: sticky; top: var(--sticky-top); align-self: start; z-index: var(--z-sticky); margin-bottom: 0; }
  .section__body { grid-column: 5 / -1; }
  .section__body--wide { grid-column: 1 / -1; }      /* price sheet, timeline table, back-office tables */
}
@media (max-width: 767px) { .section { padding-block: var(--s-12); } }
.section__head p { margin-top: var(--s-4); font-size: var(--fs-sm); color: var(--muted); max-width: 28ch; }
```

Column 4 is deliberately empty at ≥1024px. Do not fill it.

### 5.3 Separation without cards

Sections and items are separated by three things only: a 1px `--rule` line, a mono index, and whitespace.

1. **Between sections:** `border-top: var(--hairline)` on the section, full container width, plus `padding-block: var(--s-24)` (`--s-12` under 768px).
2. **Inside sections:** repeated items (services, steps, case entries, contact channels, FAQ items, price rows) are **rows**: `border-bottom: var(--hairline)`, `padding-block`, no background, no radius, no shadow. Lists get `border-top` on the list so the first row is closed above.
3. **Vertical rhythm inside a body column:** `--s-4` between paragraphs, `--s-8` between blocks, `--s-12` between sub-groups. Never eyeball a margin: pick from the scale.
4. **Flat bands:** at most two per page — the pricing sheet and the footer — both `background: var(--band)` and both carrying `border-top` and `border-bottom` hairlines. No other background colour exists on the public site. No ink band, no CTA band.
5. **Strong rules (`--strong`, 1px `--ink`)** are used only under table header rows, above the ledger total, above the success block, and above the footer. They mark the end of something.

### 5.4 Numbering

The site is one numbered document. The numbers are fixed and shared by the home page sections, the inner pages, the mobile menu and the footer index:

| No. | Section | Page |
|---|---|---|
| 01 | Overview | Home hero |
| 02 | Services | `/services`, sub-numbered `02.1` … `02.9` |
| 03 | Process | Home; repeated on service pages as "How it goes" |
| 04 | Pricing | `/pricing` |
| 05 | Work | `/work`, entries `05.1` … |
| 06 | About | `/about` |
| 07 | Contact | `/contact` |

Eyebrow format: `02 — SERVICES`. Sub-items: `02.4 — CYBER-SECURITY`. Service rows carry their sub-number in the first cell. The desktop nav does **not** show numbers (width); the mobile drawer and footer index do.

### 5.5 Three alignment lines

Everything hangs from the left edge of column 1, column 5, or column 9. Text blocks are 7–8 columns wide; figures 4–5. Nothing is ever centred in the viewport.

### 5.6 Figures

```css
.fig { margin: 0; }
.fig img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border: var(--hairline); }
.fig--portrait img { aspect-ratio: 4 / 5; }
.fig--screen img { aspect-ratio: 16 / 10; }
.fig figcaption { margin-top: var(--s-3); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); }
```

Caption format: `Fig. 05.2 — Booking flow, car-rental client, 2025`. Screenshots are shown in colour, always (no grayscale, no hover reveal). No crop marks, no browser chrome, no device frames, no shadow.

---

## 6. Components

All CSS below is complete and plain. Fonts are referenced via tokens. Every interactive element is at least `--control-h` (44px) tall.

### 6.1 Buttons

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--s-2);
  min-height: var(--control-h); padding: 0 var(--s-5);
  font: 500 var(--fs-sm) / 1 var(--font-sans); letter-spacing: 0; text-decoration: none; white-space: nowrap;
  border: var(--strong); background: transparent; color: var(--ink); cursor: pointer;
}
.btn::after { content: "→"; font-family: var(--font-mono); }
.btn--noarrow::after { content: none; }
.btn:hover { background: var(--ink); color: var(--on-fill); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn:disabled { opacity: .45; cursor: not-allowed; background: transparent; color: var(--ink); }

/* Primary — the quote / submit action. At most one per viewport. */
.btn--primary { background: var(--accent); border-color: var(--accent); color: var(--on-fill); }
.btn--primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

/* Secondary — the default .btn: ink outline, fills ink on hover. Used for "See the price sheet", "All work", Archive. */
.btn--secondary { }

/* WhatsApp — see 6.4 */
.btn--wa { background: var(--wa); border-color: var(--wa); color: var(--on-fill); }
.btn--wa:hover { background: var(--wa-hover); border-color: var(--wa-hover); }

/* Danger — back-office delete only */
.btn--danger { border-color: var(--error); color: var(--error); }
.btn--danger:hover { background: var(--error); color: var(--on-fill); }

.btn--sm { min-height: 2.25rem; padding: 0 var(--s-4); }
.btn--block { width: 100%; }
.btn-row { display: flex; flex-wrap: wrap; gap: var(--s-3); align-items: center; }
@media (max-width: 479px) { .btn-row .btn { width: 100%; } }
```

Labels: `Request a quote`, `Request a free audit`, `Send request`, `WhatsApp +230 5908 6131`, `Message on WhatsApp`, `See the price sheet`, `All work`, `Sign in`, `Save`. Never "Submit", "Get started", "Learn more". The `→` comes from `::after`; never type it into the label.

### 6.2 Text links

Grafted from The Rate Card: links are ink, underlined in the rule colour, and the underline turns accent on hover. No link is ever blue, coloured or bold.

```css
a { color: var(--ink); text-decoration: underline; text-decoration-thickness: 1px; text-decoration-color: var(--rule); text-underline-offset: .18em; }
a:hover { text-decoration-color: var(--accent); }
a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.link-quiet { text-decoration: none; }                    /* nav, footer index, row links */
.link-quiet:hover { text-decoration: underline; text-decoration-color: var(--accent); }

.link-arrow::after { content: " →"; font-family: var(--font-mono); white-space: nowrap; }  /* "All work →", "Request →" */

.wa-link { color: var(--wa); font-weight: 500; text-decoration-color: var(--wa); }       /* the only coloured link */
.wa-link:hover { text-decoration-thickness: 2px; }
.wa-link .num { font-family: var(--font-mono); font-weight: 400; }
```

Exception: in body prose on the band (footer) links stay ink; on `--band` the accent underline is 5.25:1.

### 6.3 Eyebrow, breadcrumb, section header

```css
.eyebrow { display: block; font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); margin-bottom: var(--s-3); }
.eyebrow .n { color: var(--ink); }   /* the number itself is ink: "02" ink, "— SERVICES" muted */

.breadcrumb { display: flex; flex-wrap: wrap; gap: var(--s-2); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); margin-bottom: var(--s-6); }
.breadcrumb a { color: var(--muted); }
.breadcrumb li + li::before { content: "/"; margin-right: var(--s-2); }
.breadcrumb ol { display: contents; list-style: none; }

.section__head h2 { font: 500 var(--fs-xl) / var(--lh-xl) var(--font-sans); letter-spacing: var(--ls-tight); max-width: 24ch; }
```

Markup:

```html
<header class="section__head">
  <span class="eyebrow"><span class="n">02</span> — Services</span>
  <h2>What I build and maintain</h2>
  <p>Fixed-price packages are on the price sheet.</p>
</header>
```

### 6.4 WhatsApp CTA

WhatsApp is the primary contact channel in Mauritius and gets the only green on the site. It is distinguished by **colour + the word + the number**, never by an icon, a bubble or a badge.

- Desktop nav: `.wa-link` text link with the number (`WhatsApp +230 5908 6131`); at 1024–1199px the number is hidden and only "WhatsApp" shows.
- Hero and contact page: `.btn.btn--wa` filled green with the label `WhatsApp +230 5908 6131`.
- Contact ladder / footer: `.wa-link`.
- Under 768px: the fixed two-cell bar below.
- `href` is always `https://wa.me/23059086131?text=Hello%20Abdurrahman%2C%20I%20need%20help%20with%20` (plain text, no emoji).

```css
.mobile-bar { display: none; }
@media (max-width: 767px) {
  .mobile-bar {
    display: grid; grid-template-columns: 1fr 1fr; position: fixed; inset: auto 0 0; z-index: var(--z-bar);
    background: var(--paper); border-top: var(--hairline);
    padding: var(--s-2) var(--s-4) calc(var(--s-2) + env(safe-area-inset-bottom));
    column-gap: var(--s-2);
  }
  .mobile-bar .btn { width: 100%; }
  body.has-bar { padding-bottom: 4.5rem; }
}
```

Cells: left `.btn--wa` "WhatsApp", right `.btn--primary` "Get a quote" (links to `/contact`). The bar is hidden on `/contact` and in the back-office.

### 6.5 Availability line

Grafted from GURIB / DATASHEET; edited from back-office Settings. The dot is the one permitted use of `--wa` outside WhatsApp (both mean "you can reach me").

```css
.avail { display: inline-flex; align-items: center; gap: var(--s-2); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); margin-top: var(--s-4); }
.avail::before { content: ""; width: 7px; height: 7px; border-radius: var(--radius-dot); background: var(--wa); flex: none; }
```

Copy pattern: `Availability — taking two new projects for October 2026 · replies within one working day`.

### 6.6 Inputs, select, textarea, focus and error

Boxed inputs with a visible `--edge` border (not underline-only): higher affordance for older buyers and a border that passes non-text contrast.

```css
.field { display: flex; flex-direction: column; gap: var(--s-2); margin-bottom: var(--s-6); }
.field__label { font: 500 var(--fs-xs) / var(--lh-xs) var(--font-mono); letter-spacing: var(--ls-form); text-transform: uppercase; color: var(--ink); }
.field__label .opt { color: var(--muted); text-transform: none; letter-spacing: 0; margin-left: var(--s-2); }  /* "(optional)" */
.field__help { font: 400 var(--fs-sm) / var(--lh-sm) var(--font-sans); color: var(--muted); }

.input, .field select, .field textarea {
  width: 100%; min-height: var(--control-h); padding: var(--s-2) var(--s-3);
  border: var(--edge-line); background: var(--paper); color: var(--ink);
  font: 400 var(--fs-base) / var(--lh-base) var(--font-sans);  /* 16px: iOS will not zoom */
  appearance: none; -webkit-appearance: none;
}
.input::placeholder, .field textarea::placeholder { color: var(--muted); }
.input:hover, .field select:hover, .field textarea:hover { border-color: var(--ink); }
.input:focus, .field select:focus, .field textarea:focus { outline: 2px solid var(--accent); outline-offset: 0; border-color: var(--accent); }
.field select {
  padding-right: var(--s-10); cursor: pointer;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%23121417' stroke-width='1.25'/></svg>");
  background-repeat: no-repeat; background-position: right var(--s-3) center;
}
.field textarea { min-height: 9rem; resize: vertical; line-height: var(--lh-base); }
.input:disabled, .field select:disabled { background: var(--band); color: var(--muted); border-color: var(--rule); }

/* Error state: border + label + a mono line. No red box, no icon. */
.field.is-invalid .input, .field.is-invalid select, .field.is-invalid textarea { border-color: var(--error); }
.field.is-invalid .input:focus, .field.is-invalid select:focus, .field.is-invalid textarea:focus { outline-color: var(--error); }
.field.is-invalid .field__label { color: var(--error); }
.field__error { display: none; font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--error); }
.field.is-invalid .field__error { display: block; }
.field__error::before { content: "Error — "; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; column-gap: var(--col-gap); }
@media (max-width: 767px) { .form-row { grid-template-columns: 1fr; } }

/* Success block (Rate Card copy + Spec Sheet's large reference) */
.form-success { border-top: var(--strong); border-bottom: var(--hairline); padding-block: var(--s-8); }
.form-success h3 { font: 600 var(--fs-lg) / var(--lh-lg) var(--font-sans); margin-bottom: var(--s-3); }
.form-success .ref { display: block; font: 500 var(--fs-num) / var(--lh-num) var(--font-mono); letter-spacing: -0.02em; margin-block: var(--s-4); }
.form-success p { color: var(--muted); max-width: var(--measure); }
```

Markup and copy:

```html
<div class="field is-invalid">
  <label class="field__label" for="phone">WhatsApp or phone</label>
  <input class="input" id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" aria-describedby="phone-err" aria-invalid="true">
  <span class="field__error" id="phone-err">Enter a number I can reach you on, e.g. +230 5xxx xxxx</span>
</div>
```

Success copy: h3 `Received.` — ref `Q-2026-0142` — p `I will reply by Tuesday 16 September. If it is urgent, message me on WhatsApp.` followed by a `.btn--wa`.

### 6.7 Checkbox, radio, segmented control

```css
/* Ruled choice list: "What do you need" (checkboxes), "Budget" (radios) */
.choice-list { list-style: none; border-top: var(--hairline); }
.choice-list li { border-bottom: var(--hairline); }
.choice-list label { display: grid; grid-template-columns: 2.5rem 1.125rem 1fr; align-items: center; column-gap: var(--s-3); min-height: var(--control-h); padding-block: var(--s-2); cursor: pointer; font-size: var(--fs-base); }
.choice-list .n { font: 400 var(--fs-xs) / 1 var(--font-mono); color: var(--muted); }
.choice-list input { appearance: none; -webkit-appearance: none; width: 1.125rem; height: 1.125rem; margin: 0; border: var(--strong); background: var(--paper); cursor: pointer; }
.choice-list input[type="radio"] { border-radius: var(--radius-dot); }
.choice-list input:checked { background: var(--ink); box-shadow: inset 0 0 0 3px var(--paper); } /* the only box-shadow: it draws the inner ring, it is not a drop shadow */
.choice-list input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Segmented "I need" control: adjoining bordered cells, active fills ink */
.segmented { display: flex; flex-wrap: wrap; margin-bottom: var(--s-6); }
.segmented label { flex: 1 1 auto; min-height: var(--control-h); display: inline-flex; align-items: center; justify-content: center; padding: 0 var(--s-4); margin-left: -1px; border: var(--edge-line); font: 500 var(--fs-sm) / 1 var(--font-sans); cursor: pointer; }
.segmented label:first-of-type { margin-left: 0; }
.segmented input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.segmented input:checked + label { background: var(--ink); color: var(--on-fill); border-color: var(--ink); position: relative; z-index: 1; }
.segmented input:focus-visible + label { outline: 2px solid var(--accent); outline-offset: 2px; position: relative; z-index: 2; }
```

The segmented control is used once: `I need — [ A quote ] [ A free audit ] [ A call-back ]`. Do not use it as tabs anywhere else.

### 6.8 Tables — price sheet and back-office lists

```css
table { width: 100%; border-collapse: collapse; font-size: var(--fs-sm); line-height: var(--lh-sm); font-variant-numeric: tabular-nums; }
thead th { text-align: left; padding: var(--s-3) var(--s-4) var(--s-3) 0; font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); border-bottom: var(--strong); vertical-align: bottom; }
tbody td { padding: var(--s-4) var(--s-4) var(--s-4) 0; border-bottom: var(--hairline); vertical-align: top; }
td.num, th.num { text-align: right; padding-right: 0; font-family: var(--font-mono); white-space: nowrap; }
td.mono { font-family: var(--font-mono); font-size: var(--fs-xs); color: var(--muted); }
td .sub { display: block; font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); margin-top: var(--s-1); }
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

/* Price sheet: a paper sheet laid on the band */
.sheet { background: var(--paper); border: var(--hairline); }
.sheet thead th, .sheet tbody td { padding-left: var(--s-4); }
.sheet td.num { padding-right: var(--s-4); }
.sheet tr.group td { padding: var(--s-6) var(--s-4) var(--s-2); background: var(--band); font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); border-bottom: var(--strong); }
.sheet td.pkg { font-weight: 500; font-size: var(--fs-base); }
.sheet td.num .from { display: block; font: 400 var(--fs-2xs) / 1 var(--font-mono); color: var(--muted); margin-bottom: var(--s-1); }  /* "from" set small above the figure */
.sheet tbody tr:last-child td { border-bottom: 0; }
sup.fn { font: 400 0.6875rem / 1 var(--font-mono); color: var(--ink); margin-left: .15em; vertical-align: super; }
sup.fn a { text-decoration: none; }
.footnotes { margin-top: var(--s-6); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); max-width: 70ch; }
.footnotes li { list-style: none; display: grid; grid-template-columns: 1.5rem 1fr; padding-block: var(--s-1); }
.sheet-notes { display: grid; grid-template-columns: 1fr 1fr; column-gap: var(--col-gap); margin-top: var(--s-8); padding-top: var(--s-6); border-top: var(--hairline); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); }
.sheet-notes h4 { font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--ink); margin-bottom: var(--s-2); }
@media (max-width: 767px) { .sheet-notes { grid-template-columns: 1fr; row-gap: var(--s-6); } }

/* Mobile: the same table markup becomes a ledger with dotted leaders (Ledger Practice graft) */
@media (max-width: 767px) {
  .sheet, .sheet tbody, .sheet tr, .sheet td { display: block; }
  .sheet thead { display: none; }
  .sheet tr { padding: var(--s-4); border-bottom: var(--hairline); }
  .sheet tr.group { padding: var(--s-4) var(--s-4) var(--s-2); }
  .sheet td { padding: var(--s-1) 0; border: 0; }
  .sheet td.pkg { font: 600 var(--fs-md) / var(--lh-md) var(--font-sans); padding-bottom: var(--s-2); }
  .sheet td.num { display: flex; align-items: baseline; gap: var(--s-2); text-align: left; white-space: normal; padding-right: 0; }
  .sheet td.num::before { content: attr(data-label); font: 500 var(--fs-2xs) / 1 var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); }
  .sheet td.num::after { content: ""; flex: 1; border-bottom: 1px dotted var(--rule); order: 1; transform: translateY(-.3em); }
  .sheet td.num .val { order: 2; }
  .sheet td.num .from { display: inline; margin: 0 var(--s-1) 0 0; }
  .sheet td.includes::before, .sheet td.delivery::before { content: attr(data-label) " — "; font: 500 var(--fs-2xs) / 1 var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); }
  .sheet td.cta { padding-top: var(--s-3); }
}

/* Back-office dense table */
.table--dense tbody td { padding: var(--s-3) var(--s-4) var(--s-3) 0; }
.table--rows tbody tr { cursor: pointer; }
.table--rows tbody tr:hover td { background: var(--band); }
.table--rows tbody tr:focus-within td { background: var(--band); }
.table--sticky thead th { position: sticky; top: 0; background: var(--paper); z-index: var(--z-sticky); }
```

Price sheet columns (desktop): `Package` · `Includes` · `Delivery` · `One-off (Rs)` · `Monthly support (Rs)` · blank cell with `Request →` `.link-arrow`. Rows are grouped by `tr.group`: `WEBSITES` / `SOFTWARE` / `SECURITY & NETWORK` / `TELEPHONY, CCTV & IOT` / `SUPPORT & REPAIRS` / `MARKETING & AUTOMATION`.

Price cell markup:

```html
<td class="num" data-label="One-off"><span class="from">from</span><span class="val">Rs 18,500<sup class="fn"><a href="#fn1">1</a></sup></span></td>
```

Under the sheet, in order: `.footnotes` (`1 Excludes domain and hosting, typically Rs 2,400 / year.` `2 Up to 5 pages; extra pages Rs 1,500 each.` …), then `.sheet-notes` with two columns — left `WHAT IS NOT INCLUDED`, right `HOW PAYMENT WORKS` (`40% on start, 60% on delivery. Monthly support billed on the 1st.`), then one mono line `All prices in Mauritian rupees (MUR), excluding VAT. Prices last revised September 2026. Remote clients: quoted in USD or EUR on request.`

Back-office enquiry list columns: `Ref` (mono) · `Received` (mono, `13 Sep, 09:14`) · `Name / Business` (sans 500 + `.sub`) · `Type` · `Source` · `Status` (`.status`) · `Budget` (num) · blank with `Open →`.

### 6.9 Definition lists — the spec table

The single reusable key/value component. Used for hero facts, service page header, case-study dossier, contact ladder, back-office enquiry sheet.

```css
.spec { display: grid; grid-template-columns: var(--spec-label) 1fr; border-top: var(--hairline); }
.spec > div { display: contents; }
.spec dt, .spec dd { padding: var(--s-3) 0; border-bottom: var(--hairline); }
.spec dt { font: 500 var(--fs-2xs) / 1.6 var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); padding-right: var(--s-4); }
.spec dd { font-size: var(--fs-sm); line-height: var(--lh-sm); }
.spec dd .mono { font-family: var(--font-mono); font-size: var(--fs-xs); }
.spec--tight dt, .spec--tight dd { padding: var(--s-2) 0; }
@media (max-width: 767px) { .spec { grid-template-columns: 7rem 1fr; } }
```

Markup:

```html
<dl class="spec">
  <div><dt>Stack</dt><dd>React · NestJS · PostgreSQL · Cloudflare</dd></div>
  <div><dt>Timeline</dt><dd>4–6 weeks</dd></div>
  <div><dt>From</dt><dd><span class="mono">Rs 45,000</span></dd></div>
</dl>
```

Named uses and their keys:

- **Hero facts** (cols 9–12): `Based` / `Serving` / `Response` / `Pricing` / `Stack`.
- **Service header** (cols 9–12): `Stack` / `Typical timeline` / `Deliverables` / `From` / `Monthly support` / `Suited to`.
- **Case dossier** (cols 1–3 of the entry): `Client` / `Sector` / `Year` / `Scope` / `Stack`.
- **Contact ladder** (cols 4–6): `WhatsApp` (`.wa-link`, "fastest") / `Phone` / `Email` / `LinkedIn` / `Hours` (`Mon–Sat 08:30–18:00, GMT+4`) / `Location`.
- **Enquiry sheet** (back-office cols 9–12): `Ref` / `Received` / `Type` / `Source` / `Sector` / `Service` / `Budget` / `Phone` (with `Open in WhatsApp →` `.wa-link`) / `Email`.

### 6.10 Tag and status

Status is a 7px dot plus a word. Never a coloured pill, never a filled background.

```css
.status { display: inline-flex; align-items: center; gap: var(--s-2); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--ink); white-space: nowrap; }
.status::before { content: ""; width: 7px; height: 7px; border-radius: var(--radius-dot); background: var(--ink); flex: none; }
.status--new::before       { background: var(--accent); }                                   /* New       */
.status--contacted::before { background: var(--paper); box-shadow: inset 0 0 0 1px var(--ink); } /* Contacted: hollow ink */
.status--quoted::before    { background: var(--ink); }                                      /* Quoted    */
.status--won               { font-weight: 500; }                                            /* Won: filled ink dot, word in 500 */
.status--won::before       { background: var(--ink); }
.status--lost              { color: var(--muted); }                                         /* Lost: muted hollow */
.status--lost::before      { background: var(--paper); box-shadow: inset 0 0 0 1px var(--muted); }
.status--archived          { color: var(--muted); opacity: .7; }                            /* Archived: muted hollow, faded */
.status--archived::before  { background: var(--paper); box-shadow: inset 0 0 0 1px var(--muted); }

.tag { display: inline-block; font: 500 var(--fs-2xs) / 1 var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); border: var(--hairline); padding: var(--s-1) var(--s-2); background: transparent; }
```

The `inset` box-shadow on hollow dots draws a ring; it is not a drop shadow. Words: `New`, `Contacted`, `Quoted`, `Won`, `Lost`, `Archived`. In the enquiry list the status filter is a plain `<select>`.

### 6.11 Ruled lists — service rows, steps, marginalia

```css
/* Service rows (home + services index): whole row is a link */
.rows { list-style: none; border-top: var(--hairline); }
.rows > li { border-bottom: var(--hairline); }
.row-link { display: grid; grid-template-columns: 3.5rem 1fr; column-gap: var(--s-4); padding: var(--s-5) 0; color: var(--ink); text-decoration: none; }
.row-link:hover { background: var(--band); margin-inline: calc(-1 * var(--s-4)); padding-inline: var(--s-4); }
.row-link .idx { font: 400 var(--fs-xs) / 1.6 var(--font-mono); color: var(--muted); }
.row-link h3 { font: 500 var(--fs-md) / var(--lh-md) var(--font-sans); letter-spacing: 0; }
.row-link:hover h3 { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: .18em; text-decoration-thickness: 1px; }
.row-link p { margin-top: var(--s-1); font-size: var(--fs-sm); color: var(--muted); max-width: 48ch; }
.row-link .stack { margin-top: var(--s-2); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); }
.row-link .price { font: 400 var(--fs-sm) / 1.6 var(--font-mono); white-space: nowrap; }
.row-link .price .from { color: var(--muted); }
@media (min-width: 1024px) {
  .row-link { grid-template-columns: 3.5rem 1fr 11rem 1.5rem; align-items: start; }
  .row-link .price { text-align: right; }
  .row-link .arrow { font-family: var(--font-mono); color: var(--muted); }
}
@media (max-width: 1023px) { .row-link .price { grid-column: 2; margin-top: var(--s-2); } .row-link .arrow { display: none; } }

/* Process steps: stacked ruled ordered list at ALL widths (never a 5-column grid) */
.steps { list-style: none; counter-reset: step; border-top: var(--strong); }
.steps > li { counter-increment: step; display: grid; grid-template-columns: 3.5rem 1fr; column-gap: var(--s-4); padding: var(--s-5) 0; border-bottom: var(--hairline); }
.steps > li::before { content: counter(step, decimal-leading-zero); font: 500 var(--fs-xs) / 1.6 var(--font-mono); color: var(--muted); }
.steps h4 { font: 600 var(--fs-md) / var(--lh-md) var(--font-sans); }
.steps p { margin-top: var(--s-2); font-size: var(--fs-sm); color: var(--ink); max-width: 52ch; }
.steps .out { margin-top: var(--s-2); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); }  /* "Output — Written quote in rupees" */
@media (min-width: 1024px) { .steps > li { grid-template-columns: 3.5rem 1fr 9rem; } .steps .when { font: 400 var(--fs-xs) / 1.6 var(--font-mono); color: var(--muted); text-align: right; } }
@media (max-width: 1023px) { .steps .when { grid-column: 2; font: 400 var(--fs-xs) / 1.6 var(--font-mono); color: var(--muted); margin-top: var(--s-2); } }

/* Plain bullets in prose */
.prose ul { list-style: none; }
.prose ul li { position: relative; padding-left: var(--s-5); margin-bottom: var(--s-2); max-width: var(--measure); }
.prose ul li::before { content: "—"; position: absolute; left: 0; font-family: var(--font-mono); color: var(--muted); }
.prose ol { list-style: none; counter-reset: n; }
.prose ol li { counter-increment: n; display: grid; grid-template-columns: 2rem 1fr; margin-bottom: var(--s-2); max-width: var(--measure); }
.prose ol li::before { content: counter(n, decimal-leading-zero); font: 400 var(--fs-xs) / 1.9 var(--font-mono); color: var(--muted); }

/* Marginalia (Rate Card graft): mono notes in the sticky head column */
.aside { margin-top: var(--s-8); padding-top: var(--s-3); border-top: var(--hairline); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); max-width: 28ch; }
.aside dt { font-weight: 500; letter-spacing: var(--ls-label); text-transform: uppercase; font-size: var(--fs-2xs); margin-top: var(--s-3); }
.aside dd { color: var(--ink); }
@media (max-width: 1023px) { .aside { max-width: none; } }

/* Sector line and counts line: one wrapped mono line between two hairlines */
.sector-line { border-block: var(--hairline); padding-block: var(--s-3); font: 400 var(--fs-xs) / 1.8 var(--font-mono); color: var(--muted); }
.sector-line b { font-weight: 500; color: var(--ink); }
```

Sector line copy: `Garages · Villas & hotels · Accountants · Car rental · Sports clubs · Retail · Cold storage & warehouses · Remote clients in Europe and the UK`.
Counts line (Spec Sheet graft, used instead of any logo wall): `Also worked with — 4 garages · 2 hotels · 1 cold-storage warehouse · 3 accounting firms · 2 sports clubs`. Numbers must be true and updated by the owner.

### 6.12 Metrics row (case studies, dashboard)

```css
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); border-top: var(--hairline); border-bottom: var(--hairline); margin-block: var(--s-8); }
.metrics > div { padding: var(--s-5) var(--s-4) var(--s-5) 0; border-left: var(--hairline); padding-left: var(--s-4); }
.metrics > div:first-child { border-left: 0; padding-left: 0; }
.metrics b { display: block; font: 500 var(--fs-num) / var(--lh-num) var(--font-mono); letter-spacing: -0.02em; }
.metrics b small { font: 400 var(--fs-xs) / 1 var(--font-mono); color: var(--muted); margin-left: var(--s-1); }  /* unit: %, wk, Rs */
.metrics span { display: block; margin-top: var(--s-2); font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); }
```

Example: `<b>−38<small>%</small></b><span>Phone calls after booking automation</span>`.

### 6.13 Nav and mobile nav

Single sticky bar. No top strip, no clock, no dropdown. "Services" links to the index page.

```css
.nav { position: sticky; top: 0; z-index: var(--z-nav); height: var(--nav-h); background: var(--paper); border-bottom: var(--hairline); }
.nav .grid { height: 100%; align-items: center; }
.nav__brand { grid-column: 1 / span 2; font: 500 var(--fs-base) / 1 var(--font-sans); color: var(--ink); text-decoration: none; white-space: nowrap; }
.nav__brand span { font: 400 var(--fs-xs) / 1 var(--font-mono); color: var(--muted); margin-left: var(--s-2); }
.nav__links { grid-column: 4 / span 5; display: none; gap: var(--s-6); list-style: none; }
.nav__links a { display: inline-flex; align-items: center; min-height: var(--control-h); font: 500 var(--fs-sm) / 1 var(--font-sans); color: var(--ink); text-decoration: none; }
.nav__links a:hover { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: .35em; }
.nav__links a[aria-current="page"] { box-shadow: inset 0 -2px 0 var(--accent); }   /* inset: draws the active underline, not a shadow */
.nav__cta { grid-column: 9 / -1; display: none; justify-content: flex-end; align-items: center; gap: var(--s-6); }
.nav__cta .wa-link .num { display: none; }
.nav__menu { grid-column: -2 / -1; justify-self: end; display: inline-flex; align-items: center; min-height: var(--control-h); font: 500 var(--fs-sm) / 1 var(--font-sans); text-decoration: underline; text-decoration-color: var(--rule); text-underline-offset: .18em; }
@media (min-width: 1024px) { .nav__links, .nav__cta { display: flex; } .nav__menu { display: none; } }
@media (min-width: 1200px) { .nav__cta .wa-link .num { display: inline; } }
@media (max-width: 1023px) { .nav__brand { grid-column: 1 / span 3; } .nav__brand span { display: none; } }

/* Drawer: full-height paper panel under the nav, numbered ruled rows */
.drawer { position: fixed; inset: var(--nav-h) 0 0; z-index: var(--z-drawer); background: var(--paper); overflow-y: auto; padding-inline: var(--gutter); display: flex; flex-direction: column; }
.drawer[hidden] { display: none; }
.drawer ul { list-style: none; border-top: var(--hairline); }
.drawer li { border-bottom: var(--hairline); }
.drawer a { display: grid; grid-template-columns: 3rem 1fr; align-items: center; min-height: 3.25rem; font: 500 var(--fs-md) / 1 var(--font-sans); color: var(--ink); text-decoration: none; }
.drawer a .n { font: 400 var(--fs-xs) / 1 var(--font-mono); color: var(--muted); }
.drawer a[aria-current="page"] { box-shadow: inset 3px 0 0 var(--accent); padding-left: var(--s-3); }
.drawer .contact { margin-top: auto; padding-block: var(--s-6) var(--s-8); font: 400 var(--fs-xs) / 1.8 var(--font-mono); color: var(--muted); border-top: var(--hairline); }
```

Nav links (desktop and drawer, in this order): `Services` · `Pricing` · `Work` · `About` · `Contact`. Drawer rows show the number: `02 Services`, `04 Pricing`, `05 Work`, `06 About`, `07 Contact`. The drawer bottom `.contact` holds WhatsApp (`.wa-link`), phone, email. The menu button text toggles `Menu` / `Close`; it is a `<button aria-expanded>`; body scroll is locked while open; Escape closes; focus returns to the button.

### 6.14 Footer

```css
.footer { background: var(--band); border-top: var(--strong); border-bottom: 0; padding-block: var(--s-16) var(--s-8); }
.footer .grid { row-gap: var(--s-8); }
.footer__brand { grid-column: 1 / -1; }
.footer__brand .name { font: 500 var(--fs-base) / 1.4 var(--font-sans); }
.footer__brand p { margin-top: var(--s-2); font-size: var(--fs-sm); color: var(--muted); max-width: 32ch; }
.footer__brand .addr { margin-top: var(--s-3); font: 400 var(--fs-xs) / 1.6 var(--font-mono); color: var(--muted); }
.footer__col { grid-column: span 2; }
.footer h4 { font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); margin-bottom: var(--s-3); }
.footer ul { list-style: none; }
.footer li { padding: var(--s-1) 0; font-size: var(--fs-sm); }
.footer li a { color: var(--ink); text-decoration: none; }
.footer li a:hover { text-decoration: underline; text-decoration-color: var(--accent); }
.footer li .n { font: 400 var(--fs-2xs) / 1 var(--font-mono); color: var(--muted); margin-right: var(--s-2); }
.footer__legal { grid-column: 1 / -1; display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--s-2); margin-top: var(--s-8); padding-top: var(--s-4); border-top: var(--hairline); font: 400 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); }
@media (min-width: 768px) { .footer__brand { grid-column: 1 / -1; } .footer__col { grid-column: span 2; } }
@media (min-width: 1024px) { .footer__brand { grid-column: 1 / span 4; } .footer__col--index { grid-column: 5 / span 2; } .footer__col--services { grid-column: 7 / span 3; } .footer__col--contact { grid-column: 10 / span 3; } }
```

Columns: brand (name, one-line description, address in mono, BRN if the owner wants it printed — otherwise omit the line entirely; never "on request"); `INDEX` (numbered pages 01–07); `SERVICES` (nine links); `CONTACT` (WhatsApp `.wa-link`, email, phone, LinkedIn as a text link — no glyph). Legal row: left `© 2026 Abdurrahman Gurib · Mauritius`, right `Privacy · Back-office`. No colophon, no "Set in", no giant wordmark.

### 6.15 Blockquote / client quote

```css
.quote { border-left: 2px solid var(--rule); padding: var(--s-1) 0 var(--s-1) var(--s-5); max-width: var(--measure); }
.quote p { font: 400 italic var(--fs-md) / var(--lh-md) var(--font-sans); color: var(--ink); }
.quote footer { margin-top: var(--s-3); font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); }
.quote footer::before { content: "— "; }
```

One quote per case study at most, attributed with role and business type (`Owner, car-rental company, Grand Baie`). No photo, no stars, no carousel. If there is no real quote, there is no quote.

### 6.16 FAQ — details / summary

```css
.faq { border-top: var(--hairline); }
.faq details { border-bottom: var(--hairline); }
.faq summary { display: grid; grid-template-columns: 1fr 2rem; align-items: center; min-height: var(--control-h); padding-block: var(--s-4); cursor: pointer; font: 600 var(--fs-md) / var(--lh-md) var(--font-sans); list-style: none; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: "+"; font: 400 var(--fs-md) / 1 var(--font-mono); color: var(--muted); text-align: right; }
.faq details[open] summary::after { content: "−"; }
.faq summary:hover { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: .18em; text-decoration-thickness: 1px; }
.faq summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.faq .faq__body { padding: 0 0 var(--s-5); max-width: var(--measure); color: var(--ink); }
.faq .faq__body p + p { margin-top: var(--s-3); }
```

Native `<details>`; no animation on open. Question text is the real question a client asked.

### 6.17 Notice / alert

One component, three tones, no icons, no filled backgrounds.

```css
.notice { border-top: var(--strong); border-bottom: var(--hairline); padding: var(--s-4) 0; font-size: var(--fs-sm); max-width: var(--measure); }
.notice .k { display: block; font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); margin-bottom: var(--s-1); }
.notice--error { border-top-color: var(--error); }
.notice--error .k { color: var(--error); }
.notice--success { border-top-color: var(--ink); }
.notice--info { border-top-color: var(--rule); }
```

Usage: form error summary at the top of a form (`.k` = `Please check 2 fields`, then a list of links to the fields), back-office "Saved" confirmation (`.k` = `Saved · 14:32`), sign-in failure (`.k` = `Sign-in failed`). Notices are inline in the flow; never a toast, never fixed.

### 6.18 Loading and empty states

No spinners, no shimmer.

```css
.loading { font: 400 var(--fs-xs) / var(--lh-xs) var(--font-mono); color: var(--muted); padding-block: var(--s-8); }
.loading::after { content: "…"; }
.placeholder-rows { border-top: var(--hairline); }
.placeholder-rows div { height: var(--control-h); border-bottom: var(--hairline); }   /* static empty rows hold the table height while data loads */

.empty { border-top: var(--hairline); border-bottom: var(--hairline); padding-block: var(--s-10); max-width: var(--measure); }
.empty h3 { font: 600 var(--fs-lg) / var(--lh-lg) var(--font-sans); }
.empty p { margin-top: var(--s-2); color: var(--muted); }
.empty .btn { margin-top: var(--s-5); }
```

Loading copy: `Loading enquiries`. Empty copy: h3 `No enquiries yet.` p `New requests from the site and WhatsApp forms appear here.` Filtered empty: h3 `Nothing matches.` p `Try clearing the status filter.` + `.btn` `Clear filters`.

### 6.19 Back-office shell

Same tokens, same fonts. Paper sidebar, not dark. Density up, voice unchanged.

```css
.bo { display: grid; grid-template-columns: var(--bo-sidebar) 1fr; min-height: 100vh; background: var(--paper); }
.bo-side { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; border-right: var(--hairline); z-index: var(--z-sticky); }
.bo-side .brand { padding: var(--s-5); border-bottom: var(--hairline); font: 500 var(--fs-base) / 1.3 var(--font-sans); }
.bo-side .brand span { display: block; font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); margin-top: var(--s-1); }
.bo-side h5 { margin: var(--s-5) var(--s-5) var(--s-2); font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); }
.bo-side a { display: flex; align-items: center; min-height: var(--control-h); padding: 0 var(--s-5); border-left: 2px solid transparent; color: var(--ink); text-decoration: none; font: 500 var(--fs-sm) / 1 var(--font-sans); }
.bo-side a .n { font: 400 var(--fs-2xs) / 1 var(--font-mono); color: var(--muted); width: 2rem; }
.bo-side a:hover { background: var(--band); }
.bo-side a[aria-current="page"] { background: var(--band); border-left-color: var(--accent); }
.bo-side .user { margin-top: auto; padding: var(--s-4) var(--s-5); border-top: var(--hairline); font: 400 var(--fs-xs) / 1.6 var(--font-mono); color: var(--muted); }
.bo-head { height: var(--nav-h); display: flex; align-items: center; justify-content: space-between; gap: var(--s-4); padding: 0 var(--s-8); border-bottom: var(--hairline); }
.bo-head .breadcrumb { margin: 0; }
.bo-main { padding: var(--s-8); max-width: var(--container); }
.bo-main h1 { font: 600 var(--fs-lg) / var(--lh-lg) var(--font-sans); margin-bottom: var(--s-6); }
.bo .input, .bo .field select, .bo .field textarea { border-radius: var(--radius-bo); }

.stat-strip { display: grid; grid-template-columns: repeat(4, 1fr); border-top: var(--hairline); border-bottom: var(--hairline); margin-bottom: var(--s-8); }
.stat-strip > div { padding: var(--s-5) var(--s-4); border-left: var(--hairline); }
.stat-strip > div:first-child { border-left: 0; padding-left: 0; }
.stat-strip b { display: block; font: 500 var(--fs-num) / var(--lh-num) var(--font-mono); letter-spacing: -0.02em; }
.stat-strip span { display: block; margin-top: var(--s-2); font: 500 var(--fs-2xs) / var(--lh-2xs) var(--font-mono); letter-spacing: var(--ls-label); text-transform: uppercase; color: var(--muted); }

.filters { display: flex; flex-wrap: wrap; gap: var(--s-4); align-items: end; padding-block: var(--s-4); border-bottom: var(--hairline); margin-bottom: var(--s-4); }
.filters .field { margin: 0; min-width: 11rem; }
.filters .field--search { flex: 1; }

.msg { border-left: 2px solid var(--rule); padding: var(--s-1) 0 var(--s-1) var(--s-5); font-size: var(--fs-base); line-height: var(--lh-base); white-space: pre-wrap; max-width: var(--measure); }
.timeline { list-style: none; border-top: var(--hairline); }
.timeline li { display: grid; grid-template-columns: 9rem 1fr; column-gap: var(--s-4); padding: var(--s-3) 0; border-bottom: var(--hairline); font-size: var(--fs-sm); }
.timeline time { font: 400 var(--fs-xs) / 1.7 var(--font-mono); color: var(--muted); }

@media (max-width: 1023px) {
  .bo { grid-template-columns: 1fr; }
  .bo-side { position: static; height: auto; border-right: 0; border-bottom: var(--hairline); flex-direction: row; flex-wrap: wrap; align-items: center; }
  .bo-side .brand { border: 0; }
  .bo-side h5 { display: none; }
  .bo-side nav { display: flex; }
  .bo-side .user { margin-left: auto; border: 0; }
  .bo-main { padding: var(--s-5) var(--gutter); }
  .stat-strip { grid-template-columns: 1fr 1fr; }
  .stat-strip > div:nth-child(3) { border-left: 0; padding-left: 0; }
  .timeline li { grid-template-columns: 1fr; }
}
```

Sidebar groups: `ENQUIRIES` — `01 Dashboard`, `02 Enquiries`; `SITE` — `03 Settings`, `View site →`; bottom `.user` shows the signed-in email and a `Sign out` link.

---

## 7. Page layouts

Legend: `[1–3]` = grid columns; `----` = hairline; `====` = strong rule; `▒▒` = `--band`. Mobile note follows each wireframe. Every public page ends with the footer (§6.14); every public page except Contact shows the mobile bar under 768px.

### 7.1 Home

```
 1    2    3    4    5    6    7    8    9    10   11   12
[ NAV: A. Gurib / software & IT ] [Services Pricing Work About Contact] [WhatsApp +230… ][Request a quote →]
----------------------------------------------------------------------------------------------
                                                                                             (no top rule: hero)
[ 01 — OVERVIEW                                              ]  .   [ dl.spec              ]
[ h1 (--fs-3xl, ≤60 chars, max 20ch)                         ]      [ BASED    Port Louis,  ]
[ "Websites, software and networks for                       ]      [          Mauritius    ]
[  businesses in Mauritius."                                 ]      [ SERVING  SMEs + remote]
[ lead, muted, 52ch                                          ]      [ RESPONSE 1 working day]
[ [Request a quote →] [WhatsApp +230 5908 6131 →]            ]      [ PRICING  Fixed, in Rs ]
[ • Availability — taking two new projects for October 2026  ]      [ STACK    React · .NET…]
----------------------------------------------------------------------------------------------
[ sector-line: Garages · Villas & hotels · Accountants · Car rental · Sports clubs · Retail · Cold storage ]
----------------------------------------------------------------------------------------------
[ 02 — SERVICES     ]  .   [ 02.1  Websites & web apps            from Rs 18,500  → ] 
[ What I build and  ]      [       New builds, redesigns, fixes, e-commerce         ]
[ maintain          ]      [       React · Node.js · Cloudflare                    ]
[ (sticky)          ]      [-----------------------------------------------------]
[ p: Fixed prices   ]      [ 02.2  Custom software                 from Rs 45,000  → ]
[ on the sheet.     ]      [ ...  × 9 rows ...                                     ]
                           [-----------------------------------------------------]
                           [ All services →                                        ]
----------------------------------------------------------------------------------------------
[ 03 — PROCESS      ]  .   [==== .steps ========================================]
[ Five steps, one   ]      [ 01  Brief              WhatsApp or a call. Free.     Day 1 ]
[ contact           ]      [     Output — a written scope                              ]
                           [-----------------------------------------------------]
                           [ 02  Audit & quote      Fixed figure in rupees.     Week 1 ]
                           [ 03  Build ...  04  Handover & training ...  05  Support  ]
----------------------------------------------------------------------------------------------
▒▒ 04 — PRICING      ▒▒ . ▒▒ table.sheet (paper on band): 3 headline packages ▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒ Packages in       ▒▒   ▒▒ PACKAGE | INCLUDES | DELIVERY | ONE-OFF (RS) | MONTHLY (RS) |   ▒▒
▒▒ Mauritian rupees  ▒▒   ▒▒ Starter site … 2–3 wks … from Rs 18,500¹ … Rs 2,500 … Request → ▒▒
▒▒ p: excl. VAT,     ▒▒   ▒▒ Business site + shop … Custom software …                       ▒▒
▒▒ revised Sep 2026  ▒▒   ▒▒ footnotes ¹ ²                                                  ▒▒
▒▒                   ▒▒   ▒▒ [See the full price sheet →]                                    ▒▒
----------------------------------------------------------------------------------------------
[ 05 — WORK         ]  .   [ 05.1 dossier dl ][ h3 title · Problem / What I did / Result ][ fig ]
[ Selected work     ]      [   CLIENT …      ][ metrics: −38% · 4 wk                    ][ 4:3 ]
                           [-----------------------------------------------------]
                           [ 05.2 (figure and text swap sides)                    ]
                           [-----------------------------------------------------]
                           [ Also worked with — 4 garages · 2 hotels · 3 accounting firms   ]
                           [ All work →                                            ]
----------------------------------------------------------------------------------------------
[ 06 — ABOUT        ]  .   [ fig portrait 4:5  ][ h3 One engineer, end to end             ]
[ (head only)       ]      [ cols 5–7          ][ two paragraphs, read size, cols 8–12     ]
                           [                   ][ "I answer my own phone." (italic) +230…  ]
                           [                   ][ More about me →                          ]
----------------------------------------------------------------------------------------------
[ 07 — CONTACT      ]  [ dl.spec ladder  ]  .  [ segmented: I need — [A quote][A free audit][A call-back] ]
[ Start with a      ]  [ WHATSAPP …      ]     [ Name            | Business & sector (select)              ]
[ message           ]  [ PHONE …         ]     [ WhatsApp/phone  | Email                                    ]
[ • availability    ]  [ EMAIL …         ]     [ What do you need — choice-list (checkboxes, 9 rows)       ]
                       [ LINKEDIN …      ]     [ Budget (select, Rs bands, optional)                        ]
                       [ HOURS …         ]     [ Message (textarea)                                         ]
                       [ [WhatsApp … →]  ]     [ [Send request →]  Replies within one working day. No newsletter. ]
==============================================================================================
▒▒ FOOTER ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
```

Mobile: everything single column in document order. Hero: eyebrow, h1 at 2.125rem, lead, buttons stacked full width, availability line, then the facts `dl.spec` (7rem labels). Section heads sit above their bodies (not sticky). Price table becomes the ledger (§6.8). Work entries: dossier, text, figure. About: portrait first at 60% width left-aligned, then text. Contact: ladder above the form. Mobile bar fixed at the bottom.

### 7.2 Services index (`/services`)

```
[ breadcrumb: Home / Services                                                              ]
[ 02 — SERVICES                                                    ]  .  [ dl.spec        ]
[ h1 Everything I build, fix and look after                        ]     [ RESPONSE …     ]
[ lead: one paragraph naming the sectors                           ]     [ PRICING …      ]
----------------------------------------------------------------------------------------------
[ .rows spanning 1–12 (wide), each row:                                                     ]
[ 02.1 | Websites & web apps                                        | from Rs 18,500 | →   ]
[      | New builds, redesigns, fixes for existing sites, e-commerce |                |     ]
[      | React · Node.js · Cloudflare                                 |                |     ]
[--------------------------------------------------------------------------------------------]
[ 02.2 | Custom software        …  02.3 IT consulting … 02.4 Cyber-security (Fortinet) …     ]
[ 02.5 | Network & infrastructure (Cisco Catalyst, Cloudflare) … 02.6 Telephony, CCTV & IoT  ]
[ 02.7 | Repairs & support … 02.8 Marketing & automation … 02.9 Cloud & DevOps (Azure)       ]
----------------------------------------------------------------------------------------------
[ 03 — PROCESS (sticky head) ]  .  [ .steps (same as home) ]
----------------------------------------------------------------------------------------------
[ 07 — CONTACT ]  [ ladder ]  .  [ form ]           (same component as home)
```

Mobile: rows stack index + title, description, stack, price on its own line. No horizontal scroll.

### 7.3 Service detail (`/services/cyber-security`)

```
[ breadcrumb: Home / Services / Cyber-security                                              ]
[ 02.4 — CYBER-SECURITY                                            ]  .  [ dl.spec        ]
[ h1 Firewalls, audits and hardening for small networks            ]     [ STACK  FortiGate 60F · FortiOS 7 ]
[ lead                                                             ]     [ TIMELINE 1–2 weeks ]
[ [Request a free audit →] [WhatsApp +230 5908 6131 →]              ]     [ DELIVERABLES … ]
[ • availability                                                   ]     [ FROM  Rs 24,000 ]
                                                                         [ MONTHLY  Rs 3,500 ]
                                                                         [ SUITED TO  Villas, warehouses ]
----------------------------------------------------------------------------------------------
[ Scope (h3 in head)   ]  .  [ prose at --fs-read, 62ch, 3–4 paragraphs                     ]
[ .aside marginalia:   ]     [                                                             ]
[  TYPICAL CLIENT      ]     [                                                             ]
[  Villa, 12 users     ]     [                                                             ]
[  (sticky)            ]     [                                                             ]
----------------------------------------------------------------------------------------------
[ How it goes          ]  .  [ .steps: 01 Audit (free) · 02 Written quote · 03 Install · 04 Handover · 05 Support ]
----------------------------------------------------------------------------------------------
[ What you get         ]  .  [ .prose ol: 01 Hardening report (PDF) · 02 Firewall config backup · 03 … ]
----------------------------------------------------------------------------------------------
[ Typical cost         ]  .  [ table.sheet, 2–3 rows from the price sheet filtered to this service + footnotes ]
----------------------------------------------------------------------------------------------
[ Related work         ]  .  [ one case entry (dossier | text | fig)                          ]
----------------------------------------------------------------------------------------------
[ Questions I get asked]  .  [ .faq details × 4–6                                             ]
----------------------------------------------------------------------------------------------
[ Ask about this       ]  .  [ the contact form, segmented pre-set to the matching option    ]
```

CTA rule: security and network pages use `Request a free audit`; every other service uses `Request a quote`. Mobile: spec dl moves directly under the CTA row; marginalia render inline under each h3; everything else stacks.

### 7.4 Packages & Pricing (`/pricing`)

```
[ breadcrumb: Home / Pricing ]
[ 04 — PRICING                                                                                ]
[ h1 Packages in Mauritian rupees                                                             ]
[ lead: One-off price, optional monthly support. Every quote is written before work starts.   ]
----------------------------------------------------------------------------------------------
▒▒ band (border-top and border-bottom hairlines) ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒ [ table.sheet spanning 1–12 ]                                                            ▒▒
▒▒  PACKAGE          | INCLUDES                | DELIVERY | ONE-OFF (RS) | MONTHLY (RS) |     ▒▒
▒▒ ==== WEBSITES (group row, band) ==========================================================▒▒
▒▒  Starter site     | 5 pages, mobile, forms, | 2–3 wks  | from         | Rs 2,500     |Request→▒▒
▒▒  Up to 5 pages    | Google Business setup   |          | Rs 18,500 ¹  |              |     ▒▒
▒▒ ------------------------------------------------------------------------------------------▒▒
▒▒  Business site + shop | … | 4–6 wks | from Rs 42,000 ² | Rs 4,000 | Request →              ▒▒
▒▒  Rework / fixes   | … | 1–2 wks | from Rs 8,000  | —        | Request →                   ▒▒
▒▒ ==== SOFTWARE ============================================================================▒▒
▒▒  Custom web app … Mobile app (Flutter) … Integration / automation …                       ▒▒
▒▒ ==== SECURITY & NETWORK ==================================================================▒▒
▒▒  Firewall install (FortiGate) … Security audit … Switching (Catalyst) … Cloudflare migration ▒▒
▒▒ ==== TELEPHONY, CCTV & IOT ===============================================================▒▒
▒▒  3CX phone system … CCTV 4-camera kit (Hikvision/Dahua) … IoT sensors …                  ▒▒
▒▒ ==== SUPPORT & REPAIRS ===================================================================▒▒
▒▒  Basic / Standard / Priority support (monthly only) … Computer repair (per job) …          ▒▒
▒▒ ==== MARKETING & AUTOMATION ==============================================================▒▒
▒▒  SEO + Google Business … WhatsApp business automation …                                   ▒▒
▒▒ [ .footnotes ]  ¹ Excludes domain and hosting, typically Rs 2,400 / year.                 ▒▒
▒▒                 ² Payment gateway fees billed by the provider. …                          ▒▒
▒▒ [ .sheet-notes ] WHAT IS NOT INCLUDED … | HOW PAYMENT WORKS 40% on start, 60% on delivery ▒▒
▒▒ All prices in Mauritian rupees (MUR), excluding VAT. Prices last revised September 2026.  ▒▒
▒▒ Remote clients: quoted in USD or EUR on request.                                          ▒▒
----------------------------------------------------------------------------------------------
[ Support tiers (head)]  .  [ table: TIER | HOURS INCLUDED | RESPONSE | INCLUDES | RS / MONTH  ]
[ p: what monthly     ]     [ Basic   | 2 h  | 2 working days | remote fixes, updates | Rs 2,500 ]
[ support means       ]     [ Standard| 5 h  | 1 working day  | + on-site once/month  | Rs 5,500 ]
                            [ Priority| 10 h | same day       | + after-hours line    | Rs 9,500 ]
----------------------------------------------------------------------------------------------
[ Questions about pricing ]  .  [ .faq × 5 (VAT, deposits, what if scope grows, hosting, remote) ]
----------------------------------------------------------------------------------------------
[ 07 — CONTACT ]  [ ladder ]  .  [ form, segmented pre-set to "A quote" ]
```

No "Most popular" column, no highlighted row, no 3-up columns. Mobile: the band stays full-bleed; the sheet becomes the ledger — each package a ruled block: package name (h4), `Includes —` line, `Delivery —` line, `ONE-OFF ......... from Rs 18,500¹`, `MONTHLY ......... Rs 2,500`, `Request →`. Support tiers table sits inside `.table-wrap`.

### 7.5 Work / case studies (`/work` and `/work/:slug`)

```
[ breadcrumb: Home / Work ]
[ 05 — WORK                                          ]  .  [ filters: All · Web · Software · Security · Network ]
[ h1 Selected work                                   ]     [ (underlined text toggles, aria-pressed)            ]
[ lead                                               ]
----------------------------------------------------------------------------------------------
[ entry 05.1 (padding-block --s-12, border-bottom hairline), 12-col sub-grid:                ]
[ dl.spec dossier ][ h3 Booking and invoicing for a car-rental firm    ][ fig 4:3, colour     ]
[ CLIENT  Car rental][ PROBLEM  two-line paragraph (mono run-in label)  ][ Fig. 05.1 — Booking ]
[ SECTOR  Grand Baie][ WHAT I DID …                                     ][ flow, 2025          ]
[ YEAR    2025      ][ RESULT …                                         ]
[ SCOPE   Web app   ][ .metrics: −38 %  |  4 wk  |  71 %                ]
[ STACK   React ·   ][   PHONE CALLS   DELIVERY   BOOKINGS W/O A CALL    ]
[         NestJS ·  ][ .quote (only if real)                             ]
[         Cloudflare][ Read the case →                                   ]
[ cols 1–3          ][ cols 4–8                                          ][ cols 9–12          ]
----------------------------------------------------------------------------------------------
[ entry 05.2: dossier 1–3 | fig 4–7 | text 8–12  (sides swap every other entry)               ]
----------------------------------------------------------------------------------------------
[ sector-line: Also worked with — 4 garages · 2 hotels · 1 cold-storage warehouse · 3 accounting firms ]
----------------------------------------------------------------------------------------------
[ 07 — CONTACT ]  [ ladder ]  .  [ form ]
```

Case-study detail page: same entry layout at the top (h1 instead of h3), then ruled sections in the 3/5–12 split: `Context`, `What I built` (with 2–3 more figures, each captioned), `Result` (metrics row + quote), `Stack in detail` (dl.spec), `Related service` (one `.row-link`), then the contact form. Confidential clients are named by type and town (`A villa, Grand Baie`), never by logo. Mobile: dossier, then figure, then text.

### 7.6 About (`/about`)

```
[ breadcrumb: Home / About ]
[ fig portrait 4:5   ][ 06 — ABOUT                                  ][ mono side lists (cols 10–12)  ]
[ cols 1–4, sticky   ][ h1 One engineer, end to end                 ][ CERTIFICATIONS & TOOLS         ]
[ 1px rule frame     ][ prose --fs-read, 62ch:                      ][ -- ruled rows --               ]
[ caption:           ][  background and years                       ][ STACK                          ]
[ Abdurrahman Gurib  ][  why local SMEs                             ][ -- ruled rows --               ]
[ — Port Louis, 2026 ][  how remote clients work with me            ][ LANGUAGES                      ]
[                    ][  what accountable means                     ][ English · French · Kreol       ]
[                    ][ "I answer my own phone." (italic, --fs-md)  ][                                ]
[                    ][ +230 5908 6131 (wa-link)                    ][                                ]
----------------------------------------------------------------------------------------------
[ Timeline (head)    ]  .  [ table: YEAR | ROLE | WHERE  (mono years, ruled rows, cols 5–12)       ]
----------------------------------------------------------------------------------------------
[ How I think about it ]  .  [ .prose ol: three numbered one-line principles                       ]
----------------------------------------------------------------------------------------------
[ sector-line: Also worked with — … ]
----------------------------------------------------------------------------------------------
[ 07 — CONTACT ]  [ ladder ]  .  [ form, segmented pre-set to "A call-back" ]
```

The portrait is a real, un-filtered photograph. No team grid, no skill bars, no timeline dots. Mobile: portrait first at 60% width left-aligned, then eyebrow/h1/prose, then side lists as ruled `dl.spec`, then timeline in `.table-wrap`.

### 7.7 Contact / Request a quote (`/contact`)

```
[ breadcrumb: Home / Contact ]
[ 07 — CONTACT       ][ dl.spec ladder (cols 4–6)      ]  .  [ form (cols 8–12)                              ]
[ h1 Start with a    ][ WHATSAPP  +230 5908 6131 · fastest]     [ segmented: I need — [A quote][A free audit][A call-back] ]
[ message            ][ PHONE     +230 5908 6131        ]     [ Name                | Business & sector (select)     ]
[ • availability     ][ EMAIL     hello@…               ]     [ WhatsApp or phone   | Email                          ]
[ p: Replies within  ][ LINKEDIN  /in/…                 ]     [ What do you need — choice-list (checkboxes)          ]
[ one working day.   ][ HOURS     Mon–Sat 08:30–18:00   ]     [ Budget (select, optional): under Rs 20,000 · 20–50k · 50–150k · over 150k · not sure ]
[                    ][ LOCATION  Port Louis, Mauritius ]     [ Message (textarea, 6 rows)                          ]
[                    ][ [WhatsApp +230 5908 6131 →] block]     [ Preferred contact: radio row WhatsApp · Phone · Email ]
[                    ][                                 ]     [ [Send request →]   Replies within one working day. No newsletter. ]
----------------------------------------------------------------------------------------------
[ success state replaces the form:                                                            ]
[ ==== Received.                                                                              ]
[ Q-2026-0142  (--fs-num mono)                                                                ]
[ I will reply by Tuesday 16 September. If it is urgent, message me on WhatsApp.              ]
[ [WhatsApp +230 5908 6131 →]                                                                 ]
----------------------------------------------------------------------------------------------
[ Questions (head) ]  .  [ .faq × 4: Do you work remotely? Do you sign NDAs? How do payments work? Do you do one-off repairs? ]
```

Segmented choice changes the submit label: `Send request` / `Request the free audit` / `Ask for a call-back`. "A free audit" reveals one extra select: `What should I audit — Website · Network & firewall · Both`. "A call-back" reveals `Best time` select. Mobile: ladder above form; the mobile bar is hidden on this page; the WhatsApp block button sits under the ladder.

### 7.8 Back-office login (`/admin/login`)

```
[ NAV variant: A. Gurib / back-office                                    (no links, no CTA) ]
----------------------------------------------------------------------------------------------
[ BACK-OFFICE (eyebrow)                                   ]  .  [ (cols 7–12 empty)          ]
[ h1 Sign in                                              ]
[ p: Private area for the owner.                          ]
[ notice--error (only after a failed attempt):            ]
[   SIGN-IN FAILED — Check the email and password.        ]
[ Email      [ input ]                                    ]
[ Password   [ input ]                                    ]
[ [Sign in →]                                             ]
[ cols 1–5                                                ]
```

Nothing centred, no logo card, no split-screen quote, no illustration. Mobile: same, full width.

### 7.9 Back-office dashboard (`/admin`)

```
[ bo-side 15rem          ][ bo-head: Dashboard                         noorgurib@… · Sign out ]
[ A. Gurib               ][--------------------------------------------------------------------]
[ BACK-OFFICE            ][ h1 This week                                                       ]
[ ENQUIRIES              ][ .stat-strip:  7      |  3            |  12          |  1 d 4 h     ]
[ 01 Dashboard  (active) ][               NEW    |  AWAITING     |  QUOTED      |  AVG REPLY   ]
[ 02 Enquiries           ][                      |  REPLY        |  THIS MONTH  |  TIME        ]
[ SITE                   ][ .avail (current availability line) · Edit in settings →            ]
[ 03 Settings            ][--------------------------------------------------------------------]
[ View site →            ][ h3 Latest enquiries          All enquiries →                       ]
[                        ][ table--dense table--rows: REF | RECEIVED | NAME / BUSINESS | TYPE | STATUS | Open → ]
[                        ][ Q-2026-0142 | 13 Sep 09:14 | R. Ramdin / Ramdin Motors | Quote | • New | Open →     ]
[ user: email · Sign out ][ … 10 rows …                                                         ]
```

Stat figures are type, not tiles. Mobile: sidebar becomes a top row (brand + three links + Sign out); stat strip 2×2; table shows Ref, Name, Status, Received inside `.table-wrap`.

### 7.10 Back-office enquiry list (`/admin/enquiries`)

```
[ bo-side ][ bo-head: Enquiries / All                                                          ]
[         ][ .filters: [Status ▾ All] [Type ▾ All] [Source ▾ All] [Search — name, business, ref…] ]
[         ][--------------------------------------------------------------------------------]
[         ][ table--dense table--rows table--sticky                                           ]
[         ][ REF | RECEIVED | NAME / BUSINESS | TYPE | SOURCE | STATUS | BUDGET (RS) |         ]
[         ][ ================================================================================ ]
[         ][ Q-2026-0142 | 13 Sep 09:14 | R. Ramdin       | Quote | Form     | • New       | 20,000–50,000 | Open → ]
[         ][             |              | Ramdin Motors   |       |          |             |               |        ]
[         ][ -------------------------------------------------------------------------------- ]
[         ][ Q-2026-0141 | 12 Sep 17:02 | S. Lee / Villa … | Audit | WhatsApp | ○ Contacted | —            | Open → ]
[         ][ … rows 44px, hover --band, whole row clickable, Enter opens …                    ]
[         ][--------------------------------------------------------------------------------]
[         ][ Showing 1–25 of 148   [← Previous] [Next →]  (secondary .btn--sm)                ]
[         ][ .empty when no rows                                                              ]
```

Archived enquiries are hidden unless Status = Archived. Mobile: `.table-wrap` horizontal scroll with Ref and Name columns first.

### 7.11 Back-office enquiry detail (`/admin/enquiries/:ref`)

```
[ bo-side ][ bo-head: Enquiries / Q-2026-0142            [Mark contacted] [Mark quoted] [Archive] ]
[         ][--------------------------------------------------------------------------------]
[         ][ cols 1–8                                        ][ cols 9–12 (sticky top 5rem)   ]
[         ][ eyebrow: Q-2026-0142 — RECEIVED 13 SEP 2026, 09:14][ dl.spec--tight              ]
[         ][ h1 R. Ramdin, Ramdin Motors                     ][ STATUS   [select ▾ New]       ]
[         ][ .msg (border-left 2px rule, pre-wrap):          ][ TYPE     Quote                ]
[         ][   "Hi, I have a garage in Curepipe and need…"   ][ SOURCE   Form                 ]
[         ][                                                 ][ SECTOR   Garage               ]
[         ][ h3 Notes                                        ][ SERVICE  Websites · Automation]
[         ][ [ textarea ]  [Save note] (secondary)           ][ BUDGET   Rs 20,000–50,000     ]
[         ][                                                 ][ PHONE    +230 5… · Open in WhatsApp → ]
[         ][ h3 Activity                                     ][ EMAIL    r@…                  ]
[         ][ .timeline:                                      ][ QUOTE    [input Rs] [Save]    ]
[         ][  13 Sep 09:14 | Received via form               ][-------------------------------]
[         ][  13 Sep 11:20 | Marked contacted (WhatsApp)     ][ [Mark won] [Mark lost]        ]
[         ][  14 Sep 15:05 | Quote sent · Rs 42,000          ][ Delete enquiry (btn--danger, confirm inline) ]
```

Status transitions are the row of secondary buttons at the top plus the select; changing status appends a timeline entry. Mobile: spec dl moves above the message; action buttons wrap full width.

### 7.12 Back-office settings (`/admin/settings`)

```
[ bo-side ][ bo-head: Settings                                                                ]
[         ][--------------------------------------------------------------------------------]
[         ][ Availability (head, cols 1–3)  ][ field: Availability line (input, 90 chars)      ]
[         ][ p: shown under the hero and on ][ field: Accepting new projects (radio Yes / No)   ]
[         ][ the contact page.              ][ [Save] (secondary)  notice--success after save   ]
[         ][--------------------------------------------------------------------------------]
[         ][ Price sheet (head)             ][ table--dense editable: PACKAGE | ONE-OFF (RS) [input] | MONTHLY (RS) [input] ]
[         ][ p: last revised 13 Sep 2026    ][ field: Footnotes (textarea)                                  ]
[         ][                                ][ [Save price sheet]                                          ]
[         ][--------------------------------------------------------------------------------]
[         ][ Sector counts (head)           ][ dl-style inputs: Garages [4] Hotels [2] Warehouses [1] …    ][Save]
[         ][--------------------------------------------------------------------------------]
[         ][ Notifications (head)           ][ field: Notification email · field: WhatsApp number · [Save] ]
[         ][--------------------------------------------------------------------------------]
[         ][ Password (head)                ][ Current · New · Confirm · [Change password]                ]
```

One save button per section; never one giant save. Mobile: heads stack above their fields.

---

## 8. Motion, accessibility, responsive

### 8.1 Motion

- Only `color`, `background-color`, `border-color`, `text-decoration-color`, `opacity` transition, at 120ms ease-out, and only on the selectors listed in the base reset.
- No transforms on hover, no scale, no lift, no arrow nudge, no scroll-triggered reveals, no parallax, no count-up, no SVG draw-in, no skeleton shimmer, no marquee, no page-transition animation.
- Route change: no transition; scroll to top instantly; move focus to the page `h1` (`tabindex="-1"`); update `document.title` to `Page — A. Gurib`.
- Form submit: button label changes to `Sending` and the button is `disabled`; on success the form is replaced by `.form-success` with focus moved to its `h3`.
- Sticky elements are the only things that "move" on scroll: the nav, section heads at ≥1024px, the About portrait, the back-office sidebar and enquiry sheet. At most one sticky section head per page is visible at a time by construction.
- `prefers-reduced-motion: reduce` zeroes every transition and animation (in the base reset). Nothing else is needed because nothing else moves.

### 8.2 Accessibility

**Verified contrast (WCAG 2.x, computed):**

| Foreground | Background | Ratio | Use | Pass |
|---|---|---|---|---|
| `--ink` #121417 | `--paper` #F4F3EF | 16.62 | body, headings | AAA |
| `--ink` | `--band` #E9E7E0 | 14.91 | text on bands | AAA |
| `--muted` #5F636A | `--paper` | 5.44 | meta, eyebrows, helper | AA |
| `--muted` | `--band` | 4.88 | footer meta, group rows | AA |
| `--accent` #A63A0F | `--paper` | 5.85 | focus ring, hover underline, new dot | AA (text) / AA (non-text 3:1) |
| `--accent` | `--band` | 5.25 | focus ring on band | AA |
| `--on-fill` #F4F3EF | `--accent` | 5.85 | primary button label | AA |
| `--on-fill` | `--accent-hover` #7F2C0B | 8.34 | primary hover label | AAA |
| `--wa` #0E6B5F | `--paper` | 5.75 | WhatsApp text link | AA |
| `--wa` | `--band` | 5.16 | WhatsApp link in footer | AA |
| `--on-fill` | `--wa` | 5.75 | WhatsApp button label | AA |
| `--on-fill` | `--wa-hover` #0A5247 | 8.18 | WhatsApp hover label | AAA |
| `--error` #A8281C | `--paper` | 6.34 | error text, error border | AA |
| `--error` | `--band` | 5.69 | error text on band | AA |
| `--on-fill` | `--error` | 6.34 | danger button hover label | AA |
| `--on-fill` | `--ink` | 16.62 | secondary button hover label | AAA |
| `--edge` #7E8187 | `--paper` | 3.52 | input borders (non-text) | AA non-text |
| `--edge` | `--band` | 3.16 | input borders on band | AA non-text |
| `--rule` #D3D1C9 | `--paper` | 1.38 | hairlines — decorative only, never a control boundary or text | n/a |

Rules that follow from the table: `--rule` is never the only boundary of an input; `--muted` is never used below 12px; `--accent` is never used as body text (links are ink); nothing is set in `--rule` colour as text.

**Other rules**

- Focus: `outline: 2px solid var(--accent); outline-offset: 2px` on every focusable element (`:focus-visible`), never removed, never a glow. Inputs use `outline-offset: 0` so the ring hugs the border.
- Targets: every button, link row, nav item, select, checkbox label, summary and mobile bar cell is ≥ 44 × 44px (`--control-h`). Inline text links inside prose are exempt (WCAG 2.5.8 inline exception).
- Skip link `Skip to content` as the first focusable element, targeting `<main id="main">`.
- Landmarks: one `<header>`, one `<nav aria-label="Main">`, one `<main>`, one `<footer>`, back-office `<nav aria-label="Back-office">`.
- Headings in order: one `h1` per page; section titles `h2`; never skip a level.
- `aria-current="page"` on the active nav link (desktop, drawer, sidebar).
- Forms: every control has a visible `<label for>`; helper and error text linked with `aria-describedby`; invalid fields get `aria-invalid="true"`; the error summary `.notice--error` receives focus on failed submit and lists links to each field; required fields are marked by omission — optional ones say `(optional)` in the label.
- Tables: `<th scope="col">`, `<caption class="visually-hidden">`; clickable rows contain a real `<a>` in the last cell (`Open →`) so keyboards and screen readers get a link, with the row click as an enhancement.
- Menu button: `aria-expanded`, `aria-controls`, Escape closes, focus trapped in the drawer while open, body scroll locked.
- Details/summary is native; do not replace with a JS accordion.
- Images: portrait `alt="Abdurrahman Gurib"`; screenshots describe what is shown (`alt="Booking calendar showing a week of reservations"`); decorative images do not exist on this site.
- Language: `<html lang="en">`; French or Kreol phrases get `lang` attributes.
- Colour is never the only carrier of meaning: status has a word next to the dot; errors have text; WhatsApp buttons have the word in the label.
- Zoom: layout survives 200% zoom and 320px width without horizontal scroll (only `.table-wrap` scrolls).

### 8.3 Responsive

| Range | Grid | Nav | Section heads | Price sheet | Mobile bar | Notes |
|---|---|---|---|---|---|---|
| < 480px | 4 cols, 1rem gap | Menu | stacked | ledger | shown | `.btn-row` buttons full width |
| 480–767px | 4 cols | Menu | stacked | ledger | shown | h1 2.125rem, h2 1.625rem |
| 768–1023px | 6 cols, 1.5rem gap | Menu | stacked above body | table (in `.table-wrap`) | hidden | back-office sidebar becomes top row |
| 1024–1199px | 12 cols | full; WhatsApp link shows the word only | sticky at 5rem | table | hidden | h1 `--fs-2xl` |
| ≥ 1200px | 12 cols | full with number | sticky | table | hidden | home hero h1 `--fs-3xl` |

- Side gutter: `--gutter` on `.container` only; minimum 1.25rem at every width.
- Nothing has `min-width` wider than the viewport; images and any `aspect-ratio` box carry `max-width: 100%`.
- Only `.table-wrap` may scroll horizontally. The body never scrolls sideways.
- Inputs stay at 16px so iOS does not zoom.
- The mobile bar adds `padding-bottom: 4.5rem` to `body.has-bar` so the footer clears it; it uses `env(safe-area-inset-bottom)`.
- Sticky section heads are disabled below 1024px (they would cover content on short viewports).
- Typography drops only at h1/h2/hero; body, meta and buttons never shrink.

---

## 9. Signature details

Ownable, repeatable, cheap to build. If a page has none of these it is not this site.

1. **Numbered document.** Every section opens with a mono eyebrow `02 — SERVICES` (number in ink, name in muted); services continue `02.1 … 02.9`; cases `05.1 …`; the same numbers appear in the mobile drawer and the footer index. The site reads as a single table of contents.
2. **The sticky spec-sheet split.** Head in cols 1–3 that stays put while cols 5–12 scroll, column 4 empty. This one move replaces every card grid on the site.
3. **The spec `<dl>`.** One key/value component (mono label 11rem, sans value, hairline per row) used for hero facts, service headers, case dossiers, the contact ladder and the back-office enquiry sheet.
4. **The footnoted price sheet.** A real `<table>` grouped by mono category rows, `from` set small above the figure, superscript numerals linking to a mono footnotes block that lists exclusions and typical add-on costs, then a two-column `WHAT IS NOT INCLUDED / HOW PAYMENT WORKS` note and `Prices last revised`. On phones it becomes a dotted-leader ledger.
5. **`Rs 18,500`.** Every price is written the way a Mauritian invoice writes it, in tabular mono, right-aligned.
6. **Ink links with a rule-coloured underline** that turns accent on hover. No link is ever blue, coloured or bold; the accent is spent only on the primary button, focus ring, active nav and the "new" dot.
7. **WhatsApp as a word, a number and a green fill** — never an icon or a bubble. Filled green button in the hero and on Contact, green text link in nav, ladder and footer, a two-cell bar on phones.
8. **The availability line.** A 7px green dot and a mono sentence under the hero CTAs, edited by the owner in Settings: `taking two new projects for October 2026 · replies within one working day`.
9. **Marginalia.** Mono notes (`TYPICAL CLIENT — Villa, 12 users`, `DELIVERED — 6 weeks`) in the sticky head column of service and case pages.
10. **Sector counts instead of logos.** `Also worked with — 4 garages · 2 hotels · 1 cold-storage warehouse · 3 accounting firms`, kept true from Settings.
11. **Result figures set large in mono** with the unit small (`−38 %`, `4 wk`, `Rs 0 downtime`), separated by hairlines, never animated.
12. **The quote form at the foot of every page** under a hairline, with the `I need` segmented control pre-set to the page's context — never a separate CTA box or band.
13. **"I answer my own phone."** — the italic closing line of About with the number in mono beneath it, next to a real portrait framed by a 1px rule.
14. **Received. Q-2026-0142.** The success state: a strong rule, one word, the reference set at `--fs-num`, the reply-by date, and a WhatsApp button.
15. **Dot + word status** in the back-office: filled accent for New, hollow ink for Contacted, filled ink for Quoted and Won, hollow muted for Lost and Archived. No pills.
16. **Paper back-office.** Same paper, same fonts, same rules; the only difference is density. The owner's tool looks like the owner's site.

---

## 10. QA checklist — reject the page if any line is true

**Colour and surface**

- [ ] A gradient, blur, glow, blob or `box-shadow` (other than the inset rings on the checkbox, status dot and active nav) exists anywhere.
- [ ] A colour that is not one of the eleven tokens in §2 appears (including `#fff`, `#000`, rgba).
- [ ] `--accent` is used on a heading, a rule, a background larger than a button, a body link, or a decorative shape.
- [ ] `--wa` is used on anything that is not WhatsApp or the availability dot.
- [ ] More than two `--band` regions on a page, or a band without its top and bottom hairlines.
- [ ] Any `border-radius` above 0 on the public site (2px back-office inputs and the 7px dot excepted).

**Layout**

- [ ] Any element is horizontally centred in the viewport (text, heading, hero, CTA, footer).
- [ ] Content is separated by boxes (border + padding + gap) rather than by rules and whitespace.
- [ ] Three-up (or any N-up) equal boxes, "plans" in columns, a highlighted "popular" package.
- [ ] Column 4 is used at ≥1024px, or a section body starts somewhere other than column 1 or 5.
- [ ] A margin that is not on the spacing scale.
- [ ] The page scrolls horizontally at 320px, or the side gutter is under 1.25rem.
- [ ] Two sticky elements overlap, or a section head is sticky under 1024px.

**Typography**

- [ ] A third font family, or a weight not in §3 (no 300, no 700+).
- [ ] An all-caps or letter-spaced heading; a mono label without uppercase; a button in mono uppercase.
- [ ] Any text below 12px; any `--muted` text below 12px; form labels not 13px ink.
- [ ] A price not written `Rs 12,345`; a "MUR 12 345"; a price hidden behind "contact us".
- [ ] A line of prose longer than 62ch, an h1 over 60 characters, a hero h1 wrapping to four lines at desktop.
- [ ] A number, date, ID or price set in the sans font.

**Imagery and ornament**

- [ ] An icon (library or hand-drawn) next to a heading, in a list, in a button, or inside a circle. An emoji anywhere.
- [ ] Stock photography, illustration, 3D, abstract shapes, a network diagram, crop marks, a faded giant wordmark, a logo wall, star ratings.
- [ ] A screenshot in grayscale, with rounded corners, a shadow, a device frame or browser chrome.

**Motion**

- [ ] Anything fades, slides, scales, lifts, counts up, draws itself, shimmers or scrolls on its own.
- [ ] A transition on a property other than the five allowed, or longer than 120ms.
- [ ] Reduced-motion is not honoured.

**Copy**

- [ ] "We", "our team", "Get started", "Learn more", "Submit", "Transforming", "Cutting-edge", "Seamless", "Unlock", "Empowering", "Lorem ipsum".
- [ ] A reply-time promise other than "within one working day".
- [ ] A sentence with no fact in it (no place, price, tool, timeline, model number or sector).
- [ ] A section eyebrow with the wrong number, or a page whose numbers do not match the footer index.

**Conversion and contact**

- [ ] More than one `.btn--primary` visible in a viewport.
- [ ] A WhatsApp icon, bubble, badge, or a WhatsApp button without the number or the word in its label.
- [ ] The quote form missing from the foot of a public page; the mobile bar missing under 768px (except Contact).
- [ ] The success state lacks the reference number, the reply-by date, or the WhatsApp button.

**Accessibility**

- [ ] A focusable element without a visible 2px accent focus ring.
- [ ] A control under 44px tall; a label not visibly attached to its control; an error carried by colour only.
- [ ] A status shown as a coloured pill, or without its word.
- [ ] A clickable table row with no real link inside it.

**The one-question test:** cover the wordmark. Can a reviewer still tell within five seconds that this page belongs to a single engineer in Mauritius who quotes fixed prices in rupees? If not, add facts, not decoration.

---

## Appendix A — Site map and routes

| Route | Page | Sections (numbers) |
|---|---|---|
| `/` | Home | 01 hero · sector line · 02 services · 03 process · 04 pricing (3 rows) · 05 work (2) · 06 about (short) · 07 contact |
| `/services` | Services index | 02 (all nine rows) · 03 · 07 |
| `/services/:slug` | Service detail | 02.n header · scope · how it goes · what you get · typical cost · related work · questions · contact |
| `/pricing` | Packages & pricing | 04 sheet · support tiers · questions · 07 |
| `/work` | Work | 05 entries · counts line · 07 |
| `/work/:slug` | Case study | 05.n · context · what I built · result · stack · related service · 07 |
| `/about` | About | 06 · timeline · principles · counts · 07 |
| `/contact` | Contact | 07 · questions |
| `/admin/login` | Login | — |
| `/admin` | Dashboard | stats · availability · latest |
| `/admin/enquiries` | Enquiry list | filters · table |
| `/admin/enquiries/:ref` | Enquiry detail | message · notes · activity · sheet · actions |
| `/admin/settings` | Settings | availability · price sheet · counts · notifications · password |

Service slugs and sub-numbers: `02.1 websites` · `02.2 custom-software` · `02.3 it-consulting` · `02.4 cyber-security` · `02.5 network-infrastructure` · `02.6 telephony-cctv-iot` · `02.7 repairs-support` · `02.8 marketing-automation` · `02.9 cloud-devops`.

## Appendix B — Class index

`.container` `.grid` `.section` `.section--first` `.section__head` `.section__body` `.section__body--wide` `.eyebrow` `.breadcrumb` `.btn` `.btn--primary` `.btn--secondary` `.btn--wa` `.btn--danger` `.btn--sm` `.btn--block` `.btn--noarrow` `.btn-row` `.link-quiet` `.link-arrow` `.wa-link` `.avail` `.field` `.field__label` `.field__help` `.field__error` `.input` `.form-row` `.form-success` `.choice-list` `.segmented` `.sheet` `.table-wrap` `.table--dense` `.table--rows` `.table--sticky` `.footnotes` `.sheet-notes` `.spec` `.spec--tight` `.status` `.status--new|contacted|quoted|won|lost|archived` `.tag` `.rows` `.row-link` `.steps` `.prose` `.aside` `.sector-line` `.metrics` `.fig` `.fig--portrait` `.fig--screen` `.nav` `.nav__brand` `.nav__links` `.nav__cta` `.nav__menu` `.drawer` `.mobile-bar` `.footer` `.footer__brand` `.footer__col` `.footer__legal` `.quote` `.faq` `.notice` `.notice--error|success|info` `.loading` `.placeholder-rows` `.empty` `.bo` `.bo-side` `.bo-head` `.bo-main` `.stat-strip` `.filters` `.msg` `.timeline` `.skip-link` `.visually-hidden`

## Appendix C — Decision log (what was taken, what was resolved, what was refused)

**Base: GURIB / DATASHEET.** Kept: the datasheet metaphor, two Plex families, the 3 / 5–12 sticky split, the spec `<dl>`, footnoted price sheet, availability line, segmented `I need` control, dot + word status, paper back-office, two-cell mobile bar, 44px controls, 2px focus rings, boxed inputs.

**Judge weaknesses on the winner, resolved:**

| Weakness | Resolution |
|---|---|
| `--wa #128C7E` failed AA (3.72:1) | `--wa #0E6B5F` — 5.75:1 on paper, 5.16:1 on band, 5.75:1 for the label on the fill |
| `--accent #C2410C` is Tailwind orange-700, 4.66:1 | hand-picked `#A63A0F` — 5.85:1 on paper, 5.85:1 for the button label |
| `--error #B42318` is a design-system default | `#A8281C` — 6.34:1 |
| 11px mono labels; form labels muted | eyebrows/table headers 12px; form labels 13px in `--ink` |
| Mono uppercase 12px buttons, cold and small | sentence-case Plex Sans 500 14px, 44px tall (Rate Card graft) |
| Five-column process too narrow | stacked ruled `.steps` at all widths |
| Nav cols 9–12 overflowed at 1024–1199px | number hidden below 1200px; no top strip |
| Ticking clock / REV stamp | removed entirely |
| `MUR 18 500` reads foreign | `Rs 18,500`; "MUR" once in the footnote |
| Crop marks (extra `<i>` wrapper, in-joke) | removed; figures get a 1px rule frame and a mono caption |
| Self-drawing topology SVG | removed; hero right column is the facts `dl.spec`; hardware model numbers live in service-page spec tables and marginalia |
| "Download as PDF" | removed |
| IBM Plex alone risks dryness | warm paper, italic client quotes, the About closing line, real portrait; no serif added (a serif would re-import the 2025–26 "warm editorial" tell) |
| "reply within 24 h" | "within one working day" everywhere |

**Grafted from The Rate Card:** ink links with rule-coloured underline; grouped price table with `from` above the figure, `Prices last revised`, the two-column `What is not included / How payment works` note; sticky marginalia; quote form at the foot of every service page; `Received. I will reply by [date].`; sentence-case button. *Refused:* serif display, scroll reveals, grayscale hover, "WA" badge, running head, folios, colophon.

**Grafted from The Ledger Practice:** dotted-leader ledger for the mobile price sheet with the monthly line; dossier `dl`; portrait-first About with "I answer my own phone."; contact ladder; `Request a free audit` on security/network pages; `Remote clients: quoted in USD or EUR on request`; CTA labels that say what happens. *Refused:* Fraunces/Instrument Sans, three-column packages with "Most chosen", pre-footer ink band, split-screen login, hover dropdown, 2-hour promise, "BRN on request".

**Grafted from SPEC SHEET:** sector counts instead of a logo wall; large mono result figures with small units; success-state reference set large; scoped radius reset and the transition allowlist. *Refused:* pure white, safety orange, 88px 700 headline, `+230` joke, footer watermark, crosshairs, text-only CTAs, dark sidebar.
