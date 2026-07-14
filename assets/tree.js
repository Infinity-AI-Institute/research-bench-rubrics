/* Collapsible rubric dependency tree.
   Nodes are chips colored by finegrained task category (accent bar);
   click a chip for the full description, click ± to expand/collapse. */

const CHIP_W = 232;
const CHIP_H = 26;
const ROW_H = 36;
const COL_W = 320;
const LABEL_CHARS = 30;
const INITIAL_DEPTH = 2; // nodes shallower than this start expanded

const params = new URLSearchParams(location.search);
const paperKey = params.get("p");

const viz = document.getElementById("viz");
const tooltip = document.getElementById("tooltip");
const overlay = document.getElementById("overlay");
const detail = document.getElementById("detail");

buildLegend(document.getElementById("legend"), "Group / uncategorized");

Promise.all([
  fetch("data/papers.json").then((r) => r.json()),
  fetch(`data/rubrics/${encodeURIComponent(paperKey || "")}.json`).then((r) => {
    if (!r.ok) throw new Error(`rubric not found (HTTP ${r.status})`);
    return r.json();
  }),
])
  .then(([index, rubric]) => {
    let paper = null;
    let collection = null;
    for (const coll of index.collections) {
      const hit = coll.papers.find((p) => p.key === paperKey);
      if (hit) {
        paper = hit;
        collection = coll;
        break;
      }
    }
    const title = paper ? paper.title : paperKey;
    document.title = `${title} — Research Bench`;
    document.getElementById("title").textContent = title;
    if (paper) {
      const s = paper.stats;
      const bits = [
        collection.label,
        paper.slug,
        `${s.leaves} leaves`,
        `depth ${s.max_depth}`,
      ];
      if (s.estimated_dollars != null) {
        bits.push(`~${s.estimated_minutes} min / $${s.estimated_dollars} estimated`);
      }
      document.getElementById("meta").textContent = bits.join(" · ");
    }
    drawTree(rubric);
  })
  .catch((err) => {
    document.getElementById("title").textContent = "Could not load rubric";
    document.getElementById("meta").textContent = String(err.message || err);
  });

