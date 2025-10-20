# Product development workflow

**Created:** 10/19/2025 16:39:27  
**Updated:** 10/19/2025 16:46:18  
**Exported:** 10/19/2025 17:50:47  
**Link:** [https://chatgpt.com/c/68f54c7f-2ca0-8330-a801-f2fa90ea01b5](https://chatgpt.com/c/68f54c7f-2ca0-8330-a801-f2fa90ea01b5)  

## Prompt:
Ah, I see now! You want to understand the standard product development workflow that tech companies use - the actual process/methodology from idea to launch. Let me clarify:

Are you asking about:

1. **The formal product development framework** (like how companies go from "we want to build a skin analysis app" through stages like: Discovery → Requirements → Design → Development → Testing → Launch)?

2. **The specific deliverables and artifacts** at each stage (like PRDs, technical specs, design systems, sprint planning)?

3. **The roles and handoffs** (when does Product hand off to Design, when does Design hand to Engineering)?

4. **The decision-making process** (how do companies decide on features, prioritize, cut scope)?

Also, are you more interested in:
- **Startup methodology** (lean, move fast, iterate quickly)
- **Enterprise methodology** (more structured, gate reviews, formal documentation)
- **Modern tech company approach** (like how Spotify, Airbnb, or similar companies work)

this is what i am intreseted in , can you give me an answer for it?

## Response:
Request for GPT-5 Pro

Reasoned for 4m 18s

Great—let’s cover all four parts you asked about (framework, deliverables, roles/handoffs, decision‑making) and show how the workflow differs for startups, enterprises, and “modern tech” orgs.

* * *

1) The end‑to‑end product development workflow (idea → launch)
--------------------------------------------------------------

A practical, battle‑tested flow many tech companies use is **dual‑track agile**: continuous _discovery_ in parallel with _delivery_. Here’s the full path with the usual gates.

### A. Strategy & Alignment

**Goal:** Decide _why_ and _what outcomes_ to pursue.  
**Activities:** Define vision, target customers, and measurable outcomes (OKRs/North Star metric). Build an initial opportunity backlog.  
**Gate:** Leadership/portfolio review (“are these the right bets?”).

### B. Discovery (problem + solution)

**Goal:** De‑risk value, usability, feasibility before coding.  
**Activities:**

*   **Problem discovery:** Customer interviews, JTBD, data analysis, competitive scan, define the “job to be done.”
*   **Solution discovery:** Sketches, prototypes, assumption mapping, quick usability tests.
*   **Tech spikes:** Prove feasibility, assess risks, choose architecture direction.  
    **Gate:** Discovery review / “Definition of Ready” for a first slice.

### C. Definition & Planning

**Goal:** Turn the winning approach into a shippable plan.  
**Activities:** Write a lightweight PRD/One‑Pager, define scope & success metrics, slice into increments, create a rollout plan (feature flags/canary), align dependencies.  
**Gate:** Cross‑functional planning review (PM+Design+Eng+Data+PMM).

### D. Design

**Goal:** Produce specs the team can build and test against.  
**Activities:** User flows, wireframes → hi‑fi comps; component specs from the design system; copy/content design; accessibility acceptance criteria.  
**Gate:** Design crit & dev review; accessibility check.

### E. Technical Design

**Goal:** Commit to how it will be built.  
**Activities:** Tech spec, data model, API contracts, sequence/architecture diagrams, NFRs (perf, security, reliability), observability plan.  
**Gate:** Architecture/security/privacy review; ADRs recorded.

### F. Implementation (Delivery)

**Goal:** Ship value safely and continuously.  
**Activities:** Trunk‑based dev, code reviews, CI/CD, automated tests, instrumentation, migrations, docs. Build behind feature flags; run small slices to production.  
**Gate:** Definition of Done per story; build health SLOs.

### G. Verification & Readiness

**Goal:** Ensure it works, is safe, and the org is ready.  
**Activities:** QA test plans, regression & accessibility tests, UAT (as needed), performance checks, privacy & threat‑model sign‑offs, support runbook, GTM assets, training.  
**Gate:** Go/No‑Go (release readiness) with rollback plan.

### H. Launch & Rollout

**Goal:** Minimize risk while validating outcomes.  
**Activities:** Dark launch → canary → staged rollout; A/B tests; marketing comms; sales enablement (B2B). Monitor guardrails (errors, latency, crash‑free sessions).  
**Gate:** Progressive expansion criteria met; incident plan ready.

