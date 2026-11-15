# Research, authorship, and communication pass

October 31, 2026. Internal editorial notes; this file is not served by Hugo.

## User-directed choices

- Preserve the homepage section order. The publications were not moved upward.
- Remove GitHub. Three equally sized introduction buttons form a single row:
  Argentina blue contact / gold INSPIRE / Argentina blue CV. Labels remain 16px
  and may wrap on very narrow screens.
- Identify Fabrizio as a third-year physics PhD student and foreground his work
  connecting physical models, simulation, and statistical inference.
- Add contribution lines to the three central projects, based on his explicit
  descriptions in this conversation. The PRL line describes end-to-end research;
  PTA describes development of simulations and learned models; IceCube credits
  Dan Hooper with the efficiency calculation. No additional detailed individual
  role was invented for the Q-ball paper.
- Revise Perspectives around concrete methodological choices and examples.
  All longer pieces remain 100–150 words in each language.
- Rework the three paper explanations to foreground the technical challenge and
  contribution; they remain below 200 words each.

## Writing and talk sources

- Radiations article: https://students.aip.org/radiations/science-comes-to-life-at-physcon-scholarly-adventures-in-washington-dc
  Verified byline: Fabrizio Vassallo, SPS Reporter, Denison University. Online
  date June 20, 2023; the essay recounts PhysCon 2022. It is labeled “Feature essay,”
  not independent press coverage. The full subtitle is “Scholarly Adventures in
  Washington, DC.” The source is the Spring 2023 issue (volume 29, number 1).
- Pheno talk: https://indico.global/event/16413/contributions/153810/
  Verified in-browser: Fabrizio Vassallo, University of Pittsburgh, May 12, 2026,
  15 minutes. “Enhancing Cosmic-Ray Antinuclei Fluxes from Dark Matter using
  Baryon Number.” Slide URL was taken directly from the presentation materials:
  https://indico.global/event/16413/contributions/153810/attachments/69894/135570/Presentation%20at%20Pheno.pdf
- The “Beyond the papers” section accepts talk, writing, and future coverage
  records. No Phys.org entry is fabricated or added as a public placeholder.

## PTA illustrated guide

Routes: `/research/pulsar-timing/` and `/es/research/pulsar-timing/`.
Source: https://arxiv.org/html/2606.18329v2, including methods and appendices.
Credit: Joshua W. Foster, Tanner Trickle, and Fabrizio Vassallo.

Original assets, with figure anchors verified in the source HTML:

| Local file under static/images/pta | Figure | Source anchor |
| --- | --- | --- |
| SketchPulsarTerm.png | 1 | S2.F1 |
| SignalExamples.svg | 2 | S2.F2 |
| SketchEarthTerm.png | 9 | S6.F9 |
| FiducialProjections.svg | 7 | S5.F7 |

Asset source URLs are `https://arxiv.org/html/2606.18329v2/<filename>`.
The images are unchanged originals, attributed to all paper authors. They are
used for this coauthor-requested explanation of his research; the arXiv record
uses the perpetual non-exclusive distribution license, not a Creative Commons
license. Do not describe the figures as CC-licensed or public domain.

Scientific distinctions preserved:

- Rare encounters can retain non-Gaussian structure; object count alone does
  not justify Gaussianity.
- Compressed inference applies the projection to data, signal, and background.
- Diffusion supplies full projected pulsar-term signal samples; the Earth-term
  analysis uses a normalizing flow for a correlated three-dimensional cubic vector.
- The plots are simulations and forecasts, not measured PTA data or detections.
- Forecasts assume compact objects and known background parameters, and omit
  intrinsic pulsar red noise. Diffusion validation here concerns null forecasts,
  not calibrated inference at arbitrary signal strengths.
- Figure captions are translated; original figure labels remain in English.
  Full-size versions are available from each figure.

The website text is a draft for Fabrizio's editorial review. No push or deployment
was performed. Temporary research materials are outside the repository.
