#!/usr/bin/env node
/**
 * MecchaGuide Static Site Generator (Premium "Paint-to-Hide" theme, i18n)
 * 数据驱动 + 多语言：data/site.json → node scripts/generate.js → public/
 * 输出：en（默认，根路径）+ /zh/ + /ja/，hreflang + 语言切换器
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ROOT = path.join(__dirname, "..");
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "site.json"), "utf8"));
const OUT = path.join(ROOT, "public");
const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const clean = slug => String(slug).replace(/\.html$/,"");
const LANGS = DATA.site.languages || ["en"];
const DEF = DATA.site.defaultLanguage || "en";
const CSS_V = crypto.createHash("md5").update(fs.readFileSync(path.join(ROOT,"templates","style.css"),"utf8")).digest("hex").slice(0,8);
const urlOf = (slug, lang) => {
  const base = `https://${DATA.site.domain}`;
  const p = clean(slug);
  const pathPart = lang === DEF ? (p === "index" ? "/" : `/${p}`) : (p === "index" ? `/${lang}/` : `/${lang}/${p}`);
  return base + pathPart;
};

/* ---------- SVG icons ---------- */
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
  "how-to-play": { icon: "how-to-play", ic: "ic-green" }, "modes": { icon: "modes", ic: "ic-blue" },
  "maps": { icon: "maps", ic: "ic-yellow" }, "tips-and-tricks": { icon: "tips-and-tricks", ic: "ic-coral" },
  "achievements": { icon: "achievements", ic: "ic-purple" }, "update-log": { icon: "update-log", ic: "ic-blue" },
  "system-requirements": { icon: "system-requirements", ic: "ic-green" }, "codes": { icon: "codes", ic: "ic-yellow" },
  "faq": { icon: "faq", ic: "ic-coral" }
};
const metaOf = slug => CARD_META[slug] || { icon: "codes", ic: "ic-green" };

/* ---------- i18n helpers ---------- */
const siteI18n = lang => {
  const i = DATA.site.i18n || {};
  const s = i[lang] || {};
  return {
    name: s.name || DATA.site.name,
    tagline: s.tagline || DATA.site.tagline,
    description: s.description || DATA.site.description,
    navHome: s.navHome || "Home", navAbout: s.navAbout || "About", navPrivacy: s.navPrivacy || "Privacy", navContact: s.navContact || "Contact",
    aboutTitle: s.aboutTitle || "About", privacyTitle: s.privacyTitle || "Privacy Policy", contactTitle: s.contactTitle || "Contact",
    footerNote: s.footerNote || "Unofficial fan site — game and related assets belong to their respective owners.",
    footerSource: s.footerSource || "Information checked against Wikipedia, the official Steam store page, IGN and Steam Community sources.",
    quickAnswers: s.quickAnswers || "Most-asked questions", guides: s.guides || "All Guides", aboutGame: s.aboutGame || "About the game",
    startPlaying: s.startPlaying || "Start Playing →", getOnSteam: s.getOnSteam || "Get it on Steam ↗", readGuide: s.readGuide || "How to Play →", moreGuides: s.moreGuides || "More Guides",
    sources: s.sources || "Sources & fact-checking", langLabel: s.langLabel || "Language"
  };
};
const pageOf = (page, lang) => {
  if (lang === DEF || !page.i18n || !page.i18n[lang]) {
    return { title: page.title, metaTitle: page.metaTitle, metaDescription: page.metaDescription, intro: page.intro, sections: page.sections };
  }
  const t = page.i18n[lang];
  return { title: t.title || page.title, metaTitle: t.metaTitle || page.metaTitle, metaDescription: t.metaDescription || page.metaDescription, intro: t.intro || page.intro, sections: t.sections || page.sections };
};