### I. Post‑Launch & Iterate

**Goal:** Learn and compound.  
**Activities:** Readout against success metrics, experiment results, support feedback, backlog updates, post‑mortems if needed. Plan next bets or deprecations.

* * *

2) Deliverables & artifacts (by stage)
--------------------------------------

> Right‑size these to your company stage; “lightweight but complete” beats “heavy and stale.”

| Stage | Core deliverables (most common) |
| --- | --- |
| Strategy | Vision/strategy brief, target customer/segments, North Star metric, annual/quarterly OKRs, opportunity backlog |
| Discovery | Problem brief & JTBD, user research plan + insights, assumption map, competitive/market notes, feasibility spike notes, opportunity solution tree |
| Definition | **PRD / One‑Pager** (goals, users, scenarios, requirements, measures, risks), success metrics & telemetry plan, RICE/WSJF sheet, Now/Next/Later roadmap, rollout plan |
| Design | User flows, wireframes & high‑fi comps, interactive prototype, spec notes (states, errors, empty states), content guidelines, accessibility checklist |
| Tech Design | Technical spec, architecture & sequence diagrams, API schemas, data model, ADRs, NFRs, migration plan, observability dashboards |
| Delivery | User stories with acceptance criteria, test cases, automated test coverage report, feature flags, dashboards & alerts |
| Readiness | Security/threat model, privacy/DPIA (as needed), performance report, QA sign‑off, support runbook & playbooks, GTM brief, enablement deck/FAQ |
| Launch | Release notes, change log, incident/rollback plan, staged rollout plan |
| Post‑Launch | Metrics readout, experiment report, retrospective, next‑step backlog |

**PRD (lightweight) outline you can copy:**

```
1) Context & problem
2) Goals (success metrics / guardrails)
3) Users & key scenarios (JTBD)
4) Requirements (functional) & NFRs
5) Out of scope / assumptions
6) Telemetry & experiment plan
7) Rollout & launch plan (flags, canary)
8) Dependencies & risks
9) Support/ops, accessibility, privacy/security notes
```

**Technical spec outline:**

```
1) Overview & rationale
2) Architecture diagram & sequence flows
3) Data model & API contracts (schemas)
4) NFRs: performance, reliability, security, privacy
5) Observability: logs, metrics, alerts, dashboards
6) Migrations & rollout/rollback strategy
7) Testing strategy (unit/integration/E2E)
8) Risks, alternatives considered, open questions
9) Milestones & ownership
```

* * *

3) Roles & handoffs (really: collaboration touchpoints)
-------------------------------------------------------

Think “shared responsibility with clear accountability,” not a baton pass.

**Core roles**

*   **PM (Product Manager):** Outcome owner, problem framing, prioritization, PRD, success metrics.
*   **Design (Product/UX + Content):** User flows, interaction patterns, prototypes, accessibility, content.
*   **Eng Manager / Tech Lead:** Feasibility, estimates, tech spec, quality bar, delivery.
*   **QA/SET:** Test strategy, automation, quality gates.
*   **Data/Analytics:** Experiment design, telemetry, dashboards.
*   **PMM / GTM:** Positioning, launch, enablement.
*   **Security/Privacy/Legal/Compliance:** Reviews & approvals where required.
*   **Support/Success/Sales (B2B):** Readiness, feedback loop.

**Key handoff points (as joint reviews):**

*   **Discovery review:** PM+Design+Eng agree on problem & riskiest assumptions.
*   **Design crit & dev review:** Design specs meet feasibility; acceptance criteria set.
*   **Architecture/security review:** Tech spec & ADRs approved.
*   **Go/No‑Go:** Readiness checklist across PM/Eng/QA/PMM/Support; rollback rehearsed.
*   **Post‑launch readout:** Data + learnings → next steps.

**Sample RACI for major artifacts**

| Artifact | A | R | C | I |
| --- | --- | --- | --- | --- |
| Strategy/OKRs | Head of Product | PM | Eng Mgr, PMM | All |
| PRD | PM | PM | Design, Eng TL, Data | Stakeholders |
| Design spec | Design Lead | Design | PM, Eng TL, QA | Support/PMM |
| Tech spec | Eng TL | Eng TL | PM, Design, Security | Stakeholders |
| Test plan | QA Lead | QA | Eng TL, PM | Team |
| GTM/Launch brief | PMM | PMM | PM, Sales/Support | All |
| Support runbook | Support Lead | Support | PM, Eng TL | PMM |

