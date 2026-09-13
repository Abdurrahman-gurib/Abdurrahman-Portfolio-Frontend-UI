# Abdurrahman Portfolio — Front end

Public website and private back office for Abdurrahman Gurib, software engineer and IT
consultant in Mauritius. React 19 + Vite + TypeScript, hand-written CSS (no UI framework).

The API lives in the
[backend repository](https://github.com/Abdurrahman-gurib/Abdurrahman-Portfolio-Backend-API).

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173, proxies /api to http://localhost:8080
```

Run the backend on port 8080 alongside it (see the backend README).

## Build

```bash
npm run build        # outputs dist/
```

## Deploy on Render

1. Render dashboard → **New → Blueprint** → choose this repository. `render.yaml` creates the
   `abdurrahman-portfolio-ui` static site.
2. The `/api/*` rewrite in `render.yaml` proxies to the backend service
   (`https://abdurrahman-portfolio-api.onrender.com`). If your backend has a different URL,
   change that line.
3. Alternative without the rewrite: set the environment variable `VITE_API_URL` to the backend
   URL at build time and set `CORS_ORIGIN` on the backend to this site's URL.

## Editing content and prices

All copy lives in `src/content/`:

| File | What it holds |
| --- | --- |
| `site.ts` | Name, phone, email, LinkedIn, WhatsApp link |
| `services.ts` | The 13 services, their pages, FAQs and starting prices |
| `packages.ts` | Every package and price, standard terms |
| `about.ts` | Bio, timeline, education, certifications, awards, process, commitments |
| `work.ts` | Case studies |
| `copy.ts` | Page headlines, form labels, footer, SEO, back-office labels |

Design: gradient + glassmorphism system, tokens in `src/styles/tokens.css`; live chat widget in `src/components/ChatWidget.tsx` (API contract in `docs/CHAT-API.md`). Optional portrait: drop `public/portrait.jpg` and it appears on the About page.

## Back office

`/backoffice` — sign in with the admin email and password configured on the backend.
