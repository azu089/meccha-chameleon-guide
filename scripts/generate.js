#!/usr/bin/env node
/**
 * MecchaGuide Static Site Generator (Premium "Paint-to-Hide" theme)
 * 数据驱动：改 data/site.json → node scripts/generate.js → public/
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "site.json"), "utf8"));
const OUT = path.join(ROOT, "public");
const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const clean = slug => slug.replace(/\.html$/,"");
const urlOf = slug => `https://${DATA.site.domain}/${clean(slug) === "index" ? "" : clean(slug)}`;

/* ---------- JSON-LD ---------- */
const siteLd = () => JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:DATA.site.name,url:`https://${DATA.site.domain}/`,description:DATA.site.description});
const articleLd = p => JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:p.title,description:p.metaDescription,mainEntityOfPage:urlOf(p.slug),datePublished:"2026-08-05",dateModified:new Date().toISOString().slice(0,10),publisher:{"@type":"Organization",name:DATA.site.name}});
const faqLd = items => JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:items.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))});
const breadcrumbLd = p => JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`https://${DATA.site.domain}/`},{"@type":"ListItem",position:2,name:p.title,item:urlOf(p.slug)}]});

/* ---------- Card icon + accent per slug ---------- */
const CARD_META = {
  "how-to-play":        { icon:"🎨", ic:"ic-green" },
  "modes":              { icon:"🎮", ic:"ic-blue" },
  "maps":               { icon:"🗺️", ic:"ic-yellow" },
  "tips-and-tricks":    { icon:"💡", ic:"ic-coral" },
  "achievements":       { icon:"🏆", ic:"ic-purple" },
  "update-log":         { icon:"📜", ic:"ic-blue" },
  "system-requirements":{ icon:"🖥️", ic:"ic-green" },
  "codes":              { icon:"🔑", ic:"ic-yellow" },
  "faq":                { icon:"❓", ic:"ic-coral" },
};
const metaOf = slug => CARD_META[slug] || { icon:"🎯", ic:"ic-green" };

/* ---------- Layout fragments ---------- */
function head(title, desc, extraLd, slug){
  const ld = [siteLd(), extraLd].filter(Boolean).join("\n");
  const gsc = DATA.site.gscVerification ? `<meta name="google-site-verification" content="${esc(DATA.site.gscVerification)}" />` : "";
  const og = DATA.site.ogImage || "/images/hero.jpg";
  return `<!DOCTYPE html>
<html lang="${DATA.site.language}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${slug==="index" ? `https://${DATA.site.domain}/` : urlOf(slug)}" />
<meta name="theme-color" content="#0a0e14" />
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%230a0e14"/><text x="50" y="68" font-size="52" text-anchor="middle">🦎</text></svg>')}" />
${gsc}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(DATA.site.name)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${slug==="index" ? `https://${DATA.site.domain}/` : urlOf(slug)}" />
<meta property="og:image" content="https://${DATA.site.domain}${og}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/style.css" />
<script type="application/ld+json">${ld}</script>
${DATA.site.gaId ? `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(DATA.site.gaId)}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${esc(DATA.site.gaId)}');</script>` : ""}
</head>
<body>`;
}

function header(active){
  const links = DATA.pages.map(p => {
    const m = metaOf(p.slug);
    return `<a href="/${p.slug}" class="${p.slug===active?"active":""}">${m.icon} ${esc(p.title.replace(" Meccha Chameleon","").replace(" (None - Explained)",""))}</a>`;
  }).join("");
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="/"><span class="mark">🦎</span>${esc(DATA.site.name)}</a>
    <nav class="nav" aria-label="Main">${links}</nav>
  </div>
</header>`;
}

function footer(){
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-top">
      <div class="footer-brand"><span class="mark">🦎</span>${esc(DATA.site.name)}</div>
      <div class="footer-links">
        <a href="/about">About</a><a href="/privacy">Privacy</a><a href="/contact">Contact</a>
        <a href="${esc(DATA.game.steamUrl)}" target="_blank" rel="noopener">Steam ↗</a>
      </div>
    </div>
    <div class="footer-meta">
      <p>${esc(DATA.site.tagline)}</p>
      <p>Unofficial fan site — ${esc(DATA.game.name)} and related assets belong to their respective owners.</p>
      <p>Information checked against Wikipedia, the official Steam store page, IGN and Steam Community sources. Last updated ${new Date().toISOString().slice(0,10)}.</p>
    </div>
    ${DATA.site.adsenseId ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(DATA.site.adsenseId)}" crossorigin="anonymous"></script>` : ""}
  </div>
</footer>
<a class="back-top" href="#" aria-label="Back to top">↑</a>
</body></html>`;
}

/* ---------- Section renderers ---------- */
function renderSection(s){
  switch(s.type){
    case "steps": {
      const items = (s.items||[]).map((it,i)=>`<li><strong>${esc(it)}</strong></li>`).join("");
      return `<section class="card"><h2>${esc(s.heading)}</h2>${s.body?`<p>${esc(s.body)}</p>`:""}<ol class="steps">${items}</ol></section>`;
    }
    case "list": {
      const items = (s.items||[]).map(it=>`<li>${esc(it)}</li>`).join("");
      return `<section class="card"><h2>${esc(s.heading)}</h2>${s.body?`<p>${esc(s.body)}</p>`:""}<ul class="checks">${items}</ul></section>`;
    }
    case "table": {
      const headRow = (s.columns||[]).map(c=>`<th>${esc(c)}</th>`).join("");
      const rows = (s.rows||[]).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
      return `<section class="card"><h2>${esc(s.heading)}</h2>${s.body?`<p>${esc(s.body)}</p>`:""}<div class="tbl-wrap"><table><thead><tr>${headRow}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
    }
    case "faq": {
      const items = (s.items||[]).map(([q,a])=>`<details class="faq"><summary>${esc(q)}<span class="pm">+</span></summary><div class="faq-a">${esc(a)}</div></details>`).join("");
      return `<section class="card"><h2>${esc(s.heading)}</h2>${items}</section>`;
    }
    default: return "";
  }
}

