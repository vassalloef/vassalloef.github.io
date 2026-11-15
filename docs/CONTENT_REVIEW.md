# Content review — first local version

Prepared October 31, 2026. This checklist is repository documentation, not part
of the generated website.

## Awaiting Fabrizio's review

- [ ] Review the introduction and new Perspectives drafts/illustrations.
- [ ] Review the six initial explanations (three projects, English and Spanish).
  They are original drafts based on the full papers, not quotations of abstracts.
  Each is between 122 and 142 words, below the 200-word maximum.
- [ ] Replace or refine the initial Spanish translations as desired.
- The former research overview has been replaced by Perspectives. The new
  public text omits the unpublished Galactic-center idea and ongoing axion work.
- [ ] Confirm the pulsar paper's current submission/publication status immediately
  before publication. “Submitted to Physical Review D” comes from the current CV;
  arXiv confirms a preprint but does not verify editorial status.
- [ ] Supply the forthcoming Phys.org article's **headline, URL, date, associated
  paper, and a short summary**. No association, headline, date, or article URL has
  been guessed. “Beyond the papers” currently contains the verified Pheno talk
  and Radiations essay; the anticipated Phys.org article is not included.
- [ ] Give explicit final approval before any push, merge, or deployment.

## Sources and metadata corrections

The supplied `CV_Oct2026.pdf` was read in full. Its education, advisors, email,
research statement, and six-paper inventory match the handoff. Its actual
INSPIRE hyperlink is https://inspirehep.net/authors/2918992. The portrait is the
supplied image, optimized to WebP; both originals remain untouched.

The existing site https://vassalloef.com/ confirms the Argentina background.
The repository was cloned from https://github.com/vassalloef/vassalloef.github.io
at commit `508bae2`. It used Hugo Blox, with Hugo 0.136.5 and GitHub Pages on `main`.

Verified against arXiv and publisher records:

| Paper | Verification / correction |
| --- | --- |
| [Pulsar timing](https://arxiv.org/abs/2606.18329) | Foster, Trickle, Vassallo. Preprint; no journal reference in the arXiv record. Full text: https://arxiv.org/html/2606.18329v2 |
| [Antinuclei](https://arxiv.org/abs/2603.12314) | Gemmell, Hooper, Koren, Vassallo. PRL 137, 171802 (2026), DOI https://doi.org/10.1103/6rsq-mjzw. Full text: https://arxiv.org/html/2603.12314v2 |
| [Q-balls](https://arxiv.org/abs/2602.15196) | **Corrected author order and initials:** B. DeVries, F. Vassallo, C. B. Verhaaren. The CV/handoff lists Verhaaren before Vassallo and gives different initials. JHEP 08 (2026) 108, DOI https://doi.org/10.1007/JHEP08(2026)108 |
| [IceCube](https://journals.aps.org/prd/abstract/10.1103/qj8m-v4mr) | Official published title uses **“annihilation”**, not “annihilating.” Hooper, Vassallo. PRD 112, 035014 (2025). Full text: https://arxiv.org/html/2505.06734v2 |
| [Lanthanum](https://journals.aps.org/pra/abstract/10.1103/6641-mdhr) | Added official subtitle **“Experiment and theory”**. Author initials are **F. E. Vassallo**. PRA 112, 052801 (2025). DOI extracted from CV and confirmed in publisher record. |
| [Lead](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.106.L010801) | Publisher uses **F. E. Vassallo**. PRA 106, L010801 (2022). DOI extracted from CV and confirmed. |

Publication ordering follows first public appearance (arXiv submission where
available). The late-2025 lanthanum paper therefore comes before the IceCube paper.

## Scientific scope of the drafts

- Antinuclei: AMS events remain candidates; enhancement depends on the model.
  No claim of a quantitatively established explanation or an antihelium-4 result.
- Pulsar timing: compact substructures include primordial black holes and
  sufficiently compact clumps. They are not interchangeable with all dark matter
  substructure. Gravitational-wave backgrounds substantially degrade sensitivity.
  These are optimistic forecasts; intrinsic pulsar noise and extended structures
  need more modeling. No detection is claimed.
- IceCube: a forecast made in the 2025 study. Its comparison is with the
  direct-detection limits considered there, not an unverified claim about all
  current limits. No dark matter detection or current deployment date is claimed.
- Schematics are original conceptual illustrations, not research data, measured
  plots, or numerical predictions. Bilingual descriptions state their purpose.

## Publication handover

Only the `website/` repository should be staged for the eventual repository
update. Build tools, temporary files, original uploads, and the handoff outside it
are not needed in Git. Within the repository, generated output and caches are
ignored. Only the compiled `public/` folder is served by Pages.

The legacy source archive is preserved for reference and is not built. The
former Blox theme/module dependency was replaced by a custom Hugo template, plain
CSS, and a small JavaScript file; Hugo itself and the existing hosting method are
retained. This avoids maintaining two unrelated language pages or a client-side
application for a small academic website.

## Homepage simplification requested October 31, 2026

The homepage now features four papers. The lanthanum and lead AMO records are
retained in `docs/archived-publications.json` and in the original CV, but are no
longer rendered on either language page. Extra introductory labels and the visible
publication permalink symbols were removed; stable paper IDs remain supported.
The CV now opens for reading in a new tab. Advisor names link to their verified
UW–Madison directory entries. Profile and INSPIRE collection links are prominent
gold buttons.

## Perspectives — October 31, 2026

Three bilingual Perspectives replace the research overview. Their first-person
text is a draft for Fabrizio to revise, not a quotation from his statement.
See `PERSPECTIVES_REVIEW.md` for sources and claim boundaries. The supplied
statement and extracted research materials remain outside the repository.
