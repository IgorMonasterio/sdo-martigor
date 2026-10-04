# SDO Toolkit

Dispensing optics calculators and a Year 1 quiz for UK student dispensing opticians, based on the
**ABDO Level 6 Diploma in Ophthalmic Dispensing (2023 syllabus)**.

It's a static, browser-only web app: plain HTML, CSS and JavaScript, no build step, no backend,
no tracking, no third-party requests.

> **Disclaimer — independent study aid.** Not affiliated with or endorsed by ABDO or the GOC.
> Always check answers against your course materials and tutors.

## Who it's for

Student dispensing opticians (SDOs) in their first year who want to practise the maths and check
their own working. Everything is single vision and Year 1 scope; where something goes beyond that
(e.g. prism with an oblique cylinder axis) the app says so.

## Tools

Type a prescription once and every tool uses it. Each result has a **Show working** panel with the
formula and the numbers plugged in, so you can compare it with your own.

| Tool | What it does |
| --- | --- |
| **Rx analysis** | Type of ametropia/astigmatism, with/against-the-rule, principal powers, optical cross, far points, anisometropia/antimetropia notes. |
| **Transposition** | Minus-cyl, plus-cyl and crossed-cylinder forms; toric transposition from a base curve or a sphere curve (minus or plus toric). |
| **Prisms** | Prentice's rule at a point, decentration to produce prism, compounding and resolving prisms (including 360° notation), splitting prism between the eyes, vertical differential prism, small-angle prism deviation and prism thickness difference. |
| **Centration** | Box centre distance, horizontal/vertical/resultant decentration and minimum size uncut, with a to-scale frame diagram. |
| **Thickness** | Centre and edge thickness from accurate and approximate sag, drawn to scale; lens measure correction for a different refractive index. |
| **Materials** | Typical refractive index, Abbe number, density, curve variation factor and surface reflectance for common lens materials. |

Conventions: standard (TABO) axis notation, 0–180° anticlockwise from the practitioner's right for
both eyes, and 180 rather than 0.

## Quiz

- **12 calculation topics** with freshly generated questions every round: light & vergence,
  refraction, surfaces & thin lenses, photometry, transposition, ametropia, toric lenses,
  Prentice's rule, decentration & MSU, prisms, differential prism, and sag & thickness.
- **225 theory questions** (multiple choice) in [`site/assets/js/bank.js`](site/assets/js/bank.js),
  covering Units 1–4 of Year 1. Each question is tagged with its syllabus code (e.g. `Unit 2 · G13`)
  or, for some patient-care questions, the GOC outcome it maps to (e.g. `Unit 3 · GOC O4.4`), and has
  a short explanation.
- Mixed rounds across all topics; your best score per topic is remembered.

## Running it locally

It's a static site, so any static file server will do. The pages use root-relative paths
(`/assets/...`), so serve the `site` folder as the web root rather than opening `index.html`
straight from disk:

```sh
python -m http.server --directory site
# then open http://localhost:8000
```

## Privacy and offline use

- Nothing leaves your browser. There is no backend, no analytics and no external fonts or scripts.
- Your prescription, settings and quiz progress are kept only in your browser's `localStorage`.
  Clearing site data resets them.
- Once the page has loaded, all calculations and quizzes run locally, so it keeps working if your
  connection drops. There's no service worker, though, so you need a connection (or a local server)
  to load it in the first place.

## Project layout

```
site/                 the app (this is the web root)
  index.html
  assets/css/app.css
  assets/js/app.js    calculators
  assets/js/quiz.js   quiz engine and calculation question generators
  assets/js/bank.js   theory question bank
  assets/fonts/       Montserrat (variable, Latin subset) + its licence
build/                source SVGs for the icons and a screenshot helper script
```

## Contributing

Spotted a wrong answer or a calculation that doesn't match your course notes? Please open an issue
with the question (or the inputs you used), what the app says and what you expected, plus the
source if you have it.

## Licence

- Code: [MIT](LICENSE).
- Font: [Montserrat](https://github.com/JulietaUla/Montserrat) is licensed under the
  [SIL Open Font License 1.1](site/assets/fonts/OFL.txt).

ABDO and GOC are referred to only to describe the syllabus the content is based on; this project is
not affiliated with or endorsed by either organisation.
