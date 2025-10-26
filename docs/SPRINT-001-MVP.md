# SPRINT-001 — MVP 并行开发清单（最小实现）

## 目标与范围（按 PRD 抽取）
- 仅交付：单张面部照片上传 → AI 分析 → 三段式结果展示：
  - 肤质类型（oily/dry/combination/normal/sensitive）+ 置信度
  - 防晒配方类型 + 理由
  - 1–2 个具体防晒产品（品牌/名称/SPF/关键好处）
- 不包含：账户、数据库/持久化、历史记录、其它产品品类、分享/支付。

参考：`docs/01-prd.md`（Core Features）、`docs/02-technical-spec.md:99`（成功标准）。

## 验收标准（Definition of Done）
- [ ] 可上传 jpg/jpeg/png，单文件 ≤ 5MB。
- [ ] 成功向后端发起分析请求并返回有效 JSON（字段见下）。
- [ ] UI 完整渲染三段式结果（含置信度与具体产品）。
- [ ] 常见错误有清晰提示（尺寸超限/类型不符/分析失败）。

## 接口与数据契约（摘要）
- Endpoint：`POST /api/analyze-skin`
- 请求体：`multipart/form-data`，字段名 `file`，仅 `jpg|jpeg|png`，≤ 5MB。
- 成功响应字段：
  - `skinType`、`confidence`
  - `analysis.observedCharacteristics[]`、`analysis.skinTypeExplanation`
  - `productRecommendation.formulationType`、`formulationReasoning`
  - `productRecommendation.specificProducts[1..2]`（`brandName`/`productName`/`spf`/`keyBenefit`）
  - `additionalNotes?`
- 失败响应：`{ "error": "InvalidImage|FileTooLarge|UnsupportedType|APIError" }`

（详细字段见 `docs/02-technical-spec.md` 与共享类型 `types/analysis.ts`）

## 前端任务（最小）
- [ ] 上传组件：文件选择/拖拽、类型与 ≤5MB 预检、提交/加载态/重试。
- [ ] 免责声明展示（医疗/产品/AI）后再允许上传（见 `legal/disclaimers.md`）。
- [ ] 调用 API：处理成功/失败/低置信度三种状态。
- [ ] 结果展示：三段式布局 + 产品卡片；移动端可用。

## 后端任务（最小）
- [ ] API 路由 `POST /api/analyze-skin`（App Router）。
- [ ] 校验：MIME 与大小（400/413/415），无文件报错（400）。
- [ ] 图片预处理：等比缩放至 ≤1024×1024（不拉伸、不上采样，JPEG 85–90%）。
- [ ] AI 调用：`gpt-5-nano`、`detail: "high"`、`max_completion_tokens`，超时 60s。
- [ ] 响应校验：保证返回 JSON 符合契约；失败映射为 500（`APIError`）。

## 并行推进顺序（轻量）
1) 冻结契约：以 `types/analysis.ts` 为唯一来源（如需变更，同步更新本文与 mocks）。
2) 前端用固定 mock JSON 开发结果页；后端先回固定假数据以打通请求。
3) 后端接入真实 AI；前端切换到真实 API。
4) 端到端手测通过“验收标准”四项后合并。

## 样例（成功）
```json
{
  "skinType": "combination",
  "confidence": 0.8,
  "analysis": {
    "observedCharacteristics": ["T 区轻微出油", "两颊较为平衡"],
    "skinTypeExplanation": "T 区油脂分泌相对明显而两颊更平衡，判断为混合肌"
  },
  "productRecommendation": {
    "formulationType": "清爽型油控啫喱",
    "formulationReasoning": "兼顾 T 区控油与两颊轻薄保护",
    "specificProducts": [
      {"brandName":"Neutrogena","productName":"Ultra Sheer Dry-Touch","spf":"55","keyBenefit":"清爽不粘腻，控油"}
    ]
  }
}
```

## 样例（失败）
```json
{ "error": "FileTooLarge" }
```

## 负责人与日期（留空待填）
- 前端负责人：____   后端负责人：____
- D0 契约冻结：____   D1 UI+mock：____   D2 API：____   D3 E2E：____

