# We2 Systems website

Marketing website for [We2 Systems](https://we2systems.com): enterprise infrastructure services, solutions and industry platforms (HMS, FMS).

It is a static site: plain HTML, [Tailwind CSS via CDN](https://tailwindcss.com/docs/installation/play-cdn), Font Awesome and Google Fonts. There is no build step.

## Project structure

```
index.html                 Homepage (contact form in #readiness)
about.html  industries.html  services.html
platforms/                 hms.html, fms.html (product pages)
solutions/                 index.html + one page per solution
css/main.css               Base styles (index, about, solutions pages)
css/site-chrome.css        Header, footer, forms, buttons, contrast layer, CTA band
js/tw-config.js            Shared Tailwind config (colour tokens, fonts)
js/site-chrome.js          Menu, skip link, form handling (Formspree)
js/main.js                 Homepage interactions
images/                    Logos, favicon, partner logos
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Use a local server rather than opening files directly, so relative paths and forms behave as in production.

## Editing

### Header and footer

The header and footer are repeated in every page between the `<!-- site-header:start/end -->` and `<!-- site-footer:start/end -->` markers. When you change them, apply the same edit to all 14 pages so they stay identical. Their styles and behaviour live in `css/site-chrome.css` and `js/site-chrome.js`.

### Colours and design

Colours live only in `js/tw-config.js` (loaded after the Tailwind CDN script on every page).

- Brand: primary sky `#0277b6` + accent indigo `#4f46e5` (gradient `#0284c7 → #4f46e5`).
- Emerald (`health`) only for HMS; amber (`field`) only for FMS and construction.
- Status: emerald = live, amber = in development, slate = planned. Rose only for pain points and alerts.
- Page flow: hero → sections alternating `bg-white` / `bg-slate-50` → closing CTA section with `sc-band-dark`. Light cards inside the band use `sc-band-card`.
- Font: Inter only (JetBrains Mono for code/labels). Motion: keep animations for live status and feedback only; decorative loops are avoided and `prefers-reduced-motion` is honoured site-wide.
- Text colours must meet WCAG AA; the contrast layer in `css/site-chrome.css` darkens light Tailwind shades automatically.

### Forms

All forms are handled by `js/site-chrome.js` via `data-sc-form` attributes. Until a Formspree ID is set, submissions fall back to opening the user's email client.

## Before going live

- [ ] Set the real Formspree ID: replace `YOUR_FORM_ID` in `js/site-chrome.js`.
- [ ] Remove `<meta name="robots" content="noindex, nofollow">` from `solutions/backup-recovery-data-resilience.html`, `cybersecurity-ai-governance.html`, `enterprise-ai.html` and `proxmox.html` once approved.
- [ ] Ask the infra team to add security response headers on AWS (CloudFront response headers policy): `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`.
- [ ] Unhide pending content when ready (search for `data-pending` and the hidden testimonials section).

## Deployment

The site is hosted on AWS and the infra team deploys individual files. Send each file with its folder path so it keeps the same location on the server. Every HTML page loads `css/site-chrome.css`, `js/site-chrome.js` and `js/tw-config.js`, so whenever those change, send them with the pages.

Current release (redesign + client brief):

```
index.html  about.html  industries.html  services.html
platforms/hms.html  platforms/fms.html
solutions/index.html
solutions/cloud-infrastructure-consulting.html
solutions/devops-infrastructure-as-code.html
solutions/platform-engineering.html
solutions/backup-recovery-data-resilience.html
solutions/cybersecurity-ai-governance.html   (new)
solutions/enterprise-ai.html                 (new)
solutions/proxmox.html                       (new)
css/main.css
css/site-chrome.css                          (new)
js/main.js
js/site-chrome.js                            (new)
js/tw-config.js                              (new)
images/partners/proxmox-logo.svg             (new)
```

Do not send `README.md` or `.gitignore`; they are for development only.

`git status` lists the changed files for future releases.
