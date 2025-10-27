#!/usr/bin/env node
/**
 * Test OpenAI Vision API
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('🔍 Testing OpenAI Vision API...\n');

async function testVisionAPI(modelName) {
  console.log(`📡 Testing model: ${modelName}`);

  // Read test image
  const imagePath = path.join(__dirname, '../experiments/test-images/test1.jpg');
  if (!fs.existsSync(imagePath)) {
    console.log('❌ Test image not found');
    return;
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

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
            content: [
              {
                type: 'text',
                text: 'Describe this image in one sentence.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_completion_tokens: 100,
        temperature: 0.5
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ ${modelName} Vision API working properly!`);
      console.log(`   Response: ${data.choices[0].message.content}`);
      console.log('');
      return true;
    } else {
      const error = await response.json();
      console.log(`   ❌ ${modelName} Vision API failed`);
      console.log(`   Status code: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(error, null, 2)}`);
      console.log('');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ ${modelName} connection failed`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

async function main() {
  const models = ['gpt-5-nano', 'gpt-4o', 'gpt-4o-mini'];

  for (const model of models) {
    const success = await testVisionAPI(model);
    if (success && model === 'gpt-5-nano') {
      console.log('✅ gpt-5-nano is available!');
      break;
    }
  }
}

main();
