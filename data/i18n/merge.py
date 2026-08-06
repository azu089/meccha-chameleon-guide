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
 "https://en.wikipedia.org/wiki/Meccha_Chameleon": {
  "zh-CN": "维基百科 — 超级变色龙",
  "zh-TW": "維基百科 — 超級變色龍",
  "ja": "Wikipedia — メチャカメレオン",
  "ko": "메카 카멜레온 — 위키백과",
  "es": "Meccha Chameleon — Wikipedia"
 },
 "https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/": {
  "zh-CN": "Steam 官方商店页",
  "zh-TW": "Steam 官方商店頁",
  "ja": "Steam 公式ストアページ",
  "ko": "Steam 공식 상점",
  "es": "Tienda oficial de Steam"
 },
 "https://kotaku.com/steams-latest-viral-multiplayer-game-is-a-6-janky-indie-game-that-is-like-prop-hunt-but-good-2000709515": {
  "zh-CN": "Steam 最新爆火多人游戏：6 美元的粗糙独立游戏，却比 Prop Hunt 更好 — Kotaku",
  "zh-TW": "Steam 最新爆火多人遊戲：6 美元的粗糙獨立遊戲，卻比 Prop Hunt 更好 — Kotaku",
  "ja": "Steam 最新のバイラルマルチプレイ：6ドルの雑なインディーが Prop Hunt より面白い — Kotaku",
  "ko": "Steam 최신 바이럴 멀티플레이: 6달러짜리 조잡한 인디지만 Prop Hunt보다 낫다 — Kotaku",
  "es": "El último éxito viral de Steam es un indie tosco de 6 $ que es como Prop Hunt, pero bueno — Kotaku"
 },
 "https://www.thegamer.com/meccha-chameleon-game-modes-guide/": {
  "zh-CN": "超级变色龙：全部游戏模式详解 — TheGamer",
  "zh-TW": "超級變色龍：全部遊戲模式詳解 — TheGamer",
  "ja": "メチャカメレオン：全モード解説 — TheGamer",
  "ko": "전체 게임 모드 해설 — TheGamer",
  "es": "Todos los modos de juego, explicados — TheGamer"
 },
 "https://www.ign.com/wikis/meccha-chameleon/Meccha_Chameleon_Patch_Notes_July_2,_2026": {
  "zh-CN": "2026-07-02 补丁说明 — IGN",
  "zh-TW": "2026-07-02 補丁說明 — IGN",
  "ja": "2026-07-02 パッチノート — IGN",
  "ko": "2026-07-02 패치 노트 — IGN",
  "es": "Notas del parche del 2 de julio de 2026 — IGN"
 },
 "https://ingamenews.com/indie/every-official-meccha-chameleon-map-ranked-from-worst-to-best/": {
  "zh-CN": "InGameNews — 全部官方地图排名",
  "zh-TW": "InGameNews — 全部官方地圖排名",
  "ja": "InGameNews — 公式マップ全ランキング",
  "ko": "InGameNews — 공식 맵 전체 순위",
  "es": "InGameNews — todos los mapas oficiales, clasificados"
 },
 "https://www.gameshedge.com/meccha-chameleon-best-hiding-spots-guide/": {
  "zh-CN": "GameShedge — 每张地图最佳躲藏点",
  "zh-TW": "GameShedge — 每張地圖最佳躲藏點",
  "ja": "GameShedge — 全マップの隠れ場所ガイド",
  "ko": "GameShedge — 맵별 최고의 숨는 장소 가이드",
  "es": "GameShedge — mejores escondites de cada mapa"
 },
 "https://widgets.sportskeeda.com/esports/5-best-meccha-chameleon-maps-based-famous-video-games": {
  "zh-CN": "Sportskeeda — 5 张最佳游戏灵感地图",
  "zh-TW": "Sportskeeda — 5 張最佳遊戲靈感地圖",
  "ja": "Sportskeeda — 有名ゲーム由来のベスト5マップ",
  "ko": "Sportskeeda — 유명 게임 기반 베스트 5 맵",
  "es": "Sportskeeda — los 5 mejores mapas basados en juegos famosos"
 },
 "https://isthereanydeal.com/product/019e2737-daa0-73e3-bd42-5a3bdc0b703d/": {
  "zh-CN": "isThereAnyDeal — 超级变色龙",
  "zh-TW": "isThereAnyDeal — 超級變色龍",
  "ja": "isThereAnyDeal — メチャカメレオン",
  "ko": "isThereAnyDeal — MECCHA CHAMELEON",
  "es": "isThereAnyDeal — MECCHA CHAMELEON"
 },
 "https://www.slashskill.com/meccha-chameleon-cheats-and-hacks-whats-real-and-whats-not/": {
  "zh-CN": "SlashSkill — 作弊与外挂详解",
  "zh-TW": "SlashSkill — 作弊與外掛詳解",
  "ja": "SlashSkill — チートとハック解説",
  "ko": "SlashSkill — 치트와 핵 해설",
  "es": "SlashSkill — trucos y hacks explicados"
 },
 "https://www.ign.com/wikis/meccha-chameleon/Meccha_Chameleon_Patch_Notes_July_20,_2026": {
  "zh-CN": "IGN 维基 — 2026-07-20 补丁说明",
  "zh-TW": "IGN 維基 — 2026-07-20 補丁說明",
  "ja": "IGN Wiki — 2026-07-20 パッチノート",
  "ko": "IGN 위키 — 2026-07-20 패치 노트",
  "es": "Wiki de IGN — notas del parche del 20 de julio de 2026"
 },
 "https://changelog.gg/games/meccha-chameleon-4704690": {
  "zh-CN": "Changelog.gg — 超级变色龙",
  "zh-TW": "Changelog.gg — 超級變色龍",
  "ja": "Changelog.gg — メチャカメレオン",
  "ko": "Changelog.gg — MECCHA CHAMELEON",
  "es": "Changelog.gg — MECCHA CHAMELEON"
 },
 "https://gamingonsteam.com/2026/06/22/can-you-play-mecha-chameleon-on-the-steam-deck-review-best-settings/": {
  "zh-CN": "GamingOnSteam — Steam Deck 评测与设置",
  "zh-TW": "GamingOnSteam — Steam Deck 評測與設定",
  "ja": "GamingOnSteam — Steam Deck レビュー＆設定",
  "ko": "GamingOnSteam — Steam 덱 리뷰 & 설정",
  "es": "GamingOnSteam — análisis y ajustes de Steam Deck"
 },
 "https://www.wikihow.com/Meccha-Chameleon-Controls": {
  "zh-CN": "wikiHow — 超级变色龙操作",
  "zh-TW": "wikiHow — 超級變色龍操作",
  "ja": "wikiHow — メチャカメレオン操作",
  "ko": "wikiHow — 메카 카멜레온 조작",
  "es": "wikiHow — Controles de Meccha Chameleon"
 },
 "https://www.thegamer.com/steam-summer-sale-2026-top-selling-chart/": {
  "zh-CN": "TheGamer — Steam 夏促畅销榜",
  "zh-TW": "TheGamer — Steam 夏促暢銷榜",
  "ja": "TheGamer — Steam サマーセールの売上チャート",
  "ko": "TheGamer — Steam 여름 세일 판매 차트",
  "es": "TheGamer — gráficas de ventas del Steam Summer Sale"
 }
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
