#!/usr/bin/env node
/**
 * 快速诊断 OpenAI API 连接
 */

require('dotenv').config({ path: '.env.local' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('🔍 诊断 OpenAI API 连接...\n');

// 检查 API Key
if (!OPENAI_API_KEY) {
  console.log('❌ 错误: OPENAI_API_KEY 未配置');
  console.log('   请在 .env.local 中设置 OPENAI_API_KEY');
  process.exit(1);
}

console.log('✅ API Key 已配置');
console.log(`   Key 前缀: ${OPENAI_API_KEY.substring(0, 10)}...`);
console.log('');

// 测试 API 连接
console.log('⏳ 测试 API 连接...\n');

const testModels = [
  'gpt-5-nano',    // 用户配置的模型
  'gpt-4o',        // 实际的 GPT-4 Omni 模型
  'gpt-4o-mini',   // 实际的 GPT-4 Omni Mini 模型
];

async function testModel(modelName) {
  console.log(`📡 测试模型: ${modelName}`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: 'Say "test" if you can see this message.'
          }
        ],
        max_tokens: 10
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ ${modelName} 工作正常！`);
      console.log(`   响应: ${data.choices[0].message.content}\n`);
      return true;
    } else {
      const error = await response.json();
      console.log(`   ❌ ${modelName} 失败`);
      console.log(`   状态码: ${response.status}`);
      console.log(`   错误: ${error.error?.message || JSON.stringify(error)}\n`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ${modelName} 连接失败`);
    console.log(`   错误: ${error.message}\n`);
    return false;
  }
}

async function runDiagnostics() {
  for (const model of testModels) {
    const success = await testModel(model);
    if (success) {
      console.log('✅ 找到可用的模型！');
      console.log(`   建议在 route.ts 中使用: ${model}\n`);
      break;
    }
  }

  console.log('====================================');
  console.log('💡 提示:');
  console.log('   如果所有模型都失败，请检查:');
  console.log('   1. API Key 是否有效');
  console.log('   2. API Key 是否有余额');
  console.log('   3. 网络连接是否正常');
  console.log('====================================');
}

runDiagnostics();
