#!/usr/bin/env node
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const sitePath = path.join(root, "data", "site.json");
const generatorPath = path.join(root, "scripts", "generate.js");
const cssPath = path.join(root, "templates", "style.css");
const expectedPublisher = "pub-4174270222899193";
const expectedClient = `ca-${expectedPublisher}`;
const official380 = "https://steamcommunity.com/games/4704690/announcements/detail/671751488532383877";
const consentTokens = ["data-consent-settings", "data-consent-accept", "data-consent-reject", "data-consent-manage-open", "data-consent-withdraw"];

const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const count = (text, needle) => text.split(needle).length - 1;
const filesUnder = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? filesUnder(path.join(dir, entry.name)) : [path.join(dir, entry.name)]).sort();
const htmlFiles = () => filesUnder(publicDir).filter(file => file.endsWith(".html"));
const rows = () => htmlFiles().map(file => ({ relative: path.relative(publicDir, file), html: fs.readFileSync(file, "utf8") }));
const treeHash = () => {
  const hash = crypto.createHash("sha256");
  for (const file of filesUnder(publicDir)) {
    hash.update(path.relative(publicDir, file)); hash.update("\0"); hash.update(fs.readFileSync(file)); hash.update("\0");
  }
  return hash.digest("hex");
};
const runBuild = fixture => {
  const env = { ...process.env };
  delete env.MECCHA_ADSENSE_FIXTURE;
  if (fixture) { env.NODE_ENV = "test"; env.MECCHA_ADSENSE_FIXTURE = "enabled"; }
  const result = spawnSync(process.execPath, [generatorPath], { cwd: root, env, encoding:"utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout || "generator failed");
  return result.stdout.trim();
};
const sitemapFiles = () => {
  const xml = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map(match => {
    const route = match[1];
    return path.join(publicDir, route.endsWith("/") ? `${route.replace(/^\//, "")}index.html` : `${route.replace(/^\//, "")}.html`);
  });
};

function snapshot(fault = "") {
  const currentRows = rows().map(row => ({ ...row }));
  const site = structuredClone(readJson(sitePath));
  let css = fs.readFileSync(cssPath, "utf8");
  const first = predicate => currentRows.find(predicate);
  if (fault === "eager-ga") first(() => true).html += '<script src="https://www.googletagmanager.com/gtag/js?id=G-FAULT"></script>';
  if (fault === "eager-adsterra") first(() => true).html += '<script src="https://fault.effectivecpmnetwork.com/invoke.js"></script>';
  if (fault === "missing-reject") first(() => true).html = first(() => true).html.replaceAll("data-consent-reject", "data-fault-reject");
  if (fault === "missing-settings") first(() => true).html = first(() => true).html.replaceAll("data-consent-settings", "data-fault-settings");
  if (fault === "missing-withdraw") first(() => true).html = first(() => true).html.replaceAll("data-consent-withdraw", "data-fault-withdraw");
  if (fault === "privacy-provider-omission") first(row => row.relative === "privacy.html").html = first(row => row.relative === "privacy.html").html.replaceAll("Adsterra", "optional provider");
  if (fault === "privacy-anonymous-absolute") first(row => row.relative === "privacy.html").html = first(row => row.relative === "privacy.html").html.replace("</article>", "<p>anonymous traffic statistics</p></article>");
  if (fault === "stale-version") first(row => row.relative === "update-log.html").html = first(row => row.relative === "update-log.html").html.replace(">3.8.0</a>", ">3.5.3</a>");
  if (fault === "missing-source") first(row => row.relative === "update-log.html").html = first(row => row.relative === "update-log.html").html.replaceAll(official380, "https://example.invalid/missing-source");
  if (fault === "mobile-header-regression") css = css.replace('grid-template-areas:"logo nav lang" "search search search"', 'grid-template-areas:"logo" "nav" "lang" "search"');
  if (fault === "adsense-serving-enabled") site.site.adsenseServing.enabled = true;
  return { currentRows, site, css };
}

function assertOutput({ fixture = false, fault = "" } = {}) {
  const { currentRows, site, css } = snapshot(fault);
  assert.equal(site.site.languages.length, 6, "six-language configuration changed");
  assert.equal(site.site.adsenseId, expectedPublisher, "AdSense publisher data must stay raw pub-");
  assert.deepEqual(site.site.adsenseServing, { enabled:false, providerReady:false, certifiedCmpReady:false }, "all three production serving gates must default false");
  assert.equal(currentRows.length, 115, "generated HTML route set changed");
  for (const row of currentRows) {
    for (const token of consentTokens) assert(row.html.includes(token), `consent control ${token} missing in ${row.relative}`);
    assert.equal(/<script[^>]+src=["'][^"']*(?:googletagmanager\.com|googlesyndication\.com|effectivecpmnetwork\.com)/i.test(row.html), false, `optional provider injected before consent in ${row.relative}`);
    assert.equal(count(row.html, "https://www.googletagmanager.com/gtag/js?id="), 1, `GA4 loader contract changed in ${row.relative}`);
    assert.equal(count(row.html, "https://pl30754294.effectivecpmnetwork.com/0c3b12f9a492c82d399cade1ef48e078/invoke.js"), 1, `Adsterra placement contract changed in ${row.relative}`);
    assert.equal(row.html.includes("client=pub-"), false, `raw pub client leaked in ${row.relative}`);
    assert.equal(row.html.includes("client=ca-ca-pub-"), false, `double ca- prefix in ${row.relative}`);
    assert.equal(count(row.html, "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"), fixture ? 1 : 0, `AdSense fixture contract changed in ${row.relative}`);
  }
  const indexable = sitemapFiles();
  assert.equal(indexable.length, 114, "six-language sitemap route set changed");
  for (const file of indexable) {
    assert(fs.existsSync(file), `missing indexable output ${path.relative(publicDir, file)}`);
    assert.equal(count(fs.readFileSync(file, "utf8"), `<meta name="google-adsense-account" content="${expectedClient}" />`), 1, `AdSense ownership meta mismatch in ${path.relative(publicDir, file)}`);
  }
  assert.equal(fs.readFileSync(path.join(publicDir, "ads.txt"), "utf8"), `google.com, ${expectedPublisher}, DIRECT, f08c47fec0942fa0\n`, "ads.txt raw publisher record changed");

  const privacyRows = currentRows.filter(row => /(^|\/)privacy\.html$/.test(row.relative));
  assert.equal(privacyRows.length, 6, "six privacy pages required");
  for (const row of privacyRows) {
    const policy = row.html.split("<footer")[0].toLowerCase();
    for (const token of ["google analytics", "adsterra", "effectivecpmnetwork.com", "meccha-consent-v1", "ip", "google adsense", "auto ads"])
      assert(policy.includes(token), `privacy provider/storage/default-off disclosure missing ${token} in ${row.relative}`);
    assert(/cookie|쿠키/.test(policy), `privacy provider/storage/default-off disclosure missing cookie in ${row.relative}`);
    assert.equal(/anonymous traffic|anonymous statistics|\u533f\u540d|익명|an[oó]nim/.test(policy), false, `privacy anonymous/no-PII absolute remains in ${row.relative}`);
  }

  const updateRows = currentRows.filter(row => /(^|\/)update-log\.html$/.test(row.relative));
  const faqRows = currentRows.filter(row => /(^|\/)faq\.html$/.test(row.relative));
  const homeRows = currentRows.filter(row => /(^|\/)index\.html$/.test(row.relative));
  assert.equal(updateRows.length, 6, "six update-log pages required");
  assert.equal(faqRows.length, 6, "six FAQ pages required");
  assert.equal(homeRows.length, 6, "six home pages required");
  for (const row of updateRows) {
    assert(row.html.includes(`<a href="${official380}" target="_blank" rel="noopener">3.8.0</a>`), `exact official 3.8.0 claim link missing in ${row.relative}`);
    assert(row.html.includes("2026") && row.html.includes("3.8.0") && row.html.includes("fix3.7.3"), `version chronology drift in ${row.relative}`);
  }
  for (const row of [...faqRows, ...homeRows]) assert(row.html.includes("3.8.0"), `current-version answer stale in ${row.relative}`);
  assert(css.includes('grid-template-areas:"logo nav lang" "search search search"'), "mobile header compact two-row contract missing");
  assert(css.includes(".consent-manage[hidden]"), "hidden consent controls need an explicit author-style override");
  assert(css.includes("min-height:44px"), "44px interactive target contract missing");
  return { pages:currentRows.length, indexablePages:indexable.length };
}

const activeFault = process.env.MECCHA_COMMERCIAL_FAULT || "";
if (activeFault) {
  runBuild(false);
  assertOutput({ fault:activeFault });
  console.error(`fault ${activeFault} was not detected`);
  process.exit(2);
}

const firstDefaultBuild = runBuild(false);
const first = assertOutput();
const firstDefaultHash = treeHash();
const secondDefaultBuild = runBuild(false);
assertOutput();
assert.equal(treeHash(), firstDefaultHash, "two default builds are not byte-identical");
const fixtureBuild = runBuild(true);
assertOutput({ fixture:true });
runBuild(false);
assertOutput();
assert.equal(treeHash(), firstDefaultHash, "fixture round-trip did not restore byte-identical default output");

const faults = [
  ["eager-ga", "optional provider injected before consent"], ["eager-adsterra", "optional provider injected before consent"],
  ["missing-reject", "data-consent-reject missing"], ["missing-settings", "data-consent-settings missing"], ["missing-withdraw", "data-consent-withdraw missing"],
  ["privacy-provider-omission", "privacy provider/storage/default-off disclosure missing adsterra"], ["privacy-anonymous-absolute", "privacy anonymous/no-PII absolute remains"],
  ["stale-version", "exact official 3.8.0 claim link missing"], ["missing-source", "exact official 3.8.0 claim link missing"],
  ["mobile-header-regression", "mobile header compact two-row contract missing"], ["adsense-serving-enabled", "all three production serving gates must default false"]
];
for (const [name, expected] of faults) {
  const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], { cwd:root, env:{ ...process.env, MECCHA_COMMERCIAL_FAULT:name }, encoding:"utf8" });
  const output = `${result.stdout}\n${result.stderr}`;
  assert.notEqual(result.status, 0, `fault ${name} unexpectedly exited zero`);
  assert(output.toLowerCase().includes(expected.toLowerCase()), `fault ${name} failed for the wrong reason: ${output}`);
}

console.log(JSON.stringify({ status:"pass", locales:6, pages:first.pages, indexablePages:first.indexablePages,
  defaultServingScripts:0, publisherId:expectedPublisher, clientId:expectedClient, officialVersion:"3.8.0", officialSource:official380,
  faultInjections:faults.map(([name]) => name), defaultTreeSha256:firstDefaultHash,
  builds:[firstDefaultBuild, secondDefaultBuild, fixtureBuild] }, null, 2));