_A = Accountable, R = Responsible, C = Consulted, I = Informed_

* * *

4) Decision‑making & prioritization
-----------------------------------

**a) Portfolio & roadmap**

*   Tie bets to **OKRs** and a **North Star metric**.
*   Keep a **Now / Next / Later** roadmap (capacity‑aware, not calendar‑stuffed).

**b) Prioritization frameworks**

*   **RICE** = Reach × Impact × Confidence ÷ Effort
    *   _Example:_
        *   Feature A: 5,000 users/month × 2 (med impact) × 0.7 ÷ 3 PMs ≈ **2,333**
        *   Feature B: 2,500 × 3 (high) × 0.8 ÷ 1 ≈ **6,000** → **higher priority**
*   **WSJF** (Scaled Agile): Cost of Delay ÷ Duration
    *   _Example:_ F1 CoD=18, Dur=3 → **6**; F2 CoD=24, Dur=6 → **4** → ship F1 first.
*   Complement with **Kano**, **MoSCoW**, or **ICE** for quick triage.
*   Use **two‑way vs. one‑way door** thinking: reversible decisions need less ceremony.

**c) Scope management**

*   Prefer **vertical slices** that deliver end‑to‑end user value.
*   Define an **MVP** (learn fastest), **MMF** (marketable), or **MLP** (lovable) depending on context.
*   Cut scope with a **kill list** (nice‑to‑haves to drop first) agreed at planning time.

**d) Risk management**

*   Keep a **RAID** log (Risks, Assumptions, Issues, Dependencies).
*   Record **ADRs** for key technical choices to avoid architectural drift.

**e) Experimentation**

*   Pre‑define **primary success metric** and **guardrails** (e.g., error rate, latency, churn).
*   Launch behind **feature flags**, run **A/B** or phased rollouts, and decide by **pre‑registered** criteria.

* * *

How this varies by company type
-------------------------------

### Startup (lean, move fast)

*   **Docs:** One‑pager PRDs, combined design/tech notes.
*   **Cadence:** Weekly/bi‑weekly releases; 2–4 week discovery→build cycles.
*   **Decisioning:** Founder/PM‑led; RICE/ICE; quick experiments, smoke tests.
*   **Risk controls:** Lightweight; privacy/security reviews proportional to data sensitivity.
*   **Tooling:** Feature flags early to learn safely.
*   **Watch‑outs:** Don’t skip instrumentation, accessibility, or rollback plans.

### Enterprise (structured, governed)

*   **Docs:** Formal PRDs, tech specs, DPIA/PIA, threat models, audit trails.
*   **Cadence:** Release trains or CAB windows; more dependencies & sign‑offs.
*   **Decisioning:** Portfolio steering committees; WSJF and business cases common.
*   **Risk controls:** Mandatory security, privacy, compliance (e.g., SOC 2, HIPAA), accessibility.
*   **Tooling:** Change management, separation of duties, approvals.
*   **Watch‑outs:** Prevent stage‑gates from stalling learning; keep discovery continuous.

### Modern tech orgs (e.g., Spotify‑style squads)

*   **Structure:** **Product trios** (PM+Design+Eng) inside **squads/tribes**; platform teams.
*   **Cadence:** Continuous delivery, trunk‑based, high automation.
*   **Decisioning:** Outcome‑driven via OKRs; dual‑track discovery; strong A/B culture.
*   **Risk controls:** Automated tests/quality gates; privacy/security embedded in pipelines.
*   **Watch‑outs:** Ensure cross‑squad alignment and reduce duplicated work via platform standards.

* * *

Cadence & ceremonies (typical)
------------------------------

*   **Weekly:** Backlog refinement, design crit, bug/incident triage.
*   **Per sprint (1–2 weeks):** Planning (sizing/commit), daily stand‑ups, demo, retro.
*   **Monthly/Quarterly:** Roadmap review vs OKRs; portfolio re‑prioritization.
*   **Before launch:** Go/No‑Go (checklist‑driven), comms finalization, on‑call readiness.

* * *

Quality bars & checklists (copy/paste)
--------------------------------------

**Definition of Ready (DoR) for a story**

*   User story + acceptance criteria
*   Designs linked (incl. empty/error states)
*   Telemetry events defined
*   Dependencies resolved / feature flag planned
*   Test approach agreed (unit/integration/E2E)
*   Non‑functional requirements noted

