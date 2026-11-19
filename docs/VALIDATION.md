# First-version validation

## Zotero reading list — November 19, 2026

- Connected public group 6771640 without authentication. All three original
  preprints provide titles, authors, abstracts, identifiers, dates, and arXiv
  categories. Zotero permits cross-origin reads and the conditional-request
  header used by the page. The live client integration returned HTTP 200 then
  HTTP 304 on a repeat read, with library version 7.
- Added the English-only `/papers/` route, excluded from page listings,
  navigation, and sitemaps, with noindex/nofollow/noarchive metadata. There is
  no Spanish route or language switch. Existing homepage and family-tree
  production checks continue to pass, including the homepage's EN/ES links.
- Ten Node tests cover old/new identifiers, category and label mapping,
  duplicate versions, combined filtering, missing dates, URL schemes,
  multi-page libraries, conditional refresh, removed records, rate limiting,
  and library changes during pagination.
- In-app browser checks cover live records and math, combined author/category
  search, sorting, empty-result recovery, and native keyboard access to filters.
  Abstracts default to hidden and can be opened independently, retaining their
  state through sorting. Categories default to collapsed. The sidebar follows
  normal page scrolling without a separate scroll area. Direct paper links
  focus and scroll the entry below the sticky header.
- Responsive layouts checked at actual CSS viewport widths of 325, 390,
  1066, and 1280 pixels. No horizontal overflow remains in the checked
  reading-page views.
- Public data is rendered as text. Math uses vendored KaTeX 0.19.1 with trust
  disabled. Browser-local snapshots provide a fallback; there is no key,
  password, writing endpoint, or paid service in the site implementation.
- The user confirmed that saving and syncing a custom tag works; synthetic label
  mapping and combined label filters also pass the data tests. No Zotero records
  were modified during development. Network-failure UI fallback was reviewed
  in code; an actual offline browser session was not simulated.
- Final build and ten data tests passed on `feat/zotero-reading-list` after the
  user's review. Publication uses the existing main-branch GitHub Pages workflow.

October 31, 2026. Local preview: http://localhost:1313/

Passed:

- Hugo production build and JavaScript syntax check.
- Six publications, paired EN/ES data, stable IDs, language metadata and alternate
  links, and working relative assets on `/` and `/es/`.
- All six explanations populated and at most 200 words.
- Supplied CV and downloadable copy are byte-for-byte identical.
- Official Hugo download checksum verified.
- Desktop/tablet and phone layouts inspected; no horizontal overflow in the
  checked layouts. Narrow Spanish navigation also checked with news present.
- Multiple paper panels remain open independently. Keyboard Enter toggles a
  panel with visible focus and exposed expanded/collapsed state.
- Direct paper anchors open the requested explanation beneath the sticky header.
- EN/ES switch retains open explanations and a section/paper anchor.
- English and Spanish demo coverage links navigate within the page, highlight
  the news entry temporarily, and return to/open the associated paper.
- Spanish coverage label identifies English-only external content; news dates
  are localized.
- Empty news data hides both the section and its navigation item. Demo data is
  absent from the checked production build.
- Reduced-motion CSS removes transitions; the navigation script checks the
  system preference before requesting smooth scrolling. This was code-reviewed,
  without changing the user's operating-system settings.

Browser verification used the Codex in-app browser. Other browser engines and a
physical phone have not been tested. Deployment was not run; the prepared workflow
targets the existing GitHub Pages setup and custom domain. Content review and
publication approval remain outstanding as listed in `CONTENT_REVIEW.md`.

## Rounded warm style pass — October 31, 2026

- Replaced sharp serif typography with self-hosted Nunito Sans, softened the
  portrait frame, navigation, buttons, research surfaces, and explanation panels.
- Updated the palette to cream/peach/sage with the requested `#CC3311` red.
- Curved the conceptual SVG connectors and rounded their strokes and shapes.
- Content files (`copy.json`, `publications.json`, `news.json`) verified unchanged
  against their pre-style-pass SHA-256 hashes.
