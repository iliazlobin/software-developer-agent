#!/usr/bin/env node

/**
 * Detailed GitHub App credentials diagnostic
 */

import { readFileSync } from 'fs';
import { generateJWT } from '../packages/shared/dist/jwt.js';

// Load environment variables with multi-line support
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
                value = value.substring(1, quoteEndIndex);
              }
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

async function makeGitHubRequest(url, headers, method = 'GET') {
  try {
    const response = await fetch(url, { 
      method, 
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      ...(method === 'POST' && { body: '{}' })
    });
    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    return { error: error.message };
  }
}

async function diagnoseGitHubApp() {
  console.log('🔍 GitHub App Credentials Diagnostic\n');
  
  const envVars = loadEnvFile();
  const appId = envVars.GITHUB_APP_ID;
  const privateKey = envVars.GITHUB_APP_PRIVATE_KEY;
  
  if (!appId || !privateKey) {
    console.error('❌ Missing GitHub App credentials in .env file');
    return;
  }
  
  console.log('📋 Found Credentials:');
  console.log(`  App ID: ${appId}`);
  console.log(`  Private Key Length: ${privateKey.length} characters`);
  console.log(`  Private Key Starts: ${privateKey.substring(0, 30)}...`);
  console.log(`  Private Key Format: ${privateKey.includes('-----BEGIN') ? 'PEM format ✓' : 'Unknown format ❌'}`);
  
  try {
    // Step 1: Generate JWT
    console.log('\n🔑 Step 1: Generating JWT...');
    const now = Math.floor(Date.now() / 1000);
    console.log(`   Current timestamp: ${now}`);
    console.log(`   Current time: ${new Date()}`);
    
    const jwt = generateJWT(appId, privateKey);
    console.log(`✅ JWT Generated: ${jwt.substring(0, 50)}...`);
    // console.log(`✅ JWT Generated: ${jwt}`);
    console.log(`   JWT Length: ${jwt.length}`);
    
    // Decode and inspect the JWT payload
    const decoded = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
    console.log(`   JWT issued at (iat): ${decoded.iat} (${new Date(decoded.iat * 1000)})`);
    console.log(`   JWT expires at (exp): ${decoded.exp} (${new Date(decoded.exp * 1000)})`);
    console.log(`   JWT issuer (iss): ${decoded.iss}`);
    console.log(`   Time to expiry: ${decoded.exp - now} seconds`);
    
    // Step 2: Test GitHub App endpoint
    console.log('\n🧪 Step 2: Testing GitHub App Info...');
    const appResult = await makeGitHubRequest('https://api.github.com/app', {
      'Authorization': `Bearer ${jwt}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OpenSWE-Diagnostic'
    });
    
    if (appResult.ok) {
      console.log(`✅ GitHub App Found: ${appResult.data.name} (ID: ${appResult.data.id})`);
      console.log(`   Owner: ${appResult.data.owner.login}`);
      console.log(`   Created: ${appResult.data.created_at}`);
    } else {
      console.log(`❌ GitHub App Error: ${appResult.status}`);
      console.log(`   Response: ${JSON.stringify(appResult.data, null, 2)}`);
      
      if (appResult.data?.message?.includes('Bad credentials')) {
        console.log('\n💡 Diagnosis: The JWT token is being rejected by GitHub');
        console.log('   Possible causes:');
        console.log('   - App ID doesn\'t match the private key');
        console.log('   - Private key is corrupted or incomplete'); 
        console.log('   - GitHub App has been deleted or revoked');
        return;
      }
    }
    
    // Step 3: Test installations endpoint
    console.log('\n🏢 Step 3: Testing Installations...');
    const installsResult = await makeGitHubRequest('https://api.github.com/app/installations', {
      'Authorization': `Bearer ${jwt}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OpenSWE-Diagnostic'
    });
    
    if (installsResult.ok) {
      console.log(`✅ Found ${installsResult.data.length} installation(s):`);
      installsResult.data.forEach((install, i) => {
        console.log(`   ${i + 1}. ID: ${install.id}, Account: ${install.account.login} (${install.account.type})`);
      });
      
      // Step 4: Test installation token generation
      if (installsResult.data.length > 0) {
        const firstInstall = installsResult.data[0];
        console.log(`\n🎫 Step 4: Testing Installation Token (ID: ${firstInstall.id})...`);
        
        const tokenResult = await makeGitHubRequest(
          `https://api.github.com/app/installations/${firstInstall.id}/access_tokens`,
          {
            'Authorization': `Bearer ${jwt}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'OpenSWE-Diagnostic'
          },
          'POST'
        );
        
        if (tokenResult.ok) {
          console.log('✅ Installation token generated successfully!');
          console.log(`   Token: ${tokenResult.data.token.substring(0, 20)}...`);
          console.log(`   Expires: ${tokenResult.data.expires_at}`);
        } else {
          console.log(`❌ Installation token failed: ${tokenResult.status}`);
          console.log(`   Response: ${JSON.stringify(tokenResult.data, null, 2)}`);
        }
      }
    } else {
      console.log(`❌ Installations Error: ${installsResult.status}`);
      console.log(`   Response: ${JSON.stringify(installsResult.data, null, 2)}`);
    }
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    if (error.message.includes('secretOrPrivateKey')) {
      console.log('\n💡 The private key format is invalid for JWT signing');
      console.log('   Check that the private key is complete and properly formatted');
    }
  }
}

diagnoseGitHubApp();