**Definition of Done (DoD)**

*   Code reviewed & merged; tests green with agreed coverage
*   Observability in place (metrics, logs, alerts)
*   Accessibility checks passed
*   Docs updated (runbook, playbooks, change log)
*   Security/privacy checks done (as needed)
*   Behind a flag or safely rolled out per plan

**Go/No‑Go essentials**

*   Rollback & comms templates ready
*   Monitoring dashboards live; owners on‑call
*   Guardrails and success metrics agreed
*   Support/Sales briefed; status page plan set

* * *

Launch patterns (how to ship safely)
------------------------------------

*   **Dark launch:** Infra live, users don’t see it yet.
*   **Canary:** 1–5% audience; watch guardrails.
*   **Staged rollout:** 10% → 25% → 50% → 100% based on thresholds.
*   **Beta/EAP:** Opt‑in target users; fast feedback loop.
*   **Big bang:** Rare—only when necessary and fully rehearsed.

* * *

Metrics that matter
-------------------

*   **North Star:** The value proxy you’re trying to grow (e.g., weekly active collaborators).
*   **Input vs output:** Inputs you can control (ship cadence, quality) vs outputs you aim to move (retention, revenue).
*   **Guardrails:** Reliability & experience (e.g., p95 latency, crash‑free sessions).
*   **Instrumentation plan:** Event names, properties, sampling, data retention, privacy notes.
*   **Readouts:** Within 1–2 weeks of launch, then again at 30/60/90 days.

* * *

Common pitfalls (and fixes)
---------------------------

*   **Handoffs as throw‑overs** → Replace with joint reviews and embedded collaboration.
*   **Massive PRDs/designs** → Ship smaller; keep docs living.
*   **QA at the end** → Shift-left testing; automate from day one.
*   **“Shipped = Done”** → Not until it meets outcomes and guardrails.
*   **No telemetry** → Instrument before launch; rehearse dashboards.
*   **Unclear ownership** → RACI + visible owners in every artifact.

* * *

Quick starter kit (you can adopt tomorrow)
------------------------------------------

1.  Create a **one‑page PRD** template (above) and use it for every initiative.
2.  Stand up **feature flags** and a **staged rollout** practice.
3.  Define **DoR / DoD** and a lightweight **Go/No‑Go** checklist.
4.  Run dual‑track: 1 discovery slice + 1 delivery slice every sprint.
5.  Pick one scoring method (**RICE** or **WSJF**) and use it consistently.
6.  Add **observability dashboards** to your “Definition of Done.”
7.  Hold a monthly **OKR readout**; drop or double‑down based on data.

* * *

If you want, tell me your team size, risk constraints (e.g., regulated vs. not), and release cadence. I’ll adapt this into a tailored playbook with a RACI and checklists sized to your context.

## Prompt:
上面内容准确的中文翻译，一字不啦，保持格式

## Response:
Thought for 19s

太好了——我们就按照你提的四个部分来讲（流程框架、产出物、角色/衔接、决策方式），并说明在初创、企业与“现代科技公司”三种组织形态下各有何不同。

* * *

1) 端到端的产品开发流程（从想法 → 上线）
-----------------------

很多科技公司采用**双轨敏捷（dual-track agile）**：\*发现（Discovery）_与_交付（Delivery）\*并行。下面是完整路径与常见关卡。

### A. 战略与对齐（Strategy & Alignment）

**目标：** 明确_为什么做_、_要达成的业务结果_。  
**活动：** 制定愿景、目标用户与可度量的结果（OKR/北极星指标）；建立初步的机会清单。  
**关卡：** 领导/组合评审（“这些赌注对吗？”）。

### B. 发现（问题 + 方案）

**目标：** 在写代码前，降低价值、可用性、可行性三方面的风险。  
**活动：**

*   **问题发现：** 客户访谈、JTBD、数据分析、竞品扫描，定义“待完成的工作”。
*   **方案发现：** 草图、原型、假设映射、快速可用性测试。
*   **技术 Spike：** 验证可行性，评估风险，确定架构方向。  
    **关卡：** 发现评审 / “就绪定义（Definition of Ready）”以通过首个切片。

### C. 定义与规划（Definition & Planning）

**目标：** 把优选方案转化为可交付的计划。  
**活动：** 撰写轻量 PRD/一页纸；定义范围与成功指标；切分增量；制定灰度/金丝雀发布计划；对齐依赖。  
**关卡：** 跨职能规划评审（PM+设计+工程+数据+PMM）。

