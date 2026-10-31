// Draws the demo game's art as SVG pages: the cover's platformer screen at ten stages, from greybox to final art, and
// the copy's store screenshot. `node art.js <out folder>` writes one page per image; seed.py renders them with Chrome.
const fs = require("fs");
const path = require("path");

const INK = "#0a1344";

// The game screen in a 240x180 box. Each stage adds one step a developer would take.
function scene(stage)
{
    const out = [];
    const grey = (stage < 3);
    const line = (stage >= 8) ? `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"` : "";
    if (grey)
    {
        out.push(`<rect width="240" height="180" fill="#eef0f4"/>`);
        const grid = [];
        for (let x = 20; x < 240; x += 20)
            grid.push(`M${x} 0 V180`);
        for (let y = 20; y < 180; y += 20)
            grid.push(`M0 ${y} H240`);
        out.push(`<path d="${grid.join(" ")}" stroke="#d5d9e2" stroke-width="1.2"/>`);
        out.push(`<rect y="140" width="240" height="40" fill="#9aa1ad"/>`);
        if (stage >= 1)
            out.push(`<rect x="140" y="96" width="70" height="14" fill="#b3b9c3"/>`);
        if (stage >= 2)
        {
            out.push(`<rect x="52" y="108" width="26" height="32" rx="7" fill="#7d8592"/>`);
            out.push(`<circle cx="175" cy="76" r="8" fill="#c3c8d0"/>`);
            out.push(`<path d="M216 140 V92" stroke="#7d8592" stroke-width="3"/><rect x="216" y="92" width="16" height="11" fill="#b3b9c3"/>`);
        }

        return out.join("");
    }

    if (stage >= 7)
    {
        out.push(`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fb0ff"/><stop offset="1" stop-color="#c4e9ff"/></linearGradient></defs>`);
        out.push(`<rect width="240" height="180" fill="url(#sky)"/>`);
        out.push(`<g fill="#ffffff"><ellipse cx="46" cy="40" rx="22" ry="9"/><ellipse cx="60" cy="34" rx="14" ry="9"/><ellipse cx="160" cy="28" rx="18" ry="7"/><ellipse cx="172" cy="23" rx="11" ry="7"/></g>`);
    }
    else
        out.push(`<rect width="240" height="180" fill="#7cc8ff"/>`);

    if (stage >= 6)
        out.push(`<path d="M0 140 Q40 104 86 130 Q130 96 178 126 Q210 110 240 122 V140 H0 Z" fill="#82d98f"/>`);

    out.push(`<rect y="140" width="240" height="40" fill="#9b5b2c" ${line}/>`);
    if (stage >= 4)
        out.push(`<rect y="140" width="240" height="9" fill="#49b85a" ${line}/>`);

    out.push(`<rect x="140" y="96" width="70" height="14" fill="${(stage >= 4) ? "#9b5b2c" : "#b3b9c3"}" ${line}/>`);
    if (stage >= 4)
        out.push(`<rect x="140" y="96" width="70" height="5" fill="#49b85a" ${line}/>`);

    if (stage >= 9)
        out.push(`<g fill="#7a4420"><circle cx="30" cy="164" r="2.5"/><circle cx="96" cy="170" r="2"/><circle cx="150" cy="160" r="2.5"/><circle cx="204" cy="168" r="2"/></g>`);

    const colored = (stage >= 5);
    out.push(`<rect x="52" y="108" width="26" height="32" rx="7" fill="${(colored) ? "#ff4d5e" : "#7d8592"}" ${line}/>`);
    if (colored)
        out.push(`<rect x="62" y="114" width="12" height="9" rx="3" fill="#ffffff"/>`);
    if (stage >= 9)
        out.push(`<circle cx="70" cy="118.5" r="2.6" fill="${INK}"/><path d="M56 112 Q57 109 60 108.5" fill="none" stroke="#ffb3bb" stroke-width="2.5" stroke-linecap="round"/>`);

    out.push(`<circle cx="175" cy="76" r="8" fill="${(colored) ? "#ffcc00" : "#c3c8d0"}" ${line}/>`);
    if (stage >= 9)
        out.push(`<path d="M172 71 V80" stroke="#fff4b0" stroke-width="2.5" stroke-linecap="round"/>`);

    out.push(`<path d="M216 140 V92" stroke="${(stage >= 8) ? INK : (colored) ? "#ffffff" : "#7d8592"}" stroke-width="3"/>`);
    out.push(`<path d="M217.5 92 H234 L228 98 L234 104 H217.5 Z" fill="${(colored) ? "#ff4d5e" : "#b3b9c3"}" ${line}/>`);
    return out.join("");
}

// The copy's store screenshot: the final screen, identical, as an AI rebuild of the game looks.
function copy()
{
    return scene(9);
}

function page(body, w, h)
{
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}svg{display:block}</style></head><body>`
        + `<svg width="${w}" height="${h}" viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">${body}</svg></body></html>`;
}

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
for (let stage = 0; stage < 10; stage++)
    fs.writeFileSync(path.join(out, `level-${stage}.html`), page(scene(stage), 960, 720));
fs.writeFileSync(path.join(out, "copy.html"), page(copy(), 960, 720));