function truncate(s, n) {
  s = (s || "").trim();
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function nodeCategory(d) {
  return d.data.finegrained_task_category || null;
}

function drawTree(rubric) {
  const root = d3.hierarchy(rubric, (d) => d.sub_tasks);
  root.each((d) => {
    d._leafCount = d.leaves().length;
  });
  root.each((d) => {
    if (d.depth >= INITIAL_DEPTH && d.children) {
      d._children = d.children;
      d.children = null;
    }
  });

  const svg = d3
    .select(viz)
    .append("svg")
    .attr("role", "img")
    .attr("aria-label", "rubric dependency tree");
  const g = svg.append("g");
  const gLinks = g.append("g");
  const gNodes = g.append("g");

  const zoom = d3
    .zoom()
    .scaleExtent([0.05, 2.5])
    .on("zoom", (ev) => g.attr("transform", ev.transform));
  svg.call(zoom).on("dblclick.zoom", null);

  const layout = d3.tree().nodeSize([ROW_H, COL_W]);
  const diagonal = d3
    .linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);

  root.x0 = 0;
  root.y0 = 0;

  function update(source) {
    layout(root);
    const nodes = root.descendants();
    const links = root.links();
    const dur = nodes.length > 800 ? 0 : 220;

    const node = gNodes.selectAll("g.node").data(nodes, (d) => d.data.id);

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", `translate(${source.y0},${source.x0})`)
      .attr("opacity", 0);

    nodeEnter
      .append("rect")
      .attr("class", "chip")
      .attr("x", 0)
      .attr("y", -CHIP_H / 2)
      .attr("width", CHIP_W)
      .attr("height", CHIP_H)
      .attr("rx", 7)
      .style("cursor", "pointer")
      .on("click", (ev, d) => openDetail(d))
      .on("mousemove", (ev, d) => showTooltip(ev, d))
      .on("mouseleave", hideTooltip);

    nodeEnter
      .append("rect")
      .attr("class", "accent")
      .attr("x", 4)
      .attr("y", -CHIP_H / 2 + 4)
      .attr("width", 4)
      .attr("height", CHIP_H - 8)
      .attr("rx", 2)
      .style("pointer-events", "none")
      .style("fill", (d) => categoryColor(nodeCategory(d)));

    nodeEnter
      .append("text")
      .attr("x", 14)
      .attr("dy", "0.32em")
      .text((d) => {
        const hasKids = d.data.sub_tasks && d.data.sub_tasks.length;
        return truncate(d.data.requirements, hasKids ? LABEL_CHARS - 6 : LABEL_CHARS);
      });

    const toggle = nodeEnter
      .filter((d) => d.children || d._children)
      .append("g")
      .attr("class", "toggle")
      .attr("transform", `translate(${CHIP_W + 13},0)`)
      .style("cursor", "pointer")
      .on("click", (ev, d) => {
        ev.stopPropagation();
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        hideTooltip();
        update(d);
      });
    toggle.append("circle").attr("r", 8.5);
    toggle.append("text").attr("dy", "0.34em");
    toggle
      .append("title")
      .text((d) => `${d._leafCount} leaf task${d._leafCount === 1 ? "" : "s"} inside`);

    nodeEnter
      .filter((d) => d.children || d._children)
      .append("text")
      .attr("class", "count")
      .attr("x", CHIP_W - 8)
      .attr("dy", "0.32em")
      .attr("text-anchor", "end")
      .style("pointer-events", "none")
      .text((d) => d._leafCount);

    const nodeMerge = node.merge(nodeEnter);
    nodeMerge
      .transition()
      .duration(dur)
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .attr("opacity", 1);
    nodeMerge.select(".toggle text").text((d) => (d.children ? "−" : "+"));

    node
      .exit()
      .transition()
      .duration(dur)
      .attr("transform", `translate(${source.y},${source.x})`)
      .attr("opacity", 0)
      .remove();

    const link = gLinks.selectAll("path.link").data(links, (d) => d.target.data.id);
    link
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", () => {
        const o = { x: source.x0, y: source.y0 + CHIP_W };
        return diagonal({ source: o, target: o });
      })
      .merge(link)
      .transition()
      .duration(dur)
      .attr("d", (d) =>
        diagonal({
          source: { x: d.source.x, y: d.source.y + CHIP_W + 22 },
          target: { x: d.target.x, y: d.target.y },
        }),
      );
    link
      .exit()
      .transition()
      .duration(dur)
      .attr("d", () => {
        const o = { x: source.x, y: source.y + CHIP_W };
        return diagonal({ source: o, target: o });
      })
      .remove();

    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  function fit() {
    const nodes = root.descendants();
    const x0 = d3.min(nodes, (d) => d.x) - ROW_H;
    const x1 = d3.max(nodes, (d) => d.x) + ROW_H;
    const y0 = d3.min(nodes, (d) => d.y) - 20;
    const y1 = d3.max(nodes, (d) => d.y) + CHIP_W + 60;
    const { width, height } = viz.getBoundingClientRect();
    let scale = Math.min(2, 0.95 * Math.min(width / (y1 - y0), height / (x1 - x0)));
    let tx, ty;
    if (scale < 0.25) {
      // fitting the whole tree would be an unreadable sliver — anchor the top
      // of the tree at a still-legible zoom and let the user pan down
      scale = 0.25;
      tx = 24 - scale * y0;
      ty = 24 - scale * x0;
    } else {
      tx = (width - scale * (y0 + y1)) / 2;
      ty = (height - scale * (x0 + x1)) / 2;
    }
    svg
      .transition()
      .duration(300)
      .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }

  document.getElementById("expand-all").addEventListener("click", () => {
    root.each((d) => {
      if (d._children) {
        d.children = d._children;
        d._children = null;
      }
    });
    update(root);
    fit();
  });
  document.getElementById("collapse-all").addEventListener("click", () => {
    root.each((d) => {
      if (d.depth >= 1 && d.children) {
        d._children = d.children;
        d.children = null;
      }
    });
    update(root);
    fit();
  });
  document.getElementById("fit").addEventListener("click", fit);

  update(root);
  fit();
}

/* ---------- tooltip ---------- */