/* ---------- JSON-LD ---------- */
const siteLd = lang => JSON.stringify({"@context":"https://schema.org","@type":"WebSite",name:siteI18n(lang).name,url:urlOf("index",lang),description:siteI18n(lang).description});
const articleLd = (p, lang) => JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:p.title,description:p.metaDescription,mainEntityOfPage:urlOf(p.slug,lang),datePublished:"2026-08-05",dateModified:new Date().toISOString().slice(0,10),inLanguage:lang,publisher:{"@type":"Organization",name:siteI18n(lang).name}});
const faqLd = items => JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:items.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))});
const breadcrumbLd = (p, lang) => JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:siteI18n(lang).navHome,item:`https://${DATA.site.domain}/${lang===DEF?"":lang+"/"}`},{"@type":"ListItem",position:2,name:p.title,item:urlOf(p.slug,lang)}]});

/* ---------- head / header / footer ---------- */
function hreflang(slug){
  return LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${urlOf(slug,l)}" />`).join("\n") +
    `<link rel="alternate" hreflang="x-default" href="${urlOf(slug,DEF)}" />`;
}
function head(title, desc, extraLd, slug, lang){
  const ld = [siteLd(lang), extraLd].filter(Boolean).join("\n");
  const gsc = DATA.site.gscVerification ? `<meta name="google-site-verification" content="${esc(DATA.site.gscVerification)}" />` : "";
  const og = DATA.site.ogImage || "/images/hero.jpg";
  const prefix = lang === DEF ? "" : `/${lang}`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${urlOf(slug,lang)}" />
${hreflang(slug)}
<meta name="theme-color" content="#0a0e14" />
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="%230a0e14"/><path d="M9 23c-2.5-1-4-3.5-4-6 0-3.5 2.5-7 7-7 2.8 0 5 1.5 5.5 3.5l3.5-1.5c.8-.4 1.7.4 1.2 1.2L20 15.5c.2.8.3 1.7.3 2.5 0 3-2.5 5-5.3 5H9z" fill="%233ddc84"/><circle cx="14" cy="14.5" r="1.6" fill="%230a0e14"/></svg>')}" />
${gsc}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(siteI18n(lang).name)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${urlOf(slug,lang)}" />
<meta property="og:image" content="https://${DATA.site.domain}${og}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/style.css?v=${CSS_V}" />
<link rel="preload" as="image" href="/images/hero.jpg" imagesrcset="/images/hero-640.jpg 640w, /images/hero-1280.jpg 1280w, /images/hero.jpg 3136w" imagesizes="(max-width: 900px) 92vw, 55vw" fetchpriority="high" />
<script type="application/ld+json">${ld}</script>
${DATA.site.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(DATA.site.gaId)}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${esc(DATA.site.gaId)}');</script>` : ""}
</head>
<body>`;
}
function langSwitcher(lang, slug){
  const flags = { en: "🇬🇧", zh: "🇨🇳", ja: "🇯🇵" };
  const names = { en: "English", zh: "中文", ja: "日本語" };
  const items = LANGS.map(l =>
    `<a href="${urlOf(slug,l)}" class="${l===lang?"active":""}"><span class="flag">${flags[l]||""}</span>${names[l]}</a>`
  ).join("");
  return `<details class="lang-dd" ${slug!=="index"?"":""}>
    <summary><span class="flag">${flags[lang]||"🌐"}</span>${names[lang]||lang}<span class="caret">▾</span></summary>
    <div class="dd-menu">${items}</div>
  </details>`;
}
function header(lang, active){
  const s = siteI18n(lang);
  const prefix = lang === DEF ? "" : `/${lang}`;
  const guideItems = DATA.pages.map(p => {
    const m = metaOf(p.slug);
    return `<a href="${prefix}/${p.slug}" class="${p.slug===active?"active":""}"><span class="nav-ic">${SVG[m.icon]}</span>${esc(pageOf(p,lang).title)}</a>`;
  }).join("");
  const guidesLabel = { en: "Guides", zh: "攻略", ja: "攻略" }[lang] || "Guides";
  const homeLabel = s.navHome;
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="${prefix}/"><span class="mark">🦎</span>${esc(s.name)}</a>
    <nav class="nav" aria-label="Main">
      <a href="${prefix}/" class="${active===""?"active":""}">${esc(homeLabel)}</a>
      <details class="dd">
        <summary>${esc(guidesLabel)} <span class="caret">▾</span></summary>
        <div class="dd-menu">${guideItems}</div>
      </details>
    </nav>
    ${langSwitcher(lang, active || "index")}
  </div>
</header>`;
}
function footer(lang){
  const s = siteI18n(lang);
  const prefix = lang === DEF ? "" : `/${lang}`;
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-top">
      <div class="footer-brand"><span class="mark">🦎</span>${esc(s.name)}</div>
      <div class="footer-links">
        <a href="${prefix}/about">${esc(s.navAbout)}</a><a href="${prefix}/privacy">${esc(s.navPrivacy)}</a><a href="${prefix}/contact">${esc(s.navContact)}</a>
        <a href="${esc(DATA.game.steamUrl)}" target="_blank" rel="noopener">Steam ↗</a>
      </div>
    </div>
    <div class="footer-meta">
      <p>${esc(s.tagline)}</p>
      <p>${esc(s.footerNote)}</p>
      <p>${esc(s.footerSource)} · ${new Date().toISOString().slice(0,10)}</p>
    </div>
    ${DATA.site.adsenseId ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(DATA.site.adsenseId)}" crossorigin="anonymous"></script>` : ""}
  </div>
<script>
// Close dropdowns on outside click / Escape
document.addEventListener('click', function(e){
  document.querySelectorAll('details.dd[open], details.lang-dd[open]').forEach(function(d){
    if (!d.contains(e.target)) d.removeAttribute('open');
  });
});
document.addEventListener('DOMContentLoaded', function(){
  var obs = new IntersectionObserver(function(es){
    es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); } });
  }, {threshold:.08});
  document.querySelectorAll('.section').forEach(function(el){ obs.observe(el); });
});
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') document.querySelectorAll('details[open]').forEach(function(d){ d.removeAttribute('open'); });
});
</script>
</footer>
<a class="back-top" href="#" aria-label="Top">${SVG.up}</a>
</body></html>`;
}

/* ---------- sections ---------- */
let SEC_IDX = 0;
function secId(heading){
  SEC_IDX += 1;
  return "sec-" + SEC_IDX;
}
function renderSection(s){
  const id = secId(s.heading);
  switch(s.type){
    case "steps": {
      const items = (s.items||[]).map(it=>`<li><strong>${esc(it)}</strong></li>`).join("");
      return `<section class="card" id="${id}"><h2>${esc(s.heading)}</h2>${s.body?`<p>${esc(s.body)}</p>`:""}<ol class="steps">${items}</ol></section>`;
    }
    case "list": {
      const items = (s.items||[]).map(it=>`<li>${esc(it)}</li>`).join("");
      return `<section class="card" id="${id}"><h2>${esc(s.heading)}</h2>${s.body?`<p>${esc(s.body)}</p>`:""}<ul class="checks">${items}</ul></section>`;
    }
    case "table": {
      const headRow = (s.columns||[]).map(c=>`<th>${esc(c)}</th>`).join("");
      const rows = (s.rows||[]).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
      return `<section class="card" id="${id}"><h2>${esc(s.heading)}</h2>${s.body?`<p>${esc(s.body)}</p>`:""}<div class="tbl-wrap"><table><thead><tr>${headRow}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
    }
    case "faq": {
      const items = (s.items||[]).map(([q,a])=>`<details class="faq"><summary>${esc(q)}<span class="pm">+</span></summary><div class="faq-a">${esc(a)}</div></details>`).join("");
      return `<section class="card" id="${id}"><h2>${esc(s.heading)}</h2>${items}</section>`;
    }
    default: return "";
  }
}

