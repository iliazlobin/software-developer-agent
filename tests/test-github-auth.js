#!/usr/bin/env node

const { readFileSync } = require('fs');
const { join } = require('path');
const jwt = require('jsonwebtoken');

// Use built-in fetch if available, otherwise require node-fetch dynamically
const fetch = globalThis.fetch || require('https').request;

// Load environment variables from .env file
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '../apps/open-swe/.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
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
          
          envVars[key] = value;
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error.message);
    return {};
  }
}

// Convert escaped newlines to actual newlines
function convertEscapedNewlinesToNewlines(str) {
  return str.replace(/\\n/g, '\n');
}

// Generate JWT token
function generateJWT(appId, privateKey) {
  console.log('🔑 Generating JWT...');
  console.log('App ID:', appId);
  console.log('Private Key length:', privateKey.length);
  console.log('Private Key starts with:', privateKey.substring(0, 50) + '...');
  
  // Use conservative timing for future system date
  const now = Math.floor(Date.now() / 1000);
  const baseTime = now > 1735689600 ? 1733011200 : now; // If year > 2024, use Dec 1 2024
  
  const iat = baseTime - 120; // 2 minutes ago
  const exp = baseTime + 480;  // 8 minutes from base time
  
  console.log('JWT timing:');
  console.log('  now:', now, new Date(now * 1000).toISOString());
  console.log('  baseTime:', baseTime, new Date(baseTime * 1000).toISOString());
  console.log('  iat:', iat, new Date(iat * 1000).toISOString());
  console.log('  exp:', exp, new Date(exp * 1000).toISOString());
  
  const payload = {
    iat: iat,
    exp: exp,
    iss: appId
  };
  
  try {
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    console.log('✅ JWT generated successfully');
    console.log('JWT length:', token.length);
    return token;
  } catch (error) {
    console.error('❌ JWT generation failed:', error.message);
    throw error;
  }
}

// Test GitHub App authentication
async function testGitHubAuth() {
  console.log('🚀 Testing GitHub App Authentication\n');
  
  // Load environment variables
  const env = loadEnvFile();
  
  const appId = env.GITHUB_APP_ID;
  const privateKey = env.GITHUB_APP_PRIVATE_KEY;
  
  if (!appId) {
    console.error('❌ GITHUB_APP_ID not found in .env file');
    return;
  }
  
  if (!privateKey) {
    console.error('❌ GITHUB_APP_PRIVATE_KEY not found in .env file');
    return;
  }
  
  console.log('📋 Configuration:');
  console.log('  App ID:', appId);
  console.log('  Private Key configured:', privateKey ? 'Yes' : 'No');
  console.log('  Private Key length:', privateKey.length);
  console.log('');
  
  try {
    // Convert escaped newlines
    const processedPrivateKey = convertEscapedNewlinesToNewlines(privateKey);
    console.log('🔄 Processed private key length:', processedPrivateKey.length);
    
    // Generate JWT
    const jwtToken = generateJWT(appId, processedPrivateKey);
    console.log('');
    
    // Test 1: Get app info (should work with just JWT)
    console.log('🧪 Test 1: Getting app information...');
    const appResponse = await fetch('https://api.github.com/app', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenSWE-Agent-Test'
      }
    });
    
    if (appResponse.ok) {
      const appData = await appResponse.json();
      console.log('✅ App info retrieved successfully:');
      console.log('  Name:', appData.name);
      console.log('  Owner:', appData.owner?.login);
      console.log('  Created:', appData.created_at);
    } else {
      const errorData = await appResponse.json();
      console.log('❌ Failed to get app info:', appResponse.status, errorData);
      return;
    }
    console.log('');
    
    // Test 2: List installations
    console.log('🧪 Test 2: Listing installations...');
    const installationsResponse = await fetch('https://api.github.com/app/installations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenSWE-Agent-Test'
      }
    });
    
    if (installationsResponse.ok) {
      const installations = await installationsResponse.json();
      console.log('✅ Installations retrieved:', installations.length);
      
      if (installations.length === 0) {
        console.log('⚠️  No installations found. You need to install the GitHub App on a repository.');
        console.log('   Go to: https://github.com/apps/your-app-name');
        return;
      }
      
      // Show installation details
      installations.forEach((installation, index) => {
        console.log(`  Installation ${index + 1}:`);
        console.log(`    ID: ${installation.id}`);
        console.log(`    Account: ${installation.account.login}`);
        console.log(`    Type: ${installation.account.type}`);
        console.log(`    Permissions:`, Object.keys(installation.permissions || {}).join(', '));
      });
      
      // Test 3: Try to get installation token for first installation
      if (installations.length > 0) {
        const firstInstallation = installations[0];
        console.log('');
        console.log(`🧪 Test 3: Getting installation token for installation ${firstInstallation.id}...`);
        
        const tokenResponse = await fetch(`https://api.github.com/app/installations/${firstInstallation.id}/access_tokens`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'OpenSWE-Agent-Test'
          }
        });
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          console.log('✅ Installation token generated successfully!');
          console.log('  Token length:', tokenData.token.length);
          console.log('  Expires at:', tokenData.expires_at);
          console.log('  Permissions:', Object.keys(tokenData.permissions || {}).join(', '));
          
          console.log('');
          console.log('🎉 All tests passed! Your GitHub App authentication is working.');
          console.log(`📝 Use installation ID: ${firstInstallation.id} in your configuration`);
          
        } else {
          const errorData = await tokenResponse.json();
          console.log('❌ Failed to get installation token:', tokenResponse.status, errorData);
        }
      }
      
    } else {
      const errorData = await installationsResponse.json();
      console.log('❌ Failed to list installations:', installationsResponse.status, errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the test
testGitHubAuth().catch(console.error);
