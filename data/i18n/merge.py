# -*- coding: utf-8 -*-
"""Merge ko/es translations into site.json (keep 1-space indent format)."""
import json, io, sys
sys.path.insert(0, '/tmp/meccha-guide-2/data/i18n')
import site_game, pages_1a, pages_1b, pages_2, pages_3a, pages_3b, pages_4

P='data/site.json'
s=json.load(io.open(P,encoding='utf-8'))

NEW_LANGS=['ko','es']

# ---- site i18n ----
for lang in NEW_LANGS:
    s['site']['i18n'][lang]=dict(site_game.SITE[lang])

# ---- languages ----
for lang in NEW_LANGS:
    if lang not in s['site']['languages']:
        s['site']['languages'].append(lang)

# ---- game ----
for lang in NEW_LANGS:
    s['game']['nameI18n'][lang]=site_game.GAME['nameI18n'][lang]
    s['game']['introI18n'][lang]=site_game.GAME['introI18n'][lang]
    s['game']['keyFactsI18n'][lang]=site_game.GAME['keyFactsI18n'][lang]
    s['game']['statsI18n'][lang]=site_game.GAME['statsI18n'][lang]

# ---- pages ----
all_pages={}
for mod in (pages_1a,pages_1b,pages_2,pages_3a,pages_3b,pages_4):
    for slug,d in mod.PAGES.items():
        all_pages[slug]=d
for p in s['pages']:
    if p['slug'] not in all_pages:
        print('WARN missing page translation:', p['slug'])
        continue
    if 'i18n' not in p: p['i18n']={}
    for lang in NEW_LANGS:
        p['i18n'][lang]=all_pages[p['slug']][lang]

# ---- sources labels ----
SRC_LABELS={
 "https://en.wikipedia.org/wiki/Meccha_Chameleon": {"ko":"메카 카멜레온 — 위키백과","es":"Meccha Chameleon — Wikipedia"},
 "https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/": {"ko":"Steam 공식 상점","es":"Tienda oficial de Steam"},
 "https://kotaku.com/steams-latest-viral-multiplayer-game-is-a-6-janky-indie-game-that-is-like-prop-hunt-but-good-2000709515": {"ko":"Steam 최신 바이럴 멀티플레이: 6달러짜리 조잡한 인디지만 Prop Hunt보다 낫다 — Kotaku","es":"El último éxito viral de Steam es un indie tosco de 6 $ que es como Prop Hunt, pero bueno — Kotaku"},
 "https://www.thegamer.com/meccha-chameleon-game-modes-guide/": {"ko":"전체 게임 모드 해설 — TheGamer","es":"Todos los modos de juego, explicados — TheGamer"},
 "https://www.ign.com/wikis/meccha-chameleon/Meccha_Chameleon_Patch_Notes_July_2,_2026": {"ko":"2026-07-02 패치 노트 — IGN","es":"Notas del parche del 2 de julio de 2026 — IGN"},
 "https://isthereanydeal.com/product/019e2737-daa0-73e3-bd42-5a3bdc0b703d/": {"ko":"isThereAnyDeal — MECCHA CHAMELEON","es":"isThereAnyDeal — MECCHA CHAMELEON"},
 "https://www.slashskill.com/meccha-chameleon-cheats-and-hacks-whats-real-and-whats-not/": {"ko":"SlashSkill — 치트와 핵 해설","es":"SlashSkill — trucos y hacks explicados"},
 "https://www.ign.com/wikis/meccha-chameleon/Meccha_Chameleon_Patch_Notes_July_20,_2026": {"ko":"IGN 위키 — 2026-07-20 패치 노트","es":"Wiki de IGN — notas del parche del 20 de julio de 2026"},
 "https://changelog.gg/games/meccha-chameleon-4704690": {"ko":"Changelog.gg — MECCHA CHAMELEON","es":"Changelog.gg — MECCHA CHAMELEON"},
 "https://gamingonsteam.com/2026/06/22/can-you-play-mecha-chameleon-on-the-steam-deck-review-best-settings/": {"ko":"GamingOnSteam — Steam 덱 리뷰 & 설정","es":"GamingOnSteam — análisis y ajustes de Steam Deck"},
 "https://www.wikihow.com/Meccha-Chameleon-Controls": {"ko":"wikiHow — 메카 카멜레온 조작","es":"wikiHow — Controles de Meccha Chameleon"},
}
for p in s['pages']:
    for src in p.get('sources',[]):
        if 'labels' not in src: src['labels']={}
        for lang in NEW_LANGS:
            src['labels'][lang]=SRC_LABELS.get(src['url'],{}).get(lang, src['label'])

io.open(P,'w',encoding='utf-8').write(json.dumps(s,ensure_ascii=False,indent=1))
print('MERGED OK. languages:', s['site']['languages'])
for lang in NEW_LANGS:
    print(lang, 'site i18n:', bool(s['site']['i18n'].get(lang)), '| pages with i18n:', sum(1 for p in s['pages'] if p.get('i18n',{}).get(lang)))
