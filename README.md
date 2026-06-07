# Aesh Solutions — SAP AI Consulting Website

A fast, fully self-contained marketing site for Aesh Solutions, an SAP AI consulting firm based in New Jersey.

## Stack
- Static **HTML / CSS / vanilla JS** — no build step, no framework, no runtime dependencies
- Self-hosted fonts (Schibsted Grotesk, DM Sans, Fraunces, Geist Mono — all SIL OFL)
- WebGL2 aurora hero shader (raw, no library)
- Images served as WebP with JPG fallback via `<picture>`

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home |
| `about.html` | About / story / values / delivery approach |
| `services.html` | SAP AI services + FAQ |
| `work.html` | Case studies |
| `contact.html` | Contact form (Formspree) |
| `privacy.html` / `terms.html` | Legal |

## Project layout
```
├── *.html              Pages
├── styles.css          All styles
├── main.js             Interactions (reveal, FAQ, form, cookie consent, carousels, etc.)
├── shader.js           Aurora hero (raw WebGL2)
├── fonts/              Self-hosted woff2 + fonts.css
├── images/             WebP + JPG assets
├── favicon.svg, apple-touch-icon.svg
```

## Local preview
The site is plain static files — open `index.html` directly, or serve the folder with any static server.

## Pre-launch checklist
- [ ] Set real Formspree form ID in `contact.html` (currently configured)
- [ ] Replace placeholder LinkedIn URL in footers
- [ ] Legal review of `privacy.html` / `terms.html` (templates, not legal advice)
- [ ] Confirm client logos / industries are approved for display
