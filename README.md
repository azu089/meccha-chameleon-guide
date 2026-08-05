# 热词游戏站项目 · 追踪总览

> 生财有术 8 月航海「AI 产品（国外-热词游戏站）」｜2026.08.05 起
> 主词候选：**Meccha Chameleon（超级变色龙）**（阶段1终验通过，Trends 30天曲线待环境恢复补验）

## 📁 目录结构
```
game-site/
├── README.md          ← 本文件：项目状态追踪
├── docs/              ← 决策与研究报告
│   ├── 选词判断表.md
│   ├── 候选词研究报告.md
│   ├── 域名可用性报告与购买方案.md
│   └── 启动配置与执行总结.md
├── site/              ← 网站工程（数据驱动生成器）
│   ├── data/site.json    # 唯一需要手写的数据（游戏/域名/页面/内容）
│   ├── scripts/generate.js
│   ├── templates/style.css
│   └── public/           # 生成产物（部署此目录）
├── content/           ← 内容素材（每页 1-2 个可靠来源 + 草稿）
└── deploy/            ← 部署记录（域名/DNS/Cloudflare/GSC/GA）
```

## ✅ 进度
- [x] 手册通读（关卡 0-1 开放内容 + 活动简介）
- [x] 候选词预筛（联想词 API + SERP 实测，7 词 → 4 强）
- [x] 选词判断表（初版 + 2026-08-05 终验版：SERP 复核 / 联想词刷新 / KD 估计 / 需求代理）
- [x] 老手建站模板（数据驱动生成器，本地验证通过）
- [x] 域名可用性实测（Spaceship API 8 候选）
- [x] **阶段 1 终验核心结论**：Meccha Chameleon 通过（主词开放 + 澄清型长尾充足 + KD 相对最低 + ~70k 当前在线需求持续）
- [ ] Google Trends 30 天曲线（⚠️ 环境仍 429，低频单次重试中；已用 Steam 玩家数+销量曲线代理）
- [x] Spaceship API 全自动链路打通（凭据/可用性/联系人已验证）
- [x] **域名注册成功**（Spaceship API，autoRenew=false，¥59.96 扣余额）
- [x] 内容正式版（13 页 × 3 语全量内容 + 每页来源；事实已核对：24 人/2-12 推荐、4 模式含 Reverse Chicken Race、7 基础地图，与 Wikipedia/Steam 一致）
- [x] **部署上线**（Cloudflare Pages + 自定义域名 HTTPS ✅）
- [x] **v2 高端视觉重构**（深色高级主题 + Seedream hero 主视觉 + 卡片网格 + FAQ 手风琴 + 字体，2026-08-05 深夜上线）
- [x] **图片缩放修复**（srcset 响应式 640/1280/3136w + CSS 版本号防缓存 + overflow-x 防护，Chrome 实测通过）
- [x] **安装 UI UX Pro Max skill**（~/.codex/skills/ui-ux-pro-max，设计智能数据库，Gaming 产品类型推荐与本主题吻合）
- [x] **GSC 已接入**（域名资源已创建+Cloudflare 授权验证+sitemap 已提交）
- [x] GA4 接入（G-9MC60XVEJZ 已注入，gtag 线上验证通过）
- [x] **UI UX Pro Max 应用**（SVG 图标替换 emoji + focus-visible + hero preload，已部署）
- [x] **多语言 en/zh/ja**（hreflang + 语言下拉带国旗 + 11页×3语全量翻译）
- [x] **导航重构**（Home + 攻略下拉 + 语言下拉，消除堆积）
- [x] **内容丰富 v2**（+Controls/联机页 + 控制表 + FAQ 扩充 + 子页配图，共 13 页×3语）
- [x] **交互打磨**（下拉点击空白/Esc 收起 + 语言横幅 + 下拉动画）
- [x] **子页面布局修复**（侧栏 300px + 图标 16px + 本页目录 TOC + logo 恢复变色龙）

## 🔑 关键决策
| 项 | 结论 |
|---|---|
| 主词 | **Meccha Chameleon（终验通过）**：主词 SERP 无 Fandom/IGN 占位 + 澄清型长尾（achievements/release date/设备版/更新日志）KD 20-35 + 需求持续（~70k 当前在线）；避开已饱和的 modes/maps/tips 攻略位 |
| 域名 | 首选 mecchachameleonguides.com（Spaceship API 注册，¥59.96 首年；⛔ 需账户钱包余额 ≥¥60） |
| 技术栈 | 纯静态 HTML + 数据驱动生成器 + Cloudflare Pages |
| 变现 | AdSense + 游戏联盟（Humble/Nexus.gg），上线后接 |

