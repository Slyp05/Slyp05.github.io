// Generates the illustrations the store pages place with <image>: a game's screen at three dated stages, stacked like
// prints with a timestamp stamp on each, and the AI clone held up by a robot beside it, with empty outlines where its
// history would be. Run with `node illustrations.js`, then re-render the pages.
const fs = require("fs");
const path = require("path");

const INK = "#0a1344";
const YELLOW = "#ffd400";
const RED = "#ff3b4f";
const METAL = "#dfe6f5";

let uidCounter = 0;

// The extent of everything drawn into the current illustration, so it can be framed tightly and centred in its page.
let bounds = null;

function resetBounds()
{
    bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
}

function include(x, y)
{
    bounds.minX = Math.min(bounds.minX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.maxY = Math.max(bounds.maxY, y);
}

// Includes the corners of a rectangle given in a group translated by (x, y) and rotated by rot degrees around (cx, cy).
function includeRotatedRect(x0, y0, x1, y1, x, y, rot, cx, cy)
{
    const a = rot * Math.PI / 180;
    for (const [px, py] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1]])
    {
        const dx = px - cx, dy = py - cy;
        include(x + cx + dx * Math.cos(a) - dy * Math.sin(a), y + cy + dx * Math.sin(a) + dy * Math.cos(a));
    }
}

// The game screen in a 240x180 box, at three stages: greybox, flat colours, final art.
function scene(stage)
{
    const uid = `g${uidCounter++}`;
    const out = [];
    if (stage === 0)
    {
        out.push(`<rect width="240" height="180" fill="#eef0f4"/>`);
        const grid = [];
        for (let x = 20; x < 240; x += 20)
            grid.push(`M${x} 0 V180`);
        for (let y = 20; y < 180; y += 20)
            grid.push(`M0 ${y} H240`);
        out.push(`<path d="${grid.join(" ")}" stroke="#d5d9e2" stroke-width="1.2"/>`);
        out.push(`<rect y="140" width="240" height="40" fill="#9aa1ad"/>`);
        out.push(`<rect x="140" y="96" width="70" height="14" fill="#b3b9c3"/>`);
        out.push(`<rect x="52" y="108" width="26" height="32" rx="7" fill="#7d8592"/>`);
        out.push(`<circle cx="175" cy="76" r="8" fill="#c3c8d0"/>`);
        out.push(`<path d="M216 140 V92" stroke="#7d8592" stroke-width="3"/><rect x="216" y="92" width="16" height="11" fill="#b3b9c3"/>`);
        return out.join("");
    }

    const final = (stage === 2);
    const line = (final) ? `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"` : "";
    if (final)
    {
        out.push(`<defs><linearGradient id="${uid}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb0ff"/><stop offset="1" stop-color="#c4e9ff"/></linearGradient></defs>`);
        out.push(`<rect width="240" height="180" fill="url(#${uid}sky)"/>`);
        out.push(`<g fill="#ffffff"><ellipse cx="46" cy="40" rx="22" ry="9"/><ellipse cx="60" cy="34" rx="14" ry="9"/><ellipse cx="160" cy="28" rx="18" ry="7"/><ellipse cx="172" cy="23" rx="11" ry="7"/></g>`);
        out.push(`<path d="M0 140 Q40 104 86 130 Q130 96 178 126 Q210 110 240 122 V140 H0 Z" fill="#82d98f"/>`);
    }
    else
        out.push(`<rect width="240" height="180" fill="#7cc8ff"/>`);

    out.push(`<rect y="140" width="240" height="40" fill="#9b5b2c" ${line}/><rect y="140" width="240" height="9" fill="#49b85a" ${line}/>`);
    out.push(`<rect x="140" y="96" width="70" height="14" fill="#9b5b2c" ${line}/><rect x="140" y="96" width="70" height="5" fill="#49b85a" ${line}/>`);
    if (final)
        out.push(`<g fill="#7a4420"><circle cx="30" cy="164" r="2.5"/><circle cx="96" cy="170" r="2"/><circle cx="150" cy="160" r="2.5"/><circle cx="204" cy="168" r="2"/></g>`);

    // The hero, mid-stride on the ground.
    out.push(`<rect x="52" y="108" width="26" height="32" rx="7" fill="#ff4d5e" ${line}/>`);
    out.push(`<rect x="62" y="114" width="12" height="9" rx="3" fill="#ffffff"/>`);
    if (final)
        out.push(`<circle cx="70" cy="118.5" r="2.6" fill="${INK}"/><path d="M56 112 Q57 109 60 108.5" fill="none" stroke="#ffb3bb" stroke-width="2.5" stroke-linecap="round"/>`);

    out.push(`<circle cx="175" cy="76" r="8" fill="#ffcc00" ${line}/>`);
    if (final)
        out.push(`<path d="M172 71 V80" stroke="#fff4b0" stroke-width="2.5" stroke-linecap="round"/>`);

    out.push(`<path d="M216 140 V92" stroke="${(final) ? INK : "#ffffff"}" stroke-width="3"/><path d="M217.5 92 H234 L228 98 L234 104 H217.5 Z" fill="#ff4d5e" ${line}/>`);
    return out.join("");
}