function showTooltip(ev, d) {
  const cat = nodeCategory(d);
  tooltip.innerHTML =
    escapeHtml(d.data.requirements || "") +
    (cat
      ? `<div class="cat"><span class="swatch" style="display:inline-block;width:9px;height:9px;border-radius:3px;background:${categoryColor(cat)};margin-right:5px"></span>${escapeHtml(cat)}</div>`
      : `<div class="cat">${d._leafCount} leaf task${d._leafCount === 1 ? "" : "s"} — click for details</div>`);
  tooltip.style.display = "block";
  const pad = 14;
  const rect = tooltip.getBoundingClientRect();
  let x = ev.clientX + pad;
  let y = ev.clientY + pad;
  if (x + rect.width > innerWidth - 8) x = ev.clientX - rect.width - pad;
  if (y + rect.height > innerHeight - 8) y = ev.clientY - rect.height - pad;
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}

function hideTooltip() {
  tooltip.style.display = "none";
}

/* ---------- detail popup ---------- */

function formatValue(v) {
  if (Array.isArray(v)) return v.map(formatValue).join(", ");
  if (v && typeof v === "object") return JSON.stringify(v, null, 1);
  return String(v);
}

function openDetail(d) {
  hideTooltip();
  const data = d.data;
  const cat = nodeCategory(d);

  const crumbs = d
    .ancestors()
    .reverse()
    .slice(0, -1)
    .map((a) => escapeHtml(truncate(a.data.requirements, 46)))
    .join('<span class="sep">›</span>');

  const badges = [];
  if (data.task_category) badges.push(badge(data.task_category));
  if (cat) badges.push(badge(cat, categoryColor(cat)));
  if (!d.data.sub_tasks || !d.data.sub_tasks.length) {
    badges.push(badge("leaf"));
  } else {
    badges.push(badge(`${d._leafCount} leaf tasks`));
  }
  if (data.weight != null && data.weight !== 1) badges.push(badge(`weight ${data.weight}`));

  const rows = [];
  const verification = data.verification;
  if (verification && (verification.spec || verification.type)) {
    rows.push([
      `Verification${verification.type ? ` — ${escapeHtml(verification.type)}` : ""}`,
      escapeHtml(verification.spec || ""),
    ]);
    if (verification.paper_cite) rows.push(["Paper citation", escapeHtml(verification.paper_cite)]);
  }
  const pre = data.preconditions;
  if (pre && Object.keys(pre).length) {
    const lines = Object.entries(pre)
      .filter(([, v]) => v != null && v !== false && !(Array.isArray(v) && !v.length))
      .map(([k, v]) => `${k}: ${formatValue(v)}`);
    if (lines.length) rows.push(["Preconditions", escapeHtml(lines.join("\n")), "mono"]);
  }
  if (data.paper_value != null) {
    let target = formatValue(data.paper_value);
    if (data.paper_unit) target += ` ${data.paper_unit}`;
    if (data.tolerance != null) target += `  (tolerance: ${formatValue(data.tolerance)})`;
    rows.push(["Paper-reported value", escapeHtml(target)]);
  }
  if (data.estimated_minutes != null || data.estimated_dollars != null) {
    const est = [];
    if (data.estimated_minutes != null) est.push(`${data.estimated_minutes} min`);
    if (data.estimated_dollars != null) est.push(`$${data.estimated_dollars}`);
    rows.push(["Estimated effort", escapeHtml(est.join(" · "))]);
  }
  rows.push(["Node id", escapeHtml(data.id || ""), "mono"]);

  detail.innerHTML = `
    <button class="close" type="button" aria-label="Close">✕ close</button>
    ${crumbs ? `<div class="crumbs">${crumbs}</div>` : ""}
    <h2 id="detail-title">${escapeHtml(data.requirements || "")}</h2>
    <div class="badges">${badges.join("")}</div>
    <dl>${rows
      .map(
        ([label, value, cls]) =>
          `<dt>${label}</dt><dd${cls ? ` class="${cls}"` : ""}>${value}</dd>`,
      )
      .join("")}</dl>`;

  detail.querySelector(".close").addEventListener("click", closeDetail);
  overlay.classList.add("open");
}

function badge(label, swatchColor) {
  return `<span class="badge">${
    swatchColor ? `<span class="swatch" style="background:${swatchColor}"></span>` : ""
  }${escapeHtml(label)}</span>`;
}

function closeDetail() {
  overlay.classList.remove("open");
}

overlay.addEventListener("click", (ev) => {
  if (ev.target === overlay) closeDetail();
});
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") closeDetail();
});
