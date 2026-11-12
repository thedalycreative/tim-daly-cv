# Tim Daly — CV Website

A one-page, responsive CV for **Timothy Daly**, a Perth-based trainer and assessor (TAE40122) who designs and builds the digital learning resources he teaches from.

The same HTML page is both the **website** and the **downloadable PDF**, so the two never drift apart.

---

## Technology used

| Layer | Technology | Why |
|---|---|---|
| Markup | **HTML5** (semantic `header`, `main`, `section`, `article`, `ol`) | Accessible structure that screen readers and search engines understand |
| CSS framework | **[Bootstrap 5.3.3](https://getbootstrap.com/)** via jsDelivr CDN | Responsive grid, navbar, cards, badges, list groups and utility classes |
| Icons | **[Bootstrap Icons 1.11.3](https://icons.getbootstrap.com/)** | Lightweight icon font that matches Bootstrap |
| Custom styles | `style.css` | Brand colour tokens, the experience timeline, cards and all **print/PDF rules** (`@media print`, `@page`) |
| JavaScript | Bootstrap bundle + a small inline script | Mobile menu, scrollspy nav highlighting, print button, footer year |
| Images | `images/` (PNG/JPEG project shots, SVG badges) | Client project previews; employer badges are simple generated SVG initials (not official logos) |
| PDF generation | **[Playwright](https://playwright.dev/)** (headless Chromium) — `scripts/build-pdf.mjs` | Renders `index.html` with print media to an A4 `Tim-Daly-CV.pdf` |
| SEO | `<meta>` description, Open Graph tags, **JSON-LD `Person` schema** | Better link previews on LinkedIn and richer search results |
| Security | **Subresource Integrity (SRI)** hashes on every CDN file | The browser refuses CDN files that have been tampered with |
| Hosting | Any static host: GitHub Pages, Netlify or Vercel | No build step needed for the site itself |

### Accessibility notes
- Skip-to-content link, `aria-label`s on navigation, decorative icons marked `aria-hidden`.
- Colour contrast checked for body text and accent links (teal `#0f766e` on white).
- Smooth scrolling only when the user hasn't asked for reduced motion.

---

## Project structure

```
tim-daly-cv/
├── index.html            # The CV (website + PDF source)
├── style.css             # Brand styles + print layout for the PDF
├── Tim-Daly-CV.pdf       # Generated, downloadable CV (3 pages, A4)
├── images/
│   ├── favicon.svg       # "TD" monogram
│   ├── logos/*.svg       # Employer badges (sector-coloured initials)
│   └── *.png / *.jpeg    # Client project previews
├── scripts/
│   └── build-pdf.mjs     # Playwright script that builds the PDF
├── package.json          # Dev tools only (Bootstrap, Playwright)
└── README.md
```

---

## Running locally

No build is needed. Open `index.html` in a browser, or serve the folder:

```bash
npm run serve            # http://localhost:5501
```

## Regenerating the PDF

Edit `index.html`, then:

```bash
npm install
npx playwright install chromium   # first time only
npm run pdf                       # writes Tim-Daly-CV.pdf
```

To use an installed Chrome instead of downloading Chromium:

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run pdf
```

**How it works:** the script opens `index.html` in headless Chromium and switches to print media, so the `@media print` rules in `style.css` apply. They hide the nav and buttons, shrink the hero into a header and force a two-column layout. The script then saves an A4 PDF with a contact footer on every page. Bootstrap requests are served from `node_modules`, so the build works offline and always uses the same versions as the live site.

The **Print this page** button on the site uses the same print rules, so printing from the browser gives the same layout.

---

## Updating content

All CV content lives in `index.html`, grouped into clearly commented sections (`HERO`, `PROFILE`, `SKILLS`, `EXPERIENCE`, `PROJECTS`, `QUALIFICATIONS`, `CONTACT`). After editing, run `npm run pdf` and commit both `index.html` and `Tim-Daly-CV.pdf`.

To add an employer badge, copy any file in `images/logos/` and change the initials and colours. The colours follow these sectors: teal for education, blue for government, orange for own business, slate for private sector, purple for community.

---

## Licence

MIT, see [LICENSE](LICENSE). CV content © Timothy Daly.
