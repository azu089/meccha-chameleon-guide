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
  "where-to-buy": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>',
  "how-long-to-beat": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  "up": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>'
};
const CARD_META = {
  "how-to-play": { icon: "how-to-play", ic: "ic-green" }, "modes": { icon: "modes", ic: "ic-blue" },
  "maps": { icon: "maps", ic: "ic-yellow" }, "tips-and-tricks": { icon: "tips-and-tricks", ic: "ic-coral" },
  "achievements": { icon: "achievements", ic: "ic-purple" }, "update-log": { icon: "update-log", ic: "ic-blue" },
  "system-requirements": { icon: "system-requirements", ic: "ic-green" }, "codes": { icon: "codes", ic: "ic-yellow" },
  "faq": { icon: "faq", ic: "ic-coral" },
  "where-to-buy": { icon: "where-to-buy", ic: "ic-blue" },
  "how-long-to-beat": { icon: "how-long-to-beat", ic: "ic-yellow" }
};
const metaOf = slug => CARD_META[slug] || { icon: "codes", ic: "ic-green" };

/* ---------- i18n helpers ---------- */
const T4 = (lang, zhCN, zhTW, ja, ko, es, en) =>
  lang === "ko" ? ko : (lang === "es" ? es : (lang === "zh-TW" ? zhTW : (lang === "zh-CN" ? zhCN : (lang === "ja" ? ja : en))));
const T3 = (lang, zh, ja, en) => (lang.startsWith("zh") ? zh : (lang === "ja" ? ja : en));

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
    startPlaying: s.startPlaying || "Get it on Steam", getOnSteam: s.getOnSteam || "Get it on Steam ↗", readGuide: s.readGuide || "How to Play →", moreGuides: s.moreGuides || "More Guides",
    sources: s.sources || "Sources & fact-checking", langLabel: s.langLabel || "Language"
  };
};
const pageOf = (page, lang) => {
  if (lang === DEF || !page.i18n || !page.i18n[lang]) {
    return { title: page.title, metaTitle: page.metaTitle, metaDescription: page.metaDescription, intro: page.intro, sections: page.sections };
  }
  const t = page.i18n[lang];
  return { title: t.title || page.title, metaTitle: t.metaTitle || page.metaTitle, metaDescription: t.metaDescription || page.metaDescription, intro: t.intro || page.intro, sections: (t.sections && t.sections.length) ? t.sections : page.sections };
};

/* ---------- JSON-LD ----------
 * 注意：所有 ld 函数返回【对象】，最终由调用方包成 JSON 数组一次性 stringify。
 * 多个对象用换行拼接进同一个 <script> 是非法 JSON，会导致 Google 无法解析 schema。
 */
const siteLd = lang => ({"@context":"https://schema.org","@type":"WebSite",name:siteI18n(lang).name,url:urlOf("index",lang),description:siteI18n(lang).description});
const articleLd = (p, lang) => ({"@context":"https://schema.org","@type":"Article",headline:p.title,description:p.metaDescription,mainEntityOfPage:urlOf(p.slug,lang),datePublished:"2026-08-05",dateModified:new Date().toISOString().slice(0,10),inLanguage:lang,publisher:{"@type":"Organization",name:siteI18n(lang).name}});
const faqLd = items => ({"@context":"https://schema.org","@type":"FAQPage",mainEntity:items.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))});
const breadcrumbLd = (p, lang) => ({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:siteI18n(lang).navHome,item:`https://${DATA.site.domain}/${lang===DEF?"":lang+"/"}`},{"@type":"ListItem",position:2,name:p.title,item:urlOf(p.slug,lang)}]});

