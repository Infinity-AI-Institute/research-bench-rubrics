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

const SPLIT_IDS = ["researchbench-10", "researchbench-20", "researchbench-50", "researchbench-100"];

function renderStatTiles() {
  const el = document.getElementById("stat-tiles");
  if (!el) return;
  let papers = 0, tasks = 0;
  for (const coll of INDEX.collections) {
    for (const p of coll.papers) { papers += 1; tasks += p.stats.leaves; }
  }
  const v100 = INDEX.views.find((v) => v.id === "researchbench-100");
  const tiles = [
    { n: papers, label: "task graphs" },
    { n: tasks.toLocaleString(), label: "checkable tasks" },
    { n: SPLIT_IDS.length, label: "nested splits" },
    { n: v100 ? v100.keys.length + (v100.pending || []).length : "—", label: "papers in ResearchBench-100" },
  ];
  el.innerHTML = tiles.map((t) =>
    `<div class="tile"><span class="n">${t.n}</span><span class="l">${escapeHtml(String(t.label))}</span></div>`).join("");
}

function renderBundles() {
  const el = document.getElementById("bundle-row");
  if (!el) return;
  el.innerHTML = SPLIT_IDS.map((id) => {
    const v = INDEX.views.find((x) => x.id === id);
    const n = v ? v.keys.length : 0;
    return `<a class="bundle" href="data/bundles/${id}.zip" download>
      <span class="name">${escapeHtml(id.replace("researchbench-", "ResearchBench-"))}</span>
      <span class="meta">${n} graphs · .zip</span></a>`;
  }).join("");
}

function renderBaselines() {
  const tiles = document.getElementById("baseline-tiles");
  const tableEl = document.getElementById("baseline-table");
  const b = INDEX.baselines;
  if (!tiles || !b || !b.attempts) return;
  const head = b.headline || {};
  tiles.innerHTML = ["attempt2", "attempt3"].map((a) => {
    const label = a === "attempt2" ? "Attempt 2 · clean baseline" : "Attempt 3 · legibility patch";
    const h = head[a] || {};
    return `<div class="tile wide"><span class="l">${label}</span>
      <span class="pair"><span class="who claude">Claude Code</span><span class="n">${escapeHtml(h.claude || "—")}</span></span>
      <span class="pair"><span class="who codex">Codex</span><span class="n">${escapeHtml(h.codex || "—")}</span></span>
      <span class="l sub">implementable claims closed</span></div>`;
  }).join("");
  if (!tableEl || !b.papers) return;
  const rows = Object.entries(b.papers)
    .sort((x, y) => ((y[1].attempt3?.claude?.pct || 0) - (x[1].attempt3?.claude?.pct || 0)));
  const cell = (e) => e && e.pct != null
    ? `<td><span class="pctbar" style="--w:${Math.min(100, e.pct)}%"></span>${e.pct.toFixed(1)}% <span class="frac">${e.passed}/${e.total}</span></td>`
    : "<td>—</td>";
  tableEl.innerHTML = `<table class="baseline"><thead><tr>
      <th>Paper</th><th>Claude A2</th><th>Claude A3</th><th>Codex A2</th><th>Codex A3</th>
    </tr></thead><tbody>` + rows.map(([slug, e]) =>
      `<tr><td class="slug">${escapeHtml(slug.slice(0, 44))}</td>` +
      cell(e.attempt2 && e.attempt2.claude) + cell(e.attempt3 && e.attempt3.claude) +
      cell(e.attempt2 && e.attempt2.codex) + cell(e.attempt3 && e.attempt3.codex) +
      "</tr>").join("") + "</tbody></table>";
}

fetch("data/papers.json")
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((index) => {
    INDEX = index;
    setupViews();
    renderStatTiles();
    renderBundles();
    renderBaselines();
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
  const bits = [`${s.leaves} tasks`, `depth ${s.max_depth}`];
  if (s.estimated_dollars != null) bits.push(`~$${s.estimated_dollars} est.`);
  return `
    <div class="paper-card">
      <a class="stretch" href="paper.html?p=${encodeURIComponent(p.key)}" aria-label="Open task graph for ${escapeHtml(p.title)}"></a>
      <p class="title">${escapeHtml(p.title)}</p>
      <p class="meta"><span class="slug">${escapeHtml(p.slug)}</span> · ${bits.join(" · ")}</p>
      <a class="dl" href="data/rubrics/${encodeURIComponent(p.key)}.json" download="${escapeHtml(p.slug)}.rubric.json" title="Download task graph JSON">⤓ JSON</a>
      ${distBar(s.categories, s.leaves)}
    </div>`;
}

function pendingCard(p) {
  return `
    <div class="paper-card pending" aria-disabled="true" title="Task graph not generated yet">
      <p class="title">${escapeHtml(p.title || p.slug)}</p>
      <p class="meta"><span class="slug">${escapeHtml(p.slug)}</span> · ${escapeHtml(p.category || "uncategorized")} · task graph pending</p>
    </div>`;
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
  const pending = (view && view.pending || []).filter(
    (p) => !query || (p.title || p.slug).toLowerCase().includes(query) || p.slug.toLowerCase().includes(query),
  );
  if (pending.length) {
    sections.push(`
      <section class="collection">
        <h2>Task graphs pending <span class="count">· ${pending.length} paper${pending.length === 1 ? "" : "s"}</span></h2>
        <div class="paper-list">${pending.map(pendingCard).join("")}</div>
      </section>`);
  }
  root.innerHTML = sections.join("") || `<p class="empty">No papers match “${escapeHtml(query)}”.</p>`;
}
