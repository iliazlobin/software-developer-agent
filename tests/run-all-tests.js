#!/usr/bin/env node

/**
 * Test Runner - Runs all main test scripts and reports results
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Open SWE Test Suite\n');

const tests = [
  {
    name: 'DynamoDB Operations',
    script: 'test-dynamodb.js',
    description: 'Tests local DynamoDB connection and CRUD operations'
  },
  {
    name: 'GitHub Authentication',
    script: 'test-github-auth-simple.js', 
    description: 'Tests GitHub App authentication and token generation'
  }
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  console.log(`\n🔍 Running: ${test.name}`);
  console.log(`   ${test.description}`);
  console.log('─'.repeat(60));
  
  try {
    execSync(`node ${test.script}`, {
      stdio: 'inherit',
      cwd: __dirname
    });
    console.log(`✅ PASSED: ${test.name}\n`);
    passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${test.name}\n`);
    failed++;
  }
}

console.log('═'.repeat(60));
console.log(`\n📊 Test Results Summary:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   📝 Total:  ${tests.length}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your Open SWE environment is ready.');
} else {
  console.log('\n⚠️  Some tests failed. Check the output above for details.');
  console.log('   See README.md for troubleshooting information.');
  process.exit(1);
}