// A print of the game screen: a white card with an ink outline and a hard ink shadow, w wide. With stampR set, it is
// a protected version: a timestamp of radius stampR on its top-right corner, and a flat border in the timestamp's
// yellow and ink around the card, joined to it. With robot set, a robot holds it up from behind.
function print(stage, x, y, w, rot, stampR = 0, robot = false)
{
    const pad = w * 0.035;
    const inner = w - pad * 2;
    const h = inner * 0.75 + pad * 2;
    const stroke = w * 0.012;
    const off = w * 0.035;
    const border = (stampR > 0) ? w * 0.03 : 0;
    const shape = (fill, dx, line) => `<rect x="${dx - border}" y="${dx - border}" width="${w + border * 2}" height="${h + border * 2}" rx="${w * 0.02 + border}" fill="${fill}"${line}/>`;
    includeRotatedRect(-border, -border, w + off + border, h + off + border, x, y, rot, w / 2, h / 2);
    if (stampR > 0)
        includeRotatedRect(w - stampR * 1.6, -stampR * 0.6, w + stampR * 0.5, stampR * 1.5, x, y, rot, w / 2, h / 2);
    if (robot)
        includeRotatedRect(-w * 0.06, -w * 0.36, w * 1.06, h, x, y, rot, w / 2, h / 2);

    return `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${h / 2})">`
        + ((robot) ? robotBehind(w) : "")
        + shape(INK, off, "")
        + ((border > 0) ? shape(YELLOW, 0, ` stroke="${INK}" stroke-width="${stroke}"`) : "")
        + `<rect width="${w}" height="${h}" rx="${w * 0.02}" fill="#ffffff" stroke="${INK}" stroke-width="${stroke}"/>`
        + `<g transform="translate(${pad} ${pad}) scale(${inner / 240})">${scene(stage)}</g>`
        + `<rect x="${pad}" y="${pad}" width="${inner}" height="${inner * 0.75}" fill="none" stroke="${INK}" stroke-width="${stroke * 0.8}"/>`
        + ((stampR > 0) ? stamp(w - stampR * 0.55, stampR * 0.45, stampR, 10) : "")
        + ((robot) ? robotHands(w, h) : "")
        + `</g>`;
}

function printHeight(w)
{
    return (w - w * 0.07) * 0.75 + w * 0.07;
}

// The empty place where a print's history would be: a dashed outline.
function emptyPrint(x, y, w, rot)
{
    const h = printHeight(w);
    includeRotatedRect(0, 0, w, h, x, y, rot, w / 2, h / 2);
    return `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${h / 2})" fill="none" stroke="#ffffff" stroke-width="${w * 0.018}" stroke-dasharray="${w * 0.045} ${w * 0.03}" stroke-linecap="round" opacity="0.9">`
        + `<rect width="${w}" height="${h}" rx="${w * 0.02}"/>`
        + `</g>`;
}

