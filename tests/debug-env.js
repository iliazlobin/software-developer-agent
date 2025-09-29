#!/usr/bin/env node

const { readFileSync } = require('fs');
const { join } = require('path');

// Load environment variables from .env file and debug
function debugEnvFile() {
  try {
    const envPath = join(process.cwd(), '../apps/open-swe/.env');
    const envContent = readFileSync(envPath, 'utf8');
    
    console.log('🔍 Debugging .env file parsing...\n');
    
    // Find the GITHUB_APP_PRIVATE_KEY line
    const lines = envContent.split('\n');
    let privateKeyStart = -1;
    let privateKeyEnd = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('GITHUB_APP_PRIVATE_KEY=')) {
        privateKeyStart = i;
        console.log(`Found GITHUB_APP_PRIVATE_KEY at line ${i + 1}`);
        break;
      }
    }
    
    if (privateKeyStart === -1) {
      console.log('❌ GITHUB_APP_PRIVATE_KEY not found');
      return;
    }
    
    // Find where the private key ends
    for (let i = privateKeyStart; i < lines.length; i++) {
      if (lines[i].includes('-----END RSA PRIVATE KEY-----')) {
        privateKeyEnd = i;
        console.log(`Private key ends at line ${i + 1}`);
        break;
      }
    }
    
    if (privateKeyEnd === -1) {
      console.log('⚠️  Could not find end of private key');
      privateKeyEnd = Math.min(privateKeyStart + 30, lines.length - 1);
    }
    
    // Extract the full private key value
    let fullKey = '';
    for (let i = privateKeyStart; i <= privateKeyEnd; i++) {
      if (i === privateKeyStart) {
        // First line: remove GITHUB_APP_PRIVATE_KEY=" prefix
        let line = lines[i];
        const equalIndex = line.indexOf('=');
        if (equalIndex > 0) {
          line = line.substring(equalIndex + 1);
          if (line.startsWith('"')) {
            line = line.substring(1);
          }
        }
        fullKey += line;
      } else if (i === privateKeyEnd && lines[i].endsWith('"')) {
        // Last line: remove trailing quote
        fullKey += '\n' + lines[i].slice(0, -1);
      } else {
        // Middle lines
        fullKey += '\n' + lines[i];
      }
    }
    
    console.log('📊 Key analysis:');
    console.log('  Lines used:', privateKeyEnd - privateKeyStart + 1);
    console.log('  Raw key length:', fullKey.length);
    console.log('  First 100 chars:', fullKey.substring(0, 100));
    console.log('  Last 100 chars:', fullKey.substring(fullKey.length - 100));
    
    // Test with escaped newlines converted
    const processedKey = fullKey.replace(/\\n/g, '\n');
    console.log('  Processed key length:', processedKey.length);
    
    // Now test our parsing logic
    console.log('\n🧪 Testing our parsing logic...');
    const envVars = {};
    
    envContent.split('\n').forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const equalIndex = trimmed.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex);
          let value = trimmed.substring(equalIndex + 1);
          
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          if (key === 'GITHUB_APP_PRIVATE_KEY') {
            console.log(`  Found key on line ${index + 1}`);
            console.log(`  Parsed value length: ${value.length}`);
            console.log(`  Parsed value: ${value.substring(0, 50)}...`);
          }
          
          envVars[key] = value;
        }
      }
    });
    
    console.log('\n📋 Final result:');
    console.log('  ENV var length:', envVars.GITHUB_APP_PRIVATE_KEY?.length || 0);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugEnvFile();