### D. 设计（Design）

**目标：** 产出团队可据此构建与测试的规格。  
**活动：** 用户流程、线框 → 高保真；基于设计系统的组件规格；文案/内容设计；无障碍验收标准。  
**关卡：** 设计评审与开发评审；无障碍检查。

### E. 技术设计（Technical Design）

**目标：** 明确“怎么实现”。  
**活动：** 技术方案、数据模型、API 契约、时序/架构图、NFR（性能、安全、可靠性）、可观测性方案。  
**关卡：** 架构/安全/隐私评审；记录 ADR。

### F. 实施交付（Implementation/Delivery）

**目标：** 持续且安全地交付价值。  
**活动：** 主干开发、Code Review、CI/CD、自动化测试、埋点、迁移、文档；功能开关；以小切片持续上线。  
**关卡：** 每个故事满足“完成定义（DoD）”；构建健康 SLO。

### G. 验证与发布就绪（Verification & Readiness）

**目标：** 确认好用、安全，且组织已准备就绪。  
**活动：** QA 测试计划、回归与无障碍测试、UAT（如需要）、性能检查、隐私与威胁建模签核、支持运行手册、GTM 资产与培训。  
**关卡：** Go/No-Go（发布就绪）并有回滚预案。

### H. 上线与灰度（Launch & Rollout）

**目标：** 在最小风险下验证效果。  
**活动：** 暗发布 → 金丝雀 → 分阶段放量；A/B 测试；市场传播；（B2B）销售赋能。监控护栏（报错、延迟、崩溃率）。  
**关卡：** 达到逐步扩量标准；事件应急预案就绪。

### I. 上线后与迭代（Post-Launch & Iterate）

**目标：** 学习并复利。  
**活动：** 对照成功指标复盘；实验结果；支持反馈；更新待办；必要时做复盘/事后检讨；规划下一步或下线。

* * *

2) 各阶段的产出物（Artifacts）
---------------------

> 根据公司阶段“适配化”：**轻量而完整**胜过**厚重却过时**。

| 阶段 | 核心产出（最常见） |
| --- | --- |
| 战略 | 愿景/战略简报、目标客群/细分、北极星指标、年度/季度 OKR、机会清单 |
| 发现 | 问题简报 & JTBD、用户研究计划与洞察、假设图、竞品/市场笔记、可行性 Spike 笔记、机会-方案树 |
| 定义 | **PRD / 一页纸**（目标、用户、场景、需求、度量、风险）、成功指标与埋点方案、RICE/WSJF 表、Now/Next/Later 路线图、放量/灰度方案 |
| 设计 | 用户流、线框 & 高保真、交互原型、规格（状态、错误、空状态）、内容指南、无障碍清单 |
| 技术设计 | 技术方案、架构/时序图、API Schema、数据模型、ADR、NFR、迁移方案、可观测性仪表盘 |
| 交付 | 用户故事与验收标准、测试用例、自动化覆盖报告、功能开关、仪表盘与告警 |
| 就绪 | 安全/威胁建模、隐私/DPIA（如需）、性能报告、QA 签核、支持运行手册 & 预案、GTM 简报、赋能材料 |
| 上线 | Release Notes、变更日志、事件/回滚预案、分阶段放量计划 |
| 上线后 | 指标读数、实验报告、回顾、后续待办 |

**轻量 PRD 模板（可复制）：**

```
1) 背景与问题
2) 目标（成功指标 / 护栏）
3) 用户与关键场景（JTBD）
4) 功能需求（FR）与 NFR
5) 范围外 / 假设
6) 埋点与实验计划
7) 上线与灰度方案（功能开关、金丝雀）
8) 依赖与风险
9) 运营/支持、无障碍、隐私/安全说明
```

**技术方案模板：**

```
1) 概述与动机
2) 架构图与时序流程
3) 数据模型与 API 契约（Schema）
4) 非功能要求：性能、可靠性、安全、隐私
5) 可观测性：日志、指标、告警、仪表盘
6) 迁移与上线/回滚策略
7) 测试策略（单元/集成/E2E）
8) 风险、备选方案、未决问题
9) 里程碑与负责人
```

* * *

3) 角色与衔接（更准确说：协作触点）
-------------------

倡导“**共同负责 + 明确归属**”，而不是“丢球式交接”。

**核心角色**

