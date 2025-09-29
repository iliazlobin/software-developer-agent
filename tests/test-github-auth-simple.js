#!/usr/bin/env node

const { readFileSync } = require('fs');
const { join } = require('path');
const jwt = require('jsonwebtoken');
const https = require('https');

// Load environment variables from .env file (handles multi-line values)
function loadEnvFile() {
  try {
      const envPath = '../apps/open-swe/.env';
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    
    const lines = envContent.split('\n');
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line && !line.startsWith('#')) {
        const equalIndex = line.indexOf('=');
        if (equalIndex > 0) {
          const key = line.substring(0, equalIndex);
          let value = line.substring(equalIndex + 1);
          
          // Handle multi-line values (quoted strings that don't end on the same line)
          // But first check if it's actually a single line with an inline comment
          const quoteEndIndex = value.indexOf('"', 1);
          const hasInlineComment = quoteEndIndex > 0 && quoteEndIndex < value.length - 1;
          
          if (value.startsWith('"') && !value.endsWith('"') && !hasInlineComment) {
            // Multi-line value - collect until we find the closing quote
            value = value.substring(1); // Remove opening quote
            
            // Look ahead for more lines
            let j = i + 1;
            while (j < lines.length) {
              const nextLine = lines[j];
              if (nextLine.endsWith('"')) {
                // Found closing quote
                value += '\n' + nextLine.slice(0, -1);
                i = j; // Skip to this line
                break;
              } else {
                // Continue collecting lines
                value += '\n' + nextLine;
              }
              j++;
            }
          } else {
            // Single line value - remove quotes if present
            if (value.startsWith('"')) {
              const quoteEndIndex = value.indexOf('"', 1);
              if (quoteEndIndex > 0) {
                // Extract just the quoted content, ignore anything after the closing quote
                value = value.substring(1, quoteEndIndex);
              }
            } else if (value.startsWith("'")) {
              const quoteEndIndex = value.indexOf("'", 1);
              if (quoteEndIndex > 0) {
                value = value.substring(1, quoteEndIndex);
              }
            } else if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
          }
          
          envVars[key] = value;
        }
      }
      i++;
    }
    
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

// Make HTTPS request
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Generate JWT token
function generateJWT(appId, privateKey) {
  console.log('🔑 Generating JWT...');
  console.log('App ID:', appId);
  console.log('Private Key length:', privateKey.length);
  console.log('Private Key starts with:', privateKey.substring(0, 50) + '...');
  
  // Use conservative timing for JWT - GitHub doesn't like tokens too far in future
  const now = Math.floor(Date.now() / 1000);
  const currentYear = new Date().getFullYear();
  
  // If system date appears to be in the future, use a base time from 2024
  let baseTime;
  if (currentYear > 2024) {
    baseTime = 1733011200; // 2024-12-01 00:00:00 UTC
    console.log(`⚠️  System year ${currentYear} detected, using base time 2024-12-01 for GitHub compatibility`);
  } else {
    baseTime = now;
  }
  
  const iat = baseTime - 60;  // 1 minute ago to account for clock skew
  const exp = baseTime + 480; // 8 minutes from base time (conservative)
  
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
    const appResponse = await makeRequest('https://api.github.com/app', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenSWE-Agent-Test'
      }
    });
    
    if (appResponse.ok) {
      const appData = appResponse.data;
      console.log('✅ App info retrieved successfully:');
      console.log('  Name:', appData.name);
      console.log('  Owner:', appData.owner?.login);
      console.log('  Created:', appData.created_at);
    } else {
      console.log('❌ Failed to get app info:', appResponse.status, appResponse.data);
      return;
    }
    console.log('');
    
    // Test 2: List installations
    console.log('🧪 Test 2: Listing installations...');
    const installationsResponse = await makeRequest('https://api.github.com/app/installations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OpenSWE-Agent-Test'
      }
    });
    
    if (installationsResponse.ok) {
      const installations = installationsResponse.data;
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
        
        const tokenResponse = await makeRequest(`https://api.github.com/app/installations/${firstInstallation.id}/access_tokens`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'OpenSWE-Agent-Test'
          }
        });
        
        if (tokenResponse.ok) {
          const tokenData = tokenResponse.data;
          console.log('✅ Installation token generated successfully!');
          console.log('  Token length:', tokenData.token.length);
          console.log('  Expires at:', tokenData.expires_at);
          console.log('  Permissions:', Object.keys(tokenData.permissions || {}).join(', '));
          
          console.log('');
          console.log('🎉 All tests passed! Your GitHub App authentication is working.');
          console.log(`📝 Use installation ID: ${firstInstallation.id} in your configuration`);
          
        } else {
          console.log('❌ Failed to get installation token:', tokenResponse.status, tokenResponse.data);
        }
      }
      
    } else {
      console.log('❌ Failed to list installations:', installationsResponse.status, installationsResponse.data);
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
