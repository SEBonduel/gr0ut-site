/* ------------------------------------------------------------------ *
 *  GR0UT — site vitrine
 *  ⚙️  À PERSONNALISER : remplace par ton lien d'invitation Discord.
 * ------------------------------------------------------------------ */
const DISCORD_INVITE = "https://discord.gg/grout";
const API = "https://gr0ut-globalmap.sebastien050599.workers.dev/api/clans";

// --- Liens Discord ---
document.querySelectorAll("[data-discord]").forEach((a) => {
  a.href = DISCORD_INVITE;
  a.target = "_blank";
  a.rel = "noopener";
});

// --- Nav : état scrollé + burger ---
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
const burger = document.getElementById("burger");
const links = document.querySelector(".nav__links");
burger?.addEventListener("click", () => links.classList.toggle("open"));
links?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

// --- Reveal au scroll ---
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// --- Compteurs animés ---
function animateCount(el, target, suffix = "") {
  const dur = 1400, t0 = performance.now();
  const dec = target % 1 !== 0 ? 1 : 0;
  function frame(t) {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// --- Données live des 3 clans ---
const COLORS = { GR0UT: "#3ddc84", GR0VT: "#8b5cf6", GR0UF: "#38bdf8" };
const fmt = (n) => (n == null ? "—" : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "));

async function loadClans() {
  const grid = document.getElementById("clans-grid");
  try {
    const res = await fetch(API, { cache: "no-store" });
    const { clans } = await res.json();
    if (!clans || !clans.length) throw new Error("empty");

    grid.innerHTML = clans.map((c) => {
      const col = COLORS[c.tag] || c.color || "#3ddc84";
      return `
      <article class="clan glass reveal" style="--c:${col}">
        <img class="clan__emblem" src="${c.emblem}" alt="Emblème ${c.tag}" loading="lazy" />
        <div class="clan__tag">${c.tag}</div>
        <div class="clan__role">${c.role}</div>
        <div class="clan__name">${c.name || ""}</div>
        <div class="clan__stats">
          <div><b>${fmt(c.members)}</b><span>Membres</span></div>
          <div><b>${c.elo10 ?? "—"}</b><span>ELO T10</span></div>
          <div><b>${c.winrate != null ? c.winrate + "%" : "—"}</b><span>Victoires CG</span></div>
        </div>
      </article>`;
    }).join("");
    grid.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Stats globales
    const sum = (k) => clans.reduce((a, c) => a + (c[k] || 0), 0);
    const totals = [sum("members"), sum("battles"), clans.length];
    document.querySelectorAll("#stats-grid .stat__num").forEach((el, i) => {
      const val = totals[i];
      const io2 = new IntersectionObserver((ents) => ents.forEach((e) => {
        if (e.isIntersecting) { animateCount(el, val); io2.unobserve(el); }
      }), { threshold: 0.4 });
      io2.observe(el);
    });
  } catch (e) {
    // Fallback : le site reste beau même si l'API est indispo
    grid.innerHTML = [
      { t: "GR0UT", r: "Clan principal", c: "#3ddc84" },
      { t: "GR0VT", r: "Grout Elite", c: "#8b5cf6" },
      { t: "GR0UF", r: "Grout Family", c: "#38bdf8" },
    ].map((c) => `
      <article class="clan glass in" style="--c:${c.c}">
        <div class="clan__tag" style="margin-top:1rem">${c.t}</div>
        <div class="clan__role">${c.r}</div>
        <div class="clan__name">Communauté francophone WoT</div>
      </article>`).join("");
    document.querySelectorAll("#stats-grid .stat__num").forEach((el, i) => { el.textContent = ["—", "—", "3"][i]; });
  }
}
loadClans();

// --- Fond : réseau de particules ---
(function bgCanvas() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.getElementById("bg-canvas");
  const ctx = cv.getContext("2d");
  let w, h, pts, raf;
  const COUNT = window.innerWidth < 700 ? 34 : 70;
  function resize() {
    w = cv.width = window.innerWidth; h = cv.height = window.innerHeight;
    pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.strokeStyle = `rgba(61,220,132,${0.14 * (1 - d / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.fillStyle = "rgba(61,220,132,0.55)";
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }
  resize(); draw();
  let to;
  window.addEventListener("resize", () => { clearTimeout(to); to = setTimeout(resize, 200); });
})();
