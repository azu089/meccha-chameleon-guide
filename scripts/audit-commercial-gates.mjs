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
const expectedPublisher = "pub-4174270222899193";
const expectedClient = `ca-${expectedPublisher}`;

const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const count = (text, needle) => text.split(needle).length - 1;
const filesUnder = dir => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory()
    ? filesUnder(path.join(dir, entry.name))
    : [path.join(dir, entry.name)])
  .sort();
const htmlFiles = () => filesUnder(publicDir).filter(file => file.endsWith(".html"));
const htmlCorpus = () => htmlFiles().map(file => fs.readFileSync(file, "utf8")).join("\n");
const treeHash = () => {
  const hash = crypto.createHash("sha256");
  for (const file of filesUnder(publicDir)) {
    hash.update(path.relative(publicDir, file));
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
};
const runBuild = fixture => {
  const env = { ...process.env };
  delete env.MECCHA_ADSENSE_FIXTURE;
  if (fixture) {
    env.NODE_ENV = "test";
    env.MECCHA_ADSENSE_FIXTURE = "enabled";
  }
  const result = spawnSync(process.execPath, [generatorPath], {
    cwd: root,
    env,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout || "generator failed");
  return result.stdout.trim();
};
const sitemapFiles = () => {
  const xml = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
  const urls = [...xml.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map(match => match[1]);
  return urls.map(route => {
    const relative = route.endsWith("/")
      ? `${route.replace(/^\//, "")}index.html`
      : `${route.replace(/^\//, "")}.html`;
    return path.join(publicDir, relative);
  });
};

const site = readJson(sitePath);
assert.equal(site.site.languages.length, 6, "six-language configuration changed");
assert.equal(site.site.adsenseId, expectedPublisher, "AdSense publisher data must stay raw pub-");
assert.deepEqual(site.site.adsenseServing, {
  enabled: false,
  providerReady: false,
  certifiedCmpReady: false,
}, "all three production serving gates must default false");

const generatorSource = fs.readFileSync(generatorPath, "utf8");
assert.equal(generatorSource.includes("cozysimhub20-20"), false, "retired Amazon tag remains in generator");
assert.equal(generatorSource.includes("renderAmazonAffiliate"), false, "retired Amazon renderer remains in generator");

const firstDefaultBuild = runBuild(false);
const firstDefaultHash = treeHash();
const defaultCorpus = htmlCorpus();
const indexableFiles = sitemapFiles();
assert.equal(indexableFiles.length, site.site.languages.length * (site.pages.length + 4), "six-language route set is incomplete");
for (const file of indexableFiles) {
  assert.equal(fs.existsSync(file), true, `missing indexable output ${path.relative(publicDir, file)}`);
  const html = fs.readFileSync(file, "utf8");
  assert.equal(count(html, `<meta name="google-adsense-account" content="${expectedClient}" />`), 1,
    `AdSense ownership meta count mismatch in ${path.relative(publicDir, file)}`);
}
assert.equal(defaultCorpus.includes("amazon-gear"), false, "default output still contains an Amazon module");
assert.equal(defaultCorpus.includes("cozysimhub20-20"), false, "default output still contains the retired Amazon tag");
assert.equal(/https:\/\/(?:www\.)?amazon\.[^\s"'<]+/i.test(defaultCorpus), false, "default output still contains an Amazon URL");
assert.equal(defaultCorpus.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"), false,
  "default output must not load the AdSense serving script");
assert.equal(fs.readFileSync(path.join(publicDir, "ads.txt"), "utf8"),
  `google.com, ${expectedPublisher}, DIRECT, f08c47fec0942fa0\n`, "ads.txt raw publisher record changed");

const secondDefaultBuild = runBuild(false);
const secondDefaultHash = treeHash();
assert.equal(secondDefaultHash, firstDefaultHash, "two default builds are not byte-identical");

const fixtureBuild = runBuild(true);
for (const file of htmlFiles()) {
  const html = fs.readFileSync(file, "utf8");
  assert.equal(count(html, "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"), 1,
    `enabled fixture must emit exactly one AdSense script in ${path.relative(publicDir, file)}`);
  assert.equal(count(html, `client=${expectedClient}`), 1,
    `enabled fixture client mismatch in ${path.relative(publicDir, file)}`);
  assert.equal(html.includes("client=pub-"), false, `raw pub client leaked in ${path.relative(publicDir, file)}`);
  assert.equal(html.includes("client=ca-ca-pub-"), false, `double ca- prefix in ${path.relative(publicDir, file)}`);
}

runBuild(false);
assert.equal(treeHash(), firstDefaultHash, "fixture round-trip did not restore byte-identical default output");
console.log(JSON.stringify({
  status: "pass",
  locales: site.site.languages.length,
  pages: htmlFiles().length,
  indexablePages: indexableFiles.length,
  defaultServingScripts: 0,
  fixtureScriptsPerPage: 1,
  publisherId: expectedPublisher,
  clientId: expectedClient,
  defaultTreeSha256: firstDefaultHash,
  builds: [firstDefaultBuild, secondDefaultBuild, fixtureBuild],
}, null, 2));
