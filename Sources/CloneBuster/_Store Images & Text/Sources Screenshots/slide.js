// Runs on every slide: shrinks a headline that is wider than its block, and draws each .stamp (data-r: radius,
// data-rot: angle) as the cover's timestamp, a clock face on a yellow disc.
(function ()
{
  for (const h1 of document.querySelectorAll("h1"))
  {
    let size = parseFloat(getComputedStyle(h1).fontSize);
    while ((h1.scrollWidth > h1.parentElement.clientWidth) && (size > 40))
      h1.style.fontSize = (size -= 2) + "px";
  }

  for (const el of document.querySelectorAll(".stamp"))
  {
    const r = parseFloat(el.dataset.r || "50");
    const rot = parseFloat(el.dataset.rot || "10");
    const ticks = [];
    for (let i = 0; i < 12; i++)
    {
      const a = i * Math.PI / 6;
      const r0 = r * 0.58, r1 = r * ((i % 3 === 0) ? 0.44 : 0.5);
      ticks.push(`M${(Math.cos(a) * r0).toFixed(2)} ${(Math.sin(a) * r0).toFixed(2)} L${(Math.cos(a) * r1).toFixed(2)} ${(Math.sin(a) * r1).toFixed(2)}`);
    }

    const size = r * 2 + r * 0.2;
    el.innerHTML = `<svg width="${size}" height="${size}" viewBox="${-size / 2} ${-size / 2} ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`
      + `<g transform="rotate(${rot})" stroke-linecap="round" stroke-linejoin="round">`
      + `<circle r="${r}" fill="#ffd400" stroke="#0a1344" stroke-width="${r * 0.09}"/>`
      + `<circle r="${r * 0.72}" fill="none" stroke="#0a1344" stroke-width="${r * 0.05}"/>`
      + `<path d="${ticks.join(" ")}" stroke="#0a1344" stroke-width="${r * 0.06}"/>`
      + `<path d="M0 0 L${-r * 0.24} ${-r * 0.2} M0 0 L${r * 0.3} ${-r * 0.3}" fill="none" stroke="#0a1344" stroke-width="${r * 0.09}"/>`
      + `<circle r="${r * 0.07}" fill="#0a1344"/></g></svg>`;
    el.style.marginLeft = el.style.marginTop = (-size / 2) + "px";
  }
})();
