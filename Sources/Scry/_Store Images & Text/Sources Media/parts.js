// Shared parts of Scry's store media, drawn identically on every image. Each page places them, then calls vision().

// A starfield on a canvas, from a fixed seed so every render is the same.
function sky(width, height, count, seed)
{
  const canvas = document.createElement("canvas");
  canvas.className = "sky";
  canvas.width = width;
  canvas.height = height;
  const g = canvas.getContext("2d");
  let s = seed || 7;
  const random = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++)
  {
    const x = random() * width;
    const y = random() * height;
    const r = (random() < 0.08) ? 1.4 + random() * 1.4 : 0.4 + random() * 0.9;
    g.globalAlpha = 0.25 + random() * 0.6;
    g.fillStyle = (random() < 0.25) ? "#d9c9ff" : "#ffffff";
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
    if (r > 1.8)
    {
      g.globalAlpha *= 0.5;
      g.fillRect(x - r * 4, y - 0.5, r * 8, 1);
      g.fillRect(x - 0.5, y - r * 4, 1, r * 8);
    }
  }
  document.body.prepend(canvas);
}

// The crystal ball on its stand. With rows, the Inspector shows inside the glass.
function orb(id, options)
{
  const o = options || {};
  const rows = (o.rows) ?
    `<g opacity="0.92" filter="url(#soft${id})">
      <rect x="112" y="150" width="176" height="28" rx="7" fill="none" stroke="#efe8ff" stroke-width="6"/>
      <rect x="112" y="150" width="32" height="28" rx="7" fill="#efe8ff" opacity="0.55"/>
      <rect x="256" y="150" width="32" height="28" rx="7" fill="#efe8ff" opacity="0.55"/>
      <rect x="112" y="198" width="176" height="28" rx="7" fill="#efe8ff" opacity="0.3" stroke="#efe8ff" stroke-width="6"/>
      <path d="M256 207 l10 10 l10 -10" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="112" y="246" width="120" height="30" rx="8" fill="#efe8ff" opacity="0.85"/>
      <path d="M276 252 a12 12 0 1 1 -5 -7" fill="none" stroke="#efe8ff" stroke-width="6" stroke-linecap="round"/>
      <path d="M265 241 l8 4 l-4 8" fill="none" stroke="#efe8ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </g>` : "";
  const mist = (o.mist === false) ? "" :
    `<g filter="url(#blur${id})" opacity="0.7">
      <path d="M200 200 C 250 170, 280 230, 240 265 C 190 305, 110 270, 105 205 C 100 130, 190 85, 265 110 C 330 135, 365 215, 330 285" fill="none" stroke="#e7dcff" stroke-width="20" opacity="0.55"/>
      <path d="M215 215 C 230 200, 205 185, 190 205 C 170 235, 225 250, 250 220" fill="none" stroke="#9fe8ff" stroke-width="12" opacity="0.5"/>
      <path d="M70 290 C 140 330, 260 340, 340 300" fill="none" stroke="#f0a8ff" stroke-width="14" opacity="0.35"/>
    </g>
    <g fill="#ffffff">
      <circle cx="262" cy="150" r="2.6" opacity="0.9"/><circle cx="150" cy="250" r="2" opacity="0.8"/><circle cx="300" cy="235" r="1.8" opacity="0.7"/>
      <circle cx="214" cy="292" r="1.6" opacity="0.6"/><circle cx="180" cy="150" r="1.4" opacity="0.7"/><circle cx="320" cy="170" r="1.6" opacity="0.6"/>
    </g>`;
  const stand = (o.stand === false) ? "" :
    `<path d="M128 342 L272 342 L322 418 Q200 440 78 418 Z" fill="url(#gold${id})"/>
     <ellipse cx="200" cy="418" rx="122" ry="14" fill="#d9a44c"/>
     <ellipse cx="200" cy="342" rx="76" ry="13" fill="#f7dc9f"/>
     <path d="M100 386 Q200 402 300 386" fill="none" stroke="#fff0c8" stroke-width="3" opacity="0.55"/>`;
  return `<svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glass${id}" cx="38%" cy="30%" r="72%">
        <stop offset="0" stop-color="#efe7ff"/>
        <stop offset="0.16" stop-color="#ad92f6"/>
        <stop offset="0.46" stop-color="#6c48cc"/>
        <stop offset="0.8" stop-color="#2c1670"/>
        <stop offset="1" stop-color="#150a3a"/>
      </radialGradient>
      <linearGradient id="gold${id}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#6b4518"/>
        <stop offset="0.3" stop-color="#d9a44c"/>
        <stop offset="0.55" stop-color="#f7d996"/>
        <stop offset="0.8" stop-color="#b9822f"/>
        <stop offset="1" stop-color="#5a3812"/>
      </linearGradient>
      <filter id="blur${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
      <filter id="soft${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="0.8"/><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ffffff" flood-opacity="0.75"/></filter>
      <clipPath id="ball${id}"><circle cx="200" cy="190" r="170"/></clipPath>
    </defs>
    ${stand}
    <circle cx="200" cy="190" r="170" fill="url(#glass${id})"/>
    <g clip-path="url(#ball${id})">${mist}${rows}
      <ellipse cx="200" cy="335" rx="120" ry="34" fill="#d9c9ff" opacity="0.22" filter="url(#blur${id})"/>
    </g>
    <circle cx="200" cy="190" r="169" fill="none" stroke="#e8deff" stroke-width="3" opacity="0.55"/>
    <path d="M86 128 A 130 130 0 0 1 168 66" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" opacity="0.8"/>
    ${(o.rows) ? "" : '<circle cx="104" cy="160" r="6" fill="#ffffff" opacity="0.75"/>'}
  </svg>`;
}

