/* SDO Toolkit · Year 1 — dispensing optics calculators (sdo.martigor.org). Everything runs in the browser.
   Scope: ABDO Level 6 Diploma in Ophthalmic Dispensing, 2023 syllabus, Year 1 (single vision).
   Conventions: standard (TABO) axis notation, 0–180 anticlockwise from the practitioner's right for both eyes; 180 not 0. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const MINUS = '−';
  const EYES = ['R', 'L'];
  const EYE_NAME = { R: 'Right', L: 'Left' };

  /* ================= formatting ================= */
  const clean = (x, dp) => { const v = Number(x.toFixed(dp)); return Object.is(v, -0) ? 0 : v; };
  function sgn(x, dp = 2) {
    if (!Number.isFinite(x)) return '—';
    const v = clean(x, dp);
    if (v === 0) return (0).toFixed(dp);
    return (v > 0 ? '+' : MINUS) + Math.abs(v).toFixed(dp);
  }
  function num(x, dp = 2) {
    if (!Number.isFinite(x)) return '—';
    const v = clean(x, dp);
    return (v < 0 ? MINUS : '') + Math.abs(v).toFixed(dp);
  }
  const sphS = (x) => (Math.abs(x) < 0.005 ? 'Plano' : sgn(x));
  function normAx(a) { let v = (((Math.round(a * 10) / 10) % 180) + 180) % 180; if (v === 0) v = 180; return v; }
  const axS = (a) => String(Math.round(normAx(a)));
  const deg = (a) => `${Math.round(normAx(a))}°`;
  function rxS(e) {
    if (Math.abs(e.cyl) < 0.005) return `${sphS(e.sph)} DS`;
    return `${sphS(e.sph)} / ${sgn(e.cyl)} × ${axS(e.axis)}`;
  }
  const mm = (x, dp = 1) => `${num(x, dp)} mm`;
  const pr = (x, dp = 2) => `${num(Math.abs(x), dp)}Δ`;
  const f = (s) => `<span class="f">${s}</span>`;

  /* ================= optics core ================= */
  const rad = (d) => (d * Math.PI) / 180;
  const se = (e) => e.sph + e.cyl / 2;
  const principal = (e) => [{ m: normAx(e.axis), p: e.sph }, { m: normAx(e.axis + 90), p: e.sph + e.cyl }];
  const transpose = (e) => ({ ...e, sph: e.sph + e.cyl, cyl: -e.cyl, axis: normAx(e.axis + 90) });
  const toMinus = (e) => (e.cyl > 0 ? transpose(e) : e);
  const toPlus = (e) => (e.cyl < 0 ? transpose(e) : e);
  const hasCyl = (e) => Math.abs(e.cyl) >= 0.005;
  const isYear1Axis = (e) => !hasCyl(e) || [90, 180].includes(Math.round(normAx(e.axis)));
  // power acting along a meridian (for axes 90/180 this is exactly the sph or sph + cyl)
  const powerAt = (e, th) => e.sph + e.cyl * Math.sin(rad(th - e.axis)) ** 2;

  function meridians(e) {
    const a = rad(e.axis);
    return [
      { u: [Math.cos(a), Math.sin(a)], p: e.sph, m: normAx(e.axis) },
      { u: [-Math.sin(a), Math.cos(a)], p: e.sph + e.cyl, m: normAx(e.axis + 90) },
    ];
  }
  // Prentice's rule along each principal meridian: viewpoint c (cm, from the OC) -> base vector B = −F·c
  function prismAt(e, c) {
    let bx = 0, by = 0;
    for (const { u, p } of meridians(e)) { const d = c[0] * u[0] + c[1] * u[1]; bx -= p * d * u[0]; by -= p * d * u[1]; }
    return [bx, by];
  }
  // OC displacement from the pupil (cm) that produces base vector B (null if a needed meridian has no power)
  function decentreFor(e, B) {
    let dx = 0, dy = 0;
    for (const { u, p } of meridians(e)) {
      const comp = B[0] * u[0] + B[1] * u[1];
      if (Math.abs(p) < 1e-9) { if (Math.abs(comp) > 1e-9) return null; continue; }
      const d = comp / p; dx += d * u[0]; dy += d * u[1];
    }
    return [dx, dy];
  }
  const nasal = (eye) => (eye === 'R' ? 1 : -1);
  function prismParts(eye, B) {
    const h = B[0] * nasal(eye), v = B[1];
    let ang = (Math.atan2(B[1], B[0]) * 180) / Math.PI; if (ang < 0) ang += 360;
    return { h, v, mag: Math.hypot(h, v), ang };
  }
  const hTxt = (h) => (Math.abs(h) < 0.005 ? 'none' : `${pr(h)} base ${h > 0 ? 'in' : 'out'}`);
  const vTxt = (v) => (Math.abs(v) < 0.005 ? 'none' : `${pr(v)} base ${v > 0 ? 'up' : 'down'}`);
  function resTxt(p) {
    if (p.mag < 0.005) return 'No prism';
    const d = [];
    if (Math.abs(p.v) >= 0.005) d.push(p.v > 0 ? 'up' : 'down');
    if (Math.abs(p.h) >= 0.005) d.push(p.h > 0 ? 'in' : 'out');
    return `${pr(p.mag)} base ${d.join(' & ')}`;
  }
  const angTxt = (a) => `${Math.round(a) % 360}°`;

  function classify(e) {
    const [a, b] = principal(e).map((o) => o.p);
    const z = (v) => Math.abs(v) < 0.125;
    let type;
    if (Math.abs(e.cyl) < 0.125) type = z(e.sph) ? 'Emmetropia (plano)' : e.sph < 0 ? 'Myopia' : 'Hypermetropia';
    else if (z(a) || z(b)) type = (z(a) ? b : a) < 0 ? 'Simple myopic astigmatism' : 'Simple hypermetropic astigmatism';
    else if (a < 0 && b < 0) type = 'Compound myopic astigmatism';
    else if (a > 0 && b > 0) type = 'Compound hypermetropic astigmatism';
    else type = 'Mixed astigmatism';
    let orient = null;
    if (Math.abs(e.cyl) >= 0.125) {
      const ma = toMinus(e).axis;
      const d180 = Math.min(Math.abs(ma - 180), ma), d90 = Math.abs(ma - 90);
      orient = d180 <= 30 ? 'With-the-rule' : d90 <= 30 ? 'Against-the-rule' : 'Oblique';
    }
    return { type, orient, se: se(e) };
  }
  // far point of the (reduced) eye for a correcting lens of power F, lens taken at the eye
  function farPoint(F) {
    if (Math.abs(F) < 0.005) return 'at infinity';
    const cm = 100 / Math.abs(F);
    const d = cm >= 100 ? `${num(cm / 100, 2)} m` : `${num(cm, 1)} cm`;
    return F < 0 ? `${d} in front (real)` : `${d} behind (virtual)`;
  }

  /* ================= thickness ================= */
  const sagAcc = (r, y) => { if (!Number.isFinite(r)) return 0; if (Math.abs(r) < y) return NaN; return r - Math.sign(r) * Math.sqrt(r * r - y * y); };
  const sagApp = (r, y) => (Number.isFinite(r) ? (y * y) / (2 * r) : 0);
  function lensThickness(e, n, dia, ctMin, etMin, F1, sagFn) {
    const y = dia / 2;
    const r1 = ((n - 1) * 1000) / F1;
    const s1 = sagFn(r1, y);
    const mers = principal(e).map((o) => {
      const F2 = o.p - F1;
      const r2 = Math.abs(F2) < 1e-9 ? Infinity : ((1 - n) * 1000) / F2;
      const s2 = sagFn(r2, y);
      return { m: o.m, p: o.p, F2, r2, s2, delta: s2 - s1 };
    });
    const anyMinus = mers.some((o) => o.p <= 0.005);
    const minDelta = Math.min(...mers.map((o) => o.delta));
    const tc = Math.max(anyMinus ? ctMin : 0, etMin - minDelta);
    mers.forEach((o) => { o.edge = tc + o.delta; });
    const ok = Number.isFinite(s1) && mers.every((o) => Number.isFinite(o.s2));
    return { n, y, F1, r1, s1, mers, tc, ok };
  }

  /* ================= state ================= */
  const PRESETS = {
    myope: { R: { sph: -2.5, cyl: 0, axis: 0 }, L: { sph: -2.75, cyl: 0, axis: 0 } },
    hyper: { R: { sph: 3, cyl: 0, axis: 0 }, L: { sph: 3.25, cyl: 0, axis: 0 } },
    wtr: { R: { sph: -1, cyl: -1.5, axis: 180 }, L: { sph: -1.25, cyl: -1.25, axis: 180 } },
    mixed: { R: { sph: 1, cyl: -2.5, axis: 90 }, L: { sph: 0.75, cyl: -2.25, axis: 90 } },
    aniso: { R: { sph: 1, cyl: 0, axis: 0 }, L: { sph: 4, cyl: -1, axis: 180 } },
  };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  let RX = { R: { sph: 0, cyl: 0, axis: 180 }, L: { sph: 0, cyl: 0, axis: 180 } };

  function parseNum(s) {
    s = String(s ?? '').trim().toLowerCase().replace(/[−–—]/g, '-').replace(',', '.');
    if (s === '' || s === '+' || s === '-') return { v: 0, empty: true };
    if (/^(pl|plano|ds|sph)$/.test(s)) return { v: 0 };
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return { v: parseFloat(s) };
    return { v: NaN };
  }
  function readRx() {
    const msgs = [];
    for (const eye of EYES) {
      const o = {};
      for (const k of ['sph', 'cyl', 'axis']) {
        const el = $(`#${eye}-${k}`), box = el.parentElement;
        const r = parseNum(el.value);
        let bad = !Number.isFinite(r.v);
        let v = bad ? 0 : r.v;
        if (k === 'axis') { if (!bad && (v < 0 || v > 180)) bad = true; if (bad) v = 180; }
        o[k] = v; o[`_${k}Empty`] = r.empty; box.classList.toggle('bad', bad);
        if (bad) msgs.push(`${EYE_NAME[eye]} ${k}: “${el.value}” isn't a valid ${k === 'axis' ? 'axis (1–180)' : 'power'}.`);
      }
      if (Math.abs(o.cyl) >= 0.005 && o._axisEmpty) { msgs.push(`${EYE_NAME[eye]} eye has a cylinder but no axis.`); $(`#${eye}-axis`).parentElement.classList.add('bad'); }
      if (o.axis === 0) o.axis = 180;
      ['sph', 'cyl'].forEach((k) => { if (!o[`_${k}Empty`] && Math.abs(o[k] * 4 - Math.round(o[k] * 4)) > 1e-6) msgs.push(`${EYE_NAME[eye]} ${k} ${sgn(o[k])} isn't in 0.25 D steps — fine for practice, unusual on a real Rx.`); });
      RX[eye] = { sph: o.sph, cyl: o.cyl, axis: o.axis };
    }
    $('#rx-msg').textContent = msgs.slice(0, 3).join(' ');
    store.set('sdo-rx1', JSON.stringify(RX));
    const mini = $('#rx-mini');
    if (mini) mini.innerHTML = `<span><b class="r">R</b>${rxS(RX.R)}</span><span><b class="l">L</b>${rxS(RX.L)}</span><i>Edit</i>`;
  }
  function writeRx(p) {
    for (const eye of EYES) {
      const e = p[eye];
      $(`#${eye}-sph`).value = e.sph ? sgn(e.sph) : 'Plano';
      $(`#${eye}-cyl`).value = e.cyl ? sgn(e.cyl) : '';
      $(`#${eye}-axis`).value = e.cyl ? String(Math.round(e.axis || 180)) : '';
    }
  }

  /* ================= small UI helpers ================= */
  function setHTML(id, html) {
    const el = document.getElementById(id);
    const open = new Set($$('details[open][data-k]', el).map((d) => d.dataset.k));
    const before = new Map($$('.res', el).map((r) => [r.querySelector('.lbl')?.textContent, r.querySelector('.val')?.textContent]));
    el.innerHTML = html;
    open.forEach((k) => { const d = el.querySelector(`details[data-k="${k}"]`); if (d) d.open = true; });
    if (before.size) $$('.res', el).forEach((r) => { const k = r.querySelector('.lbl')?.textContent; if (before.has(k) && before.get(k) !== r.querySelector('.val')?.textContent) r.classList.add('bump'); });
  }
  let toastT;
  function toast(msg) {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1800);
  }
  const work = (k, html) => `<details class="work" data-k="${k}"><summary>Show working</summary><div class="work-body">${html}</div></details>`;
  const seg = (name) => ($(`.seg[data-name="${name}"] button.on`) || {}).dataset?.v;
  function val(id, def, { min = -Infinity, max = Infinity } = {}) {
    const el = document.getElementById(id);
    const r = parseNum(el.value);
    const bad = !r.empty && (!Number.isFinite(r.v) || r.v < min || r.v > max);
    el.closest('.unit-in')?.classList.toggle('bad', bad);
    if (r.empty || bad) return def;
    return r.v;
  }
  const res = (lbl, v, note = '', cls = '') => `<div class="res ${cls}"><div class="lbl">${lbl}</div><div class="val">${v}</div>${note ? `<div class="note">${note}</div>` : ''}</div>`;
  const callout = (cls, html) => `<div class="callout ${cls}"><div>${html}</div></div>`;
  const eyeCls = (eye) => eye.toLowerCase();
  // drawable width inside a card for an output container (charts are drawn 1:1 so text stays readable)
  function innerW(id, inCard = false) {
    const el = document.getElementById(id);
    const pad = window.innerWidth >= 720 ? 50 : 38;
    return Math.max(280, Math.round((el.clientWidth || 600) - (inCard ? 0 : pad)));
  }
  const svgOpen = (W, H, label, cls = '') => `<svg class="chart ${cls}" width="${Math.round(W)}" height="${Math.round(H)}" viewBox="0 0 ${Math.round(W)} ${Math.round(H)}" role="img" aria-label="${label}">`;
  const year1Note = (e) => (isYear1Axis(e) ? '' : callout('warn', `Axis ${axS(e.axis)} is oblique. Year 1 prism questions only use axes <b>90 and 180</b>; with an oblique axis the answer gains an extra cross term (Year 2+).`));

  // optical cross (viewed from the front)
  function crossSVG(e) {
    const R = 36, L = 54;
    const pt = (m, r) => [r * Math.cos(rad(m)), -r * Math.sin(rad(m))];
    const ps = principal(e);
    const line = (m, cls) => { const [x, y] = pt(m, R); return `<line class="${cls}" x1="${-x}" y1="${-y}" x2="${x}" y2="${y}"/>`; };
    const label = (m, p) => { const [x, y] = pt(normAx(m), L); return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle">${sgn(p)}</text>`; };
    let s = `<svg class="cross" viewBox="-70 -70 140 140" role="img" aria-label="Optical cross: ${sgn(ps[0].p)} along ${deg(ps[0].m)}, ${sgn(ps[1].p)} along ${deg(ps[1].m)}"><circle class="c-ring" r="${R}"/>`;
    if (hasCyl(e)) s += line(ps[1].m, 'c-axis2') + line(ps[0].m, 'c-axis') + label(ps[0].m, ps[0].p) + label(ps[1].m, ps[1].p);
    else s += line(180, 'c-axis') + line(90, 'c-axis') + `<text x="0" y="${R + 22}" text-anchor="middle">${sgn(e.sph)} all</text>`;
    return s + '</svg>';
  }

  /* ================= RX ANALYSIS ================= */
  function renderOverview() {
    let cards = '';
    for (const eye of EYES) {
      const e = RX[eye], c = classify(e), ps = principal(e);
      const tags = [];
      if (c.orient) tags.push(`<span class="tag">${c.orient}</span>`);
      if (hasCyl(e) && !isYear1Axis(e)) tags.push('<span class="tag warn">Oblique axis</span>');
      cards += `<article class="card eye-card ${eyeCls(eye)}">
        <div class="eye-top"><div>
          <span class="eye-label">${EYE_NAME[eye]} eye</span>
          <div class="big-rx">${rxS(e)}</div>
          <div class="sub">${c.type}</div>
        </div>${crossSVG(e)}</div>
        ${tags.length ? `<div class="tags">${tags.join('')}</div>` : ''}
        <dl class="kv">
          <div><dt>Principal powers</dt><dd>${sgn(ps[0].p)} along ${deg(ps[0].m)}<small>${sgn(ps[1].p)} along ${deg(ps[1].m)}</small></dd></div>
          ${hasCyl(e) ? `<div><dt>Transposed</dt><dd>${rxS(transpose(e))}</dd></div>` : ''}
          <div><dt>Far point</dt><dd>${hasCyl(e) ? `${deg(ps[0].m)}: ${farPoint(ps[0].p)}<small>${deg(ps[1].m)}: ${farPoint(ps[1].p)}</small>` : farPoint(e.sph)}</dd></div>
        </dl>
        ${work(`ov-${eye}`, `<p><b>Principal meridians:</b> the axis meridian (${deg(ps[0].m)}) has the sphere power ${sgn(ps[0].p)}; the meridian at 90° to it (${deg(ps[1].m)}) has sph + cyl = ${sgn(ps[0].p)} + (${sgn(e.cyl)}) = ${sgn(ps[1].p)}.</p>
          <p><b>Far point:</b> the correcting lens's second focal point coincides with the eye's far point, so far point distance = 1 / F (lens taken at the eye). Minus → real far point in front of the eye; plus → virtual, behind it.</p>`)}
      </article>`;
    }
    setHTML('ov-eyes', cards);

    const R = RX.R, Lx = RX.L, notes = [];
    const dSE = Math.abs(se(R) - se(Lx));
    if (dSE >= 1) notes.push(`<b>Anisometropia</b> — the eyes differ by about ${num(dSE)} D. Look at the differential prism when the eyes move away from the OCs.`);
    if (se(R) * se(Lx) < 0 && Math.abs(se(R)) >= 0.25 && Math.abs(se(Lx)) >= 0.25) notes.push('<b>Antimetropia</b> — one eye myopic, the other hypermetropic.');
    const dV = Math.abs(powerAt(R, 90) - powerAt(Lx, 90));
    if (dV >= 1) notes.push(`<b>Vertical meridians differ by ${num(dV)} D</b> → about ${pr(dV)} of vertical differential prism 10 mm below the OCs.`);
    if (!isYear1Axis(R) || !isYear1Axis(Lx)) notes.push('<b>Oblique axis</b> — fine for transposition; Year 1 prism work sticks to axes 90 and 180.');
    const ok = !notes.length;
    if (ok) notes.push('Nothing unusual — a straightforward single vision prescription.');
    setHTML('ov-summary', `<div class="card"><div class="card-head"><h3>Things to notice</h3><span class="ref">Unit 2 · C, H</span></div>${notes.map((n) => callout(ok ? 'ok' : '', n)).join('')}</div>`);
  }

  /* ================= TRANSPOSITION ================= */
  function renderTranspose() {
    let rows = '';
    for (const eye of EYES) {
      const e = RX[eye], ps = principal(e);
      const crossed = hasCyl(e) ? `${sgn(ps[0].p)} × ${axS(ps[1].m)} / ${sgn(ps[1].p)} × ${axS(ps[0].m)}` : `${sgn(e.sph)} DS`;
      rows += `<tr><td class="${eyeCls(eye)}">${eye}</td><td>${rxS(toMinus(e))}</td><td>${rxS(toPlus(e))}</td><td>${crossed}</td></tr>`;
    }
    const e0 = RX.R, ps0 = principal(e0);
    setHTML('tr-forms', `<div class="card-head"><h3>Sph-cyl and crossed cylinder forms <span class="ref">Unit 2 · C4–C5</span></h3></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Minus cyl</th><th>Plus cyl</th><th>Crossed cylinders</th></tr></thead><tbody>${rows}</tbody></table></div>
      ${work('tr-rules', `<p><b>Transposition (sph-cyl ↔ sph-cyl):</b> (1) new sph = sph + cyl; (2) change the sign of the cyl; (3) change the axis by 90°.</p>
        ${hasCyl(e0) ? `<p>R: ${rxS(e0)} → sph ${sgn(e0.sph)} + (${sgn(e0.cyl)}) = ${sgn(e0.sph + e0.cyl)} · cyl ${sgn(-e0.cyl)} · axis ${axS(e0.axis)} ± 90 = ${axS(e0.axis + 90)} → <b>${rxS(transpose(e0))}</b></p>` : ''}
        <p><b>Crossed cylinders:</b> each principal power becomes a plano-cylinder with its axis at 90° to the meridian it acts in.${hasCyl(e0) ? ` R: ${sgn(ps0[0].p)} acts along ${deg(ps0[0].m)} → ${sgn(ps0[0].p)} × ${axS(ps0[1].m)}; ${sgn(ps0[1].p)} acts along ${deg(ps0[1].m)} → ${sgn(ps0[1].p)} × ${axS(ps0[0].m)}.` : ''}</p>
        <p><b>Crossed cylinders → sph-cyl:</b> take either cylinder's power as the sphere; cyl = the other power − that sphere; axis = the axis of the other cylinder.</p>`)}`);

    // toric
    const te = seg('tor-eye') || 'R', t = RX[te];
    const mode = seg('tor-mode') || 'base', side = seg('tor-side') || 'back', minusT = side === 'back';
    $('#tor-val-lbl').textContent = mode === 'base' ? 'Base curve' : `Sphere curve (${minusT ? 'front' : 'back'})`;
    const v = Math.abs(val('tor-val', 6, { min: 0.25, max: 25 }));
    let out;
    const curveS = (T, m) => `${sgn(T)} × ${axS(m + 90)}`; // a curve acting along meridian m has its axis at m + 90
    if (!hasCyl(t)) {
      out = `<p class="empty">${EYE_NAME[te]} eye has no cylinder, so no toric surface is needed.</p>`;
    } else {
      const ps = principal(t);
      let sph, base, cross, steps;
      if (mode === 'base') {
        const B = minusT ? -v : v;
        const hi = ps[0].p >= ps[1].p ? ps[0] : ps[1], lo = hi === ps[0] ? ps[1] : ps[0];
        const bm = minusT ? hi : lo, om = minusT ? lo : hi;
        sph = bm.p - B; base = { m: bm.m, T: B }; cross = { m: om.m, T: om.p - sph };
        const form = minusT ? toMinus(t) : toPlus(t);
        steps = `<p>1. ${minusT ? 'Minus' : 'Plus'} base curve, so write the Rx in ${minusT ? 'minus' : 'plus'} cyl form: <b>${rxS(form)}</b></p>
          <p>2. Sphere curve = sph − base curve = ${sgn(form.sph)} − (${sgn(B)}) = <b>${sgn(sph)}</b></p>
          <p>3. Base curve axis = cyl axis ± 90 = ${axS(form.axis + 90)} → base curve <b>${sgn(B)} × ${axS(form.axis + 90)}</b></p>
          <p>4. Cross curve = base curve + cyl = ${sgn(B)} + (${sgn(form.cyl)}) = <b>${sgn(B + form.cyl)}</b>, axis = cyl axis = ${axS(form.axis)}</p>`;
      } else {
        sph = minusT ? v : -v;
        const T = ps.map((o) => ({ m: o.m, T: o.p - sph }));
        const sorted = [...T].sort((a, b) => a.T - b.T);
        base = minusT ? sorted[1] : sorted[0]; cross = minusT ? sorted[0] : sorted[1];
        steps = `<p>1. The sphere curve ${sgn(sph)} goes on the ${minusT ? 'front' : 'back'}; the toric surface is the other one.</p>
          <p>2. Each principal power minus the sphere curve gives the toric curve in that meridian: ${ps.map((o) => `${deg(o.m)}: ${sgn(o.p)} − (${sgn(sph)}) = ${sgn(o.p - sph)}`).join(' ; ')}</p>
          <p>3. The base curve is the flatter (weaker) of the two: <b>${sgn(base.T)}</b> along ${deg(base.m)} → written ${curveS(base.T, base.m)}; cross curve ${curveS(cross.T, cross.m)}.</p>`;
      }
      const wrongSign = minusT ? (base.T > 0.005 || cross.T > 0.005) : (base.T < -0.005 || cross.T < -0.005);
      const toricTxt = `${curveS(base.T, base.m)} / ${curveS(cross.T, cross.m)}`;
      const top = minusT ? `${sgn(sph)} DS` : toricTxt, bot = minusT ? toricTxt : `${sgn(sph)} DS`;
      out = `<div class="tor-box"><div class="fraction"><span>${top}</span><span class="bar"></span><span class="den">${bot}</span></div>
        <div class="sub">Front: ${minusT ? `sphere ${sgn(sph)}` : `base ${curveS(base.T, base.m)}, cross ${curveS(cross.T, cross.m)}`}<br>Back: ${minusT ? `base ${curveS(base.T, base.m)}, cross ${curveS(cross.T, cross.m)}` : `sphere ${sgn(sph)}`}</div></div>
        ${wrongSign ? callout('warn', `With this ${mode === 'base' ? 'base' : 'sphere'} curve the toric surface isn't fully ${minusT ? 'minus' : 'plus'}, so it isn't a sensible ${minusT ? 'minus' : 'plus'} toric. Try a ${mode === 'sph' ? 'steeper sphere curve' : 'different curve'}.`) : ''}
        ${work('tor', `${steps}<p><b>Check / back to sph-cyl (D6):</b> add the sphere curve to each toric curve → along ${deg(base.m)}: ${sgn(sph)} + (${sgn(base.T)}) = ${sgn(sph + base.T)}; along ${deg(cross.m)}: ${sgn(sph)} + (${sgn(cross.T)}) = ${sgn(sph + cross.T)} → ${rxS(t)} ✓</p>`)}`;
    }
    setHTML('tr-toric', `<p class="hint">${EYE_NAME[te]}: ${rxS(t)} — written front surface over back surface (thin lens).</p>${out}`);
  }

  /* ================= PRISM DIAGRAM ================= */
  // Front view of a lens, as the practitioner sees it. pt/oc in mm and B in prism dioptres, all in the TABO frame (x = practitioner's right, y = up).
  function prismDiagram(eye, pt, oc, B, label, F) {
    const W = 300, H = 210, cx = W / 2, cy = H / 2 + 6, R = 72;
    const off = Math.max(8, Math.hypot(pt[0] - oc[0], pt[1] - oc[1]));
    const k = Math.min(4.2, (R - 16) / off);
    const X = (x) => cx + x * k, Y = (y) => cy - y * k;
    const ox = X(oc[0]), oy = Y(oc[1]), px = X(pt[0]), py = Y(pt[1]);
    const mag = Math.hypot(B[0], B[1]);
    const len = mag < 0.005 ? 0 : Math.min(60, 22 + mag * 8), ux = mag ? B[0] / mag : 0, uy = mag ? B[1] / mag : 0;
    const ax = px + ux * len, ay = py - uy * len;
    const nasalRight = eye === 'R';
    const sign = F > 0.005 ? '+' : F < -0.005 ? '\u2212' : '';
    let s = `<svg class="pdiag" viewBox="0 0 ${W} ${H}" role="img" aria-label="Lens diagram: ${label}">
      <defs><marker id="pd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="pd-head"/></marker></defs>
      <text class="pd-side" x="10" y="${cy + 4}">${nasalRight ? 'Temporal' : 'Nasal'}</text><text class="pd-side" x="${W - 10}" y="${cy + 4}" text-anchor="end">${nasalRight ? 'Nasal' : 'Temporal'}</text>
      <circle class="pd-lens ${F < 0 ? 'minus' : 'plus'}" cx="${ox}" cy="${oy}" r="${R}"/>
      <line class="pd-axis" x1="${ox - R}" x2="${ox + R}" y1="${oy}" y2="${oy}"/><line class="pd-axis" x1="${ox}" x2="${ox}" y1="${oy - R}" y2="${oy + R}"/>
      ${sign ? `<text class="pd-kind" x="10" y="${H - 6}">${F > 0 ? 'Plus' : 'Minus'} lens (${sign === '+' ? 'base towards OC' : 'base away from OC'})</text>` : ''}
      <circle class="pd-oc" cx="${ox}" cy="${oy}" r="5"/><text class="pd-lbl" x="${ox + 9}" y="${oy + 17}">OC</text>`;
    if (Math.hypot(px - ox, py - oy) > 2) s += `<line class="pd-dec" x1="${ox}" y1="${oy}" x2="${px}" y2="${py}"/>`;
    s += `<circle class="pd-pt" cx="${px}" cy="${py}" r="6.5"/><circle class="pd-pt-in" cx="${px}" cy="${py}" r="2.4"/>`;
    if (len) s += `<line class="pd-base" x1="${px}" y1="${py}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" marker-end="url(#pd-arrow)"/>`;
    s += `<text class="pd-cap" x="${cx}" y="16" text-anchor="middle">${label}</text></svg>`;
    return s;
  }
  const legendPD = (what) => `<div class="legend pd-legend"><span><i class="oc"></i>Optical centre</span><span><i class="pt"></i>${what}</span><span><i class="ar"></i>Prism base</span></div>`;

  /* ================= PRISMS ================= */
  function prismWorking(e, c, B) {
    const fh = powerAt(e, 180), fv = powerAt(e, 90);
    let s = `<p>${f('P = c × F')} (c in cm, F in D). Plus lens: base towards the OC. Minus lens: base away from the OC.</p>
      <p>Horizontal: ${num(Math.abs(c[0]), 2)} cm × power along 180 (${sgn(fh)}) = ${num(Math.abs(c[0] * fh))}Δ</p>
      <p>Vertical: ${num(Math.abs(c[1]), 2)} cm × power along 90 (${sgn(fv)}) = ${num(Math.abs(c[1] * fv))}Δ</p>`;
    if (Math.abs(B[0]) >= 0.005 && Math.abs(B[1]) >= 0.005) s += `<p>Single resultant: ${f('√(H² + V²)')} = √(${num(Math.abs(B[0]))}² + ${num(Math.abs(B[1]))}²) = ${num(Math.hypot(B[0], B[1]))}Δ</p>`;
    return s;
  }
  function renderPrism() {
    { // small-angled prism
      const a = val('pb-a', 5, { min: 0, max: 30 }), n = val('pb-n', 1.523, { min: 1, max: 2.5 });
      const d = (n - 1) * a, P = 100 * Math.tan(rad(d));
      setHTML('pb-out', `<div class="res-grid">${res('Deviation d', `${num(d, 2)}°`, '', 'hero')}${res('Prism power', `${num(P, 2)}Δ`)}</div>
        ${work('pb', `<p>${f('d = (n − 1) a')} = (${num(n, 3)} − 1) × ${num(a, 1)}° = <b>${num(d, 2)}°</b></p><p>Prism dioptre: 1Δ deviates light by 1 cm at 1 m → ${f('P = 100 tan d')} = 100 × tan ${num(d, 2)}° = <b>${num(P, 2)}Δ</b></p><p>Rule of thumb: for small prisms 1° ≈ 1.75Δ.</p>`)}`);
    }
    { // thickness difference
      const P = val('pg-p', 3, { min: 0, max: 30 }), d = val('pg-d', 50, { min: 1, max: 100 }), n = val('pg-n', 1.498, { min: 1, max: 2.5 });
      const g = (P * d) / (100 * (n - 1));
      setHTML('pg-out', `<div class="res-grid">${res('Thickness difference g', mm(g, 2), 'base edge minus apex edge', 'hero')}</div>
        ${work('pg', `<p>${f('g = P d / 100(n − 1)')} = ${num(P, 2)} × ${num(d, 0)} / (100 × ${num(n - 1, 3)}) = <b>${num(g, 2)} mm</b></p>`)}`);
    }
    { // effect at a point
      const eye = seg('pe-eye') || 'R', e = RX[eye];
      const h = val('pe-h', 0, { min: 0, max: 40 }) * (seg('pe-hdir') === 'out' ? -1 : 1);
      const v = val('pe-v', 0, { min: 0, max: 40 }) * (seg('pe-vdir') === 'down' ? -1 : 1);
      const c = [(h / 10) * nasal(eye), v / 10];
      const B = prismAt(e, c), p = prismParts(eye, B);
      const Fpe = Math.abs(c[1]) >= Math.abs(c[0]) ? powerAt(e, 90) : powerAt(e, 180);
      setHTML('pe-out', `<p class="hint">${EYE_NAME[eye]}: ${rxS(e)}</p>${year1Note(e)}<div class="pd-wrap">${prismDiagram(eye, [c[0] * 10, c[1] * 10], [0, 0], B, resTxt(p), Fpe)}${legendPD('Where the eye looks')}</div><div class="res-grid">
          ${res('Horizontal', hTxt(p.h), '', eyeCls(eye))}${res('Vertical', vTxt(p.v), '', eyeCls(eye))}
          ${res('Single resultant', resTxt(p), p.mag >= 0.005 ? `360° notation: base ${angTxt(p.ang)}` : '', 'hero')}
        </div>${work('pe', prismWorking(e, c, B))}`);
    }
    { // decentration
      const eye = seg('dc-eye') || 'R', e = RX[eye];
      const H = val('dc-h', 0, { min: 0, max: 30 }) * (seg('dc-hdir') === 'out' ? -1 : 1);
      const V = val('dc-v', 0, { min: 0, max: 30 }) * (seg('dc-vdir') === 'down' ? -1 : 1);
      const B = [H * nasal(eye), V];
      const d = decentreFor(e, B);
      let out;
      if (Math.abs(H) < 0.005 && Math.abs(V) < 0.005) out = '<p class="empty">Enter the prescribed prism.</p>';
      else if (!d) out = callout('warn', 'This lens has no power in a meridian the prism needs, so decentration cannot produce it — the prism would have to be worked (surfaced).');
      else {
        const dh = d[0] * 10 * nasal(eye), dv = d[1] * 10, tot = Math.hypot(dh, dv);
        const hW = Math.abs(dh) < 0.05 ? 'none' : `${mm(Math.abs(dh))} ${dh > 0 ? 'in' : 'out'}`;
        const vW = Math.abs(dv) < 0.05 ? 'none' : `${mm(Math.abs(dv))} ${dv > 0 ? 'up' : 'down'}`;
        const fh = powerAt(e, 180), fv = powerAt(e, 90);
        const Fdc = Math.abs(V) > Math.abs(H) ? fv : fh;
        const capt = `OC ${[hW, vW].filter((x) => x !== 'none').join(', ')}`;
        out = `<div class="pd-wrap">${prismDiagram(eye, [0, 0], [d[0] * 10, d[1] * 10], B, capt, Fdc)}${legendPD('Pupil')}</div><div class="res-grid">${res('Move OC horizontally', hW, '', eyeCls(eye))}${res('Move OC vertically', vW, '', eyeCls(eye))}${res('Single resultant decentration', mm(tot), 'use this for the minimum size uncut', 'hero')}</div>
          ${work('dc', `<p>${f('c = P / F')} in each meridian (c in cm). Plus lens: move the OC towards the base. Minus lens: move it away from the base.</p>
            ${Math.abs(H) >= 0.005 ? `<p>Horizontal: ${num(Math.abs(H))}Δ / ${sgn(fh)} (power along 180) = ${num(Math.abs(H / fh), 2)} cm = ${mm(Math.abs(dh))} ${dh > 0 ? 'in' : 'out'}</p>` : ''}
            ${Math.abs(V) >= 0.005 ? `<p>Vertical: ${num(Math.abs(V))}Δ / ${sgn(fv)} (power along 90) = ${num(Math.abs(V / fv), 2)} cm = ${mm(Math.abs(dv))} ${dv > 0 ? 'up' : 'down'}</p>` : ''}
            ${Math.abs(dh) >= 0.05 && Math.abs(dv) >= 0.05 ? `<p>Single resultant: √(${num(Math.abs(dh), 1)}² + ${num(Math.abs(dv), 1)}²) = <b>${mm(tot)}</b></p>` : ''}`)}`;
      }
      setHTML('dc-out', `<p class="hint">${EYE_NAME[eye]}: ${rxS(e)}</p>${year1Note(e)}${out}`);
    }
    { // compound
      const eye = seg('cp-eye') || 'R';
      const H = val('cp-h', 0, { min: 0, max: 40 }) * (seg('cp-hdir') === 'out' ? -1 : 1);
      const V = val('cp-v', 0, { min: 0, max: 40 }) * (seg('cp-vdir') === 'down' ? -1 : 1);
      const p = prismParts(eye, [H * nasal(eye), V]);
      const fromH = (Math.atan2(Math.abs(V), Math.abs(H)) * 180) / Math.PI;
      setHTML('cp-out', `<div class="res-grid">${res('Resultant', resTxt(p), p.mag >= 0.005 ? `${num(fromH, 1)}° from the horizontal` : '', 'hero')}${res('360° notation', p.mag >= 0.005 ? `base ${angTxt(p.ang)}` : '—', `${EYE_NAME[eye]} eye`)}</div>
        ${work('cp', `<p>${f('P = √(H² + V²)')} = √(${num(Math.abs(H))}² + ${num(Math.abs(V))}²) = <b>${num(p.mag)}Δ</b></p><p>${f('θ = tan⁻¹(V / H)')} = ${num(fromH, 1)}° from the horizontal.</p><p>360° notation (both eyes, anticlockwise from the practitioner's right): right eye base in = 0°, out = 180°; left eye base in = 180°, out = 0°; up = 90°, down = 270°.</p>`)}`);
    }
    { // resolve
      const eye = seg('rs-eye') || 'R';
      const P = val('rs-p', 0, { min: 0, max: 40 }), A = val('rs-a', 0, { min: 0, max: 360 });
      const B = [P * Math.cos(rad(A)), P * Math.sin(rad(A))], p = prismParts(eye, B);
      setHTML('rs-out', `<div class="res-grid">${res('Horizontal', hTxt(p.h), '', eyeCls(eye))}${res('Vertical', vTxt(p.v), '', eyeCls(eye))}</div>
        ${work('rs', `<p>${f('H = P cos θ')} = ${num(P)} × cos ${num(A, 0)}° = ${num(Math.abs(B[0]))}Δ ; ${f('V = P sin θ')} = ${num(P)} × sin ${num(A, 0)}° = ${num(Math.abs(B[1]))}Δ</p>`)}`);
    }
    { // split
      const H = val('sp-h', 0, { min: 0, max: 40 }), hb = seg('sp-hdir') === 'out' ? 'out' : 'in';
      const V = val('sp-v', 0, { min: 0, max: 20 }), upR = seg('sp-vdir') !== 'downR';
      const part = (eye) => {
        const t = [];
        if (H >= 0.005) t.push(`${pr(H / 2)} base ${hb}`);
        if (V >= 0.005) t.push(`${pr(V / 2)} base ${(eye === 'R') === upR ? 'up' : 'down'}`);
        return t.length ? t.join(' + ') : 'none';
      };
      setHTML('sp-out', `<div class="res-grid">${res('Right eye', part('R'), '', 'r')}${res('Left eye', part('L'), '', 'l')}</div>
        ${work('sp', `<p>Horizontal prism is shared equally with the <b>same</b> base direction in each eye (in with in, out with out).</p><p>Vertical prism is shared with <b>opposite</b> bases: base up in one eye has the same effect as base down in the other.</p>`)}`);
    }
  }

  /* ================= DIFFERENTIAL PRISM ================= */
  function renderBino() {
    const down = val('bi-down', 10, { min: 0, max: 30 }), inset = val('bi-in', 0, { min: 0, max: 10 });
    const P = {};
    for (const eye of EYES) P[eye] = prismParts(eye, prismAt(RX[eye], [(inset / 10) * nasal(eye), -down / 10]));
    const diff = P.R.v - P.L.v, ad = Math.abs(diff);
    const hTot = P.R.h + P.L.h;
    const imb = ad < 0.005 ? 'none' : `${pr(ad)} base ${diff > 0 ? 'up R (≡ base down L)' : 'down R (≡ base up L)'}`;
    const same = Math.sign(P.R.v) === Math.sign(P.L.v);
    const fyR = powerAt(RX.R, 90), fyL = powerAt(RX.L, 90);
    setHTML('bi-out', `${year1Note(RX.R) || year1Note(RX.L)}<div class="card"><div class="card-head"><h3>At ${num(down, 0)} mm below${inset ? ` and ${num(inset, 0)} mm in from` : ''} the OCs</h3></div>
      <div class="res-grid">${res('Right eye', vTxt(P.R.v), inset ? `horizontal: ${hTxt(P.R.h)}` : `vertical power ${sgn(fyR)}`, 'r')}${res('Left eye', vTxt(P.L.v), inset ? `horizontal: ${hTxt(P.L.h)}` : `vertical power ${sgn(fyL)}`, 'l')}
      ${res('Vertical differential', imb, '', 'hero')}${inset ? res('Net horizontal', Math.abs(hTot) < 0.005 ? 'none' : `${pr(hTot)} base ${hTot > 0 ? 'in' : 'out'}`) : ''}</div>
      ${ad >= 1 ? callout('warn', `<b>${pr(ad)} vertical differential prism.</b> The eyes cope far less well with vertical prism than horizontal, so differences around 1Δ and above can cause problems. How to manage it comes later in the course.`) : callout('ok', 'Small vertical differential prism.')}
      ${work('bi', `<p>Prentice's rule for each eye, using the power along the 90 meridian:</p>
        <p>R: ${num(down / 10, 1)} cm × ${sgn(fyR)} = ${num(Math.abs(P.R.v))}Δ base ${P.R.v >= 0 ? 'up' : 'down'} · L: ${num(down / 10, 1)} cm × ${sgn(fyL)} = ${num(Math.abs(P.L.v))}Δ base ${P.L.v >= 0 ? 'up' : 'down'}</p>
        <p>${same ? 'Same base direction in both eyes → <b>subtract</b>' : 'Opposite base directions → <b>add</b>'}: differential = <b>${num(ad)}Δ</b></p>
        <p>Shortcut: c × (difference between the vertical powers) = ${num(down / 10, 1)} × ${num(Math.abs(fyR - fyL))} = ${num(Math.abs((down / 10) * (fyR - fyL)))}Δ</p>`)}</div>`);
  }

  /* ================= CENTRATION ================= */
  function frameCalc() {
    const A = val('fr-a', 50, { min: 20, max: 80 }), B = val('fr-b', 40, { min: 10, max: 70 }), DBL = val('fr-dbl', 20, { min: 5, max: 30 });
    const pd = { R: val('fr-pdr', 32, { min: 20, max: 45 }), L: val('fr-pdl', 32, { min: 20, max: 45 }) };
    const ht = { R: val('fr-hr', B / 2, { min: 0, max: 70 }), L: val('fr-hl', B / 2, { min: 0, max: 70 }) };
    const allow = val('fr-allow', 0, { min: 0, max: 10 });
    const BCD = A + DBL, eyes = {};
    for (const eye of EYES) {
      const hd = BCD / 2 - pd[eye], vd = ht[eye] - B / 2, rd = Math.hypot(hd, vd);
      eyes[eye] = { hd, vd, rd, msu: A + 2 * rd + allow };
    }
    return { A, B, DBL, pd, ht, allow, BCD, eyes };
  }
  function renderFrame() {
    const F = frameCalc(), E = F.eyes;
    const dirH = (d) => (Math.abs(d) < 0.05 ? 'none' : `${mm(Math.abs(d))} ${d > 0 ? 'in' : 'out'}`);
    const dirV = (d) => (Math.abs(d) < 0.05 ? 'none' : `${mm(Math.abs(d))} ${d > 0 ? 'up' : 'down'}`);
    const Wpx = Math.min(innerW('fr-out'), 760);
    const ext = (eye) => { const r = E[eye].msu / 2, oy = F.ht[eye] - F.B / 2; return { top: Math.max(F.B / 2, oy + r), bot: Math.max(F.B / 2, -(oy - r)) }; };
    const top = Math.max(ext('R').top, ext('L').top), bot = Math.max(ext('R').bot, ext('L').bot);
    const halfW = F.DBL / 2 + F.A + Math.max(4, (Math.max(E.R.msu, E.L.msu) - F.A) / 2 + 2);
    const k = Math.min(5.5, Wpx / (2 * halfW));
    const W = 2 * halfW * k, H = (top + bot) * k + 66;
    const X = (x) => (x + halfW) * k, Y = (y) => (top - y) * k + 8;
    const rr = Math.min(F.A, F.B) * 0.45;
    let g = `<line class="datum" x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}"/>`;
    for (const eye of EYES) {
      const s = eye === 'R' ? -1 : 1;
      const bcx = s * (F.DBL / 2 + F.A / 2);
      const x0 = s > 0 ? F.DBL / 2 : -(F.DBL / 2 + F.A);
      g += `<rect class="box" x="${X(x0)}" y="${Y(F.B / 2)}" width="${F.A * k}" height="${F.B * k}"/>`;
      g += `<rect class="shape" x="${X(x0) + 1}" y="${Y(F.B / 2) + 1}" width="${F.A * k - 2}" height="${F.B * k - 2}" rx="${rr * k}"/>`;
      g += `<line class="bc" x1="${X(bcx) - 7}" x2="${X(bcx) + 7}" y1="${Y(0)}" y2="${Y(0)}"/><line class="bc" x1="${X(bcx)}" x2="${X(bcx)}" y1="${Y(0) - 7}" y2="${Y(0) + 7}"/>`;
      const ocx = s * F.pd[eye], ocy = F.ht[eye] - F.B / 2;
      g += `<circle class="mbs-${eyeCls(eye)}" cx="${X(ocx)}" cy="${Y(ocy)}" r="${(E[eye].msu / 2) * k}"/>`;
      g += `<circle class="oc-${eyeCls(eye)}" cx="${X(ocx)}" cy="${Y(ocy)}" r="4.5"/>`;
      g += `<text class="t-ink" x="${X(bcx)}" y="${Y(-bot) + 22}" text-anchor="middle">${eye} · dec ${dirH(E[eye].hd)}</text>`;
    }
    const yb = Y(-bot) + 40, xa = X(-(F.DBL / 2 + F.A / 2)), xb = X(F.DBL / 2 + F.A / 2);
    g += `<line class="dim" x1="${xa}" x2="${xb}" y1="${yb}" y2="${yb}"/><line class="dim" x1="${xa}" x2="${xa}" y1="${yb - 5}" y2="${yb + 5}"/><line class="dim" x1="${xb}" x2="${xb}" y1="${yb - 5}" y2="${yb + 5}"/><text x="${X(0)}" y="${yb + 17}" text-anchor="middle">BCD ${num(F.BCD, 1)} mm</text>`;
    const svg = `${svgOpen(W, H, 'Frame with box centres, optical centres and minimum size uncut', 'frame-svg')}${g}</svg>`;

    let cards = '';
    for (const eye of EYES) {
      const e = E[eye];
      cards += `<div class="card eye-card ${eyeCls(eye)}"><span class="eye-label">${EYE_NAME[eye]} lens</span>
        <div class="res-grid">${res('Horizontal decentration', dirH(e.hd))}${res('Vertical decentration', dirV(e.vd))}${res('Resultant decentration', mm(e.rd, 2))}${res('Minimum size uncut', `Ø ${mm(e.msu)}`, 'then the next blank size up', 'hero')}</div>
      </div>`;
    }
    setHTML('fr-out', `<div class="card"><div class="card-head"><h3>Frame layout</h3><span class="sub">Viewed from the front</span></div>${svg}
        <div class="legend"><span><i></i>Box centre +</span><span><i class="r"></i>R optical centre &amp; uncut</span><span><i class="l"></i>L optical centre &amp; uncut</span></div>
        ${work('fr', `<p>${f('BCD (frame PD) = A + DBL')} = ${num(F.A, 1)} + ${num(F.DBL, 1)} = <b>${num(F.BCD, 1)} mm</b></p>
          <p>${f('Horizontal decentration = BCD/2 − mono PD')} → R: ${num(F.BCD / 2, 1)} − ${num(F.pd.R, 1)} = ${num(E.R.hd, 1)} ; L: ${num(F.BCD / 2, 1)} − ${num(F.pd.L, 1)} = ${num(E.L.hd, 1)} (positive = inwards)</p>
          <p>${f('Vertical decentration = OC height − B/2')} → R: ${num(F.ht.R, 1)} − ${num(F.B / 2, 1)} = ${num(E.R.vd, 1)} ; L: ${num(E.L.vd, 1)} (positive = up)</p>
          <p>${f('Resultant = √(h² + v²)')} → R ${num(E.R.rd, 2)} mm, L ${num(E.L.rd, 2)} mm</p>
          <p>${f('MSU = horizontal lens size + 2 × resultant decentration')}${F.allow ? ' + allowance' : ''} → R: ${num(F.A, 1)} + 2 × ${num(E.R.rd, 2)}${F.allow ? ` + ${num(F.allow, 1)}` : ''} = <b>${num(E.R.msu, 1)} mm</b> ; L: <b>${num(E.L.msu, 1)} mm</b></p>`)}</div>
      <div class="grid two">${cards}</div>`);
  }

  /* ================= THICKNESS ================= */
  function profileSVG(t, mer, k) {
    const y = t.y, steps = 40, pts = [];
    const z1 = (h) => sagAcc(t.r1, Math.abs(h)), z2 = (h) => t.tc + sagAcc(mer.r2, Math.abs(h));
    for (let i = 0; i <= steps; i++) { const h = -y + (2 * y * i) / steps; pts.push([z1(h), h]); }
    for (let i = steps; i >= 0; i--) { const h = -y + (2 * y * i) / steps; pts.push([z2(h), h]); }
    const zs = pts.map((p) => p[0]), zmin = Math.min(...zs), zmax = Math.max(...zs);
    const padL = 10, w = (zmax - zmin) * k + 150, H = 2 * y * k + 56;
    const X = (z) => padL + (z - zmin) * k, Y = (h) => 34 + (y - h) * k;
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('') + 'Z';
    const right = X(zmax) + 12;
    return { w, H, svg: `<path class="lens-f" d="${d}"/><line class="lens-axis" x1="0" x2="${right}" y1="${Y(0)}" y2="${Y(0)}"/>
      <text class="t-ink" x="${right}" y="${Y(0) + 4}">centre ${num(t.tc, 1)}</text>
      <text class="t-ink" x="${right}" y="${Y(y) + 8}">edge ${num(mer.edge, 1)}</text>
      <text x="${padL}" y="14">along ${deg(mer.m)} · ${sgn(mer.p)} D</text>` };
  }
  function renderThick() {
    const eye = seg('th-eye') || 'R', e = RX[eye];
    const n = val('th-n', 1.498, { min: 1.3, max: 2 }), dia = val('th-dia', 50, { min: 20, max: 90 });
    const F1 = val('th-f1', 6, { min: 0.25, max: 20 }), ct = val('th-ct', 2, { min: 0.5, max: 10 }), et = val('th-et', 1, { min: 0.3, max: 10 });
    const t = lensThickness(e, n, dia, ct, et, F1, sagAcc);
    const ta = lensThickness(e, n, dia, ct, et, F1, sagApp);
    if (!t.ok) {
      setHTML('th-out', `<div class="card">${callout('warn', 'A surface is too steep for this diameter (its radius is smaller than the semi-diameter). Use a smaller diameter or a flatter front curve.')}</div>`);
    } else {
      const thin = t.mers.reduce((a, b) => (b.edge < a.edge ? b : a)), thick = t.mers.reduce((a, b) => (b.edge > a.edge ? b : a));
      const avail = innerW('th-out'), list = hasCyl(e) ? t.mers : [t.mers[0]];
      let k = Math.min(6, 280 / dia);
      let profs = list.map((m) => profileSVG(t, m, k));
      const need = profs.reduce((a, p) => a + p.w + 10, 0);
      if (need > avail) { k *= Math.max(0.3, (avail - list.length * 160) / (need - list.length * 160)); profs = list.map((m) => profileSVG(t, m, k)); }
      let x = 0, inner = '';
      profs.forEach((p) => { inner += `<g transform="translate(${x.toFixed(1)},0)">${p.svg}</g>`; x += p.w + 10; });
      const W = x, H = Math.max(...profs.map((p) => p.H));
      const plus = t.mers.every((m) => m.p > 0.005);
      setHTML('th-out', `<div class="card"><div class="card-head"><h3>${EYE_NAME[eye]} lens · n = ${num(n, 3)}</h3><span class="sub">${rxS(e)} · Ø ${num(dia, 0)} mm · F₁ ${sgn(F1)}</span></div>
          <div class="res-grid">${res('Centre thickness', mm(t.tc, 2), plus ? `set by the ${num(et, 1)} mm minimum edge` : `minimum centre ${num(ct, 1)} mm`, 'hero')}
          ${res(hasCyl(e) ? 'Thinnest edge' : 'Edge thickness', mm(thin.edge, 2), hasCyl(e) ? `along ${deg(thin.m)}` : '')}
          ${hasCyl(e) ? res('Thickest edge', mm(thick.edge, 2), `along ${deg(thick.m)}`) : ''}
          ${res('With approx. sag', plus ? `centre ${mm(ta.tc, 2)}` : `edge ${mm(Math.max(...ta.mers.map((m) => m.edge)), 2)}`, 's ≈ y² / 2r')}</div>
          ${svgOpen(W, H, 'Lens cross-section at true scale')}${inner}</svg>
          <p class="chart-cap">Cross-section${hasCyl(e) ? 's in each principal meridian' : ''} at true scale (light from the left), uncut round lens with the OC at its centre.</p>
          ${work('th', `<p>Back surface (thin lens): ${f('F₂ = F − F₁')} → ${t.mers.map((m) => `${deg(m.m)}: ${sgn(m.p)} − ${sgn(F1)} = ${sgn(m.F2)}`).join(' ; ')}</p>
            <p>Radius: ${f('r = (n − 1) / F')} → r₁ = ${num(t.r1, 1)} mm${t.mers.map((m) => `, r₂(${deg(m.m)}) = ${Number.isFinite(m.r2) ? `${num(Math.abs(m.r2), 1)} mm` : '∞'}`).join('')}</p>
            <p>Accurate sag: ${f('s = r − √(r² − y²)')}, y = ${num(t.y, 1)} mm → s₁ = ${num(t.s1, 2)} mm${t.mers.map((m) => `, s₂(${deg(m.m)}) = ${num(Math.abs(m.s2), 2)} mm`).join('')}</p>
            <p>Approximate sag: ${f('s ≈ y² / 2r')} → s₁ ≈ ${num(ta.s1, 2)} mm${ta.mers.map((m) => `, s₂(${deg(m.m)}) ≈ ${num(Math.abs(m.s2), 2)} mm`).join('')}</p>
            <p>${plus ? f('centre = edge + s₁ − s₂') : f('edge = centre + s₂ − s₁')} → ${t.mers.map((m) => `${deg(m.m)}: edge <b>${num(m.edge, 2)} mm</b>`).join(' ; ')}, centre <b>${num(t.tc, 2)} mm</b></p>`)}
        </div>`);
    }
    // lens measure
    const r = val('lm-r', 6, { min: -30, max: 30 }), nc = val('lm-nc', 1.523, { min: 1.3, max: 2 }), nl = val('lm-n', 1.498, { min: 1.3, max: 2 });
    const tru = (r * (nl - 1)) / (nc - 1), radius = Math.abs(r) < 1e-9 ? Infinity : ((nc - 1) * 1000) / Math.abs(r);
    setHTML('lm-out', `<div class="res-grid">${res('True surface power', `${sgn(tru)} D`, `for n = ${num(nl, 3)}`, 'hero')}${res('Surface radius', Number.isFinite(radius) ? mm(radius, 1) : '∞', 'what the measure actually reads')}</div>
      ${work('lm', `<p>The lens measure reads the sag over a fixed chord and converts it to power assuming n = ${num(nc, 3)}, so what it really measures is the radius: ${f('r = (n_cal − 1) / reading')} = ${num(nc - 1, 3)} / ${num(Math.abs(r), 2)} = ${Number.isFinite(radius) ? `${num(radius / 1000, 4)} m` : '∞'}.</p>
        <p>True power: ${f('F = reading × (n − 1) / (n_cal − 1)')} = ${sgn(r)} × ${num(nl - 1, 3)} / ${num(nc - 1, 3)} = <b>${sgn(tru)} D</b></p>`)}`);
  }

  /* ================= MATERIALS (Unit 2 · A) ================= */
  // typical catalogue values; individual products vary
  const MATS = [
    ['CR39', 1.498, 58, 1.32], ['Crown glass', 1.523, 59, 2.54], ['Trivex', 1.532, 45, 1.11], ['Mid-index 1.56', 1.56, 36, 1.23],
    ['Polycarbonate', 1.586, 30, 1.2], ['1.6 resin', 1.6, 41, 1.3], ['1.67 resin', 1.67, 32, 1.35], ['1.74 resin', 1.74, 33, 1.46], ['1.8 glass', 1.802, 35, 3.65],
  ];
  function renderMaterials() {
    const rows = MATS.map(([name, n, V, d]) => {
      const R = ((n - 1) / (n + 1)) ** 2;
      return `<tr><td>${name}</td><td class="num">${n.toFixed(3)}</td><td class="num">${V}</td><td class="num">${d.toFixed(2)}</td><td class="num">${num(0.523 / (n - 1), 2)}</td><td class="num">${num(R * 100, 1)}%</td></tr>`;
    }).join('');
    setHTML('mt-table', `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Material</th><th class="num">n</th><th class="num">Abbe V</th><th class="num">Density g/cm³</th><th class="num">CVF</th><th class="num">Reflection / surface</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="hint">Typical values — always check the manufacturer's data.</p>
      ${work('mt', `<p><b>Refractive index n</b> — higher n = flatter curves = thinner lens.</p>
        <p><b>Abbe number V</b> — dispersion: the lower V is, the more colour fringing away from the optical centre.</p>
        <p><b>Density</b> — with thickness, decides the weight. Glass is roughly twice as dense as CR39.</p>
        <p><b>Curve variation factor</b> ${f('CVF = (1.523 − 1) / (n − 1)')} — how the curves compare with crown glass for the same power (below 1 = flatter).</p>
        <p><b>Reflection</b> per surface ${f('R = ((n − 1) / (n + 1))²')} — rises with n, which is why anti-reflection coatings matter more on high index.</p>`)}`);
  }

  /* ================= wiring ================= */
  const RENDER = { overview: renderOverview, transpose: renderTranspose, prism: () => { renderPrism(); renderBino(); }, frame: renderFrame, thick: () => { renderThick(); renderMaterials(); } };
  let active = 'overview';
  function renderActive() { try { RENDER[active](); } catch (err) { console.error(err); } }
  const MODES = ['tools', 'quiz', 'weeks'];
  function setMode(m, push = true) {
    if (!MODES.includes(m)) m = 'tools';
    MODES.forEach((k) => { const el = $(`#mode-${k}`); if (el) el.hidden = k !== m; });
    $$('.mode button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === m)));
    if (m === 'quiz') { if (push) history.replaceState(null, '', '#quiz'); window.SDOQuiz?.show(); }
    else if (m === 'weeks') { if (push) history.replaceState(null, '', '#weeks'); window.SDOWeeks?.show(); }
    else if (push) history.replaceState(null, '', active === 'overview' ? location.pathname : `#${active}`);
    store.set('sdo-mode', m);
    window.scrollTo({ top: 0 });
  }
  function show(tab, push = true) {
    if (tab === 'quiz') { setMode('quiz', push); return; }
    const wk = /^weeks?(?:-(\d+))?$/.exec(tab);
    if (wk) { setMode('weeks', false); window.SDOWeeks?.open(wk[1] ? Number(wk[1]) : null, push); return; }
    const bk = /^book-([a-z0-9-]+)$/.exec(tab);
    if (bk) { setMode('weeks', false); window.SDOWeeks?.book(bk[1], push); return; }
    if ($('#mode-tools').hidden) setMode('tools', false);
    if (tab === 'bino') tab = 'prism';
    if (!RENDER[tab]) tab = 'overview';
    active = tab;
    $$('.tabs button').forEach((b) => { const on = b.dataset.tab === tab; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    $$('.panel').forEach((p) => { p.hidden = p.id !== `p-${tab}`; });
    if (push) history.replaceState(null, '', tab === 'overview' ? location.pathname : `#${tab}`);
    store.set('sdo-tab', tab);
    renderActive();
    $(`.tabs button[data-tab="${tab}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  function init() {
    let saved = null;
    try { saved = JSON.parse(store.get('sdo-rx1') || 'null'); } catch { saved = null; }
    writeRx(saved && saved.R && saved.L ? saved : PRESETS.wtr);
    $$('.rx-grid input').forEach((el) => { el.placeholder = { pow: el.id.endsWith('sph') ? 'Plano' : 'DS', axis: '—' }[el.dataset.kind]; });
    readRx();

    const rxGrid = $('.rx-grid');
    rxGrid.addEventListener('input', () => { readRx(); renderActive(); });
    rxGrid.addEventListener('keydown', (ev) => {
      const el = ev.target;
      if (el.tagName !== 'INPUT' || (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown')) return;
      ev.preventDefault();
      const kind = el.dataset.kind, dir = ev.key === 'ArrowUp' ? 1 : -1;
      let v = parseNum(el.value).v; if (!Number.isFinite(v)) v = 0;
      if (kind === 'axis') { v = Math.round(v) + dir * (ev.shiftKey ? 10 : 1); if (v > 180) v -= 180; if (v < 1) v += 180; el.value = String(v); }
      else { v = Math.round((v + dir * 0.25) * 4) / 4; el.value = v ? sgn(v) : el.id.endsWith('sph') ? 'Plano' : ''; }
      readRx(); renderActive();
    });
    rxGrid.addEventListener('focusout', (ev) => {
      const el = ev.target; if (el.tagName !== 'INPUT') return;
      const r = parseNum(el.value); if (!Number.isFinite(r.v) || r.empty) { if (r.empty) el.value = ''; return; }
      if (el.dataset.kind === 'axis') { if (r.v >= 0 && r.v <= 180) el.value = String(Math.round(r.v) || 180); }
      else el.value = r.v ? sgn(r.v) : el.id.endsWith('sph') ? 'Plano' : '';
      readRx(); renderActive();
    });
    $$('.sign').forEach((b) => {
      b.addEventListener('pointerdown', (ev) => ev.preventDefault());
      b.addEventListener('click', () => {
        const el = $(`#${b.dataset.for}`);
        let s = el.value.trim().replace(/^plano$/i, '');
        if (/^[-−]/.test(s)) s = s.replace(/^[-−]/, '+');
        else if (/^\+/.test(s)) s = s.replace(/^\+/, '-');
        else s = `-${s}`;
        el.value = s.replace(/^\+$/, ''); el.focus();
        const n = el.value.length; try { el.setSelectionRange(n, n); } catch { /* ok */ }
        readRx(); renderActive();
      });
    });
    $('#example').addEventListener('change', (ev) => {
      const p = PRESETS[ev.target.value]; if (!p) return;
      const name = ev.target.selectedOptions[0]?.textContent || 'Example';
      writeRx(p); ev.target.value = ''; readRx(); renderActive(); toast(`Loaded: ${name}`);
    });
    $('#copy-rl').addEventListener('click', () => { ['sph', 'cyl', 'axis'].forEach((k) => { $(`#L-${k}`).value = $(`#R-${k}`).value; }); readRx(); renderActive(); toast('Copied right eye \u2192 left eye'); });
    $('#clear-rx').addEventListener('click', () => { $$('.rx-grid input').forEach((el) => { el.value = ''; }); readRx(); renderActive(); $('#R-sph').focus(); toast('Prescription cleared'); });

    document.addEventListener('click', (ev) => {
      const b = ev.target.closest('.seg button');
      if (!b) return;
      $$('button', b.parentElement).forEach((x) => x.classList.toggle('on', x === b));
      if (b.parentElement.dataset.name === 'tor-mode') $('#tor-val').value = b.dataset.v === 'base' ? '6.00' : '8.00';
      renderActive();
    });
    $('main').addEventListener('input', (ev) => { if (!ev.target.closest('.rx-card')) renderActive(); });
    $('#th-from-frame').addEventListener('click', () => {
      const F = frameCalc(), eye = seg('th-eye') || 'R';
      $('#th-dia').value = num(F.A + 2 * F.eyes[eye].rd, 1);
      renderActive();
    });

    $$('.subnav').forEach((nav) => nav.addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-sub]'); if (!b) return;
      $$('button', nav).forEach((x) => x.classList.toggle('on', x === b));
      $$(':scope > [data-sub]', nav.parentElement).forEach((el) => { el.hidden = el.dataset.sub !== b.dataset.sub; });
      b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      renderActive();
    }));
    $$('.mode button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
    $$('.tabs button').forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));
    $('.tabs-in').addEventListener('keydown', (ev) => {
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      const tabs = $$('.tabs button'), i = tabs.findIndex((t) => t.dataset.tab === active);
      const n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      show(n.dataset.tab); n.focus();
    });
    const mini = $('#rx-mini'), rxCard = $('.rx-card');
    if (mini && rxCard && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => mini.classList.toggle('show', !en.isIntersecting && en.boundingClientRect.top < 0)).observe(rxCard);
      mini.addEventListener('click', () => { rxCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); setTimeout(() => $('#R-sph').focus({ preventScroll: true }), 450); });
    }
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(renderActive, 150); });
    window.addEventListener('hashchange', () => show(location.hash.slice(1) || 'overview', false));
    $('#theme').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next); store.set('sdo-theme', next);
    });
    const h = location.hash.slice(1);
    if (h) show(h, false);
    else { const m = store.get('sdo-mode') || 'weeks'; if (m === 'tools') show(store.get('sdo-tab') || 'overview', false); else setMode(m, false); }
  }
  function go(tab, sub) {
    show(tab);
    if (sub) { const b = $(`.subnav button[data-sub="${sub}"]`, $(`#p-${tab}`)); if (b && !b.classList.contains('on')) b.click(); }
  }
  window.SDO = { toast, go, setMode, sgn, num, rxS, normAx, axS, deg, se, principal, transpose, toMinus, toPlus, hasCyl, powerAt, prismAt, prismParts, hTxt, vTxt, resTxt, classify, farPoint, sagAcc, sagApp, f, store, mm, pr };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