*   **PM（产品经理）：** 结果负责人；问题定义、优先级、PRD、成功指标。
*   **设计（产品/UX + 内容）：** 用户流程、交互模式、原型、无障碍、内容。
*   **工程经理 / 技术负责人：** 可行性、预估、技术方案、质量标准、交付。
*   **QA/SET：** 测试策略、自动化、质量关口。
*   **数据/分析：** 实验设计、埋点、仪表盘。
*   **PMM / GTM：** 定位、发布、赋能。
*   **安全/隐私/法务/合规：** 审查与批准（按需）。
*   **支持/成功/销售（B2B）：** 发布就绪、反馈闭环。

**关键交接点（以联合评审为主）：**

*   **发现评审：** PM+设计+工程对问题与最关键假设达成一致。
*   **设计评审 & 开发评审：** 设计规格满足可实现性；明确验收标准。
*   **架构/安全评审：** 技术方案与 ADR 获批。
*   **Go/No-Go：** 基于就绪清单的 PM/Eng/QA/PMM/支持联审；演练回滚。
*   **上线后读数：** 以数据与学习反哺后续计划。

**典型 RACI（部分产出）**

| 产出 | A | R | C | I |
| --- | --- | --- | --- | --- |
| 战略/OKR | 产品负责人 | PM | 工程经理、PMM | 全体 |
| PRD | PM | PM | 设计、技术负责人、数据 | 利益相关者 |
| 设计规格 | 设计负责人 | 设计 | PM、技术负责人、QA | 支持/PMM |
| 技术方案 | 技术负责人 | 技术负责人 | PM、设计、安全 | 利益相关者 |
| 测试计划 | QA 负责人 | QA | 技术负责人、PM | 团队 |
| GTM/发布简报 | PMM | PMM | PM、销售/支持 | 全体 |
| 支持运行手册 | 支持负责人 | 支持 | PM、技术负责人 | PMM |

_A = 归口负责（Accountable），R = 具体执行（Responsible），C = 咨询（Consulted），I = 知会（Informed）_

* * *

4) 决策与优先级
---------

**a) 组合与路线图**

*   将关键赌注绑定到**OKR**与**北极星指标**。
*   维护**Now / Next / Later**路线图（容量敏感而非“日历塞满”）。

**b) 优先级框架**

*   **RICE** = 触达（Reach）× 影响（Impact）× 置信度（Confidence） ÷ 代价（Effort）
    *   _示例：_
        *   功能 A：5,000 用户/月 × 2（中等影响）× 0.7 ÷ 3 **PMs**（人月）≈ **2,333**
        *   功能 B：2,500 × 3（高）× 0.8 ÷ 1 ≈ **6,000** → **优先 B**
*   **WSJF**（规模化敏捷）：延期成本（CoD）÷ 持续时间
    *   _示例：_ F1 CoD=18，Dur=3 → **6**；F2 CoD=24，Dur=6 → **4** → 先做 F1。
*   可辅以 **Kano**、**MoSCoW**、**ICE** 做快速分拣。
*   **单向门 vs 双向门**：可逆决策减少流程负担。

**c) 范围管理**

*   倾向**纵向切片**，每片都能交付端到端用户价值。
*   依据场景定义 **MVP**（最快学习）、**MMF**（可上市最小功能）、**MLP**（可喜爱最小产品）。
*   用\*\*“砍单清单”\*\*（最先移除的 Nice-to-have）在规划期就约定好。

**d) 风险管理**

*   维护 **RAID** 台账（风险、假设、问题、依赖）。
*   对关键技术选择记录 **ADR**，防止架构漂移。

**e) 实验**

*   预先定义**主指标**与**护栏指标**（如错误率、延迟、流失）。
*   功能开关 + **A/B** 或分阶段灰度；按照**事先注册**的判定标准做决策。

* * *

三类组织的差异
-------

### 初创（Lean，快迭代）

*   **文档：** 一页纸 PRD，设计/技术合并笔记。
*   **节奏：** 每周/双周发布；2–4 周发现→开发循环。
*   **决策：** 创始人/PM 主导；RICE/ICE；快速实验与冒烟测试。
*   **风险控制：** 轻量化；隐私/安全随数据敏感度收紧。
*   **工具：** 早期就使用功能开关以安全学习。
*   **注意：** 别跳过埋点、无障碍、回滚预案。

### 企业（规范、治理）

