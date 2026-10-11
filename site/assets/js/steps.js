/* SDO Toolkit · Step by step. Every calculation of Year 1 worked out one step at a time, with fresh numbers each time:
   what we do and why, the formula, the numbers put in, what to press on the calculator, and the result. You can try
   first and ask for one step at a time as a hint; a wrong answer is checked against the usual slips (centimetres
   instead of metres, the wrong sign, n instead of n − 1…) so the feedback says where it went wrong.
   Asked for by Marta (2026-10-10): "I wish it explained me math step by step, including the formulas". */
(() => {
  'use strict';
  const S = window.SDO;
  if (!S) return;
  const $ = (s, r = document) => r.querySelector(s);
  const root = () => $('#steps-root');

  /* ---------- numbers ---------- */
  const MINUS = '−';
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ri = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = (arr) => arr[ri(0, arr.length - 1)];
  const qd = (lo, hi) => { let v; do { v = Math.round(rnd(lo, hi) * 4) / 4; } while (Math.abs(v) < 0.01); return v; };
  const N = (x, dp = 2) => S.num(x, dp);                       // fixed decimals, real minus sign
  const G = (x, dp = 2) => S.sgn(x, dp);                       // always signed: +4.00 / −4.00
  const Z = (x, dp = 3) => { const v = Number(x.toFixed(dp)); return (v < 0 ? MINUS : '') + String(Math.abs(v)); }; // no trailing zeros
  const P = (x, dp = 3) => (x < 0 ? `(${Z(x, dp)})` : Z(x, dp)); // in brackets when negative, for substitutions
  const sinD = (d) => Math.sin((d * Math.PI) / 180), asinD = (x) => (Math.asin(x) * 180) / Math.PI;
  const sup = (e) => `<sup>${e < 0 ? MINUS + Math.abs(e) : e}</sup>`;

  /* ---------- maths markup ---------- */
  const fr = (a, b) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
  const eq = (s) => `<div class="st-eq">${s}</div>`;
  const v = (s) => `<i>${s}</i>`; // a symbol

  /* ---------- topics ---------- */
  // weeks: the college weeks the topic belongs to (8 = Consolidation Assignment 1). quiz: quiz topics it explains.
  const T = [];
  const topic = (o) => T.push({ weeks: [], quiz: [], ...o });

  /* ===== Maths toolkit ===== */
  topic({ id: 'units', group: 'tool', title: 'Metres, centimetres and dioptres', blurb: 'Why everything goes into metres, and power ↔ focal length', weeks: [4, 5, 6, 8], quiz: [],
    formulas: [[`${v('F')} = ${fr('1', v('f′'))}`, [['F', 'power', 'dioptres (D)'], ['f′', 'focal length', 'metres (m)']]], ['1 m = 100 cm = 1000 mm', []]],
    gen() {
      if (Math.random() < 0.55) {
        const mm = Math.random() < 0.4, plus = Math.random() < 0.6;
        const d = mm ? pick([125, 200, 250, 400, 500, 800, 1000]) : pick([10, 20, 25, 40, 50, 80, 100, 200]);
        const m = mm ? d / 1000 : d / 100, F = (plus ? 1 : -1) / m, u = mm ? 'mm' : 'cm';
        return {
          q: `A ${plus ? '<b>converging</b> (plus)' : '<b>diverging</b> (minus)'} lens has a focal length of <b>${d} ${u}</b>. What is its power?`,
          know: [['f′', `${d} ${u}`, 'focal length'], ['type', plus ? 'converging → plus' : 'diverging → minus', '']], find: 'the power F, in dioptres',
          steps: [
            { h: 'Change the focal length into metres', say: `A dioptre is "one over a metre", so the distance has to be in <b>metres</b> before anything else. There are ${mm ? '1000 mm' : '100 cm'} in a metre, so divide by ${mm ? '1000' : '100'}.`,
              e: eq(`${v('f′')} = ${fr(`${d} ${u}`, mm ? '1000' : '100')} = <b>${Z(m)} m</b>`), calc: `${d} ÷ ${mm ? 1000 : 100} =` },
            { h: 'Power is one over the focal length', say: 'The shorter the focal length, the stronger the lens: that is why it is "one over".',
              e: eq(`${v('F')} = ${fr('1', v('f′'))} = ${fr('1', Z(m))} = ${N(Math.abs(F))}`), calc: `1 ÷ ${Z(m)} =` },
            { h: 'Give it its sign', say: plus ? 'A converging lens is a <b>plus</b> lens.' : 'A diverging lens is a <b>minus</b> lens.', res: `F = ${G(F)} D` },
          ],
          answer: [{ label: 'Power', unit: 'D', v: F, dp: 2, signed: true }],
          traps: [{ v: (plus ? 1 : -1) / d, msg: `You divided 1 by the ${u}. Change the focal length into metres first.` },
            { v: (plus ? 1 : -1) * m, msg: 'That is the focal length in metres: now do 1 ÷ that number.' }],
        };
      }
      const F = pick([0.5, 1, 2, 2.5, 4, 5, 8, 10]) * pick([1, -1]), m = 1 / F;
      return {
        q: `A lens has a power of <b>${G(F)} D</b>. What is its focal length, in centimetres?`,
        know: [['F', `${G(F)} D`, 'power']], find: 'the focal length f′, in cm',
        steps: [
          { h: 'Turn the formula round', say: `${v('F')} = 1 / ${v('f′')} works both ways: one over the power gives the focal length, <b>in metres</b>.`,
            e: eq(`${v('f′')} = ${fr('1', v('F'))} = ${fr('1', P(F, 2))} = <b>${Z(m)} m</b>`), calc: `1 ÷ ${Z(F, 2)} =` },
          { h: 'Metres into centimetres', say: 'Multiply by 100.', e: eq(`${Z(m)} × 100 = ${Z(m * 100, 1)} cm`), calc: `${Z(m)} × 100 =` },
          { h: 'What the sign tells you', say: F > 0 ? 'Plus: a <b>real</b> focus, behind the lens, where the light really meets.' : 'Minus: a <b>virtual</b> focus, in front of the lens; the light only seems to come from it.',
            res: `f′ = ${Z(m * 100, 1)} cm` },
        ],
        answer: [{ label: 'Focal length', unit: 'cm', v: m * 100, dp: 1, signed: true }],
        traps: [{ v: m, msg: 'That is the answer in metres. Multiply by 100 for centimetres.' }, { v: F * 100, msg: 'Divide 1 by the power, do not multiply.' }],
      };
    } });

  topic({ id: 'rearrange', group: 'tool', title: 'Rearranging a formula', blurb: 'Getting the letter you want on its own, the balance way', weeks: [4, 5, 8, 28, 30], quiz: [],
    formulas: [['Whatever you do to one side, do to the other', []]],
    gen() {
      const r = Math.random();
      if (r < 0.4) {
        const F = pick([4, 5, 6, 8, 10]) * pick([1, -1]), n = pick([1.5, 1.523, 1.6, 1.7]), rad = (n - 1) / F;
        return {
          q: `A surface in air has power ${v('F')} = <b>${G(F)} D</b> and is made of glass with ${v('n')} = <b>${n}</b>. Use ${v('F')} = (${v('n')} − 1) / ${v('r')} to find its radius ${v('r')} in millimetres.`,
          know: [['F', `${G(F)} D`, 'surface power'], ['n', String(n), 'refractive index']], find: 'the radius r, in mm',
          steps: [
            { h: 'Start from the formula', say: `${v('r')} is at the bottom of a fraction. We want it on its own on one side.`, e: eq(`${v('F')} = ${fr(`${v('n')} − 1`, v('r'))}`) },
            { h: 'Multiply both sides by r', say: `Multiplying by ${v('r')} cancels the "÷ ${v('r')}" on the right. Do the same on the left to keep the balance.`, e: eq(`${v('F')} × ${v('r')} = ${v('n')} − 1`) },
            { h: 'Divide both sides by F', say: `Now ${v('r')} is being multiplied by ${v('F')}: undo it by dividing both sides by ${v('F')}.`, e: eq(`${v('r')} = ${fr(`${v('n')} − 1`, v('F'))}`) },
            { h: 'Put the numbers in', e: eq(`${v('r')} = ${fr(`${n} − 1`, P(F, 2))} = ${fr(Z(n - 1), P(F, 2))} = <b>${Z(rad, 4)} m</b>`), calc: `( ${n} − 1 ) ÷ ${Z(F, 2)} =` },
            { h: 'Metres into millimetres', say: 'Multiply by 1000. The sign stays: plus = convex, minus = concave.', e: eq(`${Z(rad, 4)} × 1000 = ${Z(rad * 1000, 1)} mm`), res: `r = ${G(rad * 1000, 1)} mm` },
          ],
          answer: [{ label: 'Radius', unit: 'mm', v: rad * 1000, dp: 1, signed: true }],
          traps: [{ v: rad, msg: 'Right number, but in metres. Multiply by 1000 for millimetres.' }, { v: (n / F) * 1000, msg: 'Use n − 1 on the top, not n.' }, { v: (F / (n - 1)) * 1000, msg: 'Upside down: r = (n − 1) ÷ F.' }],
        };
      }
      if (r < 0.7) {
        const Pr = pick([1, 1.5, 2, 2.5, 3]), F = pick([2, 2.5, 4, 5, 6, 8]), c = Pr / F;
        return {
          q: `Prentice's rule is ${v('P')} = ${v('c')}${v('F')}. A <b>${G(F)} D</b> lens must give <b>${Z(Pr, 1)}Δ</b>. How far from the optical centre must the eye look (${v('c')}, in mm)?`,
          know: [['P', `${Z(Pr, 1)}Δ`, 'prism wanted'], ['F', `${G(F)} D`, 'lens power']], find: 'the distance c, in mm',
          steps: [
            { h: 'Start from the formula', say: `${v('c')}${v('F')} means ${v('c')} × ${v('F')}.`, e: eq(`${v('P')} = ${v('c')} × ${v('F')}`) },
            { h: 'Divide both sides by F', say: `To leave ${v('c')} alone, undo the "× ${v('F')}" by dividing both sides by ${v('F')}.`, e: eq(`${v('c')} = ${fr(v('P'), v('F'))}`) },
            { h: 'Put the numbers in', say: 'In Prentice\'s rule c comes out in <b>centimetres</b>.', e: eq(`${v('c')} = ${fr(Z(Pr, 1), Z(F, 2))} = ${Z(c, 3)} cm`), calc: `${Z(Pr, 1)} ÷ ${Z(F, 2)} =` },
            { h: 'Centimetres into millimetres', say: 'Multiply by 10.', e: eq(`${Z(c, 3)} × 10 = ${Z(c * 10, 1)} mm`), res: `c = ${Z(c * 10, 1)} mm` },
          ],
          answer: [{ label: 'Distance', unit: 'mm', v: c * 10, dp: 1 }],
          traps: [{ v: c, msg: 'That is in centimetres: Prentice gives c in cm. Multiply by 10.' }, { v: Pr * F, msg: 'Divide P by F; do not multiply.' }],
        };
      }
      const f14 = pick([4.5, 5, 5.5, 6, 6.5, 7]), lam = 3e8 / (f14 * 1e14);
      return {
        q: `Use ${v('v')} = ${v('f')}${v('λ')} to find the wavelength of light of frequency <b>${Z(f14, 1)} × 10${sup(14)} Hz</b> in air (${v('v')} = 3 × 10${sup(8)} m/s). Give it in nanometres.`,
        know: [['v', `3 × 10${sup(8)} m/s`, 'speed of light'], ['f', `${Z(f14, 1)} × 10${sup(14)} Hz`, 'frequency']], find: 'the wavelength λ, in nm',
        steps: [
          { h: 'Start from the formula', e: eq(`${v('v')} = ${v('f')} × ${v('λ')}`) },
          { h: 'Divide both sides by f', say: `${v('λ')} is being multiplied by ${v('f')}; divide both sides by ${v('f')} to leave it alone.`, e: eq(`${v('λ')} = ${fr(v('v'), v('f'))}`) },
          { h: 'Split the numbers from the powers of ten', say: 'Divide the front numbers, and <b>subtract</b> the powers of ten.', e: eq(`${v('λ')} = ${fr('3', Z(f14, 1))} × ${fr(`10${sup(8)}`, `10${sup(14)}`)} = ${Z(3 / f14, 3)} × 10${sup(8 - 14)}`), calc: `3 ÷ ${Z(f14, 1)} =` },
          { h: 'Tidy into nanometres', say: `1 nm = 10${sup(-9)} m. ${Z(3 / f14, 3)} × 10${sup(-6)} m = ${Z(lam * 1e9, 0)} × 10${sup(-9)} m.`, res: `λ = ${Z(lam * 1e9, 0)} nm` },
        ],
        answer: [{ label: 'Wavelength', unit: 'nm', v: lam * 1e9, dp: 0, tol: 3 }],
        traps: [{ v: (f14 / 3) * 100, msg: 'Upside down: λ = v ÷ f.' }],
      };
    } });

  /* ===== Week 4: surface power, lens form ===== */
  const LIGHT = 'Light travels from left to right. A radius is <b>positive</b> when the centre of curvature is to the right of the surface (convex towards the light) and <b>negative</b> when it is to the left (concave).';
  topic({ id: 'surf-power', group: 4, title: 'Power of a surface', blurb: 'F = (n′ − n) / r from the radius', weeks: [4, 8], quiz: ['u1-surf', 'u1-lens', 'ca1'],
    formulas: [[`${v('F')} = ${fr(`${v('n′')} − ${v('n')}`, v('r'))}`, [['F', 'surface power', 'D'], ['n', 'index the light comes from', ''], ['n′', 'index the light goes into', ''], ['r', 'radius of curvature', 'metres, with its sign']]]],
    gen() {
      const n2 = pick([1.498, 1.523, 1.586, 1.6, 1.7]), rc = ri(5, 25) * pick([1, -1]), F = (n2 - 1) / (rc / 100);
      return {
        q: `Light in air meets a ${rc > 0 ? 'convex' : 'concave'} glass surface (${v('n′')} = <b>${n2}</b>) with a radius of <b>${Math.abs(rc)} cm</b>. What is the power of the surface?`,
        know: [['n', '1', 'air: where the light comes from'], ['n′', String(n2), 'glass: where it goes'], ['r', `${Math.abs(rc)} cm`, rc > 0 ? 'convex' : 'concave']], find: 'the surface power F, in D',
        steps: [
          { h: 'Write the formula', say: 'Surface power depends on how much the index changes and how curved the surface is.', e: eq(`${v('F')} = ${fr(`${v('n′')} − ${v('n')}`, v('r'))}`) },
          { h: 'Decide the sign of r', say: LIGHT, e: eq(`${rc > 0 ? 'convex' : 'concave'} → r = ${G(rc, 0)} cm`) },
          { h: 'Radius into metres', say: 'Dioptres need metres: divide the centimetres by 100.', e: eq(`r = ${fr(G(rc, 0), '100')} = ${Z(rc / 100)} m`), calc: `${rc} ÷ 100 =` },
          { h: 'Work out the top', e: eq(`${v('n′')} − ${v('n')} = ${n2} − 1 = ${Z(n2 - 1)}`) },
          { h: 'Divide', e: eq(`${v('F')} = ${fr(Z(n2 - 1), P(rc / 100))} = ${G(F)} D`), calc: `${Z(n2 - 1)} ÷ ${Z(rc / 100)} =`, res: `F = ${G(F)} D` },
        ],
        answer: [{ label: 'Power', unit: 'D', v: F, dp: 2, signed: true }],
        traps: [{ v: (n2 - 1) / rc, msg: 'You divided by centimetres. Change the radius into metres first.' }, { v: n2 / (rc / 100), msg: 'The top is n′ − n = n′ − 1, not n′ on its own.' }],
      };
    } });

  topic({ id: 'surf-radius', group: 4, title: 'Radius from the power', blurb: 'r = (n − 1) / F, in mm', weeks: [4, 8], quiz: ['u1-surf', 'ca1'],
    formulas: [[`${v('r')} = ${fr(`${v('n')} − 1`, v('F'))}`, [['r', 'radius', 'm (× 1000 for mm)'], ['n', 'refractive index of the lens', ''], ['F', 'surface power', 'D']]]],
    gen() {
      const F = Math.round(rnd(2, 12) * 2) / 2 * pick([1, -1]), n = pick([1.498, 1.523, 1.586, 1.6, 1.7]), rad = (n - 1) / F;
      return {
        q: `A <b>${G(F)} D</b> surface is made in a material of ${v('n')} = <b>${n}</b> (in air). What is its radius of curvature?`,
        know: [['F', `${G(F)} D`, 'surface power'], ['n', String(n), 'lens material']], find: 'the radius r, in mm',
        steps: [
          { h: 'Turn the surface-power formula round', say: `${v('F')} = (${v('n')} − 1) / ${v('r')}, so ${v('r')} = (${v('n')} − 1) / ${v('F')}. (See "Rearranging a formula" if this step feels like magic.)`, e: eq(`${v('r')} = ${fr(`${v('n')} − 1`, v('F'))}`) },
          { h: 'Put the numbers in', e: eq(`${v('r')} = ${fr(`${n} − 1`, P(F, 2))} = ${fr(Z(n - 1), P(F, 2))} = ${Z(rad, 4)} m`), calc: `( ${n} − 1 ) ÷ ${Z(F, 2)} =` },
          { h: 'Metres into millimetres', say: 'Multiply by 1000.', e: eq(`${Z(rad, 4)} × 1000 = ${Z(rad * 1000, 1)} mm`), calc: `${Z(rad, 4)} × 1000 =` },
          { h: 'Convex or concave?', say: F > 0 ? 'Plus power, plus radius: the surface is <b>convex</b> to the light.' : 'Minus power, minus radius: the surface is <b>concave</b> to the light.', res: `r = ${Z(Math.abs(rad * 1000), 1)} mm, ${F > 0 ? 'convex' : 'concave'}` },
        ],
        answer: [{ label: 'Radius', unit: 'mm', v: Math.abs(rad * 1000), dp: 1 }, { label: 'Shape', choices: ['convex', 'concave'], v: F > 0 ? 'convex' : 'concave' }],
        traps: [{ v: Math.abs(rad), msg: 'Right number but in metres: × 1000 for mm.' }, { v: Math.abs((n / F) * 1000), msg: 'Use n − 1 on top, not n.' }, { v: Math.abs(1000 / F), msg: 'That is the focal length (1/F). The radius needs n − 1 on top.' }],
      };
    } });

  const FORMS = ['bi-convex', 'bi-concave', 'plano-convex', 'plano-concave', 'positive meniscus', 'negative meniscus', 'equi-convex', 'equi-concave'];
  const formOf = (a, b) => {
    if (Math.abs(b) < 0.01) return a > 0 ? 'plano-convex' : 'plano-concave';
    if (a > 0 && b > 0) return Math.abs(a - b) < 0.01 ? 'equi-convex' : 'bi-convex';
    if (a < 0 && b < 0) return Math.abs(a - b) < 0.01 ? 'equi-concave' : 'bi-concave';
    return `${a + b > 0 ? 'positive' : 'negative'} meniscus`;
  };
  topic({ id: 'thin-lens', group: 4, title: 'Thin lens power and form', blurb: 'F = F₁ + F₂, and naming the shape', weeks: [4, 8], quiz: ['u1-surf', 'ca1'],
    formulas: [[`${v('F')} = ${v('F')}<sub>1</sub> + ${v('F')}<sub>2</sub>`, [['F₁', 'front surface power', 'D'], ['F₂', 'back surface power', 'D'], ['F', 'power of the thin lens', 'D']]]],
    gen() {
      let F1, F2, F; do { F1 = qd(-4, 10); F2 = Math.random() < 0.15 ? 0 : qd(-10, 4); F = F1 + F2; } while (Math.abs(F) < 0.25 || (F1 < 0 && F2 > 0)); // concave front + convex back is not a form the course names
      const form = formOf(F1, F2);
      return {
        q: `A thin lens has a front surface of <b>${G(F1)} D</b> and a back surface of <b>${Math.abs(F2) < 0.01 ? 'plano (0.00 D)' : G(F2) + ' D'}</b>. What is its power, and what form is it?`,
        know: [['F₁', `${G(F1)} D`, 'front'], ['F₂', `${G(F2)} D`, 'back']], find: 'the power F and the form',
        steps: [
          { h: 'Add the two surfaces', say: 'For a thin lens the powers simply add up. Keep the signs: adding a minus number takes away.', e: eq(`${v('F')} = ${G(F1)} + ${P(F2, 2)} = ${G(F)} D`), calc: `${Z(F1, 2)} + ${P(F2, 2)} =` },
          { h: 'Look at each surface', say: 'Plus surface = convex, minus surface = concave, zero = flat (plano).', e: eq(`front ${F1 > 0 ? 'convex' : 'concave'} · back ${Math.abs(F2) < 0.01 ? 'plano' : F2 > 0 ? 'convex' : 'concave'}`) },
          { h: 'Name the form', say: Math.abs(F2) < 0.01 ? 'One flat side → <b>plano</b>-something.' : Math.sign(F1) === Math.sign(F2) ? 'Both surfaces the same sign → <b>bi</b>-convex or bi-concave (<b>equi</b> if they are equal).' : 'Convex front and concave back → a <b>meniscus</b>; the total power says if it is a positive or a negative meniscus.', res: `${G(F)} D, ${form}` },
        ],
        answer: [{ label: 'Power', unit: 'D', v: F, dp: 2, signed: true }, { label: 'Form', choices: FORMS, v: form }],
        traps: [{ v: F1 - F2, msg: 'Add the surfaces with their signs (F₁ + F₂); do not subtract.' }],
      };
    } });

  topic({ id: 'lensmaker', group: 4, title: 'Lens power from the radii', blurb: 'Two surfaces from n and r, then add them', weeks: [4, 8], quiz: ['u1-surf', 'ca1'],
    formulas: [[`${v('F')}<sub>1</sub> = ${fr(`${v('n')} − 1`, `${v('r')}<sub>1</sub>`)} &nbsp; ${v('F')}<sub>2</sub> = ${fr(`1 − ${v('n')}`, `${v('r')}<sub>2</sub>`)} &nbsp; ${v('F')} = ${v('F')}<sub>1</sub> + ${v('F')}<sub>2</sub>`, [['n', 'lens index', ''], ['r₁, r₂', 'front and back radii', 'metres, with sign']]]],
    gen() {
      let n, r1, r2, F1, F2, F;
      do { n = pick([1.498, 1.523, 1.6]); r1 = ri(8, 30); r2 = ri(5, 40) * pick([1, -1]); F1 = (n - 1) / (r1 / 100); F2 = (1 - n) / (r2 / 100); F = F1 + F2; } while (Math.abs(F) < 0.25);
      return {
        q: `A thin lens (${v('n')} = <b>${n}</b>) has a front radius of <b>+${r1} cm</b> and a back radius of <b>${G(r2, 0)} cm</b>. What is its power?`,
        know: [['n', String(n), 'lens'], ['r₁', `+${r1} cm`, 'front'], ['r₂', `${G(r2, 0)} cm`, 'back']], find: 'the power F, in D',
        steps: [
          { h: 'Radii into metres', e: eq(`r<sub>1</sub> = ${Z(r1 / 100)} m &nbsp; r<sub>2</sub> = ${Z(r2 / 100)} m`), calc: `${r1} ÷ 100 = · ${r2} ÷ 100 =` },
          { h: 'Front surface: air into glass', say: `The light goes from air (1) into glass (${n}), so n′ − n = ${n} − 1.`, e: eq(`${v('F')}<sub>1</sub> = ${fr(`${n} − 1`, Z(r1 / 100))} = ${G(F1)} D`), calc: `( ${n} − 1 ) ÷ ${Z(r1 / 100)} =` },
          { h: 'Back surface: glass into air', say: `Now the light leaves the glass, so n′ − n = 1 − ${n}: the top is <b>negative</b>. This is the step most people get wrong.`, e: eq(`${v('F')}<sub>2</sub> = ${fr(`1 − ${n}`, P(r2 / 100))} = ${fr(Z(1 - n), P(r2 / 100))} = ${G(F2)} D`), calc: `( 1 − ${n} ) ÷ ${P(r2 / 100)} =` },
          { h: 'Add them', e: eq(`${v('F')} = ${G(F1)} + ${P(F2, 2)} = ${G(F)} D`), res: `F = ${G(F)} D` },
        ],
        answer: [{ label: 'Power', unit: 'D', v: F, dp: 2, signed: true, tol: 0.03 }],
        traps: [{ v: F1 - F2, msg: 'Add F₁ and F₂; do not subtract them.' }, { v: F1 + (n - 1) / (r2 / 100), msg: 'For the back surface the light goes from glass into air, so the top is (1 − n), which is negative.' }, { v: F / 100, msg: 'Put the radii into metres before dividing.' }],
      };
    } });

  /* ===== Week 5: propagation of light ===== */
  topic({ id: 'freq', group: 5, title: 'Frequency from wavelength', blurb: 'v = fλ with powers of ten', weeks: [5, 8], quiz: ['u1-waves', 'ca1'],
    formulas: [[`${v('v')} = ${v('f')} ${v('λ')} &nbsp;→&nbsp; ${v('f')} = ${fr(v('v'), v('λ'))}`, [['v', 'speed of light', '3 × 10⁸ m/s in air'], ['f', 'frequency', 'Hz'], ['λ', 'wavelength', 'm (1 nm = 10⁻⁹ m)']]]],
    gen() {
      const lam = pick([400, 420, 450, 480, 500, 520, 550, 580, 600, 630, 650, 700]), m = lam / 100, fr14 = 3 / (lam / 100) * 10; // f = 3e8 / (lam e-9) = (3/lam) e17
      const mant = 3 / m, e = 8 - -7; // 3 / (m × 10^-7) = (3/m) × 10^15
      return {
        q: `Light of wavelength <b>${lam} nm</b> travels in air (${v('v')} = 3 × 10${sup(8)} m/s). What is its frequency? Give the number in front of × 10${sup(14)} Hz.`,
        know: [['λ', `${lam} nm`, 'wavelength'], ['v', `3 × 10${sup(8)} m/s`, 'speed in air']], find: `f, as ? × 10${sup(14)} Hz`,
        steps: [
          { h: 'Rearrange v = fλ', say: `Divide both sides by ${v('λ')}.`, e: eq(`${v('f')} = ${fr(v('v'), v('λ'))}`) },
          { h: 'Nanometres into metres', say: `"nano" means × 10${sup(-9)}. Move the decimal point so the front number is between 1 and 10: ${lam} × 10${sup(-9)} = ${Z(m, 2)} × 10${sup(-7)} m.`, e: eq(`${v('λ')} = ${Z(m, 2)} × 10${sup(-7)} m`) },
          { h: 'Divide the front numbers', e: eq(`${fr('3', Z(m, 2))} = ${Z(mant, 3)}`), calc: `3 ÷ ${Z(m, 2)} =` },
          { h: 'Divide the powers of ten', say: `Dividing powers of ten means <b>subtracting</b> the little numbers: 8 − (−7) = 8 + 7 = 15.`, e: eq(`${fr(`10${sup(8)}`, `10${sup(-7)}`)} = 10${sup(e)}`) },
          { h: 'Put them together and tidy', say: `${Z(mant, 3)} × 10${sup(15)}: move the point one place to the right and take one off the power.`, e: eq(`${Z(mant, 3)} × 10${sup(15)} = ${Z(fr14, 2)} × 10${sup(14)} Hz`), calc: `3 EXP 8 ÷ ${lam} EXP −9 =`, res: `f = ${Z(fr14, 2)} × 10${sup(14)} Hz` },
        ],
        answer: [{ label: 'f', unit: '× 10¹⁴ Hz', v: fr14, dp: 2, tol: 0.03 }],
        traps: [{ v: mant, msg: `That is the number in front of × 10${sup(15)}. Write it as × 10${sup(14)}: multiply the front number by 10.` }, { v: (m / 3) * 10, msg: 'Upside down: f = v ÷ λ.' }],
      };
    } });

  topic({ id: 'speed', group: 5, title: 'Speed of light in a medium', blurb: 'n = c / v', weeks: [5, 8], quiz: ['u1-waves', 'ca1'],
    formulas: [[`${v('n')} = ${fr(v('c'), v('v'))} &nbsp;→&nbsp; ${v('v')} = ${fr(v('c'), v('n'))}`, [['n', 'refractive index', 'no unit'], ['c', 'speed in a vacuum (≈ air)', '3 × 10⁸ m/s'], ['v', 'speed in the medium', 'm/s']]]],
    gen() {
      const n = pick([1.333, 1.498, 1.5, 1.523, 1.586, 1.6, 1.7, 1.8]), vv = 3 / n;
      return {
        q: `How fast does light travel in a medium of refractive index <b>${n}</b>? Give the number in front of × 10${sup(8)} m/s.`,
        know: [['n', String(n), 'refractive index'], ['c', `3 × 10${sup(8)} m/s`, 'speed in a vacuum']], find: `v, as ? × 10${sup(8)} m/s`,
        steps: [
          { h: 'What n means', say: 'The refractive index says how many times slower light goes in the material than in a vacuum.', e: eq(`${v('n')} = ${fr(v('c'), v('v'))}`) },
          { h: 'Rearrange for v', say: `Swap ${v('v')} and ${v('n')}: multiply both sides by ${v('v')}, then divide both sides by ${v('n')}.`, e: eq(`${v('v')} = ${fr(v('c'), v('n'))}`) },
          { h: 'Divide', say: `The × 10${sup(8)} just comes along for the ride.`, e: eq(`${v('v')} = ${fr(`3 × 10${sup(8)}`, String(n))} = ${Z(vv, 3)} × 10${sup(8)} m/s`), calc: `3 ÷ ${n} =` },
          { h: 'Sense check', say: 'Light always slows down in glass or water, so the answer must be <b>less than 3</b>.', res: `v = ${Z(vv, 3)} × 10${sup(8)} m/s` },
        ],
        answer: [{ label: 'v', unit: '× 10⁸ m/s', v: vv, dp: 2, tol: 0.02 }],
        traps: [{ v: 3 * n, msg: 'Multiplied instead of dividing: light is slower in the medium, so the answer must be less than 3.' }, { v: 3 / (n - 1), msg: 'Just c ÷ n here: no "n − 1".' }],
      };
    } });

  topic({ id: 'vergence', group: 5, title: 'Vergence', blurb: 'L = n / l, with the sign', weeks: [5, 8], quiz: ['u1-waves', 'ca1'],
    formulas: [[`${v('L')} = ${fr(v('n'), v('l'))}`, [['L', 'vergence', 'D'], ['n', 'index of the medium (air = 1)', ''], ['l', 'distance to the point the light comes from or goes to', 'metres, with sign']]]],
    gen() {
      const d = pick([10, 20, 25, 40, 50, 80, 100, 200]), conv = Math.random() < 0.4, l = (conv ? 1 : -1) * d / 100, L = 1 / l;
      return {
        q: `Light ${conv ? 'is <b>converging</b> towards a point' : '<b>diverges</b> from a point source'} <b>${d} cm</b> away, in air. What is its vergence here?`,
        know: [['n', '1', 'air'], ['distance', `${d} cm`, conv ? 'to the point ahead' : 'back to the source']], find: 'the vergence L, in D',
        steps: [
          { h: 'Decide the sign of l', say: conv ? 'The light is heading to a point <b>ahead</b> (to the right): l is <b>positive</b>, and converging light has positive vergence.' : 'The light comes from a point <b>behind</b> it (to the left): l is <b>negative</b>, and diverging light has negative vergence.', e: eq(`l = ${conv ? '+' : MINUS}${d} cm`) },
          { h: 'Distance into metres', e: eq(`l = ${fr((conv ? '+' : MINUS) + d, '100')} = ${Z(l)} m`), calc: `${d} ÷ 100 =` },
          { h: 'Divide', e: eq(`${v('L')} = ${fr('1', P(l))} = ${G(L)} D`), calc: `1 ÷ ${Z(Math.abs(l))} =`, res: `L = ${G(L)} D` },
        ],
        answer: [{ label: 'L', unit: 'D', v: L, dp: 2, signed: true }],
        traps: [{ v: (conv ? 1 : -1) / d, msg: 'Change the distance into metres before dividing.' }, { v: (conv ? 1 : -1) * d / 100, msg: 'That is the distance in metres: the vergence is 1 ÷ that.' }],
      };
    } });

  topic({ id: 'lambda-n', group: 5, title: 'Wavelength in a medium', blurb: 'λ shrinks by n; the frequency does not change', weeks: [5, 8], quiz: ['u1-waves'],
    formulas: [[`${v('λ')}<sub>medium</sub> = ${fr(`${v('λ')}<sub>air</sub>`, v('n'))}`, [['λ', 'wavelength', 'nm'], ['n', 'refractive index', '']]]],
    gen() {
      const lam = pick([450, 500, 550, 589, 600, 650, 700]), n = pick([1.333, 1.5, 1.523, 1.6, 1.7]), ln = lam / n;
      return {
        q: `Light of wavelength <b>${lam} nm</b> in air enters glass of ${v('n')} = <b>${n}</b>. What is its wavelength in the glass?`,
        know: [['λ', `${lam} nm`, 'in air'], ['n', String(n), 'glass']], find: 'the wavelength in the glass, in nm',
        steps: [
          { h: 'What stays the same', say: 'The frequency (the colour) never changes when light changes medium. The light slows down by n, so in v = fλ the wavelength must shrink by n too.', e: eq(`${v('λ')}<sub>glass</sub> = ${fr(`${v('λ')}<sub>air</sub>`, v('n'))}`) },
          { h: 'Divide', e: eq(`${fr(String(lam), String(n))} = ${Z(ln, 1)} nm`), calc: `${lam} ÷ ${n} =`, res: `λ = ${Z(ln, 1)} nm` },
        ],
        answer: [{ label: 'λ', unit: 'nm', v: ln, dp: 1, tol: 0.6 }],
        traps: [{ v: lam * n, msg: 'The wavelength gets shorter in glass: divide by n.' }],
      };
    } });

  /* ===== Week 6: errors of refraction ===== */
  topic({ id: 'far-point', group: 6, title: 'Far point from the Rx', blurb: 'Where the eye focuses without its glasses', weeks: [6, 8], quiz: ['u2-amet', 'ca1'],
    formulas: [[`far point distance = ${fr('1', v('F'))}`, [['F', 'correcting lens (at the eye)', 'D'], ['distance', 'from the eye', 'm (× 100 for cm)']]]],
    gen() {
      const myope = Math.random() < 0.65, F = myope ? -pick([0.5, 1, 1.25, 2, 2.5, 4, 5, 8]) : pick([0.5, 1, 2, 2.5, 4, 5]), cm = 100 / Math.abs(F);
      return {
        q: `An eye is fully corrected by a <b>${G(F)} D</b> lens (take the lens at the eye). Where is its far point?`,
        know: [['F', `${G(F)} D`, 'correcting lens']], find: 'how far, and in front or behind',
        steps: [
          { h: 'The idea', say: 'The correcting lens must send parallel light to the eye\'s far point. So the far point sits at the <b>focal point</b> of the lens.' },
          { h: 'Focal length', e: eq(`${fr('1', Z(Math.abs(F), 2))} = ${Z(1 / Math.abs(F), 3)} m = ${Z(cm, 1)} cm`), calc: `1 ÷ ${Z(Math.abs(F), 2)} × 100 =` },
          { h: 'In front or behind?', say: myope ? 'Minus lens → the eye is <b>myopic</b> → its far point is real, <b>in front</b> of the eye.' : 'Plus lens → the eye is <b>hypermetropic</b> → its far point is virtual, <b>behind</b> the eye.', res: `${Z(cm, 1)} cm ${myope ? 'in front of' : 'behind'} the eye` },
        ],
        answer: [{ label: 'Distance', unit: 'cm', v: cm, dp: 1 }, { label: 'Where', choices: ['in front of the eye', 'behind the eye'], v: myope ? 'in front of the eye' : 'behind the eye' }],
        traps: [{ v: 1 / Math.abs(F), msg: 'Right, but in metres: × 100 for cm.' }, { v: Math.abs(F) * 100, msg: 'Divide 1 by the power; do not multiply.' }],
      };
    } });

  topic({ id: 'correct-lens', group: 6, title: 'Lens from the far point', blurb: 'The Rx that corrects a given far point', weeks: [6, 8], quiz: ['u2-amet', 'ca1'],
    formulas: [[`${v('F')} = ${fr('1', 'far point distance')}`, [['F', 'correcting lens', 'D'], ['distance', 'in metres; in front = −, behind = +', '']]]],
    gen() {
      const front = Math.random() < 0.65, cm = front ? pick([12.5, 20, 25, 40, 50, 80, 100, 200]) : pick([20, 25, 40, 50, 100, 200]), F = (front ? -1 : 1) * 100 / cm;
      return {
        q: `An eye's far point is <b>${Z(cm, 1)} cm ${front ? 'in front of' : 'behind'}</b> the eye. What lens (at the eye) corrects it?`,
        know: [['far point', `${Z(cm, 1)} cm ${front ? 'in front' : 'behind'}`, '']], find: 'the lens power F, in D',
        steps: [
          { h: 'Sign of the distance', say: front ? 'In front of the eye = against the direction of the light = <b>negative</b>.' : 'Behind the eye = <b>positive</b>.', e: eq(`distance = ${front ? MINUS : '+'}${Z(cm, 1)} cm = ${front ? MINUS : '+'}${Z(cm / 100, 3)} m`) },
          { h: 'One over the distance', e: eq(`${v('F')} = ${fr('1', `${front ? MINUS : '+'}${Z(cm / 100, 3)}`)} = ${G(F)} D`), calc: `1 ÷ ${Z(cm / 100, 3)} =` },
          { h: 'Sense check', say: front ? 'Far point in front → myopia → a <b>minus</b> lens. ✔' : 'Far point behind → hypermetropia → a <b>plus</b> lens. ✔', res: `F = ${G(F)} D` },
        ],
        answer: [{ label: 'Power', unit: 'D', v: F, dp: 2, signed: true }],
        traps: [{ v: (front ? -1 : 1) / cm, msg: 'Change the centimetres into metres first.' }],
      };
    } });

  /* ===== Week 7: pinhole camera and plane mirrors ===== */
  topic({ id: 'pinhole', group: 7, title: 'Pinhole camera', blurb: 'Similar triangles: image size and distances', weeks: [7, 8], quiz: ['u1-mirror', 'ca1'],
    formulas: [[`${fr(v('h′'), v('h'))} = ${fr(v('l′'), v('l'))}`, [['h', 'object height', ''], ['h′', 'image height', ''], ['l', 'object to pinhole', ''], ['l′', 'pinhole to screen', 'all in the same unit!']]]],
    gen() {
      const h = pick([1.5, 1.8, 2, 3, 5, 8, 10, 12]), u = pick([4, 5, 6, 8, 10, 15, 20, 25]), vc = pick([10, 12, 15, 20, 25, 30]);
      const hmm = h * 1000, umm = u * 1000, vmm = vc * 10, hi = (hmm * vmm) / umm;
      if (Math.random() < 0.6) return {
        q: `A <b>${Z(h, 1)} m</b> tall object stands <b>${u} m</b> from a pinhole camera whose screen is <b>${vc} cm</b> behind the hole. How tall is the image?`,
        know: [['h', `${Z(h, 1)} m`, 'object'], ['l', `${u} m`, 'object to hole'], ['l′', `${vc} cm`, 'hole to screen']], find: 'the image height h′, in mm',
        steps: [
          { h: 'Draw it', say: 'Rays from the top and the bottom of the object cross at the hole. That makes two triangles of the same shape, so their sides are in the same ratio.', e: eq(`${fr(v('h′'), v('h'))} = ${fr(v('l′'), v('l'))}`) },
          { h: 'Everything in millimetres', say: 'Ratios only work if all four lengths are in the same unit.', e: eq(`h = ${hmm} mm · l = ${umm} mm · l′ = ${vmm} mm`) },
          { h: 'Get h′ on its own', say: `Multiply both sides by ${v('h')}.`, e: eq(`${v('h′')} = ${v('h')} × ${fr(v('l′'), v('l'))}`) },
          { h: 'Put the numbers in', e: eq(`${v('h′')} = ${hmm} × ${fr(String(vmm), String(umm))} = ${Z(hi, 1)} mm`), calc: `${hmm} × ${vmm} ÷ ${umm} =` },
          { h: 'Which way up?', say: 'The rays cross at the hole, so the image is <b>upside down (inverted)</b>. (A longer camera would give a bigger but dimmer image.)', res: `${Z(hi, 1)} mm, inverted` },
        ],
        answer: [{ label: 'Image height', unit: 'mm', v: hi, dp: 1 }],
        traps: [{ v: (h * vc) / u, msg: 'Mixed units: put everything in mm first.' }, { v: (hmm * umm) / vmm, msg: 'Upside down ratio: h′/h = l′/l (screen distance over object distance).' }],
      };
      const him = pick([5, 8, 10, 12, 15, 20, 24]), dmm = (vmm * hmm) / him;
      return {
        q: `A <b>${Z(h, 1)} m</b> tall object gives a <b>${him} mm</b> image in a pinhole camera <b>${vc} cm</b> long. How far is the object from the hole?`,
        know: [['h', `${Z(h, 1)} m`, 'object'], ['h′', `${him} mm`, 'image'], ['l′', `${vc} cm`, 'hole to screen']], find: 'the object distance l, in m',
        steps: [
          { h: 'Same triangles', e: eq(`${fr(v('l'), v('l′'))} = ${fr(v('h'), v('h′'))}`) },
          { h: 'Everything in millimetres', e: eq(`h = ${hmm} mm · h′ = ${him} mm · v = ${vmm} mm`) },
          { h: 'Get l on its own', say: `Multiply both sides by ${v('l′')}.`, e: eq(`${v('l')} = ${v('l′')} × ${fr(v('h'), v('h′'))}`) },
          { h: 'Put the numbers in', e: eq(`${v('l')} = ${vmm} × ${fr(String(hmm), String(him))} = ${Z(dmm, 0)} mm`), calc: `${vmm} × ${hmm} ÷ ${him} =` },
          { h: 'Millimetres into metres', say: 'Divide by 1000.', res: `l = ${Z(dmm / 1000, 2)} m` },
        ],
        answer: [{ label: 'Distance', unit: 'm', v: dmm / 1000, dp: 2, tol: 0.05 }],
        traps: [{ v: dmm, msg: 'That is in millimetres: ÷ 1000 for metres.' }, { v: (vc * h) / him, msg: 'Mixed units: put every length in mm before dividing.' }],
      };
    } });

  topic({ id: 'mirror-turn', group: 7, title: 'Turning a mirror', blurb: 'The reflected ray turns 2θ', weeks: [7, 8], quiz: ['u1-mirror', 'ca1'],
    formulas: [['ray turns 2θ &nbsp;·&nbsp; deviation = 180° − 2' + v('i') + ' = 2' + v('g'), [['θ', 'angle the mirror turns', '°'], ['i', 'angle of incidence (from the normal)', '°'], ['g', 'glancing angle (from the mirror surface)', '°']]]],
    gen() {
      if (Math.random() < 0.5) {
        const th = pick([2, 5, 8, 10, 12, 15, 20, 25]);
        return {
          q: `A plane mirror is turned through <b>${th}°</b> while the incident ray stays still. Through what angle does the reflected ray turn?`,
          know: [['θ', `${th}°`, 'mirror turns']], find: 'how far the reflected ray turns',
          steps: [
            { h: 'The normal turns with the mirror', say: `The normal is stuck at 90° to the mirror, so it turns ${th}° too. The angle of incidence changes by ${th}°.` },
            { h: 'Reflection doubles it', say: `The angle of reflection always equals the angle of incidence, so it also changes by ${th}°. Incidence + reflection together: ${th}° + ${th}°.`, e: eq(`2θ = 2 × ${th}° = ${2 * th}°`), res: `${2 * th}°` },
          ],
          answer: [{ label: 'Angle', unit: '°', v: 2 * th, dp: 0, tol: 0.1 }],
          traps: [{ v: th, msg: 'The mirror turns θ, but the reflected ray turns twice as much.' }],
        };
      }
      const i = pick([10, 20, 25, 30, 35, 40, 50, 60, 70]);
      return {
        q: `A ray hits a plane mirror with an angle of incidence of <b>${i}°</b>. Through what angle is it deviated (turned from its original direction)?`,
        know: [['i', `${i}°`, 'angle of incidence, from the normal']], find: 'the deviation',
        steps: [
          { h: 'Draw it', say: `The ray comes in at ${i}° to the normal and leaves at ${i}° on the other side. Between the incoming and outgoing ray there is 2 × ${i}° = ${2 * i}°.` },
          { h: 'Deviation', say: `If nothing were there, the ray would carry straight on (180°). The mirror bends it back, so the deviation is what is left. Your book works it the other way round: the glancing angle (ray to mirror surface) is 90° − ${i}° = ${90 - i}°, and the deviation is twice that.`, e: eq(`deviation = 180° − 2 × ${i}° = 2 × ${90 - i}° = ${180 - 2 * i}°`), res: `${180 - 2 * i}°` },
        ],
        answer: [{ label: 'Deviation', unit: '°', v: 180 - 2 * i, dp: 0, tol: 0.1 }],
        traps: [{ v: 2 * i, msg: 'That is the angle between the two rays; the deviation is 180° minus that.' }, { v: 180 - i, msg: 'Use 2 × i: the ray turns through the incidence and the reflection.' }],
      };
    } });

  topic({ id: 'mirror-images', group: 7, title: 'Two mirrors at an angle', blurb: 'N = 360 / θ − 1', weeks: [7, 8], quiz: ['u1-mirror', 'ca1'],
    formulas: [[`${v('N')} = ${fr('360', 'θ')} − 1`, [['N', 'number of images', ''], ['θ', 'angle between the mirrors', '°']]]],
    gen() {
      const th = pick([90, 60, 45, 36, 30, 20]), N = 360 / th - 1;
      return {
        q: `Two plane mirrors are set at <b>${th}°</b> to each other, with an object between them. How many images are seen?`,
        know: [['θ', `${th}°`, 'between the mirrors']], find: 'the number of images N',
        steps: [
          { h: 'How many times θ fits in a circle', e: eq(`${fr('360', String(th))} = ${360 / th}`), calc: `360 ÷ ${th} =` },
          { h: 'Take one away', say: 'One of those "slots" is the object itself, not an image. (The formula holds when θ divides into 360° a whole number of times, as here.)', e: eq(`${v('N')} = ${360 / th} − 1 = ${N}`), res: `${N} images` },
        ],
        answer: [{ label: 'Images', unit: '', v: N, dp: 0, tol: 0.1 }],
        traps: [{ v: N + 1, msg: 'Take one away: one of those is the object itself.' }],
      };
    } });

  topic({ id: 'mirror-length', group: 7, title: 'Shortest mirror', blurb: 'Half your height, and where to hang it', weeks: [7, 8], quiz: ['u1-mirror', 'ca1'],
    formulas: [['length = ½ height · bottom edge = ½ eye height', []]],
    gen() {
      const H = ri(150, 195), e = ri(9, 13), eye = H - e;
      return {
        q: `A person <b>${H} cm</b> tall, with their eyes <b>${e} cm</b> below the top of their head, wants to see their whole body in a wall mirror. How long must the mirror be, and how high above the floor is its bottom edge?`,
        know: [['height', `${H} cm`, ''], ['eyes', `${e} cm below the top`, `so ${eye} cm above the floor`]], find: 'the mirror length and the height of its bottom edge',
        steps: [
          { h: 'The ray from the feet', say: 'Light from the feet hits the mirror and bounces up to the eyes. The angle in equals the angle out, so it reflects <b>halfway</b> between floor level and eye level.', e: eq(`bottom edge = ${fr(String(eye), '2')} = ${Z(eye / 2, 1)} cm`), calc: `${eye} ÷ 2 =` },
          { h: 'The ray from the top of the head', say: `In the same way it reflects halfway between the top of the head and the eyes: ${Z(e / 2, 1)} cm below the top of the head.`, e: eq(`top edge = ${H} − ${fr(String(e), '2')} = ${Z(H - e / 2, 1)} cm`) },
          { h: 'Length of the mirror', say: 'Top edge minus bottom edge. Notice it is exactly half the height, however far away you stand.', e: eq(`${Z(H - e / 2, 1)} − ${Z(eye / 2, 1)} = ${Z(H / 2, 1)} cm = ${fr(String(H), '2')}`), res: `${Z(H / 2, 1)} cm long, bottom edge ${Z(eye / 2, 1)} cm up` },
        ],
        answer: [{ label: 'Length', unit: 'cm', v: H / 2, dp: 1, tol: 0.2 }, { label: 'Bottom edge', unit: 'cm', v: eye / 2, dp: 1, tol: 0.2 }],
        traps: [{ v: H, msg: 'The mirror only needs to be half your height.' }],
      };
    } });

  /* ===== Unit 1 later: refraction ===== */
  topic({ id: 'snell', group: 10, title: "Snell's law", blurb: 'Angle of refraction with sin and sin⁻¹', weeks: [10, 15], quiz: ['u1-refr'],
    formulas: [[`${v('n')} sin ${v('i')} = ${v('n′')} sin ${v('i′')}`, [['i', 'angle of incidence', '° from the normal'], ['i′', 'angle of refraction', '°'], ['n, n′', 'indices before and after', '']]]],
    gen() {
      const i = ri(20, 70), n2 = pick([1.333, 1.5, 1.523, 1.6]), s = sinD(i) / n2, r = asinD(s);
      return {
        q: `Light in air hits glass (${v('n′')} = <b>${n2}</b>) at an angle of incidence of <b>${i}°</b>. What is the angle of refraction?`,
        know: [['n', '1', 'air'], ['n′', String(n2), 'glass'], ['i', `${i}°`, 'incidence']], find: 'the angle of refraction i′',
        steps: [
          { h: 'Write Snell\'s law', e: eq(`${v('n')} sin ${v('i')} = ${v('n′')} sin ${v('i′')}`) },
          { h: 'Get sin i′ on its own', say: `Divide both sides by ${v('n′')}. With n = 1 the left is just sin i.`, e: eq(`sin ${v('i′')} = ${fr(`1 × sin ${i}°`, String(n2))}`) },
          { h: 'Work out the sine', say: 'Make sure the calculator is in <b>degrees</b> (D or DEG on the screen).', e: eq(`sin ${i}° = ${Z(sinD(i), 4)} &nbsp;→&nbsp; ${fr(Z(sinD(i), 4), String(n2))} = ${Z(s, 4)}`), calc: `sin ${i} = ÷ ${n2} =` },
          { h: 'Undo the sine', say: 'sin⁻¹ (usually SHIFT then sin) turns the sine back into an angle.', e: eq(`${v('i′')} = sin<sup>−1</sup>(${Z(s, 4)}) = ${Z(r, 1)}°`), calc: `SHIFT sin ${Z(s, 4)} =` },
          { h: 'Sense check', say: 'Going into glass the ray bends <b>towards</b> the normal, so i′ must be smaller than i. ✔', res: `i′ = ${Z(r, 1)}°` },
        ],
        answer: [{ label: 'i′', unit: '°', v: r, dp: 1, tol: 0.3 }],
        traps: [{ v: i / n2, msg: 'Divide the sine, not the angle: sin i′ = sin i ÷ n′, then sin⁻¹.' }, { v: s, msg: 'That is sin i′. Press SHIFT sin (sin⁻¹) to turn it into an angle.' }],
      };
    } });

  topic({ id: 'critical', group: 10, title: 'Critical angle', blurb: 'sin c = 1 / n', weeks: [10, 15], quiz: ['u1-refr'],
    formulas: [[`sin ${v('i')}<sub>c</sub> = ${fr(v('n′'), v('n'))}`, [['i<sub>c</sub>', 'critical angle', '°'], ['n', 'denser medium (light starts here)', ''], ['n′', 'less dense medium (air = 1)', '']]]],
    gen() {
      const n = pick([1.333, 1.5, 1.523, 1.6, 1.7, 1.8]), c = asinD(1 / n);
      return {
        q: `What is the critical angle for light going from a medium of ${v('n')} = <b>${n}</b> into air?`,
        know: [['n', String(n), 'medium'], ['n′', '1', 'air']], find: 'the critical angle i<sub>c</sub>',
        steps: [
          { h: 'The idea', say: 'At the critical angle the refracted ray just skims along the surface (90°). Put i′ = 90° in Snell\'s law: sin 90° = 1.', e: eq(`${n} × sin ${v('i')}<sub>c</sub> = 1 × sin 90° = 1`) },
          { h: 'Get sin i<sub>c</sub> on its own', e: eq(`sin ${v('i')}<sub>c</sub> = ${fr('1', String(n))} = ${Z(1 / n, 4)}`), calc: `1 ÷ ${n} =` },
          { h: 'Undo the sine', e: eq(`${v('i')}<sub>c</sub> = sin<sup>−1</sup>(${Z(1 / n, 4)}) = ${Z(c, 1)}°`), calc: `SHIFT sin ${Z(1 / n, 4)} =`, res: `i<sub>c</sub> = ${Z(c, 1)}° (beyond it: total internal reflection)` },
        ],
        answer: [{ label: 'Critical angle', unit: '°', v: c, dp: 1, tol: 0.3 }],
        traps: [{ v: 1 / n, msg: 'That is sin i<sub>c</sub>. Press SHIFT sin (sin⁻¹) to get the angle.' }, { v: 90 - c, msg: 'Check the calculator is in degrees, and use sin⁻¹, not cos⁻¹.' }],
      };
    } });

  topic({ id: 'depth', group: 10, title: 'Apparent depth', blurb: 'n = real / apparent', weeks: [10, 15], quiz: ['u1-refr'],
    formulas: [[`${v('n')} = ${fr('real depth', 'apparent depth')}`, []]],
    gen() {
      const t = ri(10, 60), n = pick([1.333, 1.5, 1.523, 1.6]), a = t / n;
      return {
        q: `A block <b>${t} mm</b> thick (${v('n')} = <b>${n}</b>) is looked at straight on from air. How thick does it look?`,
        know: [['real', `${t} mm`, ''], ['n', String(n), '']], find: 'the apparent thickness, in mm',
        steps: [
          { h: 'Write the formula', say: 'Things under glass or water look closer than they are, by a factor n.', e: eq(`${v('n')} = ${fr('real', 'apparent')}`) },
          { h: 'Get "apparent" on its own', say: 'Swap it with n.', e: eq(`apparent = ${fr('real', v('n'))}`) },
          { h: 'Divide', e: eq(`${fr(String(t), String(n))} = ${Z(a, 1)} mm`), calc: `${t} ÷ ${n} =`, res: `${Z(a, 1)} mm (it looks ${Z(t - a, 1)} mm shallower)` },
        ],
        answer: [{ label: 'Apparent', unit: 'mm', v: a, dp: 1, tol: 0.15 }],
        traps: [{ v: t * n, msg: 'It looks thinner, not thicker: divide by n.' }, { v: t - a, msg: 'That is how much shallower it looks; the question asks for the apparent thickness.' }],
      };
    } });

  /* ===== Unit 2 ===== */
  topic({ id: 'transpose', group: 9, title: 'Transposition', blurb: 'Plus cyl ↔ minus cyl in three steps', weeks: [9, 11, 12, 15], quiz: ['u2-trans'],
    formulas: [['1. sph + cyl &nbsp; 2. change the cyl sign &nbsp; 3. axis ± 90°', []]],
    gen() {
      const e = { sph: Math.round(rnd(-6, 6) * 4) / 4, cyl: qd(-3, 3), axis: ri(1, 36) * 5 }, t = S.transpose(e);
      const ax2 = t.axis;
      return {
        q: `Transpose <b>${S.rxS(e)}</b> into ${e.cyl < 0 ? 'plus' : 'minus'}-cyl form.`,
        know: [['sph', G(e.sph), ''], ['cyl', G(e.cyl), ''], ['axis', String(e.axis), '']], find: 'the same lens written the other way',
        steps: [
          { h: 'New sphere = sphere + cylinder', say: 'Add them, keeping the signs.', e: eq(`${G(e.sph)} + ${P(e.cyl, 2)} = ${G(t.sph)}`), calc: `${Z(e.sph, 2)} + ${P(e.cyl, 2)} =` },
          { h: 'Change the sign of the cylinder', e: eq(`${G(e.cyl)} → ${G(t.cyl)}`) },
          { h: 'Turn the axis through 90°', say: 'Add 90 if the axis is 90 or less; take away 90 if it is more. The answer must stay between 1 and 180.', e: eq(`${e.axis} ${e.axis <= 90 ? '+' : MINUS} 90 = ${ax2}`), res: S.rxS(t) },
        ],
        answer: [{ label: 'Sph', unit: 'D', v: t.sph, dp: 2, signed: true, tol: 0.001 }, { label: 'Cyl', unit: 'D', v: t.cyl, dp: 2, signed: true, tol: 0.001 }, { label: 'Axis', unit: '°', v: ax2, dp: 0, tol: 0.1 }],
        traps: [],
      };
    } });

  topic({ id: 'prentice', group: 28, title: "Prentice's rule", blurb: 'P = cF, and which way the base points', weeks: [13, 14, 23, 25, 28, 30], quiz: ['u2-prentice'],
    formulas: [[`${v('P')} = ${v('c')}${v('F')}`, [['P', 'prismatic effect', 'Δ'], ['c', 'distance from the optical centre', 'cm'], ['F', 'power in that meridian', 'D']]]],
    gen() {
      const F = qd(-8, 8), c = ri(2, 12), dir = pick(['below', 'above', 'nasal to', 'temporal to']), Pr = (c / 10) * Math.abs(F);
      const toOC = { below: 'up', above: 'down', 'nasal to': 'out', 'temporal to': 'in' }, opp = { up: 'down', down: 'up', in: 'out', out: 'in' };
      const base = F > 0 ? toOC[dir] : opp[toOC[dir]];
      return {
        q: `The wearer looks through a point <b>${c} mm ${dir}</b> the optical centre of a <b>${G(F)} D</b> spherical lens. What is the prismatic effect, and which way is the base?`,
        know: [['c', `${c} mm`, dir + ' the OC'], ['F', `${G(F)} D`, 'sphere: same power in every meridian']], find: 'the prism P and its base direction',
        steps: [
          { h: 'Millimetres into centimetres', say: 'Prentice\'s rule uses c in <b>centimetres</b>: divide by 10.', e: eq(`c = ${fr(String(c), '10')} = ${Z(c / 10, 1)} cm`) },
          { h: 'Multiply', say: 'Use the size of the power; the sign only decides the base.', e: eq(`${v('P')} = ${Z(c / 10, 1)} × ${Z(Math.abs(F), 2)} = ${Z(Pr, 2)}Δ`), calc: `${Z(c / 10, 1)} × ${Z(Math.abs(F), 2)} =` },
          { h: 'Base direction', say: F > 0 ? `A plus lens is like two prisms base to base: the base points <b>towards</b> the optical centre. The OC is ${toOC[dir] === 'up' ? 'above' : toOC[dir] === 'down' ? 'below' : toOC[dir] === 'in' ? 'nasal to' : 'temporal to'} the point, so base <b>${base}</b>.` : `A minus lens is like two prisms apex to apex: the base points <b>away from</b> the optical centre → base <b>${base}</b>.`, res: `${Z(Pr, 2)}Δ base ${base}` },
        ],
        answer: [{ label: 'Prism', unit: 'Δ', v: Pr, dp: 2, tol: 0.02 }, { label: 'Base', choices: ['up', 'down', 'in', 'out'], v: base }],
        traps: [{ v: c * Math.abs(F), msg: 'c must be in centimetres: divide the mm by 10.' }],
      };
    } });

  topic({ id: 'decentre', group: 28, title: 'Decentring for prism', blurb: 'c = P / F, and which way to move the OC', weeks: [28, 30], quiz: ['u2-decentre'],
    formulas: [[`${v('c')} = ${fr(v('P'), v('F'))}`, [['c', 'decentration', 'cm (× 10 for mm)'], ['P', 'prism wanted', 'Δ'], ['F', 'power in that meridian', 'D']]]],
    gen() {
      let F, Pr, c; do { F = qd(-8, 8); Pr = pick([0.5, 1, 1.5, 2, 2.5, 3]); c = Pr / Math.abs(F); } while (Math.abs(F) < 1 || c > 1);
      const base = pick(['up', 'down', 'in', 'out']), opp = { up: 'down', down: 'up', in: 'out', out: 'in' }, dir = F > 0 ? base : opp[base];
      return {
        q: `A <b>${G(F)} D</b> spherical lens must give <b>${Z(Pr, 1)}Δ base ${base}</b>. How far, and which way, should the optical centre be moved?`,
        know: [['P', `${Z(Pr, 1)}Δ base ${base}`, 'wanted'], ['F', `${G(F)} D`, '']], find: 'the decentration in mm and its direction',
        steps: [
          { h: 'Rearrange Prentice', say: 'P = cF, so c = P ÷ F (use the size of F).', e: eq(`${v('c')} = ${fr(Z(Pr, 1), Z(Math.abs(F), 2))} = ${Z(c, 3)} cm`), calc: `${Z(Pr, 1)} ÷ ${Z(Math.abs(F), 2)} =` },
          { h: 'Centimetres into millimetres', e: eq(`${Z(c, 3)} × 10 = ${Z(c * 10, 1)} mm`) },
          { h: 'Which way?', say: F > 0 ? 'Plus lens: the base points towards the OC, so move the OC <b>the same way as the base</b>.' : 'Minus lens: the base points away from the OC, so move the OC <b>the opposite way to the base</b>.', res: `${Z(c * 10, 1)} mm ${dir}` },
        ],
        answer: [{ label: 'Distance', unit: 'mm', v: c * 10, dp: 1, tol: 0.06 }, { label: 'Move the OC', choices: ['up', 'down', 'in', 'out'], v: dir }],
        traps: [{ v: c, msg: 'That is in centimetres: × 10 for mm.' }, { v: Pr * Math.abs(F) * 10, msg: 'Divide P by F, do not multiply.' }],
      };
    } });

  const GROUPS = [
    ['tool', 'Maths toolkit', 'The tricks every calculation leans on'],
    [4, 'Week 4 · Surface power and lens form', ''], [5, 'Week 5 · Propagation of light', ''], [6, 'Week 6 · Errors of refraction', ''], [7, 'Week 7 · Pinhole camera and plane mirrors', ''],
    [9, 'Weeks 9–12 · Sph-cyl lenses', ''], [10, 'Week 10 onwards · Refraction', ''], [28, 'Prisms and decentration', ''],
  ];

  /* ================= storage ================= */
  const KEY = 'sdo-steps1';
  const load = () => { try { return JSON.parse(S.store.get(KEY) || '{}') || {}; } catch { return {}; } };
  const bump = (id, k) => { const st = load(); st[id] = st[id] || { seen: 0, solved: 0 }; st[id][k]++; S.store.set(KEY, JSON.stringify(st)); };

  /* ================= views ================= */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const tile = (t) => { const st = load()[t.id];
    return `<button class="qt st-tile" data-steps="${t.id}"><span class="qt-kind">${t.group === 'tool' ? 'Maths toolkit' : 'Step by step'}</span><span class="qt-title">${t.title}</span><span class="qt-blurb">${t.blurb}</span>
      <span class="qt-foot">${st?.solved ? `<span class="qt-best">Solved ${st.solved}</span>` : '<span class="qt-best new">New</span>'}</span></button>`; };

  function home(push = true) {
    cur = null;
    root().innerHTML = `<section class="banner st-banner"><div><span class="hero-kicker">Step by step</span><h1>Every calculation, one step at a time</h1>
        <p>Pick a topic: you get a fresh problem each time. Have a go yourself, ask for one step at a time when you get stuck, or just watch it worked out: the formula, the numbers going in, and what to press on the calculator.</p></div></section>
      ${GROUPS.map(([g, title, sub]) => { const ts = T.filter((t) => t.group === g); return ts.length ? `<h2 class="q-unit">${title}</h2>${sub ? `<p class="st-sub">${sub}</p>` : ''}<div class="qt-grid">${ts.map(tile).join('')}</div>` : ''; }).join('')}`;
    if (push) history.replaceState(null, '', '#steps');
    window.scrollTo({ top: 0 });
  }

  let cur = null; // { t, p, shown, done }
  function open(id, push = true) {
    const t = T.find((x) => x.id === id);
    if (!t) { home(push); return; }
    let p = null; for (let k = 0; k < 30 && !p; k++) p = t.gen();
    cur = { t, p, shown: 0, done: false };
    bump(t.id, 'seen');
    draw();
    if (push) history.replaceState(null, '', `#steps-${id}`);
    window.scrollTo({ top: 0 });
  }

  const legend = (t) => t.formulas.map(([f, rows]) => `<div class="st-formula">${eq(f)}${rows.length ? `<table class="st-legend">${rows.map(([s, m, u]) => `<tr><th>${s}</th><td>${m}</td><td>${u}</td></tr>`).join('')}</table>` : ''}</div>`).join('');
  const stepHtml = (s, i) => `<li class="st-step"><span class="st-n">${i + 1}</span><div class="st-body"><h4>${s.h}</h4>${s.say ? `<p>${s.say}</p>` : ''}${s.e || ''}
      ${s.calc ? `<p class="st-calc"><svg class="ico"><use href="#i-tools"/></svg><span>Calculator</span><code>${s.calc}</code></p>` : ''}${s.res ? `<p class="st-res">${s.res}</p>` : ''}</div></li>`;
  const field = (a, i) => a.choices
    ? `<label class="st-in"><span>${a.label}</span><select data-k="${i}"><option value="">choose…</option>${a.choices.map((c) => `<option>${esc(c)}</option>`).join('')}</select></label>`
    : `<label class="st-in"><span>${a.label}</span><input data-k="${i}" inputmode="decimal" autocomplete="off" placeholder="${a.signed ? '±' : ''}0${a.dp ? '.' + '0'.repeat(a.dp) : ''}"><em>${a.unit}</em></label>`;

  function draw() {
    const { t, p, shown, done } = cur, all = p.steps.length;
    const others = T.filter((x) => x.group === t.group && x.id !== t.id);
    root().innerHTML = `<div class="q-top"><button class="btn ghost sq" data-act="home" aria-label="All topics"><svg class="ico"><use href="#i-back"/></svg></button>
        <div class="q-meta"><span>Step by step</span><b>${t.title}</b></div></div>
      <section class="card st-card"><div class="card-head"><h3><svg class="ico"><use href="#i-book"/></svg> The formula</h3></div>${legend(t)}</section>
      <section class="card st-card st-problem"><div class="card-head"><h3><svg class="ico"><use href="#i-quiz"/></svg> The problem</h3><button class="btn ghost st-new" data-act="new">New numbers ↻</button></div>
        <p class="st-q">${p.q}</p>
        <div class="st-know"><div><h5>What we know</h5><ul>${p.know.map(([s, val, m]) => `<li><b>${s}</b> = ${val}${m ? ` <small>(${m})</small>` : ''}</li>`).join('')}</ul></div><div><h5>What we want</h5><p>${p.find}</p></div></div>
        <div class="st-try"><h5>Your answer</h5><div class="st-fields">${p.answer.map(field).join('')}</div>
          <div class="st-btns"><button class="btn" data-act="check">Check my answer</button>${shown < all && !done ? `<button class="btn ghost" data-act="hint">${shown ? 'Next step' : 'Show me the first step'}</button><button class="btn ghost" data-act="all">Show me everything</button>` : ''}</div>
          <div id="st-fb" aria-live="polite"></div></div></section>
      <section class="st-steps-wrap" ${shown ? '' : 'hidden'}><h2 class="q-unit">Worked out${shown < all ? ` · step ${shown} of ${all}` : ''}</h2><ol class="st-steps">${p.steps.slice(0, shown).map(stepHtml).join('')}</ol>
        ${shown >= all ? `<p class="st-final"><b>Answer:</b> ${p.steps[all - 1].res || ''}</p><div class="st-btns"><button class="btn" data-act="new">Another one, new numbers →</button></div>` : ''}</section>
      ${others.length ? `<h2 class="q-unit">More from this week</h2><div class="qt-grid">${others.map(tile).join('')}</div>` : ''}`;
  }

  const values = () => [...root().querySelectorAll('[data-k]')].map((el) => el.value);
  const restore = (keep, cls) => root().querySelectorAll('[data-k]').forEach((el, i) => { el.value = keep[i] ?? ''; if (cls && el.value) el.classList.add(cls); });
  const parse = (s) => { const x = Number(String(s).trim().replace(/[−–]/g, '-').replace(',', '.').replace(/\s+/g, '').replace(/^\+/, '').replace(/[a-zA-Zμ°Δ%]+$/, '')); return Number.isFinite(x) ? x : null; };
  function check() {
    const { p } = cur, fb = $('#st-fb');
    const msgs = []; let right = 0, filled = 0;
    p.answer.forEach((a, i) => {
      const el = root().querySelector(`[data-k="${i}"]`), raw = el.value;
      el.classList.remove('ok', 'no');
      if (a.choices) {
        if (!raw) return; filled++;
        if (raw === a.v) { right++; el.classList.add('ok'); } else { el.classList.add('no'); msgs.push(`${a.label}: not ${raw}.`); }
        return;
      }
      const x = parse(raw); if (x === null) { if (raw.trim()) msgs.push(`${a.label}: type just the number, like ${a.signed ? '−' : ''}${Z(Math.abs(a.v), a.dp)}.`); return; }
      filled++;
      const tol = a.tol ?? Math.max(1.01 * 10 ** -a.dp, Math.abs(a.v) * 0.01), close = (y) => Math.abs(x - y) <= tol;
      if (close(a.v) || (!a.signed && close(Math.abs(a.v)))) { right++; el.classList.add('ok'); return; }
      el.classList.add('no');
      const trap = (p.traps || []).find((tr) => (tr.k ?? 0) === i && (close(tr.v) || (!a.signed && close(Math.abs(tr.v)))));
      if (trap) msgs.push(trap.msg);
      else if (a.signed && close(-a.v)) msgs.push(`${a.label}: the right size but the wrong sign. Look at the sign step again.`);
      else msgs.push(`${a.label}: not quite. Try the next step as a hint.`);
    });
    if (!filled) { fb.innerHTML = '<div class="q-fb no"><b>Type your answer first</b>, or ask for a step.</div>'; return; }
    const all = right === p.answer.length;
    if (all) { const keep = values(); bump(cur.t.id, 'solved'); cur.done = true; cur.shown = p.steps.length; draw(); restore(keep, 'ok'); $('#st-fb').innerHTML = '<div class="q-fb ok"><b>Correct!</b> Here is the full working, so you can check your method too.</div>'; return; }
    fb.innerHTML = `<div class="q-fb no"><b>Not quite yet.</b>${msgs.map((m) => `<p>${m}</p>`).join('')}</div>`;
  }

  document.addEventListener('click', (ev) => {
    const r = root(); if (!r || !r.contains(ev.target)) return;
    const tl = ev.target.closest('[data-steps]'); if (tl) { open(tl.dataset.steps); return; }
    const b = ev.target.closest('[data-act]'); if (!b || !cur && b.dataset.act !== 'home') return;
    const act = b.dataset.act;
    if (act === 'home') home();
    else if (act === 'new') open(cur.t.id, false);
    else if (act === 'check') check();
    else if (act === 'hint' || act === 'all') {
      const keep = values();
      cur.shown = act === 'all' ? cur.p.steps.length : cur.shown + 1;
      draw();
      restore(keep);
      const list = r.querySelectorAll('.st-step'); list[list.length - 1]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.matches?.('#steps-root [data-k]')) { ev.preventDefault(); check(); } });

  const forWeek = (n) => T.filter((t) => t.weeks.includes(n));
  window.SDOSteps = {
    show() { if (!cur) home(false); },
    open, home,
    tiles: (n) => forWeek(n).map(tile).join(''),
    forQuiz: (qid) => T.find((t) => t.quiz.includes(qid)) || null,
    _topics: T,
  };
  // app.js starts before this file loads: if the page opened on Step by step (a #steps link, or the last mode used), draw it now
  const boot = () => { const m = $('#mode-steps'); if (!m || m.hidden || root().innerHTML) return; const h = /^#steps-([a-z0-9-]+)$/.exec(location.hash); if (h) open(h[1], false); else home(false); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