/* ---------- Home ---------- */
function renderHome(){
  const cards = DATA.pages.map(p => {
    const m = metaOf(p.slug);
    return `<a class="guide-card" href="/${p.slug}">
      <span class="icon ${m.ic}">${m.icon}</span>
      <span class="arrow">→</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.metaDescription)}</p>
    </a>`;
  }).join("");
  const stats = (DATA.game.stats||[]).map(s=>`<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("");
  const faqItems = DATA.pages.find(p=>p.slug==="faq")?.sections[0]?.items || [];
  const faqHtml = faqItems.map(([q,a])=>`<details class="faq"><summary>${esc(q)}<span class="pm">+</span></summary><div class="faq-a">${esc(a)}</div></details>`).join("");
  const keyFacts = DATA.game.keyFacts.map(f=>`<li>${esc(f)}</li>`).join("");
  const body = `
  <main class="container">
    <section class="hero">
      <div class="hero-copy">
        <span class="badge"><span class="dot"></span> 2026's viral hide-and-seek hit · Guides updated regularly</span>
        <h1>${esc(DATA.game.name)} <span class="grad">Guides</span>, Modes, Maps &amp; Answers</h1>
        <p class="lead">${esc(DATA.site.tagline)}. Everything players actually search for — how to play, every mode and map, achievements &amp; codes clarification, and the full update log. One clean hub.</p>
        <div class="stats">${stats}</div>
        <div class="cta-row">
          <a class="btn btn-primary" href="/how-to-play">Start Playing →</a>
          <a class="btn btn-ghost" href="${esc(DATA.game.steamUrl)}" target="_blank" rel="noopener">Get it on Steam ↗</a>
        </div>
      </div>
      <div class="hero-media floating">
        <span class="blob g"></span><span class="blob b"></span>
        <div class="hero-img"><img src="/images/hero.jpg" alt="${esc(DATA.game.name)} key art — a chameleon painting itself to blend into a colorful wall" width="3136" height="1344" loading="eager" /></div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div><div class="kicker">Guides</div><h2>All ${esc(DATA.game.name)} Guides</h2></div>
        <p>Every page answers a real search — built from verified sources, not guesswork.</p>
      </div>
      <div class="guide-grid">${cards}</div>
    </section>

    ${faqHtml ? `<section class="section">
      <div class="section-head"><div><div class="kicker">Quick Answers</div><h2>Most-asked questions</h2></div><p>Tap a question to expand.</p></div>
      ${faqHtml}
    </section>` : ""}

    <section class="section">
      <div class="section-head"><div><div class="kicker">About</div><h2>The game behind the guides</h2></div></div>
      <div class="card">
        <p>${esc(DATA.game.intro)}</p>
        <ul class="checks" style="margin-top:14px">${keyFacts}</ul>
        <p style="margin-top:14px"><strong>Release:</strong> ${esc(DATA.game.releaseDate)} · <strong>Platforms:</strong> ${esc(DATA.game.platforms.join(", "))} · <strong>Price:</strong> ${esc(DATA.game.price)}</p>
      </div>
    </section>
  </main>`;
  return head(`${DATA.game.name} Guides & Wiki`, DATA.site.description, null, "index") + header("") + body + footer();
}

/* ---------- Inner page ---------- */
function renderPage(p){
  const m = metaOf(p.slug);
  const sections = p.sections.map(renderSection).join("");
  const faq = p.sections.find(s=>s.type==="faq");
  const ld = [articleLd(p), breadcrumbLd(p), faq?faqLd(faq.items):""].join("\n");
  const related = DATA.pages.filter(x=>x.slug!==p.slug).slice(0,6).map(x=>{
    const mm = metaOf(x.slug);
    return `<a href="/${x.slug}">${mm.icon} ${esc(x.title)}</a>`;
  }).join("");
  const hasSources = p.sections.some(s=>s.heading==="Sources");
  const body = `
  <main class="container">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span>›</span> <span>${esc(p.title)}</span></nav>
    <div class="article-grid">
      <article>
        <div class="page-hero">
          <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:10px">
            <span class="icon ${m.ic}" style="width:48px;height:48px;border-radius:13px;display:grid;place-items:center;font-size:24px">${m.icon}</span>
            <div>
              <h1>${esc(p.title)}</h1>
              <p class="lead">${esc(p.metaDescription)}</p>
            </div>
          </div>
          <p class="intro">${esc(p.intro)}</p>
        </div>
        ${sections}
        <div class="sources">
          <b>Sources & fact-checking</b>
          <ul>
            <li>Meccha Chameleon — Wikipedia (gameplay, modes, maps, sales)</li>
            <li>Official Steam store page (system requirements, price, platform)</li>
            ${p.slug==="update-log" ? "<li>IGN wiki patch notes · changelog.gg · Steam Community news</li>" : ""}
            ${p.slug==="achievements" || p.slug==="codes" ? "<li>isThereAnyDeal · SlashSkill (cheats/codes reality check)</li>" : ""}
          </ul>
        </div>
      </article>
      <aside class="related">
        <div class="card">
          <h2>More Guides</h2>
          <div style="display:grid;gap:8px;margin-top:10px">${related}</div>
        </div>
      </aside>
    </div>
  </main>`;
  return head(p.metaTitle, p.metaDescription, ld, p.slug) + header(p.slug) + body + footer();
}

/* ---------- Static pages ---------- */
function renderStatic(title, contentHtml, slug){
  const body = `<main class="container"><nav class="crumbs"><a href="/">Home</a> <span>›</span> <span>${esc(title)}</span></nav><article style="max-width:820px"><div class="page-hero"><h1>${esc(title)}</h1></div><div class="card">${contentHtml}</div></article></main>`;
  return head(`${title} — ${DATA.site.name}`, `${title} — ${DATA.site.name}`, articleLd({title,metaDescription:`${title} — ${DATA.site.name}`,slug}), slug) + header(slug) + body + footer();
}

/* ---------- Build ---------- */
fs.mkdirSync(path.join(OUT,"css"),{recursive:true});
fs.mkdirSync(path.join(OUT,"images"),{recursive:true});
for(const f of fs.readdirSync(OUT)){
  const fp=path.join(OUT,f);
  if(fs.statSync(fp).isFile() && !f.startsWith(".") && !["css","images"].includes(f)) fs.unlinkSync(fp);
}
fs.writeFileSync(path.join(OUT,"css","style.css"), fs.readFileSync(path.join(ROOT,"templates","style.css"),"utf8"));
// copy images
for(const img of fs.readdirSync(path.join(ROOT,"assets","images"))){
  fs.copyFileSync(path.join(ROOT,"assets","images",img), path.join(OUT,"images",img));
}
fs.writeFileSync(path.join(OUT,"index.html"), renderHome());
for(const p of DATA.pages) fs.writeFileSync(path.join(OUT,`${p.slug}.html`), renderPage(p));
fs.writeFileSync(path.join(OUT,"about.html"), renderStatic("About", `<p>${esc(DATA.site.name)} is an unofficial fan guide for ${esc(DATA.game.name)}.</p><p style="margin-top:10px">We research each question with 1-2 reliable sources (Wikipedia, the official Steam page, IGN, Steam Community) so you get accurate answers fast.</p>`, "about"));
fs.writeFileSync(path.join(OUT,"privacy.html"), renderStatic("Privacy Policy", `<p>We use Google Analytics to understand anonymous traffic. We do not sell personal data and do not require any account to browse the site.</p>`, "privacy"));
fs.writeFileSync(path.join(OUT,"contact.html"), renderStatic("Contact", `<p>Questions or corrections? Reach us at <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a>.</p>`, "contact"));
fs.writeFileSync(path.join(OUT,"404.html"), `<!DOCTYPE html><html lang="${DATA.site.language}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 — ${esc(DATA.site.name)}</title><link rel="stylesheet" href="/css/style.css"></head><body>${header("")}<main class="container" style="padding-top:80px;text-align:center"><section class="card" style="max-width:520px;margin:0 auto"><h1>404 — Page not found</h1><p style="margin-top:10px">The page you're looking for doesn't exist. Try the guides above.</p></section></main></body></html>`);
const today=new Date().toISOString().slice(0,10);
const urls=[`https://${DATA.site.domain}/`, ...DATA.pages.map(p=>urlOf(p.slug))];
fs.writeFileSync(path.join(OUT,"sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>${u.endsWith("/")?"1.0":"0.8"}</priority></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT,"robots.txt"), `User-agent: *\nAllow: /\nSitemap: https://${DATA.site.domain}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT,"ads.txt"), `# AdSense - replace with your publisher ID, e.g.\n# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n`);
console.log(`✓ Generated ${1+DATA.pages.length+3} pages + sitemap/robots/ads + images into public/`);