// The timestamp: a stamp with a clock face. No text.
function stamp(cx, cy, r, rot)
{
    const ticks = [];
    for (let i = 0; i < 12; i++)
    {
        const a = i * Math.PI / 6;
        const r0 = r * 0.58, r1 = r * ((i % 3 === 0) ? 0.44 : 0.5);
        ticks.push(`M${(Math.cos(a) * r0).toFixed(2)} ${(Math.sin(a) * r0).toFixed(2)} L${(Math.cos(a) * r1).toFixed(2)} ${(Math.sin(a) * r1).toFixed(2)}`);
    }

    return `<g transform="translate(${cx} ${cy}) rotate(${rot})" stroke-linecap="round" stroke-linejoin="round">`
        + `<circle r="${r}" fill="${YELLOW}" stroke="${INK}" stroke-width="${r * 0.09}"/>`
        + `<circle r="${r * 0.72}" fill="none" stroke="${INK}" stroke-width="${r * 0.05}"/>`
        + `<path d="${ticks.join(" ")}" stroke="${INK}" stroke-width="${r * 0.06}"/>`
        + `<path d="M0 0 L${-r * 0.24} ${-r * 0.2} M0 0 L${r * 0.3} ${-r * 0.3}" fill="none" stroke="${INK}" stroke-width="${r * 0.09}"/>`
        + `<circle r="${r * 0.07}" fill="${INK}"/>`
        + `</g>`;
}

// The AI: a robot's head peeking over the top of a print it holds, with startled red LED eyes and an antenna.
// Drawn behind the print, in its coordinates.
function robotBehind(w)
{
    const cx = w * 0.5, top = -w * 0.21, hw = w * 0.36, hh = w * 0.26;
    const line = `stroke="${INK}" stroke-width="${w * 0.012}" stroke-linejoin="round" stroke-linecap="round"`;
    return `<g ${line}>`
        + `<path d="M${cx} ${top} V${top - w * 0.08}" fill="none"/>`
        + `<circle cx="${cx}" cy="${top - w * 0.095}" r="${w * 0.022}" fill="${RED}"/>`
        + `<rect x="${cx - hw / 2 - w * 0.035}" y="${top + hh * 0.3}" width="${w * 0.04}" height="${hh * 0.4}" rx="${w * 0.01}" fill="${METAL}"/>`
        + `<rect x="${cx + hw / 2 - w * 0.005}" y="${top + hh * 0.3}" width="${w * 0.04}" height="${hh * 0.4}" rx="${w * 0.01}" fill="${METAL}"/>`
        + `<rect x="${cx - hw / 2}" y="${top}" width="${hw}" height="${hh}" rx="${w * 0.04}" fill="${METAL}"/>`
        + `<rect x="${cx - hw * 0.38}" y="${top + hh * 0.18}" width="${hw * 0.76}" height="${hh * 0.5}" rx="${w * 0.025}" fill="${INK}"/>`
        + `<circle cx="${cx - hw * 0.18}" cy="${top + hh * 0.43}" r="${w * 0.035}" fill="${RED}" stroke="none"/>`
        + `<circle cx="${cx + hw * 0.18}" cy="${top + hh * 0.43}" r="${w * 0.035}" fill="${RED}" stroke="none"/>`
        + `<circle cx="${cx - hw * 0.18 - w * 0.01}" cy="${top + hh * 0.43 - w * 0.012}" r="${w * 0.01}" fill="#ffffff" stroke="none"/>`
        + `<circle cx="${cx + hw * 0.18 - w * 0.01}" cy="${top + hh * 0.43 - w * 0.012}" r="${w * 0.01}" fill="#ffffff" stroke="none"/>`
        + `</g>`;
}

// The robot's grippers, clamped on the print's left and right edges. Drawn over the print, in its coordinates.
function robotHands(w, h)
{
    const gw = w * 0.075, gh = w * 0.11, y = h * 0.42;
    const line = `fill="${METAL}" stroke="${INK}" stroke-width="${w * 0.012}" stroke-linejoin="round"`;
    const grip = (x) => `<rect x="${x}" y="${y}" width="${gw}" height="${gh}" rx="${w * 0.018}" ${line}/>`
        + `<path d="M${x + gw * 0.2} ${y + gh * 0.36} H${x + gw * 0.8} M${x + gw * 0.2} ${y + gh * 0.64} H${x + gw * 0.8}" stroke="${INK}" stroke-width="${w * 0.008}" stroke-linecap="round"/>`;
    return grip(-gw * 0.55) + grip(w - gw * 0.45);
}

