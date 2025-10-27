#!/usr/bin/env node
/**
 * Quick diagnostic for OpenAI API connection
 */

require('dotenv').config({ path: '.env.local' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('🔍 Diagnosing OpenAI API connection...\n');

// Check API Key
if (!OPENAI_API_KEY) {
  console.log('❌ Error: OPENAI_API_KEY not configured');
  console.log('   Please set OPENAI_API_KEY in .env.local');
  process.exit(1);
}

console.log('✅ API Key configured');
console.log(`   Key prefix: ${OPENAI_API_KEY.substring(0, 10)}...`);
console.log('');

// Test API connection
console.log('⏳ Testing API connection...\n');

const testModels = [
  'gpt-5-nano',    // User-configured model
  'gpt-4o',        // Actual GPT-4 Omni model
  'gpt-4o-mini',   // Actual GPT-4 Omni Mini model
];

async function testModel(modelName) {
  console.log(`📡 Testing model: ${modelName}`);

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
      console.log(`   ✅ ${modelName} working properly!`);
      console.log(`   Response: ${data.choices[0].message.content}\n`);
      return true;
    } else {
      const error = await response.json();
      console.log(`   ❌ ${modelName} failed`);
      console.log(`   Status code: ${response.status}`);
      console.log(`   Error: ${error.error?.message || JSON.stringify(error)}\n`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ${modelName} connection failed`);
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

async function runDiagnostics() {
  for (const model of testModels) {
    const success = await testModel(model);
    if (success) {
      console.log('✅ Found available model!');
      console.log(`   Suggested for use in route.ts: ${model}\n`);
      break;
    }
  }

  console.log('====================================');
  console.log('💡 Tips:');
  console.log('   If all models fail, please check:');
  console.log('   1. API Key validity');
  console.log('   2. API Key has available credits');
  console.log('   3. Network connection is working');
  console.log('====================================');
}

runDiagnostics();