// v7 · ATLAS house style: time-of-day sky, entrance only once, pointer-lit cards
(function () {
  const root = document.documentElement;
  const tod = () => { const h = new Date().getHours(); root.dataset.tod = h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 21 ? 'dusk' : 'night'; };
  tod(); setInterval(tod, 60000);
  setTimeout(() => root.classList.add('ready'), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1900);
  let raf = 0, mx = 0, my = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return; mx = e.clientX; my = e.clientY; if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      for (const c of document.querySelectorAll('.card')) {
        const r = c.getBoundingClientRect();
        if (r.bottom < -400 || r.top > innerHeight + 400) continue;
        c.style.setProperty('--mx', (mx - r.left) + 'px'); c.style.setProperty('--my', (my - r.top) + 'px');
      }
    });
  }, { passive: true });
})();

// v11 · self-update. A home-screen app (iOS above all) resumes the page it already had in memory instead of loading it
// again, so new versions never show up. When the app comes back to the front (and every 15 min while it stays open) ask
// the server for index.html and compare its versioned files (?v=N) with the ones this page loaded; if they differ, reload.
(function () {
  const sig = (list) => [...new Set(list)].sort().join(' ');
  const mine = () => sig([...document.querySelectorAll('script[src*="?v="], link[href*="?v="]')].map((e) => e.getAttribute('src') || e.getAttribute('href')));
  let last = Date.now(), busy = false;
  async function check() {
    if (busy || document.visibilityState !== 'visible') return;
    busy = true; last = Date.now();
    try {
      const r = await fetch(`/?t=${Date.now()}`, { cache: 'no-store', redirect: 'error' });
      if (!r.ok) return;
      const theirs = sig([...(await r.text()).matchAll(/(?:src|href)="(\/assets\/[^"]+\?v=\d+)"/g)].map((m) => m[1]));
      if (!theirs || theirs === mine()) return;
      // never loop: at most one automatic reload every 5 minutes
      let prev = 0; try { prev = Number(sessionStorage.getItem('sdo-reloaded')) || 0; } catch { prev = 0; }
      if (Date.now() - prev < 300000) return;
      try { sessionStorage.setItem('sdo-reloaded', String(Date.now())); } catch { /* private mode */ }
      location.reload();
    } catch { /* offline, or the login has expired: leave the page as it is */ } finally { busy = false; }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
  addEventListener('pageshow', (e) => { if (e.persisted) check(); });
  addEventListener('focus', () => { if (Date.now() - last > 60000) check(); });
  setInterval(check, 15 * 60000);
})();

// which copy and which build this is, in the footer: a home-screen icon doesn't show its address
(function () {
  const put = () => {
    const made = document.querySelector('.foot .made');
    if (!made || made.querySelector('.build')) return;
    const v = (document.querySelector('script[src*="app.js?v="]')?.getAttribute('src') || '').split('v=')[1] || '?';
    const priv = /^iris\.martigor\.org$/.test(location.hostname);
    made.insertAdjacentHTML('beforeend', ` · <span class="build">v${v} · ${priv ? 'private copy' : 'public copy'} · ${location.hostname}</span>`);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', put); else put();
})();