// The full scene: three stamped prints of the original, and the robot's clone with empty history behind it.
// w: print width. step: offset between stacked prints. gap: space between the stack and the clone's empty history.
function composition(w, step, gap)
{
    const parts = [];
    const stackX = 0, stackY = step * 2.2;
    const front = { x: stackX + step * 2, y: stackY + step * 2 };
    const cloneX = front.x + w + gap + step * 2;
    const cloneY = front.y;

    // The original: greybox at the back, flat colours, final art in front, each stamped on its top-right corner.
    parts.push(print(0, stackX, stackY, w, -7, w * 0.1));
    parts.push(print(1, stackX + step, stackY + step, w, -3.5, w * 0.1));
    parts.push(print(2, front.x, front.y, w, 0, w * 0.12));

    // The clone: an identical final screen held up by the robot that made it, with nothing behind it.
    parts.push(emptyPrint(cloneX - step * 2, cloneY - step * 2, w, -7));
    parts.push(emptyPrint(cloneX - step, cloneY - step, w, -3.5));
    parts.push(print(2, cloneX, cloneY, w, 4, 0, true));
    return parts.join("\n");
}

// Writes the illustration framed tightly on what was drawn, plus margin, and returns its size.
function write(file, body, margin)
{
    const x = bounds.minX - margin, y = bounds.minY - margin;
    const w = Math.ceil(bounds.maxX - bounds.minX + margin * 2), h = Math.ceil(bounds.maxY - bounds.minY + margin * 2);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${w} ${h}">\n${body}\n</svg>\n`;
    fs.writeFileSync(path.join(__dirname, file), svg);
    console.log(`${file}: ${w}x${h}`);
    return { w, h };
}

// Scales the illustration to fit the box [x, y, w, h] of the page's canvas, centres it there, and writes the placement
// into the page's <image> element for that file.
function place(page, file, size, box)
{
    const [bx, by, bw, bh] = box;
    const scale = Math.min(bw / size.w, bh / size.h);
    const w = size.w * scale, h = size.h * scale;
    const x = bx + (bw - w) / 2, y = by + (bh - h) / 2;
    const element = `<image href="${file}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/>`;
    const pagePath = path.join(__dirname, page);
    const html = fs.readFileSync(pagePath, "utf8");
    const pattern = new RegExp(`<image href="${file.replace(".", "\\.")}"[^>]*/>`);
    if (pattern.test(html) == false)
        throw new Error(`${page} has no <image> for ${file}.`);

    fs.writeFileSync(pagePath, html.replace(pattern, element));
    console.log(`  ${page}: ${element}`);
}

// Cover and social share one illustration. The card's is drawn at its own scale for its small display size. Boxes are
// in each page's canvas units: below the title block on the cover and the card, the whole canvas less a margin on the
// social image and the icon.
resetBounds();
const main = write("illustration.svg", composition(400, 90, 150), 8);
place("cover.html", "illustration.svg", main, [40, 430, 1870, 840]);
place("social.html", "illustration.svg", main, [50, 40, 1100, 550]);

resetBounds();
const card = write("illustration-card.svg", composition(250, 46, 60), 6);
place("card.html", "illustration-card.svg", card, [30, 156, 780, 380]);

// Icon art: the three prints stacked, the final one in front, and a large stamp on its top-right corner. No clone: it
// does not read at 80x80.
{
    resetBounds();
    const w = 196;
    const parts = [];
    parts.push(print(0, 0, 0, w, -8));
    parts.push(print(1, 28, 30, w, -4));
    parts.push(print(2, 58, 62, w, 0, 46));
    const icon = write("illustration-icon.svg", parts.join("\n"), 4);
    place("icon.html", "illustration-icon.svg", icon, [22, 22, 276, 276]);
}
