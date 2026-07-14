/* Shared category mapping. Slot order is the CVD-safe palette ordering —
   color follows the category everywhere on the site, never its rank. */

const CATEGORY_SLOTS = [
  "Environment & Infrastructure Setup",
  "Dataset and Model Acquisition",
  "Data Processing & Preparation",
  "Method Implementation",
  "Experimental Setup",
  "Evaluation, Metrics & Benchmarking",
  "Logging, Analysis & Presentation",
];

function categoryColor(category) {
  const idx = CATEGORY_SLOTS.indexOf(category);
  return `var(--cat-${idx === -1 ? 0 : idx + 1})`;
}

function buildLegend(el, extraLabel) {
  const items = CATEGORY_SLOTS.map(
    (c, i) =>
      `<span class="item"><span class="swatch" style="background:var(--cat-${i + 1})"></span>${c}</span>`,
  );
  if (extraLabel) {
    items.push(
      `<span class="item"><span class="swatch" style="background:var(--cat-0)"></span>${extraLabel}</span>`,
    );
  }
  el.innerHTML = items.join("");
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch],
  );
}