- Production build and existing content/link checks pass.
- Browser layouts checked at 325, 779, and 1200 CSS pixels; no horizontal overflow.
  Narrow Spanish layout also checked with all four navigation links in the demo.
- Paper expansion and preservation of the open paper on language switch verified.
- Accent contrast: 5.19:1 for white on red; 4.86:1 for red on cream. The darker
  link color on pale peach is 5.97:1. Muted body text on cream is 5.55:1.
- Original style files retained outside the repository in
  `../.working/style-original/` for easy comparison during local review.

## Argentina-inspired palette — October 31, 2026

Changed colors only: pastel sky-blue background, navy text and controls, and
restrained gold accents. Rounded geometry, typography, and written content are
unchanged. Production build/content checks pass, content hashes still match,
and the updated palette was visually inspected in the local browser. The red
style is retained outside the repository in `../.working/style-rounded-red/`.

## Simplified typography — October 31, 2026

- Consolidated supporting text, advisor details, citation metadata, and controls
  at 16px. Titles use 20px, sections 32px, and the name 64px/48px.
- All four introduction links have matching text size, width, and 50px height.
- Reflowed navigation, research cards, and publication controls to accommodate
  readable text; sticky-header anchor offsets track the actual header height.
- Checked English and Spanish layouts at phone, tablet, and desktop widths
  (325, 397, 780, and 1200 CSS pixels), with no horizontal overflow.
- Verified publication expansion and the enlarged publication text in-browser.
- Production build and existing bilingual content/link checks pass: four public
  papers and six explanations. Written content was unchanged in this pass.

## Perspectives — October 31, 2026

- Three illustrated cards replace the research overview in both languages.
  English/Spanish blurbs are 18–21 words; full pieces are 126–138 words.
- Production checks now validate paired Perspective content, word counts,
  stable IDs, and rendered anchors alongside the existing publication checks.
- Browser checks at 325, 397, 780, and 1200 CSS pixels found no horizontal
  overflow. Desktop cards share a height; tablet cards use illustrations beside
  text; phone cards stack vertically. Dialog text remains 16px.
- Verified card opening, keyboard Enter and Escape, native Tab cycling, focus
  return after closing, browser Back/Forward, direct Perspective URLs, and the
  same Perspective reopening in Spanish. Copy-link feedback appeared; system
  clipboard contents were not independently confirmed by the browser bridge.
- Verified the existing direct PTA paper link still expands its explanation.
- Full text remains in the HTML for reading without JavaScript; this fallback
  was code-reviewed. Decorative art is hidden from assistive technologies.
- The PDF statement and temporary extracts remain outside the repository.
  The content source mapping and claim boundaries are in PERSPECTIVES_REVIEW.md.

## Research ownership and illustrated guide — October 31, 2026

- Added user-confirmed contribution statements, revised the introduction and
  Perspectives, and rewrote the three paper explanations around their methods
  and results. Original homepage section order is preserved.
- GitHub was removed. The contact / INSPIRE / CV buttons form a single
  blue–gold–blue row; browser measurements at 325px confirm matching vertical
  positions and heights, with 16px text. CV remains a new-tab reading link.
- Added verified Pheno 2026 and Radiations entries. The talk's related-research
  link opens the antinuclei explanation. External talk, slides, and essay URLs
  came from their authoritative pages; the talk page was inspected in-browser.
- Added English and Spanish PTA guides with four unchanged attributed paper
  figures, translated captions/alt text, and full-size image links. Figure
  anchors were checked against the source HTML.
- Checked desktop, tablet, and phone layouts at 1280, 780, 390, and 325 CSS px.
  No horizontal overflow found in the checked homepage and guide views.
- Verified language switching preserves the guide's selected chapter after a
  targeted fix. The existing expanded-paper links and new homepage-to-guide
  navigation also work. Figure lazy loading was observed as sections entered view.
- Production build and JS syntax checks pass. Build validation now covers
  contribution translations, optional writing/paper associations, both guide
  pages, figure files, guide anchors, and links back to the corresponding homepage.
- No push or deployment was performed. See RESEARCH_PASS.md for source notes.