/* ---------- home ---------- */
function renderHome(lang){
  const s = siteI18n(lang);
  const prefix = lang === DEF ? "" : `/${lang}`;
  const cards = DATA.pages.map(p => {
    const m = metaOf(p.slug);
    const t = pageOf(p, lang);
    return `<a class="guide-card" href="${prefix}/${p.slug}">
      <span class="icon ${m.ic}">${SVG[m.icon]}</span><span class="arrow">→</span>
      <h3>${esc(t.title)}</h3><p>${esc(t.metaDescription)}</p>
    </a>`;
  }).join("");
  const statsArr = (DATA.game.statsI18n && DATA.game.statsI18n[lang]) || DATA.game.stats || [];
  const stats = statsArr.map(st=>`<div class="stat"><b>${esc(st.value)}</b><span>${esc(st.label)}</span></div>`).join("");
  const faqItems = (pageOf(DATA.pages.find(p=>p.slug==="faq"), lang).sections[0]?.items) || [];
  const faqHtml = faqItems.map(([q,a])=>`<details class="faq"><summary>${esc(q)}<span class="pm">+</span></summary><div class="faq-a">${esc(a)}</div></details>`).join("");
  const keyFactsArr = (DATA.game.keyFactsI18n && DATA.game.keyFactsI18n[lang]) || DATA.game.keyFacts || [];
  const keyFacts = keyFactsArr.map(f=>`<li>${esc(f)}</li>`).join("");
  const gintro = (DATA.game.introI18n && DATA.game.introI18n[lang]) || DATA.game.intro;
  const gname = (DATA.game.nameI18n && DATA.game.nameI18n[lang]) || DATA.game.name;
  const body = `
  <main class="container">
    <section class="hero">
      <div class="hero-copy">
        <span class="badge"><span class="dot"></span> ${lang==="zh"?"2026 年现象级捉迷藏派对游戏 · 持续更新":lang==="ja"?"2026年話題のかくれんぼパーティゲーム · 定期更新":"2026's viral hide-and-seek hit · Guides updated regularly"}</span>
        <h1>${esc(gname)} <span class="grad">${lang==="zh"?"攻略":lang==="ja"?"ガイド":"Guides"}</span>${lang==="zh"?"：模式、地图与答案":lang==="ja"?"：モード・マップ・Q&A":" &amp; Answers"}</h1>
        <p class="lead">${esc(s.tagline)}. ${lang==="zh"?"每页回答一个真实搜索问题，来源可查，持续更新。":lang==="ja"?"各ページが実際の検索に答えます。信頼できる情報源、定期的に更新。":s.description}</p>
        <div class="stats">${stats}</div>
        <div class="cta-row">
          <a class="btn btn-primary" href="${esc(DATA.game.steamUrl)}" target="_blank" rel="noopener">${esc(s.startPlaying)}</a>
          <a class="btn btn-ghost" href="${prefix}/how-to-play">${esc(s.readGuide || "How to Play →")}</a>
        </div>
      </div>
      <div class="hero-media floating">
        <span class="blob g"></span><span class="blob b"></span>
        <div class="hero-img"><img src="/images/hero.jpg" srcset="/images/hero-640.jpg 640w, /images/hero-1280.jpg 1280w, /images/hero.jpg 3136w" sizes="(max-width: 900px) 92vw, 55vw" width="3136" height="1344" alt="${esc(gname)} key art" loading="eager" /></div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><div><div class="kicker">${lang==="zh"?"攻略":lang==="ja"?"攻略":"Guides"}</div><h2>${esc(s.guides)}</h2></div><p>${lang==="zh"?"每一页都来自真实搜索需求，基于可靠来源。":lang==="ja"?"各ページは実際の検索ニーズに基づいています。":""}</p></div>
      <div class="guide-grid">${cards}</div>
    </section>
    ${faqHtml ? `<section class="section"><div class="section-head"><div><div class="kicker">${lang==="zh"?"问答":lang==="ja"?"Q&A":"FAQ"}</div><h2>${esc(s.quickAnswers)}</h2></div></div>${faqHtml}</section>` : ""}
    <section class="section">
      <div class="section-head"><div><div class="kicker">${lang==="zh"?"关于":lang==="ja"?"概要":"About"}</div><h2>${esc(s.aboutGame)}</h2></div></div>
      <div class="card"><p>${esc(gintro)}</p><ul class="checks" style="margin-top:14px">${keyFacts}</ul></div>
    </section>
  </main>`;
  return head(`${esc(gname)} ${lang==="zh"?"攻略站":lang==="ja"?"攻略ガイド":"Guides & Wiki"}`, s.description, null, "index", lang) + header(lang, "") + body + footer(lang);
}

