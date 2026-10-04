/* SDO Toolkit · Year 1 quiz. Questions are generated with fresh numbers every time and marked with the same
   optics code as the calculators (window.SDO). Scope: ABDO 2023 syllabus, Year 1 — Unit 1 and Unit 2. */
(() => {
  'use strict';
  const S = window.SDO;
  if (!S) return;
  const $ = (s, r = document) => r.querySelector(s);
  const { sgn, num, rxS, normAx, axS, principal, transpose, prismAt, prismParts, powerAt, classify, farPoint, sagAcc, f } = S;

  /* ---------- random helpers ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ri = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = (arr) => arr[ri(0, arr.length - 1)];
  const step = (lo, hi, s) => Math.round(rnd(lo, hi) / s) * s;
  function qd(lo, hi, nonzero = true) { let v; do { v = Math.round(rnd(lo, hi) * 4) / 4; } while (nonzero && Math.abs(v) < 0.01); return v === 0 ? 0 : v; }
  const axis = () => ri(1, 36) * 5;
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = ri(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const EYE = { R: 'Right', L: 'Left' };
  const sci = (x) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${num(x / 10 ** e, 2)} × 10<sup>${e}</sup>`; };
  const deg1 = (x) => `${num(x, 1)}°`;
  const sinD = (d) => Math.sin((d * Math.PI) / 180), asinD = (x) => (Math.asin(x) * 180) / Math.PI;

  // build a 4-option question; wrong answers that duplicate the right one (or each other) are dropped
  function mcq(q, correct, wrong, explain) {
    const opts = [correct];
    for (const w of wrong) if (w && !opts.includes(w)) opts.push(w);
    if (opts.length < 3) return null; // not enough distinct distractors — caller regenerates
    const options = shuffle(opts.slice(0, 4));
    return { q, options, answer: options.indexOf(correct), explain };
  }

  /* ================= UNIT 2 generators ================= */
  const gTranspose = () => {
    const e = { sph: qd(-6, 6, false), cyl: qd(-3, 3), axis: axis() };
    if (Math.random() < 0.6) {
      const t = transpose(e);
      return mcq(`Transpose <b>${rxS(e)}</b> into ${e.cyl < 0 ? 'plus' : 'minus'} cyl form.`, rxS(t), [
        rxS({ sph: e.sph + e.cyl, cyl: -e.cyl, axis: e.axis }),
        rxS({ sph: e.sph, cyl: -e.cyl, axis: normAx(e.axis + 90) }),
        rxS({ sph: e.sph + e.cyl, cyl: e.cyl, axis: normAx(e.axis + 90) }),
        rxS({ sph: e.sph - e.cyl, cyl: -e.cyl, axis: normAx(e.axis + 90) }),
      ], `<p>1. New sph = sph + cyl = ${sgn(e.sph)} + (${sgn(e.cyl)}) = ${sgn(e.sph + e.cyl)}</p><p>2. Change the cyl sign → ${sgn(-e.cyl)}</p><p>3. Axis ± 90 → ${axS(e.axis + 90)}</p>`);
    }
    const ps = principal(e);
    if (ps.some((o) => Math.abs(o.p) < 0.01)) return null; // one principal power is plano: really a single plano cylinder
    return mcq(`Write <b>${rxS(e)}</b> as two crossed cylinders.`, `${sgn(ps[0].p)} × ${axS(ps[1].m)} / ${sgn(ps[1].p)} × ${axS(ps[0].m)}`, [
      `${sgn(ps[0].p)} × ${axS(ps[0].m)} / ${sgn(ps[1].p)} × ${axS(ps[1].m)}`,
      `${sgn(e.sph)} × ${axS(ps[1].m)} / ${sgn(e.cyl)} × ${axS(ps[0].m)}`,
      `${sgn(e.sph)} × ${axS(e.axis)} / ${sgn(e.cyl)} × ${axS(e.axis + 90)}`,
    ], `<p>Principal powers: ${sgn(ps[0].p)} along ${axS(ps[0].m)}, ${sgn(ps[1].p)} along ${axS(ps[1].m)}.</p><p>A cylinder acts at 90° to its axis, so a power along ${axS(ps[0].m)} is written × ${axS(ps[1].m)}, and vice versa.</p>`);
  };

  const TYPES = ['Myopia', 'Hypermetropia', 'Simple myopic astigmatism', 'Simple hypermetropic astigmatism', 'Compound myopic astigmatism', 'Compound hypermetropic astigmatism', 'Mixed astigmatism'];
  const gAmetropia = () => {
    if (Math.random() < 0.6) {
      const t = pick(TYPES);
      const c = qd(0.5, 3);
      let p1, p2;
      switch (t) {
        case 'Myopia': p1 = p2 = qd(-8, -0.5); break;
        case 'Hypermetropia': p1 = p2 = qd(0.5, 6); break;
        case 'Simple myopic astigmatism': p1 = 0; p2 = -c; break;
        case 'Simple hypermetropic astigmatism': p1 = 0; p2 = c; break;
        case 'Compound myopic astigmatism': p1 = qd(-6, -0.5); p2 = p1 - c; break;
        case 'Compound hypermetropic astigmatism': p1 = qd(0.5, 5); p2 = p1 + c; break;
        default: p1 = qd(0.25, 2.5); p2 = -qd(0.25, 2.5);
      }
      let e = { sph: p1, cyl: p2 - p1, axis: axis() };
      if (Math.random() < 0.5 && e.cyl) e = transpose(e);
      const right = classify(e).type;
      const wrong = shuffle(TYPES.filter((x) => x !== right)).slice(0, 3);
      const ps = principal(e);
      return mcq(`What type of ametropia does <b>${rxS(e)}</b> correct?`, right, wrong, `<p>Look at the two principal meridians: ${sgn(ps[0].p)} and ${sgn(ps[1].p)}.</p><p>Both minus → compound myopic; both plus → compound hypermetropic; one plano → simple; one plus and one minus → mixed.</p>`);
    }
    const F = Math.random() < 0.65 ? qd(-8, -0.5) : qd(0.5, 6);
    const d = 100 / Math.abs(F), dTxt = (x) => (x >= 100 ? `${num(x / 100, 2)} m` : `${num(x, 1)} cm`);
    const side = (neg) => (neg ? 'in front (real)' : 'behind (virtual)');
    return mcq(`An eye is fully corrected by a <b>${sgn(F)} D</b> lens (take the lens at the eye). Where is its far point?`, `${dTxt(d)} ${side(F < 0)}`, [
      `${dTxt(d)} ${side(F > 0)}`, `${dTxt(d * 10)} ${side(F < 0)}`, `${dTxt(d / 2)} ${side(F < 0)}`,
    ], `<p>The lens's second focal point must coincide with the far point, so the far point is 1/F = 1/${num(Math.abs(F))} = ${dTxt(d)} from the eye.</p><p>Minus lens → myopia → real far point in front. Plus lens → hypermetropia → virtual far point behind.</p>`);
  };

  function lens9018() {
    const e = { sph: qd(-8, 8), cyl: 0, axis: 180 };
    if (Math.random() < 0.45) { e.cyl = qd(-3, 3); e.axis = pick([90, 180]); }
    return e;
  }
  const gPrentice = () => {
    const eye = pick(['R', 'L']), e = lens9018(), vertical = Math.random() < 0.55, c = ri(2, 12);
    const dir = vertical ? pick(['below', 'above']) : pick(['inwards (nasally) from', 'outwards (temporally) from']);
    const sign = dir.startsWith('above') || dir.startsWith('in') ? 1 : -1;
    const vec = vertical ? [0, (sign * c) / 10] : [((sign * c) / 10) * (eye === 'R' ? 1 : -1), 0];
    const p = prismParts(eye, prismAt(e, vec));
    const F = powerAt(e, vertical ? 90 : 180), Fo = powerAt(e, vertical ? 180 : 90);
    const val = vertical ? p.v : p.h;
    if (Math.abs(val) < 0.01) return null;
    const words = vertical ? ['up', 'down'] : ['in', 'out'];
    const txt = (m, pos) => `${num(Math.abs(m))}Δ base ${pos ? words[0] : words[1]}`;
    return mcq(`${EYE[eye]} lens <b>${rxS(e)}</b>. The eye looks through a point <b>${c} mm ${dir}</b> the optical centre. What is the prismatic effect?`, txt(val, val > 0), [
      txt(val, val < 0), txt(val * 10, val > 0), Math.abs(Fo - F) > 0.01 ? txt((c / 10) * Fo, val > 0) : txt(val / 10, val > 0),
    ], `<p>${f('P = c F')}: c = ${num(c / 10, 1)} cm, power along the ${vertical ? '90' : '180'} meridian = ${sgn(F)} → ${num(Math.abs((c / 10) * F))}Δ</p><p>${F > 0 ? 'Plus lens: base towards the OC' : 'Minus lens: base away from the OC'} → base ${val > 0 ? words[0] : words[1]}.</p>`);
  };

  const gDecentre = () => {
    const r = Math.random();
    if (r < 0.45) {
      const eye = pick(['R', 'L']), e = lens9018(), vertical = Math.random() < 0.4;
      const F = powerAt(e, vertical ? 90 : 180);
      if (Math.abs(F) < 0.75) return null;
      const P = step(0.5, 3, 0.5), base = vertical ? pick(['up', 'down']) : pick(['in', 'out']);
      const d = (P / Math.abs(F)) * 10;
      if (d > 10) return null; // more than 10 mm isn't a realistic decentration
      const towards = F > 0;
      const opp = { up: 'down', down: 'up', in: 'out', out: 'in' };
      const dir = towards ? base : opp[base];
      return mcq(`${EYE[eye]} lens <b>${rxS(e)}</b> needs <b>${num(P, 1)}Δ base ${base}</b>. How should the optical centre be decentred?`, `${num(d, 1)} mm ${dir}`, [
        `${num(d, 1)} mm ${opp[dir]}`, `${num(d / 10, 2)} mm ${dir}`, `${num(P * Math.abs(F), 1)} mm ${dir}`,
      ], `<p>${f('c = P / F')} = ${num(P, 1)} / ${num(Math.abs(F))} (power along the ${vertical ? '90' : '180'} meridian) = ${num(d / 10, 3)} cm = <b>${num(d, 1)} mm</b></p><p>${towards ? 'Plus lens: move the OC towards the base' : 'Minus lens: move the OC away from the base'} → ${dir}.</p>`);
    }
    const A = ri(44, 56), DBL = ri(14, 22), PD = ri(28, 35);
    const dec = (A + DBL) / 2 - PD;
    if (Math.abs(dec) < 0.5) return null;
    if (r < 0.75) {
      return mcq(`Boxed lens size <b>${A}</b>, DBL <b>${DBL}</b>, monocular PD <b>${PD} mm</b>. What is the horizontal decentration?`, `${num(Math.abs(dec), 1)} mm ${dec > 0 ? 'in' : 'out'}`, [
        `${num(Math.abs(dec), 1)} mm ${dec > 0 ? 'out' : 'in'}`, `${num(Math.abs(A + DBL - PD), 1)} mm ${dec > 0 ? 'in' : 'out'}`, `${num(Math.abs(A + DBL / 2 - PD), 1)} mm ${dec > 0 ? 'in' : 'out'}`,
      ], `<p>${f('BCD = A + DBL')} = ${A + DBL} mm → half = ${num((A + DBL) / 2, 1)}</p><p>Decentration = ${num((A + DBL) / 2, 1)} − ${PD} = ${num(dec, 1)} mm → ${dec > 0 ? 'inwards (the PD is smaller than half the BCD)' : 'outwards'}.</p>`);
    }
    const allow = Math.random() < 0.5 ? 2 : 0;
    const msu = A + 2 * Math.abs(dec) + allow;
    return mcq(`Round lens, horizontal size <b>${A} mm</b>, DBL <b>${DBL}</b>, mono PD <b>${PD} mm</b>, no vertical decentration, ${allow ? `<b>${allow} mm</b> glazing allowance` : '<b>no</b> allowance'}. Minimum size uncut?`, `${num(msu, 1)} mm`, [
      allow ? `${num(msu - allow, 1)} mm` : null, `${num(A + Math.abs(dec) + allow, 1)} mm`, `${num(A + 2 * Math.abs(A + DBL - PD) + allow, 1)} mm`, `${num(A - 2 * Math.abs(dec) + allow, 1)} mm`,
    ], `<p>Decentration = (A + DBL)/2 − PD = ${num((A + DBL) / 2, 1)} − ${PD} = ${num(Math.abs(dec), 1)} mm</p><p>${f(`MSU = lens size + 2 × decentration${allow ? ' + allowance' : ''}`)} = ${A} + 2 × ${num(Math.abs(dec), 1)}${allow ? ` + ${allow}` : ''} = <b>${num(msu, 1)} mm</b></p>`);
  };

  const gPrisms = () => {
    const r = Math.random();
    if (r < 0.2) {
      const a = ri(2, 12), n = pick([1.498, 1.523, 1.586, 1.6, 1.7]), d = (n - 1) * a;
      return mcq(`A thin prism has an apical angle of <b>${a}°</b> and refractive index <b>${n}</b>. What is its deviation?`, deg1(d), [deg1(n * a), deg1(a / (n - 1)), deg1((n + 1) * a)],
        `<p>${f('d = (n − 1) a')} = (${n} − 1) × ${a}° = <b>${num(d, 1)}°</b></p>`);
    }
    if (r < 0.45) {
      const eye = pick(['R', 'L']), H = step(0.5, 4, 0.5), V = step(0.5, 4, 0.5), hb = pick(['in', 'out']), vb = pick(['up', 'down']);
      const P = Math.hypot(H, V), oh = hb === 'in' ? 'out' : 'in';
      return mcq(`${EYE[eye]} eye: <b>${num(H, 1)}Δ base ${hb}</b> combined with <b>${num(V, 1)}Δ base ${vb}</b>. Single resultant?`, `${num(P)}Δ base ${vb} & ${hb}`, [
        `${num(H + V)}Δ base ${vb} & ${hb}`, `${num(P)}Δ base ${vb} & ${oh}`, `${num(Math.abs(H - V) || H / 2)}Δ base ${vb} & ${hb}`,
      ], `<p>${f('P = √(H² + V²)')} = √(${num(H, 1)}² + ${num(V, 1)}²) = <b>${num(P)}Δ</b>, at ${num((Math.atan2(V, H) * 180) / Math.PI, 1)}° from the horizontal.</p><p>Prisms add like vectors, not like ordinary numbers.</p>`);
    }
    if (r < 0.65) {
      const P = ri(2, 6), th = pick([30, 45, 60]), hb = pick(['in', 'out']), vb = pick(['up', 'down']);
      const H = P * Math.cos((th * Math.PI) / 180), V = P * Math.sin((th * Math.PI) / 180);
      const t = (h, v, hb_, vb_) => `${num(h)}Δ base ${hb_} + ${num(v)}Δ base ${vb_}`;
      return mcq(`Resolve <b>${P}Δ</b> with its base ${vb} and ${hb}, at <b>${th}°</b> to the horizontal, into horizontal and vertical components.`, t(H, V, hb, vb), [
        t(V, H, hb, vb), t(H, V, hb === 'in' ? 'out' : 'in', vb), t(P / 2, P / 2, hb, vb),
      ], `<p>${f('H = P cos θ')} = ${P} × cos ${th}° = ${num(H)}Δ ; ${f('V = P sin θ')} = ${P} × sin ${th}° = ${num(V)}Δ</p>`);
    }
    if (r < 0.82) {
      if (Math.random() < 0.5) {
        const X = ri(2, 8), b = pick(['in', 'out']);
        return mcq(`An Rx needs <b>${X}Δ base ${b}</b> in total. How is it usually split between the eyes?`, `${num(X / 2, 1)}Δ base ${b} R and ${num(X / 2, 1)}Δ base ${b} L`, [
          `${num(X / 2, 1)}Δ base ${b} R and ${num(X / 2, 1)}Δ base ${b === 'in' ? 'out' : 'in'} L`, `${X}Δ base ${b} R and ${X}Δ base ${b} L`, `${X}Δ base ${b} R only, none L`,
        ], '<p>Horizontal prism is shared equally, with the <b>same</b> base direction in both eyes.</p>');
      }
      const X = pick([1, 2, 3, 4]);
      return mcq(`An Rx needs <b>${X}Δ base up R</b>. How can it be split between the eyes?`, `${num(X / 2, 1)}Δ base up R and ${num(X / 2, 1)}Δ base down L`, [
        `${num(X / 2, 1)}Δ base up R and ${num(X / 2, 1)}Δ base up L`, `${X}Δ base up R and ${X}Δ base down L`, `${num(X / 2, 1)}Δ base down R and ${num(X / 2, 1)}Δ base up L`,
      ], '<p>Vertical prism is shared with <b>opposite</b> bases: base up R has the same effect as base down L.</p>');
    }
    const P = ri(1, 6), d = step(40, 60, 2), n = pick([1.498, 1.523, 1.6]);
    const g = (P * d) / (100 * (n - 1));
    return mcq(`A <b>${P}Δ</b> prism, <b>${d} mm</b> across, made in material n = <b>${n}</b>. What is the thickness difference between base and apex?`, `${num(g, 2)} mm`, [
      `${num((P * d) / (100 * n), 2)} mm`, `${num((P * d) / 100, 2)} mm`, `${num((P * d) / (10 * (n - 1)), 2)} mm`,
    ], `<p>${f('g = P d / 100(n − 1)')} = ${P} × ${d} / (100 × ${num(n - 1, 3)}) = <b>${num(g, 2)} mm</b></p>`);
  };

  const gToric = () => {
    const e = { sph: qd(-5, 5, false), cyl: qd(-3, -0.5), axis: axis() };
    const minus = Math.random() < 0.6;
    const form = minus ? e : transpose(e);
    // only base curves that give a meniscus: plus front sphere on a minus toric, minus back sphere on a plus toric
    const bases = (minus ? [-4, -6, -8] : [6, 8, 10]).filter((b) => (minus ? form.sph - b > 0.12 : form.sph - b < -0.12));
    if (!bases.length) return null;
    const B = pick(bases);
    const sph = form.sph - B, cross = B + form.cyl, bax = axS(form.axis + 90), cax = axS(form.axis);
    const T = (s, b, ba, c, ca) => (minus ? `${sgn(s)} DS front · ${sgn(b)} × ${ba} / ${sgn(c)} × ${ca} back` : `${sgn(b)} × ${ba} / ${sgn(c)} × ${ca} front · ${sgn(s)} DS back`);
    return mcq(`Transpose <b>${rxS(e)}</b> into ${minus ? 'minus' : 'plus'} toric form on a <b>${sgn(B)}</b> base curve.`, T(sph, B, bax, cross, cax), [
      T(sph, B, bax, B - form.cyl, cax), T(sph, B, cax, cross, bax), T(form.sph + B, B, bax, cross, cax),
    ], `<p>1. Write the Rx with the cyl the same sign as the base: ${rxS(form)}</p><p>2. Sphere curve = sph − base = ${sgn(form.sph)} − (${sgn(B)}) = ${sgn(sph)}</p><p>3. Base curve axis = cyl axis ± 90 = ${bax}</p><p>4. Cross curve = base + cyl = ${sgn(B)} + (${sgn(form.cyl)}) = ${sgn(cross)}, axis ${cax}</p>`);
  };

  const gThick = () => {
    const r = Math.random();
    if (r < 0.4) {
      const F = step(2, 10, 0.5), n = pick([1.498, 1.523, 1.6]), dia = step(40, 60, 2), y = dia / 2;
      const rad = ((n - 1) * 1000) / F, s = sagAcc(rad, y);
      if (!Number.isFinite(s)) return null;
      return mcq(`A surface of power <b>${num(F, 2)} D</b> (n = ${n}) on a <b>${dia} mm</b> lens. What is its sag (accurate formula)?`, `${num(s, 2)} mm`, [
        `${num((y * y) / (2 * rad), 2)} mm`, Number.isFinite(sagAcc(rad, dia)) ? `${num(sagAcc(rad, dia), 2)} mm` : `${num(s * 2, 2)} mm`, Number.isFinite(sagAcc((n * 1000) / F, y)) ? `${num(sagAcc((n * 1000) / F, y), 2)} mm` : `${num(s / 2, 2)} mm`,
      ], `<p>${f('r = (n − 1) / F')} = ${num(n - 1, 3)} / ${num(F)} = ${num(rad / 1000, 4)} m = ${num(rad, 1)} mm</p><p>${f('s = r − √(r² − y²)')}, y = ${num(y, 0)} mm → ${num(rad, 1)} − √(${num(rad, 1)}² − ${num(y, 0)}²) = <b>${num(s, 2)} mm</b></p><p>(The approximate formula y²/2r gives ${num((y * y) / (2 * rad), 2)} mm.)</p>`);
    }
    if (r < 0.75) {
      const F = -step(2, 8, 0.5), F1 = step(2, 6, 1), n = pick([1.498, 1.523]), dia = step(44, 56, 2), y = dia / 2, ct = 2;
      const r1 = ((n - 1) * 1000) / F1, r2 = ((1 - n) * 1000) / (F - F1);
      const s1 = sagAcc(r1, y), s2 = sagAcc(r2, y);
      if (!Number.isFinite(s1) || !Number.isFinite(s2)) return null;
      const edge = ct + s2 - s1;
      return mcq(`Lens <b>${sgn(F)} DS</b>, front curve <b>${sgn(F1)}</b>, n = ${n}, <b>${dia} mm</b> round, centre thickness <b>2.0 mm</b>. Edge thickness?`, `${num(edge, 2)} mm`, [
        `${num(ct + s2, 2)} mm`, `${num(ct + s2 + s1, 2)} mm`, `${num(s2 - s1, 2)} mm`,
      ], `<p>Back surface F₂ = F − F₁ = ${sgn(F)} − ${sgn(F1)} = ${sgn(F - F1)}</p><p>Sags (y = ${num(y, 0)} mm): front s₁ = ${num(s1, 2)} mm, back s₂ = ${num(s2, 2)} mm</p><p>${f('edge = centre + s₂ − s₁')} = 2.0 + ${num(s2, 2)} − ${num(s1, 2)} = <b>${num(edge, 2)} mm</b></p>`);
    }
    const R = step(2, 10, 0.25) * pick([1, -1]), n = pick([1.498, 1.586, 1.6, 1.7]);
    const tru = (R * (n - 1)) / 0.523;
    return mcq(`A lens measure calibrated for <b>n = 1.523</b> reads <b>${sgn(R)} D</b> on a lens made of <b>n = ${n}</b>. True surface power?`, `${sgn(tru)} D`, [
      `${sgn((R * 0.523) / (n - 1))} D`, `${sgn((R * n) / 1.523)} D`, `${sgn(R)} D`,
    ], `<p>The measure really reads the radius. ${f('F = reading × (n − 1) / (1.523 − 1)')} = ${sgn(R)} × ${num(n - 1, 3)} / 0.523 = <b>${sgn(tru)} D</b></p>`);
  };

  const gDiff = () => {
    const R = { sph: qd(-6, 6), cyl: 0, axis: 180 }, L = { sph: qd(-6, 6), cyl: 0, axis: 180 };
    if (Math.random() < 0.35) { L.cyl = qd(-2, -0.5); L.axis = pick([90, 180]); }
    const c = pick([8, 10, 12]);
    const vR = prismParts('R', prismAt(R, [0, -c / 10])).v, vL = prismParts('L', prismAt(L, [0, -c / 10])).v;
    const diff = vR - vL;
    if (Math.abs(diff) < 0.2) return null;
    const t = (x, upR) => `${num(Math.abs(x))}Δ base ${upR ? 'up R (base down L)' : 'down R (base up L)'}`;
    const zero = Math.abs(vR) < 0.005 || Math.abs(vL) < 0.005;
    const same = Math.sign(vR) === Math.sign(vL);
    const wrongMag = zero ? 2 * Math.abs(diff) : same ? Math.abs(vR) + Math.abs(vL) : Math.abs(Math.abs(vR) - Math.abs(vL));
    const pT = (v) => (Math.abs(v) < 0.005 ? 'no vertical prism' : `${num(Math.abs(v))}Δ base ${v > 0 ? 'up' : 'down'}`);
    return mcq(`R <b>${rxS(R)}</b>, L <b>${rxS(L)}</b>. Both eyes read <b>${c} mm below</b> the OCs. Vertical differential prism?`, t(diff, diff > 0), [
      t(diff, diff < 0), wrongMag > 0.01 ? t(wrongMag, diff > 0) : t(diff * 10, diff > 0), t(diff * 10, diff > 0) === t(diff, diff > 0) ? null : t(diff * 10, diff > 0),
    ], `<p>R: ${num(c / 10, 1)} × ${sgn(powerAt(R, 90))} = ${pT(vR)} · L: ${num(c / 10, 1)} × ${sgn(powerAt(L, 90))} = ${pT(vL)}</p><p>${zero ? 'Only one eye has vertical prism → that is the differential' : same ? 'Same direction → subtract' : 'Opposite directions → add'} → <b>${num(Math.abs(diff))}Δ</b></p>`);
  };

  /* ================= UNIT 1 generators ================= */
  const gWaves = () => {
    const r = Math.random();
    if (r < 0.4) {
      const lam = pick([400, 450, 500, 550, 600, 650, 700]), fr = 3e8 / (lam * 1e-9);
      return mcq(`Light of wavelength <b>${lam} nm</b> in air (c = 3 × 10<sup>8</sup> m/s). What is its frequency?`, `${sci(fr)} Hz`, [`${sci(fr / 1000)} Hz`, `${sci(fr * 1000)} Hz`, `${sci((lam * 1e-9) / 3e8)} Hz`],
        `<p>${f('v = f λ')} → f = v / λ = 3 × 10<sup>8</sup> / ${lam} × 10<sup>−9</sup> = <b>${sci(fr)} Hz</b></p>`);
    }
    if (r < 0.75) {
      const d = pick([10, 20, 25, 33.3, 40, 50, 66.7, 100, 200]), conv = Math.random() < 0.35;
      const L = (conv ? 1 : -1) * (100 / d);
      return mcq(`Light ${conv ? 'is converging towards a point' : 'diverges from a point source'} <b>${num(d, 1)} cm</b> away, in air. What is the vergence here?`, `${sgn(L)} D`, [`${sgn(-L)} D`, `${sgn((conv ? 1 : -1) * (d / 100))} D`, `${sgn((conv ? 1 : -1) * d)} D`, `${sgn((conv ? 1 : -1) * (10 / d))} D`],
        `<p>${f('L = n / l')} with l in metres: 1 / ${num(d / 100, 3)} = ${num(Math.abs(L))} D. ${conv ? 'Converging light → positive' : 'Diverging light → negative'} → <b>${sgn(L)} D</b></p>`);
    }
    const n = pick([1.333, 1.5, 1.523, 1.6, 1.7]), v = 3e8 / n;
    return mcq(`What is the speed of light in a medium of refractive index <b>${n}</b>?`, `${sci(v)} m/s`, [`${sci(3e8 * n)} m/s`, `${sci(3e8)} m/s`, `${sci(3e8 / (n - 1))} m/s`],
      `<p>Absolute refractive index n = c / v → v = c / n = 3 × 10<sup>8</sup> / ${n} = <b>${sci(v)} m/s</b></p>`);
  };

  const gRefraction = () => {
    const r = Math.random();
    if (r < 0.4) {
      const i = ri(20, 70), n = pick([1.333, 1.5, 1.523, 1.6]), rr = asinD(sinD(i) / n);
      return mcq(`Light in air hits glass (n = <b>${n}</b>) at <b>${i}°</b> incidence. Angle of refraction?`, deg1(rr), [deg1(i / n), deg1(90 - rr), deg1(i - rr)],
        `<p>Snell's law: ${f("n sin i = n′ sin i′")} → sin i′ = sin ${i}° / ${n} = ${num(sinD(i) / n, 4)} → <b>${num(rr, 1)}°</b></p>`);
    }
    if (r < 0.7) {
      const n = pick([1.333, 1.5, 1.523, 1.6, 1.7, 1.8]), ic = asinD(1 / n);
      return mcq(`Critical angle for light going from a medium of n = <b>${n}</b> into air?`, deg1(ic), [deg1(90 - ic), deg1(asinD(n - 1 > 1 ? 0.99 : n - 1)), deg1((Math.atan(1 / n) * 180) / Math.PI)],
        `<p>${f("sin ic = n′ / n")} = 1 / ${n} = ${num(1 / n, 4)} → <b>${num(ic, 1)}°</b>. Beyond this angle there is total internal reflection.</p>`);
    }
    const t = ri(10, 60), n = pick([1.333, 1.5, 1.523, 1.6]);
    return mcq(`A block <b>${t} mm</b> thick (n = <b>${n}</b>) is viewed straight on from air. How deep does it appear?`, `${num(t / n, 1)} mm`, [`${num(t * n, 1)} mm`, `${num(t - t / n, 1)} mm`, `${num(t / (n - 1), 1)} mm`],
      `<p>${f('n = real thickness / apparent (reduced) thickness')} → apparent = ${t} / ${n} = <b>${num(t / n, 1)} mm</b></p><p>(The image is displaced by ${num(t - t / n, 1)} mm.)</p>`);
  };

  const gLenses = () => {
    if (Math.random() < 0.6) {
      const F = step(2, 10, 0.5) * pick([1, -1]), l = -ri(10, 100), L = 100 / l, L2 = L + F;
      if (Math.abs(L2) < 0.25) return null;
      const l2 = 100 / L2;
      const t = (x) => `${num(Math.abs(x), 1)} cm ${x > 0 ? 'right of the lens (real)' : 'left of the lens (virtual)'}`;
      const L2w = -L + F;
      return mcq(`An object is <b>${-l} cm</b> to the left of a <b>${sgn(F)} D</b> thin lens. Where is the image?`, t(l2), [
        Math.abs(L2w) > 0.01 ? t(100 / L2w) : null, t(-l2), Math.abs(F - L) > 0.01 ? t(100 / (F - L) * -1) : null, t(l2 * 2),
      ].filter(Boolean), `<p>${f("L′ = L + F")} with L = 1/l (l negative to the left): L = 1 / ${num(l / 100, 2)} = ${sgn(L)}</p><p>L′ = ${sgn(L)} + ${sgn(F)} = ${sgn(L2)} → l′ = 1 / L′ = ${num(l2 / 100, 3)} m = <b>${t(l2)}</b></p>`);
    }
    const rcm = step(5, 25, 1) * pick([1, -1]), n2 = pick([1.5, 1.523, 1.6, 1.7]), F = (n2 - 1) / (rcm / 100);
    return mcq(`A single surface separates air from glass (n′ = <b>${n2}</b>); its radius is <b>${sgn(rcm, 0)} cm</b>. Surface power?`, `${sgn(F)} D`, [`${sgn(-F)} D`, `${sgn((n2 - 1) / rcm)} D`, `${sgn(n2 / (rcm / 100))} D`],
      `<p>${f("F = (n′ − n) / r")} with r in metres = (${n2} − 1) / ${num(rcm / 100, 2)} = <b>${sgn(F)} D</b></p>`);
  };

  const gPhoto = () => {
    const r = Math.random();
    if (r < 0.45) {
      const I = pick([50, 100, 200, 300, 400, 600, 800]), d = pick([0.5, 1.5, 2, 2.5, 3, 4]), E = I / (d * d); // at 1 m three of the options coincide
      return mcq(`A <b>${I} cd</b> lamp shines straight down on a desk <b>${num(d, 1)} m</b> away. Illuminance?`, `${num(E, 1)} lux`, [`${num(I / d, 1)} lux`, `${num(I * d * d, 1)} lux`, `${num(I / (2 * d), 1)} lux`],
        `<p>Inverse square law: ${f('E = I / d²')} = ${I} / ${num(d * d, 2)} = <b>${num(E, 1)} lux</b></p>`);
    }
    if (r < 0.8) {
      const I = pick([100, 200, 400, 500]), d = pick([1, 2, 2.5]), th = pick([30, 45, 60]), E = (I * Math.cos((th * Math.PI) / 180)) / (d * d);
      return mcq(`A <b>${I} cd</b> source is <b>${num(d, 1)} m</b> from a surface; the light arrives at <b>${th}°</b> to the normal. Illuminance?`, `${num(E, 1)} lux`, [`${num(I / (d * d), 1)} lux`, `${num((I * sinD(th)) / (d * d), 1)} lux`, `${num((I * Math.cos((th * Math.PI) / 180)) / d, 1)} lux`, `${num(I / (d * d * Math.cos((th * Math.PI) / 180)), 1)} lux`],
        `<p>Cosine law: ${f('E = I cos θ / d²')} = ${I} × cos ${th}° / ${num(d * d, 2)} = <b>${num(E, 1)} lux</b></p>`);
    }
    const inc = pick([200, 400, 500, 800]), pct = pick([4, 8, 10, 20, 25, 40]), ref = (inc * pct) / 100;
    return mcq(`<b>${num(ref, 0)} lm</b> of the <b>${inc} lm</b> falling on a surface is reflected. What is its reflectance?`, `${pct}%`, [`${100 - pct}%`, `${num(inc / ref, 1)}%`, `${num(ref, 0)}%`],
      `<p>${f('Reflectance = reflected flux / incident flux')} = ${num(ref, 0)} / ${inc} = <b>${pct}%</b></p>`);
  };

  // theory banks (bank.js): no repeats until every question in that bank has been seen on this device
  const BANK = window.SDO_BANK || {};
  let roundUsed = new Set();
  function bankGen(key) {
    return () => {
      const arr = BANK[key] || [];
      if (!arr.length) return null;
      const sk = `sdo-seen-${key}`;
      let seen; try { seen = new Set(JSON.parse(S.store.get(sk) || '[]')); } catch { seen = new Set(); }
      let pool = arr.map((_, i) => i).filter((i) => !seen.has(i) && !roundUsed.has(`${key}${i}`));
      if (!pool.length) { seen = new Set(); pool = arr.map((_, i) => i).filter((i) => !roundUsed.has(`${key}${i}`)); }
      if (!pool.length) return null;
      const i = pick(pool);
      seen.add(i); roundUsed.add(`${key}${i}`);
      S.store.set(sk, JSON.stringify([...seen]));
      const [ref, q, a, w, ex] = arr[i];
      return mcq(q, a, w, `<p>${ex}</p><p class="q-ref">${ref}</p>`);
    };
  }
  const count = (k) => (BANK[k] || []).length;

  const TOPICS = [
    { id: 'u1-waves', unit: 1, title: 'Light & vergence', blurb: 'v = fλ, vergence, speed in a medium', gen: gWaves },
    { id: 'u1-refr', unit: 1, title: 'Refraction', blurb: "Snell's law, critical angle, apparent depth", gen: gRefraction },
    { id: 'u1-lens', unit: 1, title: 'Surfaces & thin lenses', blurb: 'F = (n′ − n)/r, conjugate foci', gen: gLenses },
    { id: 'u1-photo', unit: 1, title: 'Photometry', blurb: 'Inverse square, cosine law, reflectance', gen: gPhoto },
    { id: 't-u1', unit: 1, title: 'Unit 1 theory', blurb: `${count('u1')} questions: waves, mirrors, refraction, lenses, light, colour`, gen: bankGen('u1') },
    { id: 'u2-trans', unit: 2, title: 'Transposition', blurb: 'Plus/minus cyl, crossed cylinders', gen: gTranspose },
    { id: 'u2-amet', unit: 2, title: 'Ametropia', blurb: 'Type of Rx, far points', gen: gAmetropia },
    { id: 'u2-toric', unit: 2, title: 'Toric lenses', blurb: 'Base and cross curves', gen: gToric },
    { id: 'u2-prentice', unit: 2, title: "Prentice's rule", blurb: 'Prismatic effect at a point', gen: gPrentice },
    { id: 'u2-decentre', unit: 2, title: 'Decentration & MSU', blurb: 'Decentring for prism, minimum size uncut', gen: gDecentre },
    { id: 'u2-prisms', unit: 2, title: 'Prisms', blurb: 'd = (n − 1)a, compound, resolve, split', gen: gPrisms },
    { id: 'u2-diff', unit: 2, title: 'Differential prism', blurb: 'Vertical imbalance between the eyes', gen: gDiff },
    { id: 'u2-thick', unit: 2, title: 'Sag & thickness', blurb: 'Sag formulae, edge thickness, lens measure', gen: gThick },
    { id: 't-u2', unit: 2, title: 'Unit 2 theory', blurb: `${count('u2')} questions: materials, lens form, cylinders, torics, prisms, ametropia`, gen: bankGen('u2') },
    { id: 't-u3', unit: 3, title: 'Patient-centred care', blurb: `${count('u3')} questions: communication, consent, complaints, referral`, gen: bankGen('u3') },
    { id: 't-u4', unit: 3, title: 'Dispensing practice (PQE)', blurb: `${count('u4')} questions: focimetry, neutralisation, frames, tools, coatings, PEP`, gen: bankGen('u4') },
  ];
  const ROUND = 10;

  /* ================= state & storage ================= */
  const KEY = 'sdo-quiz1';
  const load = () => { try { return JSON.parse(S.store.get(KEY) || '{}') || {}; } catch { return {}; } };
  const save = (o) => S.store.set(KEY, JSON.stringify(o));
  let run = null; // { topic, qs: [], i, picked: [] }

  function makeQ(topic) {
    for (let k = 0; k < 40; k++) {
      const t = topic.id === 'mixed' ? pick(TOPICS) : topic;
      const q = t.gen();
      if (q && q.options.length >= 3 && q.answer >= 0) return { ...q, topic: t.title };
    }
    return null;
  }

  /* ================= views ================= */
  const root = () => $('#quiz-root');
  const ring = (pct, size = 120) => {
    const r = size / 2 - 9, c = 2 * Math.PI * r;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}"/><circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-dasharray="${(c * pct).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
  };
  function home() {
    run = null;
    const st = load();
    const tile = (t) => {
      const b = st[t.id];
      const kind = t.id.startsWith('t-') ? 'Theory' : 'Calculation';
      return `<button class="qt u${t.unit}" data-topic="${t.id}"><span class="qt-kind">${kind}</span><span class="qt-title">${t.title}</span><span class="qt-blurb">${t.blurb}</span>
        <span class="qt-foot">${b ? `<span class="qt-best">Best ${b.best}/${ROUND}</span>` : '<span class="qt-best new">New</span>'}<span class="qt-bar"><i data-p="${b ? b.best / ROUND : 0}"></i></span></span></button>`;
    };
    const mixed = st.mixed;
    root().innerHTML = `<section class="banner quiz-hero"><div class="hero-txt"><span class="hero-kicker">Year 1 quiz</span><h1>Practise until<br>it's automatic.</h1><p>${ROUND} questions a round, fresh numbers every time, and the full working after each answer.</p></div>
        <button class="mixed" data-topic="mixed"><span>Mixed round</span><small>All Year 1 topics${mixed ? ` · best ${mixed.best}/${ROUND}` : ''}</small><b>Start →</b></button></section>
      <h2 class="q-unit">Unit 1 · Theory of General Optics</h2><div class="qt-grid">${TOPICS.filter((t) => t.unit === 1).map(tile).join('')}</div>
      <h2 class="q-unit">Unit 2 · Theory of Ophthalmic Lenses</h2><div class="qt-grid">${TOPICS.filter((t) => t.unit === 2).map(tile).join('')}</div>
      <h2 class="q-unit">Units 3 &amp; 4 · Patient care and dispensing practice</h2><div class="qt-grid">${TOPICS.filter((t) => t.unit === 3).map(tile).join('')}</div>`;
    root().querySelectorAll('.qt-bar i').forEach((i) => { i.style.width = `${Math.round(Number(i.dataset.p) * 100)}%`; });
  }
  function start(id) {
    const topic = id === 'mixed' ? { id: 'mixed', title: 'Mixed round' } : TOPICS.find((t) => t.id === id);
    if (!topic) return home();
    const qs = [];
    roundUsed = new Set();
    for (let tries = 0; qs.length < ROUND && tries < ROUND * 4; tries++) { const q = makeQ(topic); if (q) qs.push(q); }
    if (!qs.length) return home();
    run = { topic, qs, i: 0, picked: [] };
    question();
  }
  function question() {
    const { topic, qs, i } = run, q = qs[i];
    const letters = 'ABCD';
    root().innerHTML = `<div class="q-top"><button class="btn ghost sq" data-act="home" aria-label="Back to topics"><svg class="ico"><use href="#i-back"/></svg></button>
        <div class="q-meta"><span>${topic.title}</span><span class="q-streak" id="q-streak"></span><b>${i + 1} / ${qs.length}</b></div></div>
      <div class="q-bar"><span data-w="${(i / qs.length) * 100}"></span></div>
      <article class="card q-card"><span class="q-tag">${q.topic}</span><h3 class="q-text">${q.q}</h3>
        <div class="q-opts">${q.options.map((o, k) => `<button class="q-opt" data-k="${k}"><span class="q-l">${letters[k]}</span><span>${o}</span></button>`).join('')}</div>
        <div id="q-fb"></div></article>`;
    $('.q-bar span').style.width = `${(i / qs.length) * 100}%`;
  }
  function answer(k) {
    const q = run.qs[run.i];
    if (run.picked[run.i] !== undefined) return;
    run.picked[run.i] = k;
    const ok = k === q.answer;
    document.querySelectorAll('.q-opt').forEach((b) => {
      const kk = Number(b.dataset.k);
      b.disabled = true;
      if (kk === q.answer) b.classList.add('right');
      else if (kk === k) b.classList.add('wrong');
    });
    const last = run.i === run.qs.length - 1;
    let streak = 0;
    for (let j = run.i; j >= 0 && run.picked[j] === run.qs[j].answer; j--) streak++;
    const sEl = $('#q-streak'); if (sEl) sEl.textContent = streak >= 2 ? `\u{1F525} ${streak}` : '';
    const head = ok ? (streak >= 3 ? `Correct — ${streak} in a row!` : 'Correct!') : 'Not quite.';
    $('#q-fb').innerHTML = `<div class="q-fb ${ok ? 'ok' : 'no'}"><b>${head}</b>${q.explain}</div>
      <button class="btn q-next" data-act="next">${last ? 'See results' : 'Next question'} →</button>`;
    $('.q-next').focus({ preventScroll: true });
    $('.q-fb').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function results() {
    const { topic, qs, picked } = run;
    const score = qs.reduce((a, q, i) => a + (picked[i] === q.answer ? 1 : 0), 0);
    const st = load(), prev = st[topic.id];
    const full = qs.length === ROUND; // only a full round counts towards the best score out of ROUND
    st[topic.id] = { best: full ? Math.max(score, prev?.best || 0) : prev?.best || 0, plays: (prev?.plays || 0) + 1 };
    save(st);
    const msg = score === qs.length ? 'Perfect round! 🎉' : score >= qs.length * 0.8 ? 'Great work.' : score >= qs.length * 0.5 ? 'Getting there — read the working on the ones you missed.' : 'Worth another go — the working below shows each method.';
    const missed = qs.map((q, i) => ({ q, i })).filter(({ q, i }) => picked[i] !== q.answer);
    root().innerHTML = `<article class="card q-res">${ring(score / qs.length)}<div class="q-score"><b>${score}<small>/${qs.length}</small></b><span>${topic.title}</span></div>
        <p class="q-msg">${msg}${full && prev && score > prev.best ? ' New best!' : ''}</p>
        <div class="q-actions"><button class="btn" data-act="again">Try again</button><button class="btn ghost" data-act="home">All topics</button></div></article>
      ${missed.length ? `<h2 class="q-unit">Review</h2>${missed.map(({ q }) => `<article class="card q-review"><span class="q-tag">${q.topic}</span><h3 class="q-text">${q.q}</h3><p class="q-correct">Answer: <b>${q.options[q.answer]}</b></p><div class="work-body">${q.explain}</div></article>`).join('')}` : ''}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (score === qs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) confetti();
  }
  function confetti() {
    const box = document.createElement('div');
    box.className = 'confetti';
    const cols = ['#16f9cb', '#2f6fe4', '#e0474c', '#fbbf24', '#a78bfa'];
    for (let i = 0; i < 46; i++) {
      const c = document.createElement('i');
      c.style.left = `${Math.random() * 100}%`;
      c.style.background = cols[i % cols.length];
      c.style.animationDelay = `${Math.random() * 0.6}s`;
      c.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(c);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3600);
  }

  document.addEventListener('click', (ev) => {
    if (!root() || root().closest('[hidden]')) return;
    const t = ev.target.closest('[data-topic], [data-act], .q-opt');
    if (!t || !root().contains(t)) return;
    if (t.dataset.topic) start(t.dataset.topic);
    else if (t.classList.contains('q-opt')) answer(Number(t.dataset.k));
    else if (t.dataset.act === 'home') home();
    else if (t.dataset.act === 'again') start(run.topic.id);
    else if (t.dataset.act === 'next') { if (run.i < run.qs.length - 1) { run.i++; question(); window.scrollTo({ top: 0 }); } else results(); }
  });
  document.addEventListener('keydown', (ev) => {
    if (!run || root().closest('[hidden]') || !$('.q-opt')) return;
    const k = '1234'.indexOf(ev.key) >= 0 ? '1234'.indexOf(ev.key) : 'abcd'.indexOf(ev.key.toLowerCase());
    if (k >= 0 && k < run.qs[run.i].options.length) answer(k);
    else if (ev.key === 'Enter' && $('.q-next')) $('.q-next').click();
  });

  window.SDOQuiz = { show() { if (!run) home(); }, _topics: TOPICS, _make: makeQ };
  if (!$('#mode-quiz').hidden) home(); // app.js may have switched to quiz mode before this file loaded
})();