*   **文档：** 正式 PRD、技术方案、DPIA/PIA、威胁建模、审计留痕。
*   **节奏：** 发布列车或 CAB 窗口；更多依赖与签核。
*   **决策：** 组合管理委员会；常用 WSJF 与商业论证。
*   **风险控制：** 必要的安全、隐私、合规（如 SOC 2、HIPAA）、无障碍。
*   **工具：** 变更管理、职责分离、审批流。
*   **注意：** 防止闸门拖慢学习；保持持续发现。

### 现代科技公司（如 Spotify 式）

*   **结构：** **产品三人组**（PM+设计+工程）在**小队/部落**中；平台团队支撑。
*   **节奏：** 持续交付、主干开发、高度自动化。
*   **决策：** 以 OKR 驱动结果；双轨发现；强实验文化。
*   **风险控制：** 自动化测试/质量门；隐私/安全嵌入流水线。
*   **注意：** 保障跨小队对齐；通过平台标准降重复。

* * *

迭代节奏与会议（常见）
-----------

*   **每周：** 待办精炼、设计评审、缺陷/事故分级。
*   **每个冲刺（1–2 周）：** 规划（估算/承诺）、每日站会、演示、回顾。
*   **每月/每季：** 路线图与 OKR 复盘；组合调整优先级。
*   **上线前：** Go/No-Go（清单驱动）、对外/内沟通定稿、值班/响应就绪。

* * *

质量门槛与清单（可直接套用）
--------------

**故事“就绪定义（DoR）”**

*   用户故事 + 验收标准
*   设计链接（含空/错状态）
*   埋点事件定义
*   依赖已解决 / 功能开关已规划
*   测试方式一致（单元/集成/E2E）
*   非功能要求已注明

**“完成定义（DoD）”**

*   代码评审合并；测试全绿且覆盖达标
*   可观测性落实（指标、日志、告警）
*   无障碍检查通过
*   文档更新（运行手册、预案、变更日志）
*   安全/隐私检查完成（按需）
*   置于功能开关后或按计划安全放量

**Go/No-Go 要点**

*   回滚与沟通模板就绪
*   监控仪表盘上线；负责人值守
*   护栏与成功指标一致
*   支持/销售已赋能；状态页预案

* * *

发布模式（如何安全上线）
------------

*   **暗发布（Dark launch）：** 基础设施上线但用户不可见。
*   **金丝雀（Canary）：** 1–5% 人群；盯紧护栏。
*   **分阶段放量（Staged rollout）：** 10% → 25% → 50% → 100%，按阈值推进。
*   **Beta/EAP：** 目标用户自愿加入；快速反馈。
*   **大爆炸（Big bang）：** 罕见——仅在必要且充分演练后采用。

* * *

关键指标
----

*   **北极星：** 你要增长的价值代理（如每周活跃协作者）。
*   **输入 vs 输出：** 输入（可控，如发布节奏、质量） vs 输出（要达成，如留存、营收）。
*   **护栏：** 可靠性与体验（如 p95 延迟、无崩溃会话）。
*   **埋点计划：** 事件名、属性、采样、数据留存、隐私说明。
*   **读数节奏：** 上线后 1–2 周首次读数；随后 30/60/90 天复盘。

* * *

常见坑（与修复）
--------

*   **扔包式交接** → 用联合评审与嵌入式协作替代。
*   **文档过厚** → 更小批量交付；让文档“活着”。
*   **把 QA 放到最后** → 左移测试；自始就自动化。
*   **“发了=完成”** → 直到达成结果与护栏才算完成。
*   **无埋点** → 上线前先埋点；演练仪表盘。
*   **所有权不清** → RACI + 每个产出都标注负责人。

* * *

快速入门包（明天就能用）
------------

1.  建一个**一页纸 PRD 模板**（见上），所有项目都用。
2.  搭好**功能开关**与**分阶段放量**实践。
3.  明确**DoR / DoD**与轻量**Go/No-Go**清单。
4.  采用双轨：每个冲刺同时推进 1 个发现切片 + 1 个交付切片。
5.  选一个打分方法（**RICE**或**WSJF**）并坚持使用。
6.  把**可观测性仪表盘**纳入“完成定义”。
7.  每月做一次**OKR 读数**；用数据决定“止损或加注”。

* * *

如果你告诉我团队规模、风险约束（是否受监管等）和发布节奏，我可以把以上内容定制成一份适配你语境的实操手册（含 RACI 与清单）。



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)