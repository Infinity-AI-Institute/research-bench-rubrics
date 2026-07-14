buildLegend(document.getElementById("legend"), "Uncategorized");

let INDEX = null;

function currentView() {
  if (!INDEX || !INDEX.views || !INDEX.views.length) return null;
  const sel = document.getElementById("view");
  return INDEX.views.find((v) => v.id === sel.value) || INDEX.views[0];
}

function setupViews() {
  const sel = document.getElementById("view");
  if (!INDEX.views || !INDEX.views.length) {
    sel.style.display = "none";
    return;
  }
  sel.innerHTML = INDEX.views
    .map(
      (v) =>
        `<option value="${escapeHtml(v.id)}">${escapeHtml(v.label)} (${v.keys.length})</option>`,
    )
    .join("");
  const fromUrl = new URLSearchParams(location.search).get("view");
  if (fromUrl && INDEX.views.some((v) => v.id === fromUrl)) sel.value = fromUrl;
  sel.addEventListener("change", () => {
    const url = new URL(location.href);
    url.searchParams.set("view", sel.value);
    history.replaceState(null, "", url);
    rerender();
  });
}

function rerender() {
  render(document.getElementById("search").value.trim().toLowerCase());
}

fetch("data/papers.json")
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((index) => {
    INDEX = index;
    setupViews();
    rerender();
  })
  .catch((err) => {
    document.getElementById("collections").innerHTML =
      `<p class="empty">Could not load data/papers.json (${escapeHtml(err.message)}). ` +
      `Run <code>python3 pipeline/scripts/build_site_data.py</code> and serve the docs/ folder over HTTP.</p>`;
  });

document.getElementById("search").addEventListener("input", rerender);

function distBar(categories, leaves) {
  const parts = [];
  for (let i = 0; i < CATEGORY_SLOTS.length; i++) {
    const n = categories[CATEGORY_SLOTS[i]] || 0;
    if (n > 0) {
      parts.push(
        `<span style="flex:${n};background:var(--cat-${i + 1})" title="${escapeHtml(CATEGORY_SLOTS[i])}: ${n}"></span>`,
      );
    }
  }
  const known = CATEGORY_SLOTS.reduce((s, c) => s + (categories[c] || 0), 0);
  const other = leaves - known;
  if (other > 0) {
    parts.push(`<span style="flex:${other};background:var(--cat-0)" title="Uncategorized: ${other}"></span>`);
  }
  return `<div class="dist" role="img" aria-label="leaf category distribution">${parts.join("")}</div>`;
}

function paperCard(p) {
  const s = p.stats;
  const bits = [`${s.leaves} leaves`, `depth ${s.max_depth}`];
  if (s.estimated_dollars != null) bits.push(`~$${s.estimated_dollars} est.`);
  return `
    <a class="paper-card" href="paper.html?p=${encodeURIComponent(p.key)}">
      <p class="title">${escapeHtml(p.title)}</p>
      <p class="meta"><span class="slug">${escapeHtml(p.slug)}</span> · ${bits.join(" · ")}</p>
      ${distBar(s.categories, s.leaves)}
    </a>`;
}

function render(query) {
  const root = document.getElementById("collections");
  if (!INDEX) return;
  const view = currentView();
  const viewKeys = view ? new Set(view.keys) : null;
  const sections = [];
  for (const coll of INDEX.collections) {
    const papers = coll.papers.filter(
      (p) =>
        (!viewKeys || viewKeys.has(p.key)) &&
        (!query ||
          p.title.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query)),
    );
    if (!papers.length) continue;
    sections.push(`
      <section class="collection">
        <h2>${escapeHtml(coll.label)} <span class="count">· ${papers.length} paper${papers.length === 1 ? "" : "s"}</span></h2>
        <div class="paper-list">${papers.map(paperCard).join("")}</div>
      </section>`);
  }
  root.innerHTML = sections.join("") || `<p class="empty">No papers match “${escapeHtml(query)}”.</p>`;
}
