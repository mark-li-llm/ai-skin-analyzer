#!/usr/bin/env node

/**
 * 自动化测试脚本 - Step 1: Data Collection Implementation
 * 测试用户识别和logging集成功能
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 Step 1 Implementation Test\n');
console.log('='.repeat(50));

// Test 1: 检查代码文件修改
console.log('\n📝 Test 1: Code File Changes');
console.log('-'.repeat(50));

const filesToCheck = [
  {
    file: 'app/page.tsx',
    checks: [
      { pattern: /useLocalStorage<string>/, desc: 'useLocalStorage import for userName' },
      { pattern: /getUserIdentifier/, desc: 'getUserIdentifier function' },
      { pattern: /anon-.*Math\.random/, desc: 'Anonymous ID generation' },
      { pattern: /analyzeSkin\(file, userId\)/, desc: 'Pass userId to analyzeSkin' }
    ]
  },
  {
    file: 'lib/api/skinAnalysis.ts',
    checks: [
      { pattern: /analyzeSkin\(file: File, userId: string\)/, desc: 'analyzeSkin accepts userId parameter' },
      { pattern: /formData\.append\('userId', userId\)/, desc: 'userId added to FormData' }
    ]
  },
  {
    file: 'app/api/analyze-skin/route.ts',
    checks: [
      { pattern: /import.*logAnalysis.*generateImageHash/, desc: 'Import logging functions' },
      { pattern: /const startTime = Date\.now\(\)/, desc: 'Timing measurement' },
      { pattern: /formData\.get\('userId'\)/, desc: 'Extract userId from FormData' },
      { pattern: /processImage.*Promise<.*imageHash/, desc: 'processImage returns hash' },
      { pattern: /await logAnalysis\({/, desc: 'Call logAnalysis on success' },
      { pattern: /function handleError.*userId.*startTime/, desc: 'handleError accepts userId and startTime' }
    ]
  },
  {
    file: 'lib/logging.ts',
    checks: [
      { pattern: /365 \* 24 \* 60 \* 60/, desc: 'TTL updated to 365 days' }
    ]
  }
];

let allTestsPassed = true;

filesToCheck.forEach(({ file, checks }) => {
  console.log(`\n📄 Checking: ${file}`);

  try {
    const filePath = path.join(process.cwd(), file);
    const content = fs.readFileSync(filePath, 'utf8');

    checks.forEach(({ pattern, desc }) => {
      if (pattern.test(content)) {
        console.log(`  ✅ ${desc}`);
      } else {
        console.log(`  ❌ ${desc}`);
        allTestsPassed = false;
      }
    });
  } catch (error) {
    console.log(`  ❌ File not found or error reading: ${error.message}`);
    allTestsPassed = false;
  }
});

// Test 2: 检查环境配置
console.log('\n\n📝 Test 2: Environment Configuration');
console.log('-'.repeat(50));

try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    const envChecks = [
      { pattern: /AUTH_PASSWORD=/, desc: 'AUTH_PASSWORD configured' },
      { pattern: /JWT_SECRET=/, desc: 'JWT_SECRET configured' },
      { pattern: /NEXT_PUBLIC_USE_MOCKS=/, desc: 'Mock mode configured' }
    ];

    envChecks.forEach(({ pattern, desc }) => {
      if (pattern.test(envContent)) {
        console.log(`  ✅ ${desc}`);
      } else {
        console.log(`  ⚠️  ${desc} (optional for basic testing)`);
      }
    });
  } else {
    console.log('  ❌ .env.local file not found');
    allTestsPassed = false;
  }
} catch (error) {
  console.log(`  ❌ Error checking .env.local: ${error.message}`);
}

// Test 3: 测试登录API
console.log('\n\n📝 Test 3: Login API Test');
console.log('-'.repeat(50));

fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'test123' })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('  ✅ Login API works with password: test123');
    } else {
      console.log('  ❌ Login API failed');
      allTestsPassed = false;
    }
  })
  .catch(err => {
    console.log(`  ⚠️  Cannot test login API (server may not be running): ${err.message}`);
  });

// Test 4: 模拟analyze-skin API调用
console.log('\n\n📝 Test 4: Analyze-Skin API Mock Test');
console.log('-'.repeat(50));

// 创建一个测试用的FormData
const FormData = require('form-data');
const testForm = new FormData();

// 创建一个假的图片buffer
const fakeImageBuffer = Buffer.from('fake-image-data');
testForm.append('file', fakeImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
testForm.append('userId', 'test-user-123');

console.log('  ℹ️  Note: API test requires server to be running');
console.log('  ℹ️  You can manually test by:');
console.log('     1. Visit http://localhost:3000');
console.log('     2. Login with password: test123');
console.log('     3. Enter a name (or leave blank for anonymous)');
console.log('     4. Upload an image');
console.log('     5. Check browser console for logging messages');

// Summary
console.log('\n\n' + '='.repeat(50));
console.log('📊 Test Summary');
console.log('='.repeat(50));

if (allTestsPassed) {
  console.log('\n✅ All automated tests passed!');
  console.log('\n📋 Manual Testing Checklist:');
  console.log('  1. [ ] Visit http://localhost:3000');
  console.log('  2. [ ] Login with password: test123');
  console.log('  3. [ ] Verify "Your name (optional)" input field is visible');
  console.log('  4. [ ] Enter name "TestUser" and upload image');
  console.log('  5. [ ] Verify analysis completes successfully');
  console.log('  6. [ ] Refresh page and check name persists');
  console.log('  7. [ ] Clear name field and upload again');
  console.log('  8. [ ] Check browser console - should see "anon-XXXXXX" ID');
  console.log('  9. [ ] Open browser DevTools → Application → Local Storage');
  console.log('  10. [ ] Verify keys: ai-skin-analyzer-user-name, ai-skin-analyzer-anon-id');
} else {
  console.log('\n❌ Some tests failed. Please review the output above.');
}

console.log('\n💡 Tip: Without Redis, you will see logging errors in console.');
console.log('   This is expected and won\'t affect the main functionality.\n');
