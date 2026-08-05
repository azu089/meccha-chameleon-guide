# 热词游戏站 · 老手可复用模板（MecchaGuide）

> 一个数据驱动的静态游戏攻略站模板。改 `data/site.json` → 跑一次生成器 → 得到整站。
> 定位 = 手册选修篇「关卡 7-8」：模板化 + 批量做内页。一套模板复制 N 个站。

## 为什么这样设计（老手打法）
1. **数据与页面分离**：所有内容在 `data/site.json`，页面由 `scripts/generate.js` 生成 → 换游戏只改数据，不改代码
2. **批量内页天然支持**：`pages` 数组加一项 = 自动生成新页面 + 更新 sitemap + 首页卡片
3. **SEO 内置**：canonical / meta / OG / JSON-LD（Article / FAQPage / BreadcrumbList / WebSite）/ sitemap / robots / ads.txt 全套
4. **零依赖**：纯 Node 标准库 + 纯 CSS，无框架，秒开，Core Web Vitals 友好
5. **变现占位**：AdSense ID / GA4 ID 在 site.json 一处配置，全站生效

## 快速开始
```bash
# 1. 改数据（游戏名、域名、页面、内容全部在这里）
vim data/site.json

# 2. 生成站点
node scripts/generate.js

# 3. 本地预览
npx serve public   # 或 python3 -m http.server public
```

## 部署（Cloudflare Pages）
1. 代码推到 GitHub 仓库
2. Cloudflare Pages → Create project → 连接仓库
3. Build command: `node scripts/generate.js`；Build output: `public`
4. 绑定域名后：把 `site.json` 的 `domain` 改成正式域名，重新生成

## 接入 GSC / GA / AdSense
在 `data/site.json` 里填：
- `site.gscVerification`：Google Search Console 的验证 meta content
- `site.gaId`：GA4 的 Measurement ID（G-XXXXXXX）
- `site.adsenseId`：AdSense 的 client ID（ca-pub-XXXXXXX）
改完重新 `node scripts/generate.js` 即可，全站生效。

## 上线后（关卡 5-6）
1. GSC 提交 `sitemap.xml`，等收录
2. GA 观察流量来源
3. 每周用 GSC「搜索查询」看真实进词 → 没排上的词 → 补内页（往 `pages` 加数据 → 重新生成）
4. 收录稳定后 AdSense 申请 → 填 `adsenseId` → 广告位自动出现

## 换一个游戏 = 复制一个站
```bash
cp -r site my-second-site
# 只改 data/site.json 的游戏名/域名/页面内容
node scripts/generate.js
```

## 目录结构
```
site/
├── data/site.json        # ★ 所有站点/游戏/页面数据（唯一需要手写的地方）
├── scripts/generate.js   # 站点生成器（Node 标准库，零依赖）
├── templates/style.css   # 设计系统（纯 CSS）
└── public/               # 生成产物（部署这个目录）
    ├── index.html        # 首页（hero + 指南卡片网格 + 游戏介绍 + 快速问答）
    ├── how-to-play.html  # 内页示例（步骤/列表/表格/FAQ 四种区块）
    ├── achievements.html # 内页示例（表格）
    ├── tier-list.html    # 内页示例
    ├── faq.html          # FAQ 页（JSON-LD FAQPage 自动生成）
    ├── about.html / privacy.html / contact.html
    ├── 404.html / sitemap.xml / robots.txt / ads.txt
    └── css/style.css
```

## 内容区块类型（site.json 的 sections[].type）
| type | 渲染 | 适合 |
|---|---|---|
| `steps` | 编号步骤列表 | How-to、攻略流程 |
| `list` | 项目符号列表 | 模式介绍、物品清单 |
| `table` | 表格（columns+rows） | 成就表、Tier List、参数表 |
| `faq` | 问答折叠（+FAQPage JSON-LD） | 常见问题（利于谷歌富摘要） |

> 注意：当前 `data/site.json` 里是 Meccha Chameleon 的**示例草稿数据**（占位内容），等 Google Trends/KD 验证锁定主词后替换成真实内容。
