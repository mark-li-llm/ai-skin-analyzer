# 🔐 Product Access Protection - 极简实施方案

**创建日期**: 2025-10-27
**预计实施时间**: 10分钟
**优先级**: High（部署前必须完成）

---

## 🎯 目标

为MVP添加简单的密码保护，防止未授权访问和滥用。

---

## 📁 需要创建的文件

```
ai-skin-analyzer/
├── middleware.ts                    ← 新建（约10行）
├── app/
│   ├── login/
│   │   └── page.tsx                ← 新建（约30行）
│   └── api/
│       └── login/
│           └── route.ts            ← 新建（约15行）
└── .env.local                      ← 更新（添加AUTH_PASSWORD）
```

**总代码量：约55行**

---

## 🔧 实施步骤

### Step 1: 环境配置（1分钟）

```bash
# .env.local
AUTH_PASSWORD=你的密码（建议16+字符）
```

### Step 2: 创建登录API（2分钟）

**文件**: `app/api/login/route.ts`

核心逻辑：
- 接收POST请求的password字段
- 比较 `password === process.env.AUTH_PASSWORD`
- 密码正确：设置cookie，返回成功
- 密码错误：返回错误

Cookie配置：
```typescript
{
  name: 'auth-token',
  value: 'authenticated',  // 简单字符串即可
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 3600  // 7天
}
```

### Step 3: 创建Middleware（3分钟）

**文件**: `middleware.ts`

核心逻辑：
1. 检查路径是否是 `/login`, `/_next/*`, `/favicon.ico`, `/api/login`
2. 如果是 → 放行
3. 如果不是 → 检查cookie
4. Cookie有效 → 放行
5. Cookie无效 → 重定向到 `/login`

### Step 4: 创建登录页面（3分钟）

**文件**: `app/login/page.tsx`

极简UI：
- 一个标题："AI Skin Analyzer"
- 一个密码输入框
- 一个提交按钮
- 错误提示区域

使用现有Tailwind样式，不需要特殊设计。

### Step 5: 本地测试（2分钟）

手动测试2个场景：
1. ✅ 输入正确密码能登录
2. ✅ 输入错误密码显示错误

---

## 🚀 部署

### Vercel配置
1. 在Vercel Dashboard → Settings → Environment Variables
2. 添加：`AUTH_PASSWORD = 你的强密码`
3. 应用到Production和Preview
4. 重新部署

### 部署后验证
- [ ] 访问生产URL自动跳转到登录页
- [ ] 正确密码可以登录
- [ ] 错误密码显示错误

---

## 🔄 回滚（如果需要）

```bash
# 删除3个文件即可
rm middleware.ts
rm -rf app/login app/api/login
git add . && git commit -m "rollback: Remove auth" && git push
```

---

## 📌 技术决策

### 为什么这么简单？
- ✅ MVP只需要基本保护
- ✅ 单个共享密码足够
- ✅ Cookie字符串比较足够安全
- ✅ 过度设计浪费时间

### 未来可以增强
- 多密码支持
- Rate limiting
- 更复杂的token

### 现在不需要
- ❌ SHA256 hash
- ❌ 防暴力破解
- ❌ 详细测试用例
- ❌ 性能评估
- ❌ IP白名单
- ❌ 审计日志

---

## ✅ 完成标准

- [ ] 能登录就行
- [ ] 能防止未授权访问就行
- [ ] 代码简单易维护

**就这么简单！**