/* ---------- page ---------- */
function renderPage(p, lang){
  SEC_IDX = 0;
  const t = pageOf(p, lang);
  const m = metaOf(p.slug);
  const s = siteI18n(lang);
  const prefix = lang === DEF ? "" : `/${lang}`;
  const sections = t.sections.map(renderSection).join("");
  const toc = t.sections.filter(x=>x.type!=="faq").map((x,i)=>`<a href="#sec-${i+1}">${esc(x.heading)}</a>`).join("");
  const faq = t.sections.find(x=>x.type==="faq");
  const ld = [articleLd(t, lang), breadcrumbLd(t, lang), faq?faqLd(faq.items):""].join("\n");
  const related = DATA.pages.filter(x=>x.slug!==p.slug).slice(0,6).map(x=>{
    const mm = metaOf(x.slug);
    return `<a href="${prefix}/${x.slug}"><span class="ri">${SVG[mm.icon]}</span>${esc(pageOf(x,lang).title)}</a>`;
  }).join("");
  const body = `
  <main class="container">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${prefix}/">${esc(s.navHome)}</a> <span>›</span> <span>${esc(t.title)}</span></nav>
    <div class="article-grid">
      <article>
        <div class="page-hero">
          ${p.image ? `<img class="page-img" src="${esc(p.image)}" srcset="${esc(p.image.replace('.jpg','-640.jpg'))} 640w, ${esc(p.image.replace('.jpg','-1280.jpg'))} 1280w, ${esc(p.image)} 3136w" sizes="(max-width: 640px) 92vw, 720px" width="3136" height="1344" alt="${esc(t.title)}" loading="lazy" />` : ""}
          <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:10px">
            <span class="icon ${m.ic}" style="width:48px;height:48px;border-radius:13px;display:grid;place-items:center">${SVG[m.icon]}</span>
            <div><h1>${esc(t.title)}</h1><p class="lead">${esc(t.metaDescription)}</p></div>
          </div>
          <p class="intro">${esc(t.intro)}</p>
        </div>
        ${sections}
        <div class="sources"><b>${esc(s.sources)}</b><ul><li>Meccha Chameleon — Wikipedia</li><li>Official Steam store page</li>${p.slug==="update-log"?"<li>IGN wiki · changelog.gg · Steam Community</li>":""}${p.slug==="achievements"||p.slug==="codes"?"<li>isThereAnyDeal · SlashSkill</li>":""}</ul></div>
      </article>
      <aside class="related">
        <div class="card"><h2>${lang==="zh"?"本页目录":lang==="ja"?"目次":"On this page"}</h2><div class="toc">${toc||"<span>"+(lang==="zh"?"无":"")+"</span>"}</div></div>
        <div class="card"><h2>${esc(s.moreGuides)}</h2><div class="related-list">${related}</div></div>
      </aside>
    </div>
  </main>`;
  return head(t.metaTitle, t.metaDescription, ld, p.slug, lang) + header(lang, p.slug) + body + footer(lang);
}

