// Renders animatic.html to the store video: every frame stepped on the timeline in headless Chrome at 3840x2160, encoded
// with ffmpeg, then muxed with the soundtrack normalized to -14 LUFS (YouTube's loudness target).
//
// Usage (from this folder): python sound.py && node render.mjs ["../Video 3840x2160.mp4"]
// Set CHROME if Chrome is not at its default install path, and RENDER_SECONDS to render only the start (a quick test).

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, process.argv[2] ?? '../Video 3840x2160.mp4');
const chrome = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FPS = 30, PORT = 9333;

const profile = mkdtempSync(join(tmpdir(), 'selvage-render-'));
const browser = spawn(chrome, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--hide-scrollbars',
  '--window-size=1920,1080', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });

async function pageSocket()
{
  for (let i = 0; i < 100; i++)
  {
    try
    {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = targets.find(t => t.type === 'page');
      if (page)
        return page.webSocketDebuggerUrl;
    }
    catch { }
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('Chrome did not open its debugging port.');
}

const ws = new WebSocket(await pageSocket());
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let nextId = 0;
const pending = new Map();
ws.addEventListener('message', e =>
{
  const msg = JSON.parse(e.data);
  if (pending.has(msg.id))
  {
    const { ok, fail } = pending.get(msg.id);
    pending.delete(msg.id);
    (msg.error) ? fail(new Error(msg.error.message)) : ok(msg.result);
  }
});
const send = (method, params = {}) => new Promise((ok, fail) =>
{
  const id = ++nextId;
  pending.set(id, { ok, fail });
  ws.send(JSON.stringify({ id, method, params }));
});
async function evaluate(expression)
{
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails)
    throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
}

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 2, mobile: false });
await send('Page.navigate', { url: pathToFileURL(join(here, 'animatic.html')).href + '?t=0' });
await evaluate(`new Promise(r => { const go = () => document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.decode().catch(() => {})))).then(r); (document.readyState === 'complete') ? go() : addEventListener('load', go); })`);
const end = Number(process.env.RENDER_SECONDS ?? await evaluate("END"));
const frames = Math.round(end * FPS);

const silent = join(profile, 'video.mp4');
const encoder = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
const encoded = new Promise((ok, fail) => encoder.on('close', code => (code === 0) ? ok() : fail(new Error('ffmpeg failed: ' + code))));

for (let f = 0; f < frames; f++)
{
  await evaluate(`seekTo(${f / FPS}); paint(); paintTyping(); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (encoder.stdin.write(Buffer.from(shot.data, 'base64')) === false)
    await new Promise(r => encoder.stdin.once('drain', r));
  if (f % 150 === 0)
    console.log(`frame ${f}/${frames}`);
}
encoder.stdin.end();
await encoded;
ws.close();
browser.kill();

await new Promise((ok, fail) =>
{
  const mux = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', join(here, 'soundtrack.wav'),
    '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-shortest',
    '-movflags', '+faststart', out], { stdio: 'inherit' });
  mux.on('close', code => (code === 0) ? ok() : fail(new Error('mux failed: ' + code)));
});
try { rmSync(profile, { recursive: true, force: true }); } catch { }
console.log('wrote', out, `${frames} frames`);