## ⏳ 待办（最近）
1. **Google Trends 恢复** → 单次低频重试 30 天曲线 + 区域分布 → 补进选词判断表（已用需求代理，不阻塞决策）
2. 用户网页充值 Spaceship 钱包余额 ≥¥60（绑卡/支付宝只是充值方式，API 注册走余额）
3. 充值完成后：API 注册 mecchachameleonguides.com（autoRenew=false, years=1, privacyProtection high, 联系人 1Ig0WBTN3VE2qmNrEDbzJzfdJBWBX）→ 轮询 async-operations
4. nameserver → Cloudflare → Cloudflare Pages 部署 site/public（build: node scripts/generate.js）
5. ~~修 site.json 事实（玩家数/模式/地图）→ 补正式内容~~ ✅ 已完成（2026-08-06）
6. ~~GSC 提交 sitemap + GA4~~ ✅ 已完成（sitemap 已提交，GA4 G-9MC60XVEJZ 已接入）
7. 全面审计修复（2026-08-06）：JSON-LD 数组化、Guides 下拉视口修复、来源链接化、update-log 更新至 3.5.3、FAQ 增补（VR 仿冒/当前版本）、404/关于/隐私页扩写、SEO 标题精简 —— 详见 docs/站点全面审计报告-2026-08-06.md

## 🔗 关联
- 交付文档（outputs/）：航海手册内容摘录、项目评估与作战计划
- 工作区（work/）：抓取原始数据、模板草稿

---

## 🚀 新对话启动指令（复制到新会话第一条消息）
```
继续「热词游戏站」项目。项目在 /Users/azu/Documents/Codex/热词游戏站/（先读 README.md 和 deploy/连接状态与部署计划.md）。

当前状态：
- 主词候选 = Meccha Chameleon（超级变色龙），但【用户要求重新验证选词，验证可行才开工】
- Spaceship API 已打通：凭据在 deploy/spaceship-credentials.env（权限600，勿外传/勿提交），Base=https://spaceship.dev/api，认证 X-Api-Key + X-Api-Secret
- 首选域名 mecchachameleonguides.com 可用（网页价 ¥59.96 首年），联系人已复用（账户已有），账户已有6个域名（已验证）
- ⛔ 唯一卡点：API 注册需要【账户钱包余额】（绑定的卡/支付宝只是充值方式，不能直接 API 扣费）→ 需用户网页充值余额 ≥¥60

今天按顺序执行：
阶段1（选词终验，用户要求重新做）：
1. Google Trends 验证：Meccha Chameleon 及候选词 vs 基准（如 gpt/wordle 等），近30天曲线 + 区域分布；若限流等冷却重试
2. SERP/竞争复核：主词首页 + 长尾（modes/tips/faq/maps/codes），确认差异化空间
3. KD 验证（SimilarWeb 或可用免费替代）→ 结论写进 docs/选词判断表.md
4. 【只有验证通过才进入阶段2，否则回退候选词】

阶段2（验证通过后）：
5. 请用户网页充值 Spaceship 钱包余额 ≥¥60（我无法代充，涉及支付）
6. API 注册 mecchachameleonguides.com（autoRenew=false, years=1, privacyProtection high, 复用联系人 1Ig0WBTN3VE2qmNrEDbzJzfdJBWBX）→ 轮询 async-operations
7. nameserver 指向 Cloudflare → Cloudflare Pages 部署 site/public（build: node scripts/generate.js）
8. GSC 提交 sitemap + GA4（site.json 填 ID）

约束：全自动化、API 优先（不要 UI 测试）；凭据勿贴聊天；正式内容每页 1-2 可靠来源，禁止 AI 编造。
```

## 决策记录
| 问题 | 决策 |
|---|---|
| 域名现在买还是等站搭好？ | **现在买**（抢窗口+成本$11可忽略+选词证据已充分） |
| 手机号验证？ | API 注册硬性要求（官方文档+注册指南确认），1 分钟 SMS 验证 |
| 充值？ | API 用余额；绑卡后开「自动充值」即可，无需手动充 |
| 深度研究？ | 做 1 轮聚焦对标（竞品页面清单+缺口→页面矩阵），不无限研究 |
| 新对话启动？ | 是（本会话工具状态已乱，项目已全部落盘，用上面启动指令无缝接上） |