/* ---------- static ---------- */
function renderStatic(title, contentHtml, slug, lang){
  const s = siteI18n(lang);
  const prefix = lang === DEF ? "" : `/${lang}`;
  const body = `<main class="container"><nav class="crumbs"><a href="${prefix}/">${esc(s.navHome)}</a> <span>›</span> <span>${esc(title)}</span></nav><article style="max-width:820px"><div class="page-hero"><h1>${esc(title)}</h1></div><div class="card">${contentHtml}</div></article></main>`;
  return head(`${title} — ${s.name}`, `${title} — ${s.name}`, articleLd({title, metaDescription:`${title} — ${s.name}`, slug}, lang), slug, lang) + header(lang, slug) + body + footer(lang);
}

/* ---------- build ---------- */
fs.mkdirSync(path.join(OUT,"css"),{recursive:true});
fs.mkdirSync(path.join(OUT,"images"),{recursive:true});
for (const f of fs.readdirSync(OUT)) {
  const fp = path.join(OUT, f);
  if (fs.statSync(fp).isFile() && !f.startsWith(".") && !["css","images"].includes(f)) fs.unlinkSync(fp);
}
for (const lang of LANGS) if (lang !== DEF) fs.mkdirSync(path.join(OUT, lang), { recursive: true });
fs.writeFileSync(path.join(OUT,"css","style.css"), fs.readFileSync(path.join(ROOT,"templates","style.css"),"utf8"));
const SRC_IMG = path.join(ROOT,"assets","images");
if (fs.existsSync(SRC_IMG)) for (const img of fs.readdirSync(SRC_IMG)) fs.copyFileSync(path.join(SRC_IMG,img), path.join(OUT,"images",img));

