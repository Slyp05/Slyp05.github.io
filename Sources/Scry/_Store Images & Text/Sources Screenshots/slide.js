// Shared setup for every slide: the cover's starfield behind it, and the crystal ball between script and Inspector.
sky(1920, 1280, 360, 11);
document.querySelectorAll(".through .orb, .ball .orb").forEach((element, i) => element.innerHTML = orb("t" + i));

// Once the captures are laid out: the beam meets the capture marked data-beam, and callouts reach their rows.
window.addEventListener("load", () => {
  alignBeam();
  placeCallouts();
});

// Shifts a column so the beam, level with the ball, crosses the middle of its capture marked data-beam.
function alignBeam() {
  document.querySelectorAll(".stage [data-beam]").forEach(target => {
    const column = target.closest(".col");
    const through = column.parentElement.querySelector(".through");
    const beam = through.getBoundingClientRect();
    const shot = target.getBoundingClientRect();
    column.style.transform = `translateY(${beam.top + beam.height / 2 - (shot.top + shot.height / 2)}px)`;
  });
}

// Each callout sits as close to level with its row as the others allow, in the order of the rows, and a line joins it
// to a dot on the capture's edge, level with the row.
function placeCallouts() {
  const stage = document.querySelector(".stage.callouts");
  if (stage === null)
    return;
  const gap = 26;
  const frame = stage.getBoundingClientRect();
  const shots = [...stage.querySelectorAll(".shot")];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("links");
  stage.appendChild(svg);

  stage.querySelectorAll(".side").forEach(side => {
    const left = side.classList.contains("left");
    const top = side.getBoundingClientRect().top;
    const items = [...side.querySelectorAll(".callout")].map(callout => {
      const shot = shots[Number(callout.dataset.shot || 0)];
      const bounds = shot.getBoundingClientRect();
      const y = bounds.top + Number(callout.dataset.y) * bounds.height / shot.naturalHeight - top;
      return { callout, y, x: (left ? bounds.left : bounds.right) - frame.left, height: callout.offsetHeight };
    }).sort((a, b) => a.y - b.y);

    // Centered on its row, pushed down past the one above, then up from the side's bottom if the last overflows.
    let next = 0;
    items.forEach(item => {
      item.top = Math.max(item.y - item.height / 2, next);
      next = item.top + item.height + gap;
    });
    let limit = side.offsetHeight;
    for (let i = items.length - 1; i >= 0; i--) {
      items[i].top = Math.min(items[i].top, limit - items[i].height);
      limit = items[i].top - gap;
    }

    items.forEach(item => {
      item.callout.style.top = item.top + "px";
      const box = item.callout.getBoundingClientRect();
      const x1 = (left ? box.right : box.left) - frame.left;
      const y1 = box.top + box.height / 2 - frame.top;
      const x2 = item.x;
      const y2 = item.y + top - frame.top;
      const middle = (x1 + x2) / 2;
      const path = document.createElementNS(svg.namespaceURI, "path");
      path.setAttribute("d", `M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${x2} ${y2}`);
      svg.appendChild(path);
      const dot = document.createElementNS(svg.namespaceURI, "circle");
      dot.setAttribute("cx", x2);
      dot.setAttribute("cy", y2);
      dot.setAttribute("r", 6.5);
      svg.appendChild(dot);
    });
  });
}
