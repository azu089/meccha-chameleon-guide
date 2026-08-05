#!/usr/bin/env node
/**
 * MecchaGuide Static Site Generator
 * 数据驱动：改 data/site.json → 运行 `node scripts/generate.js` → 输出 public/ 整站
 * 支持批量内页：pages 数组加一项，自动生成页面 + 更新 sitemap/首页
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "site.json"), "utf8"));
const OUT = path.join(ROOT, "public");

function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ---------- JSON-LD builders ----------
function siteLd() {
  return JSON.stringify({
    "@context": "https://schema.org", "@type": "WebSite",
    "name": DATA.site.name, "url": `https://${DATA.site.domain}/`,
    "description": DATA.site.description
  });
}
function articleLd(page) {
  return JSON.stringify({
    "@context": "https://schema.org", "@type": "Article",
    "headline": page.title, "description": page.metaDescription,
    "mainEntityOfPage": `https://${DATA.site.domain}/${page.slug}.html`,
    "datePublished": "2026-08-05", "dateModified": "2026-08-05",
    "publisher": { "@type": "Organization", "name": DATA.site.name }
  });
}
function faqLd(items) {
  return JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": items.map(([q, a]) => ({
      "@type": "Question", "name": q, "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  });
}

// ---------- HTML fragment builders ----------
function head(title, desc, extraLd, canonical) {
  const ld = [siteLd(), extraLd].filter(Boolean).join("\n");
  const gsc = DATA.site.gscVerification ? `<meta name="google-site-verification" content="${esc(DATA.site.gscVerification)}" />` : "";
  return `<!DOCTYPE html>
<html lang="${DATA.site.language}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${canonical === "index.html" ? `https://${DATA.site.domain}/` : `https://${DATA.site.domain}/${canonical}`}" />
${gsc}
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${canonical === "index.html" ? `https://${DATA.site.domain}/` : `https://${DATA.site.domain}/${canonical}`}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="stylesheet" href="/css/style.css" />
<script type="application/ld+json">${ld}</script>
${DATA.site.gaId ? `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(DATA.site.gaId)}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${esc(DATA.site.gaId)}');
</script>` : `<!-- TODO: 填入 GA4 ID (data/site.json -> site.gaId) -->`}
</head>
<body>
<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="/">${esc(DATA.site.name)}</a>
    <nav class="nav" aria-label="Main">
      <a href="/">Home</a>
      ${DATA.pages.map(p => `<a href="/${p.slug}.html">${esc(p.title)}</a>`).join("")}
    </nav>
  </div>
</header>
<main class="container">`;
}

function footer() {
  return `</main>
<footer class="site-footer">
  <div class="container">
    <p>${esc(DATA.site.name)} — ${esc(DATA.site.tagline)}</p>
    <p class="foot-links"><a href="/about.html">About</a> · <a href="/privacy.html">Privacy</a> · <a href="/contact.html">Contact</a></p>
    <p class="disclaimer">This is an unofficial fan site. ${esc(DATA.game.name)} and related assets are the property of their respective owners.</p>
    ${DATA.site.adsenseId ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(DATA.site.adsenseId)}" crossorigin="anonymous"></script>` : `<!-- TODO: 填入 AdSense ID (data/site.json -> site.adsenseId) -->`}
  </div>
</footer>
</body>
</html>`;
}

function renderSection(s) {
  switch (s.type) {
    case "steps": {
      const items = (s.items || []).map((it, i) => `<li><strong>Step ${i + 1}.</strong> ${esc(it)}</li>`).join("");
      return `<section class="card"><h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p><ol class="steps">${items}</ol></section>`;
    }
    case "list": {
      const items = (s.items || []).map(it => `<li>${esc(it)}</li>`).join("");
      return `<section class="card"><h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p><ul>${items}</ul></section>`;
    }
    case "faq": {
      const items = (s.items || []).map(([q, a]) => `<div class="faq-item"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join("");
      return `<section class="card"><h2>${esc(s.heading)}</h2>${items}</section>`;
    }
    case "table": {
      const headRow = (s.columns || []).map(c => `<th>${esc(c)}</th>`).join("");
      const rows = (s.rows || []).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
      return `<section class="card"><h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p><div class="table-wrap"><table><thead><tr>${headRow}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
    }
    default: {
      return `<section class="card"><h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p></section>`;
    }
  }
}

// ---------- Page renderers ----------
function renderHome() {
  const cards = DATA.pages.map(p => `
    <a class="guide-card" href="/${p.slug}.html">
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.metaDescription)}</p>
    </a>`).join("");

  const facts = DATA.game.keyFacts.map(f => `<li>${esc(f)}</li>`).join("");
  const faqItems = DATA.pages.find(p => p.slug === "faq")?.sections[0]?.items || [];
  const faqHtml = faqItems.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");

  const body = `
  <section class="hero">
    <h1>${esc(DATA.game.name)} Guides, Achievements & Tier Lists</h1>
    <p class="lead">${esc(DATA.game.tagline)}. Everything about ${esc(DATA.game.name)} in one place — updated daily.</p>
    <div class="facts">
      <ul>${facts}</ul>
    </div>
    <p class="meta-line"><strong>Release:</strong> ${esc(DATA.game.releaseDate)} · <strong>Platforms:</strong> ${esc(DATA.game.platforms.join(", "))} · <strong>Price:</strong> ${esc(DATA.game.price)}</p>
  </section>
  <section class="grid cards">
    ${cards}
  </section>
  <section class="card intro-card">
    <h2>About ${esc(DATA.game.name)}</h2>
    <p>${esc(DATA.game.intro)}</p>
  </section>
  ${faqHtml ? `<section class="card"><h2>Quick Answers</h2>${faqHtml}</section>` : ""}`;
  return head(`${DATA.game.name} Guides & Wiki`, DATA.site.description, null, "index.html") + body + footer();
}

function renderPage(p) {
  const sections = p.sections.map(renderSection).join("");
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://${DATA.site.domain}/` },
      { "@type": "ListItem", "position": 2, "name": p.title, "item": `https://${DATA.site.domain}/${p.slug}.html` }
    ]
  });
  const faq = p.sections.find(s => s.type === "faq");
  const ld = [articleLd(p), breadcrumbLd, faq ? faqLd(faq.items) : ""].join("\n");
  const related = DATA.pages.filter(x => x.slug !== p.slug).map(x => `<li><a href="/${x.slug}.html">${esc(x.title)}</a></li>`).join("");
  const body = `
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <span>${esc(p.title)}</span></nav>
  <article>
    <h1>${esc(p.title)}</h1>
    <p class="lead">${esc(p.metaDescription)}</p>
    <p>${esc(p.intro)}</p>
    ${sections}
  </article>
  <aside class="card related">
    <h2>More Guides</h2>
    <ul>${related}</ul>
  </aside>`;
  return head(p.metaTitle, p.metaDescription, ld, `${p.slug}.html`) + body + footer();
}

function renderStaticPage(title, contentHtml, slug) {
  const body = `<section class="card"><h1>${esc(title)}</h1>${contentHtml}</section>`;
  return head(`${title} — ${DATA.site.name}`, `${title} — ${DATA.site.name}`, articleLd({ title, metaDescription: `${title} — ${DATA.site.name}`, slug }), `${slug}.html`) + body + footer();
}

// ---------- Build ----------
fs.mkdirSync(path.join(OUT, "css"), { recursive: true });
// Clean stale output files (keep css dir)
for (const f of fs.readdirSync(OUT)) {
  const fp = path.join(OUT, f);
  if (fs.statSync(fp).isFile() && !f.startsWith(".")) {
    if (!(f === "css" || f === "style.css")) fs.unlinkSync(fp);
  }
}


// CSS
const css = fs.readFileSync(path.join(ROOT, "templates", "style.css"), "utf8");
fs.writeFileSync(path.join(OUT, "css", "style.css"), css);

// Home
fs.writeFileSync(path.join(OUT, "index.html"), renderHome());

// Inner pages
for (const p of DATA.pages) {
  fs.writeFileSync(path.join(OUT, `${p.slug}.html`), renderPage(p));
}

// Static utility pages
fs.writeFileSync(path.join(OUT, "about.html"), renderStaticPage("About", `<p>${esc(DATA.site.name)} is an unofficial fan guide for ${esc(DATA.game.name)}.</p>`, "about"));
fs.writeFileSync(path.join(OUT, "privacy.html"), renderStaticPage("Privacy Policy", `<p>We use Google Analytics to understand traffic. We do not sell personal data.</p>`, "privacy"));
fs.writeFileSync(path.join(OUT, "contact.html"), renderStaticPage("Contact", `<p>Reach us at contact@${esc(DATA.site.domain)}</p>`, "contact"));

// 404
fs.writeFileSync(path.join(OUT, "404.html"), `<!DOCTYPE html><html lang="${DATA.site.language}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 — ${esc(DATA.site.name)}</title><link rel="stylesheet" href="/css/style.css"></head><body><header class="site-header"><div class="container header-inner"><a class="logo" href="/">${esc(DATA.site.name)}</a></div></header><main class="container"><section class="card"><h1>404 — Page Not Found</h1><p><a href="/">Go back to the homepage</a></p></section></main></body></html>`);

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = [`https://${DATA.site.domain}/`, ...DATA.pages.map(p => `https://${DATA.site.domain}/${p.slug}.html`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>${u.endsWith("/") ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemap);

// robots.txt
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: https://${DATA.site.domain}/sitemap.xml\n`);

// ads.txt (AdSense placeholder)
fs.writeFileSync(path.join(OUT, "ads.txt"), `# AdSense - replace with your publisher ID, e.g.\n# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n`);

console.log(`✓ Generated ${1 + DATA.pages.length + 3} HTML pages + sitemap/robots/ads into public/`);
console.log(`  Home + ${DATA.pages.map(p => p.slug).join(", ")}`);