for (const lang of LANGS) {
  const dir = lang === DEF ? OUT : path.join(OUT, lang);
  fs.writeFileSync(path.join(dir,"index.html"), renderHome(lang));
  for (const p of DATA.pages) fs.writeFileSync(path.join(dir, `${p.slug}.html`), renderPage(p, lang));
  fs.writeFileSync(path.join(dir,"about.html"), renderStatic(siteI18n(lang).aboutTitle, `<p>${esc(siteI18n(lang).name)} — ${esc(siteI18n(lang).footerNote)}</p><p style="margin-top:10px">${esc(siteI18n(lang).footerSource)}</p>`, "about", lang));
  fs.writeFileSync(path.join(dir,"privacy.html"), renderStatic(siteI18n(lang).privacyTitle, `<p>${lang==="zh"?"我们使用 Google Analytics 分析匿名流量，不出售个人数据。":lang==="ja"?"Google Analytics で匿名トラフィックを分析します。個人データは販売しません。":"We use Google Analytics to understand anonymous traffic. We do not sell personal data."}</p>`, "privacy", lang));
  fs.writeFileSync(path.join(dir,"contact.html"), renderStatic(siteI18n(lang).contactTitle, `<p>${lang==="zh"?"联系我们：":lang==="ja"?"お問い合わせ：":"Reach us at:"} <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a></p>`, "contact", lang));
}
// 404 (default lang)
fs.writeFileSync(path.join(OUT,"404.html"), `<!DOCTYPE html><html lang="${DEF}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404</title><link rel="stylesheet" href="/css/style.css"></head><body>${header(DEF,"")}<main class="container" style="padding-top:80px;text-align:center"><section class="card" style="max-width:520px;margin:0 auto"><h1>404</h1><p><a href="/">Home</a></p></section></main></body></html>`);

// sitemap
const today = new Date().toISOString().slice(0,10);
const urls = [];
for (const lang of LANGS) {
  urls.push(urlOf("index",lang));
  for (const p of DATA.pages) urls.push(urlOf(p.slug,lang));
}
fs.writeFileSync(path.join(OUT,"sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>${u.endsWith("/")?"1.0":"0.8"}</priority></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT,"robots.txt"), `User-agent: *\nAllow: /\nSitemap: https://${DATA.site.domain}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT,"ads.txt"), `# AdSense - replace with your publisher ID, e.g.\n# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n`);
console.log(`✓ Generated ${LANGS.length} locales x ${1+DATA.pages.length+3} pages + sitemap`);
