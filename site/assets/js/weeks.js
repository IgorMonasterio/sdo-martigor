/* SDO Toolkit · Weeks. The Year 1 timetable (32 weeks) as the way in: pick a week and get its key points, the tools
   that belong to it and the quiz topics to practise. Key points are the toolkit's own summaries of the public ABDO 2023
   syllabus. On a private copy, the week's full college notes can be served at /assets/weeks/wNN/index.html; the public
   site never carries them (that content is not ours to publish). */
(() => {
  'use strict';
  const S = window.SDO;
  if (!S) return;
  const $ = (s, r = document) => r.querySelector(s);
  const root = () => $('#weeks-root');
  // only a private copy (iris.martigor.org) or a local preview ever asks for college material; the public site does not even try
  const PRIVATE = /^(iris\.martigor\.org|127\.0\.0\.1|localhost)$/.test(location.hostname);

  /* ---------- the timetable (Year 1 Diploma 2026-27; each week's work is due on the Tuesday at 13:59) ---------- */
  // tools: [tab, sub, label] → opens that calculator. quiz: topic ids from quiz.js.
  const T = {
    rx: ['overview', null, 'Rx analysis — type of ametropia, meridians, far points'],
    forms: ['transpose', 'forms', 'Sph-cyl forms — plus cyl, minus cyl, crossed cylinders'],
    toric: ['transpose', 'toric', 'Toric transposition — base curve or sphere curve'],
    basics: ['prism', 'basics', 'Prism basics — d = (n − 1)a, thickness difference'],
    compound: ['prism', 'compound', 'Compound two prisms'],
    resolve: ['prism', 'resolve', 'Resolve a prism into H and V'],
    split: ['prism', 'split', 'Split prism between the eyes'],
    prentice: ['prism', 'prentice', "Prentice's rule — prism at a point"],
    decentre: ['prism', 'decentre', 'Decentration to produce prism'],
    diff: ['prism', 'diff', 'Differential prism'],
    frame: ['frame', null, 'Centration & minimum size uncut'],
    thick: ['thick', 'thick', 'Centre & edge thickness (sag)'],
    measure: ['thick', 'measure', 'Lens measure correction'],
    materials: ['thick', 'materials', 'Lens materials table'],
  };
  const W = (n, title, due, kind, o = {}) => ({ n, title, due, kind, unit: o.unit || 0, codes: o.codes || [], tools: o.tools || [], quiz: o.quiz || [], key: o.key || '', note: o.note || '' });
  const WEEKS = [
    W(1, 'Pre-programme maths support', '2026-09-01', 'maths', { key: `
      <p>The maths the whole year leans on. None of it is new, but every optics formula assumes it is automatic.</p>
      <ul>
        <li><b>Order of operations</b> (PEDMAS): brackets, then powers, then × and ÷ left to right, then + and −. <i>2 + 3 × 4 = 14</i>, not 20.</li>
        <li><b>Negative numbers</b>: subtracting a negative adds; multiplying two negatives gives a positive. Lens powers and distances carry signs, so this matters every day.</li>
        <li><b>Reciprocals</b>: 1/x. Power in dioptres is the reciprocal of a distance in metres: <i>F = 1/f</i>. 1/0.25 m = 4.00 D; 1/(−0.50 m) = −2.00 D.</li>
        <li><b>Ratios and proportions</b>: used for magnification, similar triangles (pinhole camera, mirrors) and scaling up a frame drawing.</li>
        <li><b>Rearranging formulae</b>: do the same thing to both sides. From <i>F = (n − 1)/r</i> you get <i>r = (n − 1)/F</i>.</li>
        <li><b>Standard form</b>: 5.5 × 10<sup>−7</sup> m is the wavelength of yellow light; 3 × 10<sup>8</sup> m/s is the speed of light. Count the places the point moves.</li>
        <li><b>Units</b>: keep distances in <b>metres</b> when you want dioptres; mm ÷ 1000 = m. Prism in prism dioptres (Δ), angles in degrees.</li>
        <li><b>Rounding</b>: work with full precision, round only the final answer, and round powers to the nearest 0.25 D if you are writing a prescription.</li>
      </ul>` }),
    W(2, 'Learning on a blended programme · Standards of Practice', '2026-09-08', 'study', { unit: 3, codes: ['Unit 3 · GOC Standards'], quiz: ['t-u3'], key: `
      <p>Two things: how to study a distance course without drowning, and the professional ground rules you now work under as a student registrant.</p>
      <ul>
        <li><b>Blended learning</b>: a weekly online book plus block-release days. The week's due date is a Tuesday at 13:59; plan the reading early in the week and the activity at the end.</li>
        <li><b>GOC Standards for Optical Students</b>: the same headings as the Standards of Practice for fully qualified dispensing opticians (put patients first, communicate well, obtain consent, keep records, respect confidentiality, be honest, work within your competence, be supervised).</li>
        <li><b>Sale and supply</b>: the Opticians Act 1989 restricts who may sell spectacles to <b>children under 16</b> and to people registered as <b>sight impaired or severely sight impaired</b>. Those sales must be made by, or under the supervision of, a registered optometrist, dispensing optician or doctor.</li>
        <li><b>Duty of care</b>: you owe the patient reasonable skill and care whether or not money changes hands; a wrong dispense is a professional matter, not just a refund.</li>
        <li><b>Supervision</b>: as a student you dispense under the supervision of your PEL (practice-based educational lead), who must be on the premises and in a position to intervene.</li>
        <li><b>Supplementary guidance</b>: the GOC publishes guidance on consent, candour (being open when things go wrong) and social media; the standards expect you to know it, not just the Act.</li>
      </ul>` }),
    W(3, 'Communication: helping patients make informed decisions', '2026-09-15', 'care', { unit: 3, codes: ['Unit 3 · communication, consent'], quiz: ['t-u3'], key: `
      <ul>
        <li><b>Communication</b> is a two-way exchange of meaning, not just information: what the patient understands is what counts.</li>
        <li><b>Internal representations</b>: each person filters what they hear through their own experience, worries and language. Check understanding instead of assuming it.</li>
        <li><b>Listening</b>: reflective (active) listening, taking in three things at once: the words themselves (linguistic), how they are said, tone, pitch and pace (paralinguistic), and body language (non-verbal). Reflect back what you heard. Know the question types: open, closed, probing, clarifying, reflective and leading.</li>
        <li><b>Summarising</b> at the end of a conversation confirms the plan, catches misunderstandings and gives the patient a chance to add something.</li>
        <li><b>Health literacy</b>: many adults struggle with medical wording and numbers. Use plain words, one idea at a time, show rather than tell, and ask them to repeat the key points ("teach-back").</li>
        <li><b>Informed decisions</b>: for a decision to be informed the patient needs the options, the benefits and drawbacks of each, the cost, and the consequences of doing nothing, in a form they can understand. Consent rests on that.</li>
      </ul>` }),
    W(4, 'Lens surface power, lens form, spherical surfaces', '2026-09-22', 'lenses', { unit: 2, codes: ['Unit 2 · A1–A3 materials', 'Unit 2 · B lens form', 'Unit 1 · curved surfaces'], tools: ['materials', 'thick'], quiz: ['u1-surf', 'u1-lens', 'u2-thick', 't-u2', 't-w4'], key: `
      <ul>
        <li><b>A spectacle lens</b> is a transparent medium bounded by two polished surfaces, at least one of them curved. Its job is to change the <b>vergence</b> of light reaching the eye.</li>
        <li><b>Surface power</b>: <i>F = (n′ − n) / r</i>, with r in metres. A surface is positive when its centre of curvature is on the side the light is going to (convex to the incident light), negative when concave.</li>
        <li><b>Thin lens power</b>: <i>F = F<sub>1</sub> + F<sub>2</sub></i>. Thickness is ignored for lenses under about 5 mm thick and 50 mm wide.</li>
        <li><b>Focal length</b>: <i>f′ = 1/F</i> (metres). A +4.00 D lens focuses parallel light 0.25 m behind it; a −4.00 D lens makes it diverge as if from 0.25 m in front.</li>
        <li><b>Forms</b>: equi-convex / equi-concave, plano-convex / plano-concave, and <b>meniscus</b> (one convex and one concave surface), which is the form spectacle lenses actually take because it reduces oblique aberrations.</li>
        <li><b>Deviation</b>: a lens is a stack of prisms, bases at the centre for plus and at the edge for minus. Light bends towards the thicker part.</li>
        <li><b>Radius of curvature</b>: rearrange the surface power formula, <i>r = (n′ − n)/F</i>. For crown glass (n = 1.523) a +6.00 D surface has r = 0.523/6 = 87.2 mm.</li>
        <li><b>Materials</b>: refractive index (how strongly it bends light; higher n means flatter, thinner lenses), Abbe number (colour dispersion; lower means more colour fringing), density (weight) and impact resistance. CR39 1.498 · crown 1.523 · polycarbonate 1.586 · 1.6 and 1.67 resins.</li>
      </ul>` }),
    W(5, 'Propagation of light', '2026-09-29', 'optics', { unit: 1, codes: ['Unit 1 · A waves and vergence'], quiz: ['u1-waves', 't-u1', 't-w5'], key: `
      <ul>
        <li><b>Light</b> is electromagnetic radiation. The visible band runs from about <b>390 nm (violet) to 760 nm (red)</b>, the figures in your course; ultraviolet is shorter, infrared is longer.</li>
        <li><b>Wave quantities</b>: <i>v = fλ</i>. In a medium of index n the speed drops to <i>c/n</i> and the wavelength shortens to <i>λ/n</i>; the frequency (and the colour) does not change.</li>
        <li><b>Rays and pencils</b>: light travels in straight lines in a uniform medium. A pencil is a bundle of rays from one point: divergent (leaving a point), convergent (heading to a point) or parallel (from infinity).</li>
        <li><b>Wavefronts</b> are at right angles to the rays: spherical for a point source, plane for parallel light.</li>
        <li><b>Vergence</b>: <i>L = n / l</i> in dioptres, with l in metres measured from the point where the vergence is wanted. Divergent light has negative vergence, convergent positive, parallel zero. Light 0.5 m from a point source has vergence −2.00 D.</li>
        <li><b>Sign convention</b>: light travels left to right; distances measured in the direction of the light are positive, against it negative.</li>
        <li><b>Standard form</b> keeps the numbers readable: 555 nm = 5.55 × 10<sup>−7</sup> m.</li>
      </ul>` }),
    W(6, 'Errors of refraction and their correction · colour and radiation', '2026-10-06', 'lenses', { unit: 2, codes: ['Unit 2 · K ametropia and far points', 'Unit 1 · photometry and colour'], tools: ['rx'], quiz: ['u2-amet', 't-u2', 't-u1', 't-w6'], key: `
      <ul>
        <li><b>Emmetropia</b>: with accommodation relaxed, parallel light focuses on the retina. The far point is at infinity.</li>
        <li><b>Myopia</b>: the eye is too powerful or too long; parallel light focuses in front of the retina. The <b>far point</b> is a real point in front of the eye, at <i>1/F</i> from it (a −2.00 D myope's far point is 0.5 m away). Corrected with a minus lens whose second focal point sits on the far point.</li>
        <li><b>Hypermetropia</b>: the eye is too weak or too short; parallel light would focus behind the retina. The far point is virtual, behind the eye. Corrected with a plus lens. Young hypermetropes can hide the error by accommodating.</li>
        <li><b>Astigmatism</b>: the eye's power differs along two principal meridians, usually at right angles, so a point focuses as two line images. With-the-rule (steeper vertical meridian), against-the-rule, oblique. Simple, compound or mixed depending on where the two foci fall relative to the retina.</li>
        <li><b>Symbols</b>: F for power (D), f for focal length (m), n for index, L and L′ for incident and emergent vergence, the eye's far point M<sub>R</sub>.</li>
        <li><b>Colour and radiation</b>: white light is a mixture of wavelengths; a prism or a lens edge separates them (dispersion) because n is higher for blue than for red. UV is the radiation below about 390 nm: the cornea absorbs the shortest (UVB and UVC, below about 315 nm) and the crystalline lens absorbs most UVA. That is why lenses quote a UV cut-off (often 380 nm, or 400 nm for "UV400"). IR is heat.</li>
      </ul>` }),
    W(7, 'Pinhole camera and reflection at plane surfaces', '2026-10-13', 'optics', { unit: 1, codes: ['Unit 1 · B reflection and mirrors'], quiz: ['u1-mirror', 't-u1', 't-w7'], key: `
      <ul>
        <li><b>Pinhole camera</b>: every point of the object sends one narrow pencil through the hole, so the image is inverted, sharp over a very wide range of object distances, undistorted and dim. By similar triangles <i>image size / object size = image distance / object distance</i>. A bigger hole is brighter but blurred; a smaller one is sharper until diffraction takes over. A longer box gives a bigger but dimmer image, and the shape of the hole does not matter as long as it is small.</li>
        <li><b>Laws of reflection</b>: the angle of incidence equals the angle of reflection, measured from the normal, and the incident ray, reflected ray and normal lie in the same plane.</li>
        <li><b>Plane mirror image</b>: virtual, erect, the same size as the object, as far behind the mirror as the object is in front, and laterally inverted.</li>
        <li><b>Rotating a mirror</b> by θ rotates the reflected ray by <b>2θ</b> (the 'optical lever' used to magnify small turns, as in the mirror galvanometer and the sextant).</li>
        <li><b>Minimum mirror length</b> to see your whole self is half your height, whatever the distance.</li>
        <li><b>Two mirrors</b> at an angle θ give 360/θ − 1 images (two at 90° give 3).</li>
      </ul>` }),
    W(8, 'Consolidation Assignment 1 (formative)', '2026-10-20', 'ca', { unit: 0, codes: ['Weeks 4–7'], tools: ['materials', 'rx'], quiz: ['ca1', 'u1-surf', 'u1-waves', 'u2-amet', 'u1-mirror', 't-u1', 't-u2', 't-ca1', 't-w4', 't-w5', 't-w6', 't-w7'], key: `
      <p>Formative: it does not count towards the exams, but it is the first time the college sees how you set out a calculation. It pulls together <b>Weeks 4 to 7</b>: surface power and lens form, propagation of light and vergence, errors of refraction, and the pinhole camera and plane mirrors.</p>
      <ul>
        <li>Write the formula first, then the substitution with units, then the answer with its unit and sign. Marks come from the working, not just the number.</li>
        <li>Keep distances in metres when you want dioptres; say which sign convention you are using.</li>
        <li>Draw a ray diagram for every mirror or pinhole question, even a rough one.</li>
        <li>The college suggests two passes: first answer as much as you can from memory, without your notes; then finish it with your materials, check your first answers and note the gaps to revisit.</li>
      </ul>`, note: 'Due Tuesday 20 October 2026, 13:59. Submit through the college submission box.' }),
    W(9, 'Sph-cyl lenses, transposition 1', '2026-11-03', 'lenses', { unit: 2, codes: ['Unit 2 · C sph-cyl, D transposition'], tools: ['forms', 'rx'], quiz: ['u2-trans', 't-u2', 't-cyl'], key: `
      <ul>
        <li>A <b>cylinder</b> has power along one meridian and none along the axis. Written as cyl × axis, with the axis in standard notation (1–180, anticlockwise from the horizontal as seen from in front of the patient).</li>
        <li>A <b>sph-cyl</b> lens is a sphere plus a cylinder. The power along the axis is the sphere; 90° away it is sphere + cyl.</li>
        <li><b>Transposition</b> between plus-cyl and minus-cyl form: new sphere = old sphere + old cyl; new cyl = −old cyl; axis rotated by 90°.</li>
        <li><b>Crossed-cylinder form</b>: two cylinders with axes 90° apart, each equal to one of the principal powers.</li>
      </ul>` }),
    W(10, 'Apparent depth, refractive index and refraction', '2026-11-10', 'optics', { unit: 1, codes: ['Unit 1 · C refraction, Snell, apparent depth'], quiz: ['u1-refr', 't-u1', 't-refr'], key: `
      <ul>
        <li><b>Snell's law</b>: <i>n sin i = n′ sin i′</i>. Light bends towards the normal entering a denser medium and away from it leaving.</li>
        <li><b>Refractive index</b> <i>n = c / v</i>; absolute (relative to vacuum) and relative between two media.</li>
        <li><b>Apparent depth</b> = real depth / n for a flat surface viewed near the normal: a pool 2 m deep looks 1.5 m deep (n = 1.33).</li>
        <li><b>Critical angle</b> and total internal reflection: sin c = n′/n; beyond c nothing is refracted out.</li>
        <li><b>Parallel-sided block</b>: the ray emerges parallel to its original direction but laterally displaced.</li>
      </ul>` }),
    W(11, 'Sph-cyl lenses, transposition 2, sph-cyl neutralisation', '2026-11-17', 'lenses', { unit: 2, codes: ['Unit 2 · D transposition', 'Unit 4 · hand neutralisation'], tools: ['forms', 'rx'], quiz: ['u2-trans', 't-u2', 't-u4', 't-cyl'], key: `
      <ul>
        <li>Transposition the other way round: from crossed-cyl to sph-cyl and back, and reading the power along any meridian.</li>
        <li><b>Hand neutralisation</b>: move the lens and watch the image; <b>against</b> movement means plus, <b>with</b> movement means minus. Add trial lenses of the opposite sign until the movement stops. For a cylinder find the two meridians with no scissors movement and neutralise each.</li>
      </ul>` }),
    W(12, 'Toric lenses, toric transposition', '2026-11-24', 'lenses', { unit: 2, codes: ['Unit 2 · D5–D6 toric transposition'], tools: ['toric', 'forms'], quiz: ['u2-toric', 't-u2', 't-cyl'], key: `
      <ul>
        <li>A <b>toric surface</b> has two different curvatures at right angles (a slice of a doughnut). The lower-powered meridian of the toric surface is the <b>base curve</b>, the other the <b>cross curve</b>.</li>
        <li><b>Toric transposition</b>: given the Rx and the base curve (or the sphere curve), first transpose the Rx so the cyl has the same sign as the base curve; the base curve goes at 90° to the Rx axis; cross curve = base curve + cyl, at the Rx axis; sphere curve = sphere − base curve. A <b>minus base toric</b> has the toric surface on the concave back, a <b>plus base toric</b> on the convex front (minus base is what is usually made today).</li>
      </ul>` }),
    W(13, 'Prisms and dispersion 1', '2026-12-01', 'optics', { unit: 2, codes: ['Unit 2 · G1–G6 prisms'], tools: ['basics'], quiz: ['u2-prisms', 'u1-refr', 't-prism', 't-refr'], key: `
      <ul>
        <li>A <b>prism</b> deviates light towards its <b>base</b>; the image appears displaced towards the <b>apex</b>.</li>
        <li>For a thin (small-angle) prism in air, <i>d = (n − 1) a</i>, with d and a in degrees.</li>
        <li><b>Prism dioptre</b>: 1 Δ deviates light by 1 cm at 1 m. P (Δ) = 100 tan d.</li>
        <li><b>Dispersion</b>: blue is deviated more than red, so a prism spreads white light into a spectrum.</li>
      </ul>` }),
    W(14, 'Prisms and dispersion 2', '2026-12-08', 'optics', { unit: 2, codes: ['Unit 2 · G prisms', 'Unit 2 · A Abbe number'], tools: ['basics', 'materials'], quiz: ['u2-prisms', 't-u2', 't-prism', 't-refr'], key: `
      <ul>
        <li>Thickness difference across a prism: <i>g = b P / (100 (n − 1))</i>, with <i>b</i> the base–apex diameter (in this chapter <i>d</i> is the deviation), the reason prism makes a lens heavier on one side.</li>
        <li><b>Abbe number</b> <i>V = (n<sub>d</sub> − 1)/(n<sub>F</sub> − n<sub>C</sub>)</i>: high V, low dispersion. Chromatic effects are worse in high-index materials and away from the optical centre.</li>
      </ul>` }),
    W(15, 'Consolidation Assignment 2 (summative)', '2026-12-15', 'ca', { codes: ['Weeks 9–14'], tools: ['forms', 'toric', 'basics'], quiz: ['u2-trans', 'u2-toric', 'u2-prisms', 'u1-refr', 't-cyl', 't-refr', 't-prism'], key: `<p>Summative: this one counts. It covers Weeks 9 to 14: sph-cyl lenses and transposition, refraction and apparent depth, toric lenses, and prisms and dispersion.</p>` }),
    W(16, "Dealing with patients' fears and concerns", '2027-01-05', 'care', { unit: 3, codes: ['Unit 3 · patient-centred care'], quiz: ['t-u3'], key: `<ul><li>Acknowledge the worry before the facts; name what you are going to do; give the patient control over the pace; avoid jargon; know when to refer or to involve the optometrist.</li></ul>` }),
    W(17, 'Refraction at curved surfaces', '2027-01-12', 'optics', { unit: 1, codes: ['Unit 1 · D curved surfaces'], quiz: ['u1-lens', 'u1-refr', 't-refr'], key: `<ul><li>The single refracting surface: <i>L′ = L + F</i> with <i>F = (n′ − n)/r</i>, vergences measured in the medium each side (<i>L = n/l</i>, <i>L′ = n′/l′</i>). Everything else in the year is this formula applied twice.</li></ul>` }),
    W(18, 'Curvature and lens thickness', '2027-01-19', 'lenses', { unit: 2, codes: ['Unit 2 · F3–F4 sag and thickness'], tools: ['thick', 'frame'], quiz: ['u2-thick'], key: `<ul><li><b>Sag</b> of a surface: exact <i>z = r − √(r² − y²)</i>, approximate <i>z = y² F / (2 (n − 1))</i> (your books call the sag <i>z</i>). Thicknesses balance across the lens: centre thickness + sag on one side = edge thickness + sag on the other. So for a plus meniscus t<sub>C</sub> = z<sub>front</sub> − z<sub>back</sub> + t<sub>E</sub>; for a bi-convex lens both sags add. A minus lens is thinnest at the centre, so work outwards to the edge.</li></ul>` }),
    W(19, 'Introduction to thin lenses', '2027-01-26', 'optics', { unit: 1, codes: ['Unit 1 · E thin lenses'], quiz: ['u1-lens'], key: `<ul><li><i>L′ = L + F</i> for the thin lens in air; focal points, focal lengths, the two principal foci and ray diagrams for real and virtual images.</li></ul>` }),
    W(20, 'Curvature and lens measure', '2027-02-02', 'lenses', { unit: 2, codes: ['Unit 2 · F1–F2 lens measure'], tools: ['measure', 'thick'], quiz: ['u2-thick'], key: `<ul><li>The <b>lens measure</b> reads the sag of a surface over a fixed chord and converts it to power assuming n = 1.523. For another material multiply by <i>(n − 1)/0.523</i>.</li></ul>` }),
    W(21, 'Consolidation Assignment 3 (summative)', '2027-02-09', 'ca', { codes: ['Weeks 16–20'], tools: ['thick', 'measure'], quiz: ['u1-lens', 'u1-refr', 'u2-thick'], key: `<p>Summative. Covers Weeks 16 to 20: patient fears and concerns, refraction at curved surfaces, lens thickness, thin lenses and the lens measure.</p>` }),
    W(22, 'Thin lenses and conjugate foci', '2027-02-16', 'optics', { unit: 1, codes: ['Unit 1 · E conjugate foci, magnification'], quiz: ['u1-lens'], key: `<ul><li>Object and image are <b>conjugate</b>: <i>L′ = L + F</i> again, magnification <i>m = L/L′ = h′/h</i>. Real images are inverted and on the far side; virtual images erect and on the same side as the object.</li></ul>` }),
    W(23, 'Ophthalmic prisms and tangent scale', '2027-02-23', 'lenses', { unit: 2, codes: ['Unit 2 · G prisms'], tools: ['basics', 'resolve'], quiz: ['u2-prisms', 't-prism'], key: `<ul><li>Prism power measured on a <b>tangent scale</b>: the displacement in cm of a target seen at 1 m. Base notation (in, out, up, down) and the 360° notation.</li></ul>` }),
    W(24, 'Photometry', '2027-03-02', 'optics', { unit: 1, codes: ['Unit 1 · F photometry'], quiz: ['u1-photo', 't-u1'], key: `<ul><li>Luminous intensity (cd), flux (lm), illuminance (lx = lm/m²). <b>Inverse square law</b> <i>E = I / d²</i> and the <b>cosine law</b> <i>E = I cos θ / d²</i>. Reflectance = reflected / incident.</li></ul>` }),
    W(25, 'Prism base setting, compounding and resolving, oblique meridians, rotary prism', '2027-03-09', 'lenses', { unit: 2, codes: ['Unit 2 · G7–G9'], tools: ['compound', 'resolve', 'split'], quiz: ['u2-prisms', 't-prism'], key: `<ul><li>Two prisms add like vectors: <b>compound</b> H and V into a single prism (<i>P = √(H² + V²)</i>, base at tan<sup>−1</sup>(V/H)); <b>resolve</b> an oblique prism into H and V (<i>P cos θ</i>, <i>P sin θ</i>). Prism power along an oblique meridian; the rotary (Risley) prism.</li></ul>` }),
    W(26, 'Effectivity and thin lens systems', '2027-03-16', 'optics', { unit: 1, codes: ['Unit 1 · E lens systems'], quiz: ['u1-lens'], key: `<ul><li>Two thin lenses in contact add their powers; separated, trace vergences through the gap with the 'step-along' method: <i>L<sub>2</sub> = L′<sub>1</sub> / (1 − d L′<sub>1</sub>)</i> (d in metres), then <i>L′<sub>2</sub> = L<sub>2</sub> + F<sub>2</sub></i>. Effectivity: the same lens has a different effect at a different distance from the eye (the Year 2 vertex distance calculation starts here).</li></ul>` }),
    W(27, 'Consolidation Assignment 4 (summative)', '2027-03-30', 'ca', { codes: ['Weeks 22–26'], tools: ['compound', 'resolve'], quiz: ['u1-lens', 'u1-photo', 'u2-prisms'], key: `<p>Summative. Covers Weeks 22 to 26: conjugate foci, ophthalmic prisms, photometry, compounding and resolving, lens systems.</p>` }),
    W(28, 'Prismatic effect of decentration', '2027-04-06', 'lenses', { unit: 2, codes: ['Unit 2 · G11 Prentice'], tools: ['prentice', 'frame'], quiz: ['u2-prentice', 't-prism'], key: `<ul><li><b>Prentice's rule</b>: <i>P = c F</i>, with c in cm from the optical centre. Plus lenses: base towards the optical centre; minus: base away from it. Year 1 keeps the axes at 90 and 180.</li></ul>` }),
    W(29, 'Curved mirrors', '2027-04-13', 'optics', { unit: 1, codes: ['Unit 1 · B curved mirrors'], quiz: ['t-u1'], key: `<ul><li>Mirror power <i>F = −2n/r</i>, <i>f = r/2</i>; <i>L′ = L + F</i> with the sign of the reflected light reversed. A concave mirror gives a real, inverted image when the object is outside the focal point, and a virtual, erect, magnified one when it is inside (the shaving mirror); convex mirrors always give virtual, erect, diminished images.</li></ul>` }),
    W(30, 'Decentration to produce prism · differential prismatic effect', '2027-04-20', 'lenses', { unit: 2, codes: ['Unit 2 · G12–G15'], tools: ['decentre', 'diff', 'frame'], quiz: ['u2-decentre', 'u2-diff', 't-prism'], key: `<ul><li>Decentration needed: <i>c = P / F</i> (cm). Minimum size uncut = lens diameter (the largest one, for a shaped lens) + 2 × the resultant decentration, plus about 2 mm for wastage. <b>Vertical differential prism</b>: the difference between the two eyes' vertical prism at the reading point. As a general guide, under about 1Δ is unlikely to cause symptoms, but even ½Δ from mismatched bifocal segment drops can (both in <i>Essentials of Dispensing</i>).</li></ul>` }),
    W(31, 'Line foci from astigmatic lenses', '2027-04-27', 'lenses', { unit: 2, codes: ['Unit 2 · E line foci, disc of least confusion'], quiz: ['u2-trans', 't-u2', 't-cyl'], key: `<ul><li>An astigmatic pencil has two <b>line foci</b> at right angles, each formed by one principal meridian; between them the <b>disc of least confusion</b> at the dioptric midpoint (the spherical equivalent).</li></ul>` }),
    W(32, 'Consolidation Assignment 5 (summative)', '2027-05-05', 'ca', { codes: ['Weeks 28–31'], tools: ['prentice', 'decentre', 'diff'], quiz: ['u2-prentice', 'u2-decentre', 'u2-diff', 'u2-trans', 't-prism', 't-cyl'], key: `<p>Summative, and the last one before the exams. Covers Weeks 28 to 31: Prentice's rule, curved mirrors, decentration and differential prism, line foci.</p>` }),
  ];
  const MILESTONES = [
    ['2026-09-15', 'PTT1 planning release', 'Review the practical training task with your PEL'],
    ['2026-11-03', 'PTT1 submission', 'Practical training task 1 + supervision tracker'],
    ['2026-11-23', 'Live teaching session', 'Online, 10:00–11:00'],
    ['2026-12-08', 'PTT2 submission', 'Practical training task 2'],
    ['2027-02-02', 'PTT3 submission', 'Practical training task 3'],
    ['2027-04-06', 'PTT4 submission', 'Practical training task 4'],
    ['2027-04-27', 'PTT5 reflective task', 'Reflective task submission'],
  ];
  const KIND = { maths: 'Maths support', study: 'Study skills & standards', care: 'Patient-centred care', optics: 'General optics', lenses: 'Ophthalmic lenses', ca: 'Consolidation assignment', ptt: 'Practical training' };
  const UNIT_OF = { maths: 0, study: 3, care: 3, optics: 1, lenses: 2, ca: 0 };

  /* ---------- dates ---------- */
  const DAY = 86400000;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const date = (iso) => new Date(`${iso}T00:00:00`);
  const fmt = (iso) => date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtLong = (iso) => date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  // A week opens about two weeks before its due date (the college releases them on the timetable). Past = due date gone.
  function status(w) {
    const t = today(), due = date(w.due), days = Math.round((due - t) / DAY);
    if (days < 0) return { s: 'past', txt: `Due ${fmt(w.due)}`, days };
    if (days > 14) return { s: 'locked', txt: `Opens about ${fmt(new Date(due - 14 * DAY).toISOString().slice(0, 10))}`, days };
    const cur = currentWeek();
    if (w.n === cur) return { s: 'now', txt: days === 0 ? 'Due today, 13:59' : days === 1 ? 'Due tomorrow, 13:59' : `Due in ${days} days`, days };
    return { s: 'soon', txt: `Due ${fmt(w.due)}`, days };
  }
  function currentWeek() { const t = today(); const w = WEEKS.find((x) => date(x.due) >= t); return w ? w.n : WEEKS.length; }
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- private college notes (served only on a private copy; never on the public site) ---------- */
  const notes = new Map();
  async function loadNotes(n) {
    if (!PRIVATE) return null;
    if (notes.has(n)) return notes.get(n);
    let html = null;
    try {
      const r = await fetch(`/assets/weeks/w${pad(n)}/index.html`, { cache: 'no-cache' });
      if (r.ok && (r.headers.get('content-type') || '').includes('text/html')) { const t = await r.text(); if (t.includes('data-sdo-week')) html = t; }
    } catch { html = null; }
    notes.set(n, html);
    return html;
  }

  /* ---------- views ---------- */
  let current = null;
  function home(push = true) {
    current = null;
    const cur = currentWeek(), now = WEEKS[cur - 1], st = status(now);
    const next = WEEKS.filter((w) => w.kind === 'ca' && date(w.due) >= today())[0];
    const t = today();
    const soonM = MILESTONES.filter(([d]) => date(d) >= t).slice(0, 2);
    const tile = (w) => { const s = status(w); const q = window.SDOQuiz?.best; const done = w.quiz.filter((id) => q?.(id)).length;
      return `<button class="wk ${s.s} k-${w.kind}" data-week="${w.n}" ${s.s === 'locked' ? 'aria-describedby="wk-locked"' : ''}>
        <span class="wk-n">Week ${w.n}</span><span class="wk-t">${w.title}</span>
        <span class="wk-f"><span>${s.s === 'now' ? '● ' : ''}${s.txt}</span>${w.quiz.length && done ? `<i title="quiz topics practised">${done}/${w.quiz.length}</i>` : ''}</span></button>`; };
    root().innerHTML = `<section class="banner wk-hero"><div class="hero-txt"><span class="hero-kicker">Year 1 · 2026-27 · week by week</span>
        <h1>This week: <em>${now.title}</em></h1>
        <p>${st.txt}. Each week has its key points, the calculators that belong to it and the quiz topics to practise.${next ? ` Next assignment: <b>${next.title.replace(/ \(.*\)/, '')}</b>, ${fmt(next.due)}.` : ''}</p>
        <div class="wk-cta"><button class="btn" data-week="${now.n}">Open week ${now.n} →</button>${cur > 1 ? `<button class="btn ghost" data-week="${cur - 1}">Week ${cur - 1}</button>` : ''}</div></div>
        <div class="wk-side">${soonM.map(([d, a, b]) => `<div class="wk-ms"><b>${fmt(d)}</b><span>${a}</span><small>${b}</small></div>`).join('')}</div></section>
      <h2 class="q-unit">Autumn · Weeks 1–15</h2><div class="wk-grid">${WEEKS.slice(0, 15).map(tile).join('')}</div>
      <h2 class="q-unit">Spring · Weeks 16–32</h2><div class="wk-grid">${WEEKS.slice(15).map(tile).join('')}</div>
      <div id="wk-books"></div>
      <p class="wk-foot" id="wk-locked">Weeks open on the college timetable, roughly two weeks before they are due. Dates are the published 2026-27 timetable; your college's page is the one that counts.</p>`;
    if (push) history.replaceState(null, '', '#weeks');
    window.scrollTo({ top: 0 });
    shelf().then((books) => {
      const el = $('#wk-books'); if (!el || !books.length || current) return;
      el.innerHTML = `<h2 class="q-unit">Your books · private copy</h2><div class="wk-grid">${books.map((b) => `<button class="wk bk u${b.unit}" data-book="${b.slug}">
        <span class="wk-n">Unit ${b.unit}</span><span class="wk-t">${b.title}</span><span class="wk-f"><span>${b.author}</span><i>${b.chapters} ch.</i></span></button>`).join('')}</div>`;
    });
  }

  /* ---------- e-books (private copy only: the college's licensed books, never on the public site) ---------- */
  let books = null;
  async function shelf() {
    if (!PRIVATE) return [];
    if (books) return books;
    try { const r = await fetch('/assets/books/index.json', { cache: 'no-cache' }); books = r.ok ? await r.json() : []; } catch { books = []; }
    return books;
  }
  async function openBook(slug, push = true, ch = '', from = 0) {
    const b = (await shelf()).find((x) => x.slug === slug);
    if (!b) return home(push);
    current = `book:${slug}`;
    const back = from ? `data-week="${from}" aria-label="Back to week ${from}"` : 'data-act="home" aria-label="All weeks"';
    root().innerHTML = `<div class="q-top"><button class="btn ghost sq" ${back}><svg class="ico"><use href="#i-back"/></svg></button>
        <div class="q-meta"><span>${from ? `Week ${from} · reading` : 'Your books'}</span><b>${b.chapters} chapters</b></div></div>
      <header class="wk-head k-${b.unit === 2 ? 'lenses' : b.unit === 1 ? 'optics' : 'care'}"><span class="hero-kicker">Unit ${b.unit} · e-book from your college</span><h1>${b.title}</h1><p>${b.author}</p></header>
      <section class="card wk-sec"><div class="theory" id="bk-body"><p class="embed-note">Loading…</p></div></section>`;
    if (push) history.replaceState(null, '', `#book-${slug}`);
    window.scrollTo({ top: 0 });
    let html = '';
    try { const r = await fetch(`/assets/books/${slug}/index.html`, { cache: 'no-cache' }); if (r.ok) html = await r.text(); } catch { html = ''; }
    if (current !== `book:${slug}`) return;
    $('#bk-body').innerHTML = html.includes('data-sdo-book') ? html : '<p class="embed-note">This book is not available here.</p>';
    const d = ch && [...root().querySelectorAll('#bk-body details.ch')].find((x) => x.querySelector('summary')?.textContent.trim() === ch);
    if (d) { d.open = true; d.scrollIntoView({ block: 'start' }); }
  }
  // the chapters to read for week n, textbooks before the worked-problem books (iris only: the list lives in the private books/index.json)
  async function reading(n) {
    const out = [];
    for (const b of [...await shelf()].sort((x, y) => x.slug.startsWith('worked-') - y.slug.startsWith('worked-'))) for (const ch of b.weeks?.[n] || []) out.push({ slug: b.slug, book: b.title, ch });
    return out;
  }
  async function open(n, push = true) {
    const w = WEEKS.find((x) => x.n === n);
    if (!w) return home(push);
    current = n;
    const s = status(w), unit = w.unit || UNIT_OF[w.kind];
    const topics = window.SDOQuiz?._topics || [], best = window.SDOQuiz?.best;
    const qtile = (id) => { const t = topics.find((x) => x.id === id); if (!t) return ''; const b = best?.(id);
      return `<button class="qt u${t.unit}" data-quiz="${id}"><span class="qt-kind">${id.startsWith('t-') ? 'Theory' : 'Calculation'}</span><span class="qt-title">${t.title}</span><span class="qt-blurb">${t.blurb}</span>
        <span class="qt-foot">${b ? `<span class="qt-best">Best ${b.best}/10</span>` : '<span class="qt-best new">New</span>'}<span class="qt-bar"><i data-p="${b ? b.best / 10 : 0}"></i></span></span></button>`; };
    const tool = (k) => { const [tab, sub, label] = T[k]; return `<button class="wk-tool" data-go="${tab}${sub ? ':' + sub : ''}"><svg class="ico"><use href="#i-${{ overview: 'eye', transpose: 'swap', prism: 'prism', frame: 'frame', thick: 'lens' }[tab]}"/></svg><span>${label}</span><b>→</b></button>`; };
    const prev = WEEKS[n - 2], nxt = WEEKS[n];
    root().innerHTML = `<div class="q-top"><button class="btn ghost sq" data-act="home" aria-label="All weeks"><svg class="ico"><use href="#i-back"/></svg></button>
        <div class="q-meta"><span>Week ${n} of ${WEEKS.length}</span><b class="wk-st ${s.s}">${s.txt}</b></div></div>
      <header class="wk-head k-${w.kind}"><span class="hero-kicker">${KIND[w.kind]}${unit ? ` · Unit ${unit}` : ''}</span><h1>${w.title}</h1>
        <p>Due <b>${fmtLong(w.due)}</b>, 13:59.${w.codes.length ? ` Syllabus: ${w.codes.map((c) => `<span class="ref">${c}</span>`).join(' ')}` : ''}</p>${w.note ? `<p class="wk-note">${w.note}</p>` : ''}</header>
      <section class="card wk-sec"><div class="card-head"><h3><svg class="ico"><use href="#i-book"/></svg> Key points</h3></div><div class="wk-key">${w.key || '<p>Key points for this week are on the way.</p>'}</div></section>
      <section class="card wk-sec" id="wk-read" hidden><div class="card-head"><h3><svg class="ico"><use href="#i-book"/></svg> Read in your books</h3><span class="ref">private copy</span></div><div class="wk-tools" id="wk-read-list"></div></section>
      <section class="card wk-sec wk-notes" id="wk-notes" hidden><div class="card-head"><h3><svg class="ico"><use href="#i-book"/></svg> Your college notes</h3><span class="ref">private copy</span></div><div class="theory" id="wk-theory"></div></section>
      ${w.tools.length ? `<section class="card wk-sec"><div class="card-head"><h3><svg class="ico"><use href="#i-tools"/></svg> Tools for this week</h3></div><div class="wk-tools">${w.tools.map(tool).join('')}</div></section>` : ''}
      ${window.SDOSteps?.tiles(n) ? `<section class="wk-sec"><h2 class="q-unit">Learn the maths step by step</h2><div class="qt-grid">${window.SDOSteps.tiles(n)}</div></section>` : ''}
      ${w.quiz.length ? `<section class="wk-sec"><h2 class="q-unit">Practise</h2><div class="qt-grid">${w.quiz.map(qtile).join('')}</div></section>` : ''}
      <nav class="wk-nav">${prev ? `<button class="btn ghost" data-week="${prev.n}">← Week ${prev.n}</button>` : '<span></span>'}${nxt ? `<button class="btn ghost" data-week="${nxt.n}">Week ${nxt.n} →</button>` : ''}</nav>`;
    root().querySelectorAll('.qt-bar i').forEach((i) => { i.style.width = `${Math.round(Number(i.dataset.p) * 100)}%`; });
    if (push) history.replaceState(null, '', `#week-${n}`);
    window.scrollTo({ top: 0 });
    reading(n).then((list) => {
      if (current !== n || !list.length) return;
      $('#wk-read-list').innerHTML = list.map((r) => `<button class="wk-tool" data-book="${r.slug}" data-ch="${r.ch.replace(/"/g, '&quot;')}" data-from="${n}"><svg class="ico"><use href="#i-book"/></svg><span>${r.ch}<small class="wk-rd">${r.book}</small></span><b>→</b></button>`).join('');
      $('#wk-read').hidden = false;
    });
    const html = await loadNotes(n);
    if (current !== n) return;
    if (html) { $('#wk-theory').innerHTML = html; $('#wk-notes').hidden = false; }
  }

  // a cross-reference inside a book (e.g. "see chapter 5") opens that chapter of the same book
  function goChapter(n) {
    const d = [...root().querySelectorAll('#bk-body details.ch')].find((x) => new RegExp(`^(Chapter )?${n}\\b`).test(x.querySelector('summary')?.textContent.trim() || ''));
    if (d) { d.open = true; d.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  }
  document.addEventListener('keydown', (ev) => { const x = ev.target.closest?.('[data-goch]'); if (x && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); goChapter(x.dataset.goch); } });
  document.addEventListener('click', (ev) => {
    if (!root() || root().closest('[hidden]')) return;
    const x = ev.target.closest('[data-goch]');
    if (x && root().contains(x)) { goChapter(x.dataset.goch); return; }
    const sx = ev.target.closest('[data-steps]');
    if (sx && root().contains(sx)) { S.go(`steps-${sx.dataset.steps}`); return; }
    const t = ev.target.closest('[data-week], [data-act], [data-go], [data-quiz], [data-book]');
    if (!t || !root().contains(t)) return;
    if (t.dataset.book) openBook(t.dataset.book, true, t.dataset.ch || '', Number(t.dataset.from) || 0);
    else if (t.dataset.week) open(Number(t.dataset.week));
    else if (t.dataset.act === 'home') home();
    else if (t.dataset.go) { const [tab, sub] = t.dataset.go.split(':'); S.go(tab, sub); }
    else if (t.dataset.quiz) { window.SDOQuiz?.start(t.dataset.quiz); S.setMode('quiz'); }
  });

  window.SDOWeeks = { show() { if (typeof current === 'string') openBook(current.slice(5), false); else if (current) open(current, false); else home(false); }, open(n, push = true) { n ? open(n, push) : home(push); }, book: openBook, _weeks: WEEKS };
  if (!$('#mode-weeks').hidden) { const m = /^#week-(\d+)$/.exec(location.hash), k = /^#book-([a-z0-9-]+)$/.exec(location.hash); k ? openBook(k[1], false) : m ? open(Number(m[1]), false) : home(false); }
})();
