// Simple test to verify page is working
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`✅ Status Code: ${res.statusCode}`);
  console.log(`✅ Server is responding`);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // Check for key elements
    const checks = [
      { text: 'AI Skin Analyzer', found: data.includes('AI Skin Analyzer') },
      { text: 'Development Mode Badge', found: data.includes('Development Mode (Using Mock Data)') },
      { text: 'Disclaimer Section', found: data.includes('disclaimer') },
      { text: 'Upload Component', found: data.includes('Choose file to upload') },
      { text: 'How it works', found: data.includes('How it works') },
      { text: 'Privacy First', found: data.includes('Privacy First') },
      { text: 'Footer', found: data.includes('© 2025 AI Skin Analyzer') },
    ];

    console.log('\n📋 Component Check:');
    checks.forEach(check => {
      console.log(`${check.found ? '✅' : '❌'} ${check.text}`);
    });

    const allPassed = checks.every(c => c.found);
    if (allPassed) {
      console.log('\n🎉 All components are rendering correctly!');
      console.log('\n👉 Open http://localhost:3001 in your browser to see the app');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('Make sure the dev server is running: NEXT_PUBLIC_USE_MOCKS=1 npm run dev');
});

req.end();