/* ---------- head / header / footer ---------- */
function hreflang(slug){
  return LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${urlOf(slug,l)}" />`).join("\n") +
    `<link rel="alternate" hreflang="x-default" href="${urlOf(slug,DEF)}" />`;
}
function head(title, desc, extraLd, slug, lang){
  // extraLd 是对象数组；与 WebSite 合并后整体 JSON.stringify（合法 JSON-LD）
  const ld = JSON.stringify([siteLd(lang)].concat(extraLd || []));
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
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
/* SVG flags (render on all platforms) */
const FLAGS = {
  "en": '<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#012169"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="11"/><path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" stroke-width="6"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="14"/><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="8"/></svg>',
  "zh-CN": '<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#EE1C25"/><g fill="#FFDE00"><path d="M12 8l1.7 3.4 3.8.5-2.8 2.7.7 3.8L12 16.7l-3.4 1.7.7-3.8-2.8-2.7 3.8-.5z"/><path d="M22 4l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3zM25 11l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3zM22 18l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3zM19 11l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3z"/></g></svg>',
  "zh-TW": '<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#FE0000"/><rect width="30" height="20" fill="#000095"/><g fill="#fff" stroke="#fff" stroke-width="1"><path d="M15 2l2.3 6.7 7 .1-5.6 4.2 2.1 6.7-5.8-4-5.8 4 2.1-6.7L5.7 8.8l7-.1z"/><g stroke-width=".6"><path d="M15 2v16M15 2 5.7 8.8 15 15.6M15 2l9.3 6.8L15 15.6M15 2v16M15 18.8 5.7 12 15 5.2M15 18.8l9.3-6.8L15 5.2"/></g></g></svg>',
  "ja": '<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="11" fill="#BC002D"/></svg>',
  "ko": '<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#fff"/><g transform="translate(30 20)"><g transform="rotate(45)"><rect x="-10" y="-5" width="20" height="10" fill="#CD2E3A"/><rect x="-10" y="0" width="20" height="10" fill="#0047A0"/><circle r="6" fill="#fff"/></g><circle r="5" fill="#CD2E3A"/><path d="M0-5a5 5 0 0 1 0 10 2 2 0 0 1 0-10" fill="#0047A0"/></g><g fill="#000"><path d="M15 2h3v6h-3zM15 32h3v6h-3zM42 2h3v6h-3zM42 32h3v6h-3z"/></g></svg>',
  "es": '<svg viewBox="0 0 60 40"><rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/><g transform="translate(30 20)"><path d="M-10 0a10 10 0 0 1 10-10 10 10 0 0 1 0 20 10 10 0 0 1-10-10z" fill="#fff" opacity=".85"/></g></svg>'
};
const LANG_META = { "en":{name:"English",flag:FLAGS.en}, "zh-CN":{name:"简体中文",flag:FLAGS["zh-CN"]}, "zh-TW":{name:"繁體中文",flag:FLAGS["zh-TW"]}, "ja":{name:"日本語",flag:FLAGS.ja}, "ko":{name:"한국어",flag:FLAGS.ko}, "es":{name:"Español",flag:FLAGS.es} };
function langSwitcher(lang, slug){
  const items = LANGS.map(l =>
    `<a href="${urlOf(slug,l)}" class="${l===lang?"active":""}"><span class="flag svg-flag">${LANG_META[l]?.flag||"🌐"}</span>${LANG_META[l]?.name||l}</a>`
  ).join("");
  return `<details class="lang-dd">
    <summary><span class="flag svg-flag">${LANG_META[lang]?.flag||"🌐"}</span><span class="lang-name">${LANG_META[lang]?.name||lang}</span><span class="caret">▾</span></summary>
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
  const guidesLabel = lang.startsWith("zh") ? "攻略" : (lang === "ja" ? "攻略" : (lang === "ko" ? "가이드" : (lang === "es" ? "Guías" : "Guides")));
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
    <form class="site-search" action="https://www.google.com/search" method="get" target="_blank" rel="noopener" role="search">
      <input type="search" name="q" placeholder="${lang.startsWith('zh')?'搜索攻略…':lang==='ja'?'ガイドを検索…':lang==='ko'?'가이드 검색…':lang==='es'?'Buscar guías…':'Search guides…'}" aria-label="Search" />
      <input type="hidden" name="as_sitesearch" value="${esc(DATA.site.domain)}" />
      <span class="search-ic">🔍</span>
    </form>
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
  // TOC scroll highlight
  var tocLinks = document.querySelectorAll('.toc a');
  var secs = document.querySelectorAll('article .card[id^="sec-"]');
  if (tocLinks.length && secs.length) {
    var spy = new IntersectionObserver(function(es){
      es.forEach(function(en){
        if (en.isIntersecting) {
          var id = '#' + en.target.id;
          tocLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === id); });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    secs.forEach(function(se){ spy.observe(se); });
  }

  var obs = new IntersectionObserver(function(es){
    es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); } });
  }, {threshold:.08});
  document.querySelectorAll('.section').forEach(function(el){ obs.observe(el); });
  // TOC active section highlight
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  if (tocLinks.length) {
    var tocTargets = tocLinks.map(function(a){ return document.querySelector(a.getAttribute('href')); });
    var tocObs = new IntersectionObserver(function(es){
      es.forEach(function(en){
        if (en.isIntersecting) {
          var id = '#' + en.target.id;
          tocLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === id); });
        }
      });
    }, {rootMargin:'-15% 0px -70% 0px', threshold:0});
    tocTargets.forEach(function(s){ if (s) tocObs.observe(s); });
  }
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
      // 关卡步骤：像素编号块
      const items = (s.items||[]).map((it,i)=>{
        const t = Array.isArray(it)?it[0]:it;
        const d = Array.isArray(it)?(it[1]||""):"";
        return `<li class="level-step"><span class="level-no">${String(i+1).padStart(2,"0")}</span><div><strong>${esc(t)}</strong>${d?`<p>${esc(d)}</p>`:""}</div></li>`;
      }).join("");
      return `<section class="arcade-card reveal" id="${id}"><div class="arcade-head"><span class="arcade-tag">${esc(s.tag||"LEVEL")}</span><h2>${esc(s.heading)}</h2></div>${s.body?`<p class="arcade-lead">${esc(s.body)}</p>`:""}<ol class="level-steps">${items}</ol></section>`;
    }
    case "list": {
      // 道具清单：像素方块勾选
      const items = (s.items||[]).map(it=>`<li class="item-chip"><span class="chip-box" aria-hidden="true"></span><p>${esc(Array.isArray(it)?it[0]:it)}</p></li>`).join("");
      return `<section class="arcade-card reveal" id="${id}"><div class="arcade-head"><span class="arcade-tag">${esc(s.tag||"ITEMS")}</span><h2>${esc(s.heading)}</h2></div>${s.body?`<p class="arcade-lead">${esc(s.body)}</p>`:""}<ul class="item-list">${items}</ul></section>`;
    }
    case "table": {
      // 数据面板：霓虹表头
      const headRow = (s.columns||[]).map(c=>`<th>${esc(c)}</th>`).join("");
      const rows = (s.rows||[]).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
      return `<section class="arcade-card reveal" id="${id}"><div class="arcade-head"><span class="arcade-tag">${esc(s.tag||"DATA")}</span><h2>${esc(s.heading)}</h2></div>${s.body?`<p class="arcade-lead">${esc(s.body)}</p>`:""}<div class="data-panel"><table><thead><tr>${headRow}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
    }
    case "faq": {
      // 问答窗口：对话框式
      const items = (s.items||[]).map(([q,a])=>`<details class="chat-faq"><summary>${esc(q)}<span class="pm">+</span></summary><div class="chat-a">${esc(a)}</div></details>`).join("");
      return `<section class="arcade-card reveal" id="${id}"><div class="arcade-head"><span class="arcade-tag">${esc(s.tag||"QA")}</span><h2>${esc(s.heading)}</h2></div>${items}</section>`;
    }
    default: return "";
  }
}
/* ---------- home ---------- */
function renderHome(lang){
  const s = siteI18n(lang);
  const prefix = lang === DEF ? "" : `/${lang}`;
  const gname = (DATA.game.nameI18n && DATA.game.nameI18n[lang]) || DATA.game.name;
  const gintro = (DATA.game.introI18n && DATA.game.introI18n[lang]) || DATA.game.intro;
  const statsArr = (DATA.game.statsI18n && DATA.game.statsI18n[lang]) || DATA.game.stats || [];
  const stats = statsArr.map(st=>`<div class="stat"><b>${esc(st.value)}</b><span>${esc(st.label)}</span></div>`).join("");
  const faqItems = (pageOf(DATA.pages.find(p=>p.slug==="faq"), lang).sections[0]?.items) || [];
  const faqHtml = faqItems.map(([q,a])=>`<details class="faq"><summary>${esc(q)}<span class="pm">+</span></summary><div class="faq-a">${esc(a)}</div></details>`).join("");
  const keyFactsArr = (DATA.game.keyFactsI18n && DATA.game.keyFactsI18n[lang]) || DATA.game.keyFacts || [];
  const keyFacts = keyFactsArr.map(f=>`<li>${esc(f)}</li>`).join("");
  const modePages = ["how-to-play","modes","maps","tips-and-tricks"];
  const modeTabs = modePages.map((slug)=>{
    const p=DATA.pages.find(x=>x.slug===slug); if(!p) return "";
    const t=pageOf(p,lang); const m=metaOf(slug);
    return `<a class="mode-tab" href="${prefix}/${slug}" data-mode="${slug}">
      <span class="mode-ic">${SVG[m.icon]}</span>
      <b>${esc(t.title)}</b>
      <p>${esc(t.metaDescription)}</p>
      <span class="mode-go">${esc(s.readGuide||"Play →")}</span>
    </a>`;
  }).join("");
  const cards = DATA.pages.map((p, i) => {
    const m = metaOf(p.slug);
    const t = pageOf(p, lang);
    const idx = String(i+1).padStart(2,"0");
    const modeRel = (p.slug==="how-to-play")?"how-to-play":(p.slug==="modes")?"modes":(p.slug==="maps")?"maps":(p.slug==="tips-and-tricks")?"tips-and-tricks":"all";
    return `<a class="level-path" href="${prefix}/${p.slug}" data-mode-rel="${modeRel}">
      <span class="path-no">${idx}</span>
      <span class="path-icon">${SVG[m.icon]}</span>
      <span class="path-body"><b>${esc(t.title)}</b><span>${esc(t.metaDescription)}</span></span>
      <span class="path-go">▶</span>
    </a>`;
  }).join("");
  const badgeTxt = lang.startsWith("zh")?"2026 年现象级捉迷藏派对游戏 · 持续更新":lang==="ja"?"2026年話題のかくれんぼパーティゲーム · 定期更新":"2026's viral hide-and-seek hit · Guides updated regularly";
  const h1Tail = lang.startsWith("zh")?"攻略站":lang==="ja"?"攻略ガイド":"GUIDES";
  const body = `
  <main>
    <section class="arcade-hero">
      <div class="arcade-bg"><img src="/images/hero.jpg" srcset="/images/hero-640.jpg 640w, /images/hero-1280.jpg 1280w, /images/hero.jpg 3136w" sizes="100vw" alt="${esc(gname)} key art" loading="eager" width="3136" height="1344" fetchpriority="high" /></div>
      <div class="arcade-overlay"></div>
      <div class="container arcade-copy">
        <span class="badge"><span class="dot"></span> ${esc(badgeTxt)}</span>
        <h1>${esc(gname)} <span class="arcade-hl">${esc(h1Tail)}</span></h1>
        <p class="lead">${esc(s.tagline)}.</p>
        <div class="stats arcade-stats">${stats}</div>
        <div class="cta-row">
          <a class="btn btn-primary" href="${esc(DATA.game.steamUrl)}" target="_blank" rel="noopener">${esc(s.startPlaying)}</a>
          <a class="btn btn-ghost" href="${prefix}/how-to-play">${esc(s.readGuide || "How to Play →")}</a>
        </div>
      </div>
    </section>
    <section class="container section">
      <div class="section-head"><div><div class="kicker">${lang.startsWith("zh")?"选择模式":lang==="ja"?"モード選択":"PICK A MODE"}</div><h2>${lang.startsWith("zh")?"模式大厅":lang==="ja"?"モードホール":"Mode Lobby"}</h2></div><p>${lang.startsWith("zh")?"每个模式一条直达攻略。":lang==="ja"?"各モードへのショートカット。":"One shortcut per mode."}</p></div>
      <div class="mode-row">${modeTabs}</div>
    </section>
    <section class="container section">
      <div class="section-head"><div><div class="kicker">${lang.startsWith("zh")?"攻略":lang==="ja"?"攻略":"Guides"}</div><h2>${esc(s.guides)}</h2></div><p>${lang.startsWith("zh")?"每一页都来自真实搜索需求，基于可靠来源。":lang==="ja"?"各ページは実際の検索ニーズに基づいています。":""}</p></div>
      <div class="level-grid">${cards}</div>
    </section>
    ${faqHtml ? `<section class="container section"><div class="section-head"><div><div class="kicker">${lang.startsWith("zh")?"问答":lang==="ja"?"Q&A":"FAQ"}</div><h2>${esc(s.quickAnswers)}</h2></div></div>${faqHtml}</section>` : ""}
    <section class="container section">
      <div class="section-head"><div><div class="kicker">${lang.startsWith("zh")?"关于":lang==="ja"?"概要":"About"}</div><h2>${esc(s.aboutGame)}</h2></div></div>
      <div class="card"><p>${esc(gintro)}</p><ul class="checks" style="margin-top:14px">${keyFacts}</ul></div>
    </section>
  </main>
  <script>
  document.addEventListener('DOMContentLoaded', function(){
    var modes=document.querySelectorAll('.mode-tab');
    var paths=document.querySelectorAll('.level-path');
    modes.forEach(function(m){
      m.addEventListener('click', function(ev){
        // 允许正常跳转，但高亮当前模式
        modes.forEach(function(x){x.classList.remove('on');});
        m.classList.add('on');
      });
    });
  });
  </script>`;
  return head(`${esc(gname)} ${lang.startsWith("zh")?"攻略站":lang==="ja"?"攻略ガイド":"Guides & Wiki"}`, s.description, [], "index", lang) + header(lang, "") + body + footer(lang);
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
  const ld = [articleLd({...t, slug:p.slug}, lang), breadcrumbLd({...t, slug:p.slug}, lang), faq?faqLd(faq.items):null].filter(Boolean);
  const sources = (p.sources && p.sources.length ? p.sources : [
    { label: `${DATA.game.name} — Wikipedia`, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(DATA.game.name)}` },
    { label: "Official Steam store page", url: DATA.game.steamUrl }
  ]);
  const sourceHtml = sources.map(x => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc((x.labels && x.labels[lang]) || x.label)}</a></li>`).join("");
  const related = DATA.pages.filter(x=>x.slug!==p.slug).slice(0,6).map(x=>{
    const mm = metaOf(x.slug);
    return `<a href="${prefix}/${x.slug}"><span class="ri">${SVG[mm.icon]}</span><span>${esc(pageOf(x,lang).title)}</span></a>`;
  }).join("");
  const body = `
  <main class="container">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${prefix}/">${esc(s.navHome)}</a> <span>›</span> <span>${esc(t.title)}</span></nav>
    <div class="lobby-hero">
      ${p.image ? `<img class="page-img" src="${esc(p.image)}" srcset="${esc(p.image.replace('.jpg','-640.jpg'))} 640w, ${esc(p.image.replace('.jpg','-1280.jpg'))} 1280w, ${esc(p.image)} 3136w" sizes="(max-width: 640px) 92vw, 820px" width="3136" height="1344" alt="${esc(t.title)}" loading="lazy" />` : ""}
      <div class="lobby-title">
        <span class="icon ${m.ic}" style="width:52px;height:52px;border-radius:14px;display:grid;place-items:center">${SVG[m.icon]}</span>
        <div>
          <span class="kicker">${lang.startsWith("zh")?"攻略":lang==="ja"?"攻略":"GUIDE"}</span>
          <h1>${esc(t.title)}</h1>
          <p class="lead">${esc(t.metaDescription)}</p>
        </div>
      </div>
      <p class="intro">${esc(t.intro)}</p>
      ${toc ? `<div class="lobby-toc"><b>${lang.startsWith("zh")?"本页目录":lang==="ja"?"目次":"On this page"}</b><div>${toc}</div></div>` : ""}
    </div>
    ${sections}
    <div class="sources"><b>${esc(s.sources)}</b><ul>${sourceHtml}</ul></div>
    <div class="lobby-related">
      <div class="section-head"><div><div class="kicker">${esc(s.moreGuides)}</div><h2>${lang.startsWith("zh")?"继续探索":lang==="ja"?"続けて探索":"Keep exploring"}</h2></div></div>
      <div class="related-list related-row">${related}</div>
    </div>
  </main>`;
  return head(t.metaTitle, t.metaDescription, ld, p.slug, lang) + header(lang, p.slug) + body + footer(lang);
}
/* ---------- static ---------- */
function renderStatic(title, contentHtml, slug, lang){
  const s = siteI18n(lang);
  const prefix = lang === DEF ? "" : `/${lang}`;
  const body = `<main class="container"><nav class="crumbs"><a href="${prefix}/">${esc(s.navHome)}</a> <span>›</span> <span>${esc(title)}</span></nav><article style="max-width:820px"><div class="page-hero"><h1>${esc(title)}</h1></div><div class="card">${contentHtml}</div></article></main>`;
  return head(`${title} — ${s.name}`, `${title} — ${s.name}`, [articleLd({title, metaDescription:`${title} — ${s.name}`, slug}, lang)], slug, lang) + header(lang, slug) + body + footer(lang);
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
const SRC_FAV = path.join(ROOT,"assets","favicon");
if (fs.existsSync(SRC_FAV)) for (const f of fs.readdirSync(SRC_FAV)) fs.copyFileSync(path.join(SRC_FAV,f), path.join(OUT,f));

for (const lang of LANGS) {
  const dir = lang === DEF ? OUT : path.join(OUT, lang);
  fs.writeFileSync(path.join(dir,"index.html"), renderHome(lang));
  for (const p of DATA.pages) fs.writeFileSync(path.join(dir, `${p.slug}.html`), renderPage(p, lang));
  const aboutBody = T4(lang,
    `<p>${esc(siteI18n(lang).name)} 是一个非官方粉丝攻略站：每一页都对应一个玩家真实搜索的问题（怎么玩、全部模式、地图、成就与兑换码真相、更新日志、配置要求等），答案基于可靠来源并持续更新。</p><p style="margin-top:10px">本站不隶属于游戏开发商或发行商。${esc(siteI18n(lang).footerNote)}</p><p style="margin-top:10px">${esc(siteI18n(lang).footerSource)}。每页底部都列出了当页使用的来源。</p>`,
    `<p>${esc(siteI18n(lang).name)} 是一個非官方粉絲攻略站：每一頁都對應一個玩家真實搜索的問題（怎麼玩、全部模式、地圖、成就與兌換碼真相、更新日誌、配置要求等），答案基於可靠來源並持續更新。</p><p style="margin-top:10px">本站不隸屬於遊戲開發商或發行商。${esc(siteI18n(lang).footerNote)}</p><p style="margin-top:10px">${esc(siteI18n(lang).footerSource)}。每頁底部都列出了當頁使用的來源。</p>`,
    `<p>${esc(siteI18n(lang).name)} は非公式のファンサイトです。各ページはプレイヤーが実際に検索する質問（遊び方、全モード、マップ、実績・コードの真相、アップデート履歴、必要スペックなど）に答え、信頼できる情報源に基づいて定期的に更新しています。</p><p style="margin-top:10px">本サイトは開発元・販売元とは無関係です。${esc(siteI18n(lang).footerNote)}</p><p style="margin-top:10px">${esc(siteI18n(lang).footerSource)}。各ページ下部に出典を記載しています。</p>`, 
    `<p>${esc(siteI18n(lang).name)}은(는) 비공식 팬 공략 사이트입니다. 각 페이지는 플레이어가 실제로 검색하는 질문(게임 방법, 전체 모드, 맵, 업적·코드의 진실, 업데이트 내역, 시스템 요구 사항 등)에 답하며, 신뢰할 수 있는 출처에 기반해 정기적으로 업데이트됩니다.</p><p style="margin-top:10px">이 사이트는 게임 개발사·퍼블리셔와 무관합니다. ${esc(siteI18n(lang).footerNote)}</p><p style="margin-top:10px">${esc(siteI18n(lang).footerSource)} 각 페이지 하단에 해당 페이지가 사용한 출처를 표기합니다.</p>`,
    `<p>${esc(siteI18n(lang).name)} es un sitio de fans no oficial. Cada página responde a una pregunta real que los jugadores buscan (cómo jugar, todos los modos, mapas, la verdad sobre logros y códigos, historial de actualizaciones, requisitos del sistema y más), basada en fuentes fiables y actualizada con regularidad.</p><p style="margin-top:10px">Este sitio no está afiliado al desarrollador ni al editor del juego. ${esc(siteI18n(lang).footerNote)}</p><p style="margin-top:10px">${esc(siteI18n(lang).footerSource)}. Cada página lista las fuentes que usó al final.</p>`,
        `<p>${esc(siteI18n(lang).name)} is an unofficial fan guide site. Every page answers a real question players search for (how to play, all modes, maps, the truth about achievements and codes, update history, system requirements and more), based on reliable sources and updated regularly.</p><p style="margin-top:10px">This site is not affiliated with the game's developer or publisher. ${esc(siteI18n(lang).footerNote)}</p><p style="margin-top:10px">${esc(siteI18n(lang).footerSource)}. Each page lists the sources it used at the bottom.</p>`);
fs.writeFileSync(path.join(dir,"about.html"), renderStatic(siteI18n(lang).aboutTitle, aboutBody, "about", lang));
  const privacyBody = T4(lang,
    `<p>本网站是游戏攻略站，我们重视访问者隐私。本政策说明我们收集什么、如何使用。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">我们收集什么</h2><p>我们使用 Google Analytics（GA4）统计匿名流量：页面浏览量、来源渠道、设备类型与大致地区。我们不收集姓名、邮箱或任何个人身份信息，也不出售数据。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Cookie</h2><p>Google Analytics 会设置 Cookie 用于会话统计。你可以在浏览器中禁用 Cookie，或安装 Google Analytics 退出插件。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">第三方服务</h2><p>本页面从 Google Fonts 加载字体，页面由 Cloudflare 提供 CDN 加速，两者可能记录标准访问日志（IP、UA、时间）。这些服务受其各自的隐私政策约束。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">联系我们</h2><p>如有隐私问题，请发邮件至 <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a>。</p><p style="margin-top:14px;opacity:.75">生效日期：${new Date().toISOString().slice(0,10)}</p>`,
    `<p>本網站是遊戲攻略站，我們重視訪問者隱私。本政策說明我們收集什麼、如何使用。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">我們收集什麼</h2><p>我們使用 Google Analytics（GA4）統計匿名流量：頁面瀏覽量、來源渠道、設備類型與大致地區。我們不收集姓名、郵箱或任何個人身份信息，也不出售數據。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Cookie</h2><p>Google Analytics 會設置 Cookie 用於會話統計。你可以在瀏覽器中禁用 Cookie，或安裝 Google Analytics 退出插件。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">第三方服務</h2><p>本頁面從 Google Fonts 加載字體，頁面由 Cloudflare 提供 CDN 加速，兩者可能記錄標準訪問日誌（IP、UA、時間）。這些服務受其各自的隱私政策約束。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">聯繫我們</h2><p>如有隱私問題，請發郵件至 <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a>。</p><p style="margin-top:14px;opacity:.75">生效日期：${new Date().toISOString().slice(0,10)}</p>`,
    `<p>本サイトはゲーム攻略サイトです。訪問者のプライバシーを尊重しています。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">収集する情報</h2><p>Google Analytics（GA4）で匿名のアクセス統計（ページビュー、流入元、端末タイプ、おおよその地域）を取得しています。氏名・メールアドレスなどの個人情報は収集せず、データの販売も行いません。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Cookie</h2><p>Google Analytics はセッション統計のため Cookie を使用します。ブラウザで無効化するか、Google Analytics のオプトアウトアドオンを利用できます。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">第三者サービス</h2><p>Google Fonts からフォントを、Cloudflare の CDN を利用しています。これらは標準的なアクセスログ（IP・UA・時刻）を記録する場合があります。</p><h2 style="font-size:1.05rem;margin:18px 0 8px">お問い合わせ</h2><p>プライバシーに関するご質問は <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a> まで。</p><p style="margin-top:14px;opacity:.75">発効日：${new Date().toISOString().slice(0,10)}</p>`,
    `<p>이 사이트는 게임 공략 사이트이며 방문자의 개인정보를 소중히 여깁니다. 본 방침은 무엇을 수집하고 어떻게 사용하는지 설명합니다.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">수집하는 정보</h2><p>Google Analytics(GA4)로 익명 트래픽 통계(페이지뷰, 유입 경로, 기기 유형, 대략적인 지역)를 수집합니다. 이름·이메일 등 개인 식별 정보는 수집하지 않으며 데이터를 판매하지 않습니다.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">쿠키</h2><p>Google Analytics는 세션 통계를 위해 쿠키를 사용합니다. 브라우저에서 쿠키를 비활성화하거나 Google Analytics 옵트아웃 애드온을 설치할 수 있습니다.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">제3자 서비스</h2><p>Google Fonts에서 폰트를, Cloudflare CDN으로 페이지를 제공하며, 둘 다 표준 접근 로그(IP, UA, 시간)를 기록할 수 있습니다. 해당 서비스는 각자의 개인정보 처리방침을 따릅니다.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">문의</h2><p>개인정보 관련 문의는 <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a>로 보내주세요.</p><p style="margin-top:14px;opacity:.75">시행일: ${new Date().toISOString().slice(0,10)}</p>`,
    `<p>Este sitio es una web de guías de juegos y respetamos la privacidad de los visitantes. Esta política explica qué recopilamos y cómo se usa.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Qué recopilamos</h2><p>Usamos Google Analytics (GA4) para estadísticas anónimas de tráfico: visitas, referencias, tipos de dispositivo y regiones aproximadas. No recopilamos nombres, correos electrónicos ni información personal identificable, y no vendemos datos.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Cookies</h2><p>Google Analytics establece cookies para estadísticas de sesión. Puedes desactivar las cookies en tu navegador o instalar el complemento de exclusión de Google Analytics.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Servicios de terceros</h2><p>Las fuentes se cargan desde Google Fonts y el sitio se sirve mediante el CDN de Cloudflare; ambos pueden registrar registros de acceso estándar (IP, agente de usuario, hora). Esos servicios siguen sus propias políticas de privacidad.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Contacto</h2><p>Para preguntas de privacidad, escribe a <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a>.</p><p style="margin-top:14px;opacity:.75">Fecha de entrada en vigor: ${new Date().toISOString().slice(0,10)}</p>`,
        `<p>This is a game guide website and we respect visitor privacy. This policy explains what we collect and how it is used.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">What we collect</h2><p>We use Google Analytics (GA4) for anonymous traffic statistics: page views, referrers, device types and approximate regions. We do not collect names, email addresses or any personally identifiable information, and we do not sell data.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Cookies</h2><p>Google Analytics sets cookies for session statistics. You can disable cookies in your browser or install the Google Analytics opt-out add-on.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Third-party services</h2><p>Fonts are loaded from Google Fonts and the site is served via Cloudflare's CDN; both may record standard access logs (IP, user agent, time). Those services follow their own privacy policies.</p><h2 style="font-size:1.05rem;margin:18px 0 8px">Contact</h2><p>For privacy questions, email <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a>.</p><p style="margin-top:14px;opacity:.75">Effective date: ${new Date().toISOString().slice(0,10)}</p>`);
fs.writeFileSync(path.join(dir,"privacy.html"), renderStatic(siteI18n(lang).privacyTitle, privacyBody, "privacy", lang));
  fs.writeFileSync(path.join(dir,"contact.html"), renderStatic(siteI18n(lang).contactTitle, `<p>${T4(lang,"联系我们：","聯繫我們：","お問い合わせ：","문의하기：","Escríbenos a:","Reach us at:")} <a href="mailto:contact@${esc(DATA.site.domain)}">contact@${esc(DATA.site.domain)}</a></p><p style="margin-top:10px">${T4(lang,"我们通常会在 2-3 个工作日内回复。","我們通常會在 2-3 個工作日內回覆。","通常 2〜3 営業日以内に返信します。","보통 2-3 영업일 내에 답변드립니다.","Normalmente respondemos en 2-3 días laborables.","We usually reply within 2-3 business days.")}</p>`, "contact", lang));
}
// 404 (default lang)
fs.writeFileSync(path.join(OUT,"404.html"), `<!DOCTYPE html><html lang="${DEF}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 — Not Found</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/css/style.css"></head><body>${header(DEF,"")}<main class="container" style="padding-top:70px;text-align:center"><section class="card" style="max-width:540px;margin:0 auto"><h1>404 — Page not found</h1><p style="margin:10px 0 18px">The page you are looking for does not exist. Try one of these guides:</p><div class="related-list" style="text-align:left">${DATA.pages.slice(0,6).map(p=>`<a href="/${p.slug}">${pageOf(p,DEF).title}</a>`).join("")}</div></section></main>${footer(DEF)}</body></html>`);

// sitemap
const today = new Date().toISOString().slice(0,10);
const urls = [];
for (const lang of LANGS) {
  urls.push(urlOf("index",lang));
  for (const p of DATA.pages) urls.push(urlOf(p.slug,lang));
}
fs.writeFileSync(path.join(OUT,"sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>${u.endsWith("/")?"1.0":"0.8"}</priority></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT,"robots.txt"), `User-agent: *\nAllow: /\nSitemap: https://${DATA.site.domain}/sitemap.xml\n`);
// ads.txt：接入 AdSense 后填 site.json 的 adsenseId，自动生成真实记录；未接入则保持空文件（避免占位符误导审核）
// 旧 /zh/ 路径重定向到 /zh-CN/（兼容改名前的链接）
fs.writeFileSync(path.join(OUT,"_redirects"), "/zh/* /zh-CN/:splat 301\n");
fs.writeFileSync(path.join(OUT,"ads.txt"), DATA.site.adsenseId ? `google.com, ${DATA.site.adsenseId}, DIRECT, f08c47fec0942fa0\n` : "");
console.log(`✓ Generated ${LANGS.length} locales x ${1+DATA.pages.length+3} pages + sitemap`);
