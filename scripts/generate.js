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
const CSS_V = require("crypto").createHash("md5").update(fs.readFileSync(path.join(ROOT,"templates","style.css"),"utf8")).digest("hex").slice(0,8);
const clean = slug => slug.replace(/\.html$/,"");
const urlOf = slug => `https://${DATA.site.domain}/${clean(slug) === "index" ? "" : clean(slug)}`;

/* ---------- JSON-LD ---------- */
const siteLd = () => JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:DATA.site.name,url:`https://${DATA.site.domain}/`,description:DATA.site.description});
const articleLd = p => JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:p.title,description:p.metaDescription,mainEntityOfPage:urlOf(p.slug),datePublished:"2026-08-05",dateModified:new Date().toISOString().slice(0,10),publisher:{"@type":"Organization",name:DATA.site.name}});
const faqLd = items => JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:items.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))});
const breadcrumbLd = p => JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:`https://${DATA.site.domain}/`},{"@type":"ListItem",position:2,name:p.title,item:urlOf(p.slug)}]});

/* ---------- SVG icons (Heroicons outline style) per slug ---------- */
const SVG = {
  logo: '<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ddc84"/><stop offset=".5" stop-color="#4cc9f0"/><stop offset="1" stop-color="#b48cff"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#lg)"/><path d="M9 23c-2.5-1-4-3.5-4-6 0-3.5 2.5-7 7-7 2.8 0 5 1.5 5.5 3.5l3.5-1.5c.8-.4 1.7.4 1.2 1.2L20 15.5c.2.8.3 1.7.3 2.5 0 3-2.5 5-5.3 5H9z" fill="#0a0e14" opacity=".92"/><circle cx="14" cy="14.5" r="1.6" fill="#3ddc84"/><circle cx="23" cy="9" r="2.2" fill="#ffd166"/><circle cx="26.5" cy="15" r="1.6" fill="#ff6b6b"/></svg>',
  "how-to-play": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"/></svg>',
  "modes": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>',
  "maps": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/></svg>',
  "tips-and-tricks": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>',
  "achievements": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/></svg>',
  "update-log": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>',
  "system-requirements": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"/></svg>',
  "codes": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/></svg>',
  "faq": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>',
  "up": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>'
};
const CARD_META = {
  "how-to-play":        { icon: "how-to-play",        ic: "ic-green" },
  "modes":              { icon: "modes",              ic: "ic-blue" },
  "maps":               { icon: "maps",               ic: "ic-yellow" },
  "tips-and-tricks":    { icon: "tips-and-tricks",    ic: "ic-coral" },
  "achievements":       { icon: "achievements",       ic: "ic-purple" },
  "update-log":         { icon: "update-log",         ic: "ic-blue" },
  "system-requirements":{ icon: "system-requirements",ic: "ic-green" },
  "codes":              { icon: "codes",              ic: "ic-yellow" },
  "faq":                { icon: "faq",                ic: "ic-coral" },
};
const metaOf = slug => CARD_META[slug] || { icon:"codes", ic:"ic-green" };

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
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="%230a0e14"/><path d="M9 23c-2.5-1-4-3.5-4-6 0-3.5 2.5-7 7-7 2.8 0 5 1.5 5.5 3.5l3.5-1.5c.8-.4 1.7.4 1.2 1.2L20 15.5c.2.8.3 1.7.3 2.5 0 3-2.5 5-5.3 5H9z" fill="%233ddc84"/><circle cx="14" cy="14.5" r="1.6" fill="%230a0e14"/></svg>')}" />
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
<link rel="stylesheet" href="/css/style.css?v=${CSS_V}" />
<link rel="preload" as="image" href="/images/hero.jpg" imagesrcset="/images/hero-640.jpg 640w, /images/hero-1280.jpg 1280w, /images/hero.jpg 3136w" imagesizes="(max-width: 900px) 92vw, 55vw" fetchpriority="high" />
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
    return `<a href="/${p.slug}" class="${p.slug===active?"active":""}"><span class="nav-ic">${SVG[m.icon]}</span>${esc(p.title.replace(" Meccha Chameleon","").replace(" (None - Explained)",""))}</a>`;
  }).join("");
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="/"><span class="mark">${SVG.logo}</span>${esc(DATA.site.name)}</a>
    <nav class="nav" aria-label="Main">${links}</nav>
  </div>
</header>`;
}

function footer(){
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-top">
      <div class="footer-brand"><span class="mark">${SVG.logo}</span>${esc(DATA.site.name)}</div>
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
<a class="back-top" href="#" aria-label="Back to top">${SVG.up}</a>
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
      <span class="icon ${m.ic}">${SVG[m.icon]}</span>
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
        <div class="hero-img"><img src="/images/hero.jpg" srcset="/images/hero-640.jpg 640w, /images/hero-1280.jpg 1280w, /images/hero.jpg 3136w" sizes="(max-width: 900px) 92vw, 55vw" width="3136" height="1344" alt="${esc(DATA.game.name)} key art — a chameleon painting itself to blend into a colorful wall" loading="eager" /></div>
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
            <span class="icon ${m.ic}" style="width:48px;height:48px;border-radius:13px;display:grid;place-items:center">${SVG[m.icon]}</span>
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