// Scry's 16 px icon, a crystal ball on its stand, in the given color.
function orbIcon(color)
{
  return `<svg viewBox="0 0 16 16"><circle cx="8" cy="7" r="5.2" fill="none" stroke="${color}" stroke-width="1.5"/><path d="M5.6 5.2a3 3 0 0 1 2.2-1.4" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/><path d="M4 14.5h8l-1.3-2.4H5.3Z" fill="${color}"/></svg>`;
}

// The two arrows of a method that runs as one undo step.
const undoIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="#bdbdbd" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5A5 5 0 0 0 12.2 11"/><path d="M13 6.5A5 5 0 0 0 3.8 5"/><path d="M12.6 13.6l-.4-2.6 2.6-.4"/><path d="M3.4 2.4l.4 2.6-2.6.4"/></svg>`;


// Draws the vision into a .vision box: three lines of plain C# enter the crystal ball, and the Inspector controls Scry
// reads from them come out level with them. One example per kind: a clamp gives bounds, a switch a dropdown, a method
// an undoable button.
function vision(element, scale)
{
  const k = (s) => `<span class="k">${s}</span>`;
  const t = (s) => `<span class="t">${s}</span>`;
  const n = (s) => `<span class="n">${s}</span>`;
  const m = (s) => `<span class="m">${s}</span>`;
  const ys = [250, 350, 450];
  const code = [
    `speed = ${t("Mathf")}.${m("Clamp")}(speed, ${n("0")}, ${n("20")});`,
    `${k("switch")} (tier) { ${k("case")} ${n("1")}: ${k("case")} ${n("2")}: ${k("case")} ${n("3")}: }`,
    `${k("public void")} ${m("Reload")}() => ammo = ${n("30")};`,
  ];
  const rows = [
    `<span class="label">Speed</span><span class="field"><span class="box start">0 ≤</span><span class="val">8</span><span class="box end">≤ 20</span></span>`,
    `<span class="label">Tier</span><span class="field drop">2</span>`,
    `<span class="method">Reload ()${undoIcon}</span>`,
  ];
  const saved = ["saved", "saved", ""];

  // The ball: its glass, radius 170 at (200, 190) in the orb's 400x440 box, scaled to radius 230 around (975, 350).
  const r = 230;
  const s = r / 170;
  let html = `<div class="halo" style="left:${975 - 420}px; top:${350 - 420}px; width:840px; height:840px"></div>`;
  html += `<div class="orb" style="left:${975 - 200 * s}px; top:${350 - 190 * s}px; width:${400 * s}px; height:${440 * s}px">${orb("v")}</div>`;
  code.forEach((line, i) => html += `<div class="chip code" style="top:${ys[i]}px"><span>${line}</span></div>`);
  rows.forEach((row, i) => html += `<div class="chip row ${saved[i]}" style="top:${ys[i]}px">${row}</div>`);
  element.innerHTML = html;

  // Each beam: dotted from the code to the glass, a glowing streak through it, solid light out to the control.
  let beams = "";
  for (const y of ys)
  {
    const half = Math.sqrt(r * r - (y - 350) * (y - 350));
    const left = 975 - half;
    const right = 975 + half;
    beams += `<path d="M662 ${y} H ${left}" stroke="#c7b4ff" stroke-width="3.5" stroke-dasharray="1 10" stroke-linecap="round" filter="url(#vglow)"/>`;
    beams += `<circle cx="662" cy="${y}" r="5" fill="#ffffff" filter="url(#vglow)"/>`;
    beams += `<path d="M${left + 6} ${y} H ${right - 6}" stroke="#f3edff" stroke-width="6" stroke-linecap="round" opacity="0.5" filter="url(#vsoft)"/>`;
    beams += `<path d="M${right} ${y} H 1288" stroke="url(#vbeam)" stroke-width="4" stroke-linecap="round" filter="url(#vglow)"/>`;
    beams += `<circle cx="1288" cy="${y}" r="6" fill="#ffffff" filter="url(#vglow)"/>`;
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "beams");
  svg.setAttribute("width", 1950);
  svg.setAttribute("height", 700);
  // Filters in user space: a horizontal line has no height, so a box-relative filter region would be empty.
  svg.innerHTML = `<defs>
    <filter id="vglow" filterUnits="userSpaceOnUse" x="0" y="0" width="1950" height="700"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="vsoft" filterUnits="userSpaceOnUse" x="0" y="0" width="1950" height="700"><feGaussianBlur stdDeviation="5"/></filter>
    <linearGradient id="vbeam" gradientUnits="userSpaceOnUse" x1="1180" y1="0" x2="1290" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9a3ff"/></linearGradient>
  </defs>${beams}`;
  element.append(svg);
  element.style.transform = `scale(${scale})`;
}
