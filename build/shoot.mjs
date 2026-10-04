// Headless Edge screenshots over CDP (Node built-ins only).
// usage: node build/shoot.mjs <url> <out-prefix> <width> <height> <dpr> [mobile] [full] [extraJS]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, out, W = '1440', H = '900', DPR = '1', mobile = '0', full = '1', extra = ''] = process.argv.slice(2);
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9300 + Math.floor(Math.random() * 500);
const prof = mkdtempSync(join(tmpdir(), 'mg-edge-'));
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 80 && !target; i++) {
  try { const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); target = l.find((t) => t.type === 'page'); } catch {}
  if (!target) await sleep(150);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
const logs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } if (d.method === 'Log.entryAdded') logs.push(`[log:${d.params.entry.level}] ${d.params.entry.text}`); if (d.method === 'Runtime.exceptionThrown') logs.push(`[exception] ${d.params.exceptionDetails.text} ${d.params.exceptionDetails.exception?.description || ''}`); if (d.method === 'Runtime.consoleAPICalled' && d.params.type !== 'log') logs.push(`[console.${d.params.type}] ${d.params.args.map(a => a.value).join(' ')}`); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJS = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
if (process.env.REDUCED === '1') await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
if (process.env.UA) await send('Emulation.setUserAgentOverride', { userAgent: process.env.UA });
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: +DPR, mobile: mobile === '1' });
if (mobile === '1') await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url });
await sleep(4200);
const shot = async (file, opts = {}) => { const r = await send('Page.captureScreenshot', { format: 'png', ...opts }); writeFileSync(file, Buffer.from(r.result.data, 'base64')); console.log('saved', file); };
await shot(`${out}-hero.png`);
if (full === '1') {
  const h = await evalJS('document.documentElement.scrollHeight');
  for (let y = 0; y <= h; y += Math.floor(+H * 0.6)) { await evalJS(`window.scrollTo(0, ${y})`); await sleep(260); }
  await sleep(1600);
  // capture each viewport as the visitor sees it
  let n = 0;
  for (let y = +H; y < h; y += +H) { await evalJS(`window.scrollTo(0, ${y})`); await sleep(900); await shot(`${out}-s${++n}.png`); }
  await evalJS('window.scrollTo(0, 0)'); await sleep(900);
  const hh = await evalJS('document.documentElement.scrollHeight');
  await shot(`${out}-full.png`, { captureBeyondViewport: true, clip: { x: 0, y: 0, width: +W, height: hh, scale: 1 } });
}
if (extra) { const v = await evalJS(extra); console.log('extra ->', v); await sleep(700); await shot(`${out}-extra.png`); }
const errs = await evalJS('JSON.stringify(window.__errs || [])');
console.log(logs.length ? logs.join(String.fromCharCode(10)) : 'NO CONSOLE ERRORS/VIOLATIONS');
ws.close(); edge.kill();
