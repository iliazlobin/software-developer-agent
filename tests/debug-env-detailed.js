const fs = require('fs');

function loadEnvFile(filePath) {
  console.log('Loading env from:', filePath);
  const envVars = {};
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    console.log('Total lines:', lines.length);
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line && !line.startsWith('#')) {
        const equalIndex = line.indexOf('=');
        if (equalIndex > 0) {
          const key = line.substring(0, equalIndex);
          let value = line.substring(equalIndex + 1);
          
          console.log('Found key:', key, 'at line', i + 1);
          
          if (key === 'GITHUB_APP_ID') {
            console.log('GITHUB_APP_ID value:', JSON.stringify(value));
          }
          
          envVars[key] = value;
        }
      }
      i++;
    }
    
    console.log('Total env vars found:', Object.keys(envVars).length);
    console.log('Keys found:', Object.keys(envVars).slice(0, 10));
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error.message);
    return {};
  }
}

const envVars = loadEnvFile('../apps/open-swe/.env');
console.log('GITHUB_APP_ID in result:', envVars.GITHUB_APP_ID);
