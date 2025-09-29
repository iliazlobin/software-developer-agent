const fs = require('fs');

function loadEnvFile(filePath) {
  const envVars = {};
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line && !line.startsWith('#')) {
        const equalIndex = line.indexOf('=');
        if (equalIndex > 0) {
          const key = line.substring(0, equalIndex);
          let value = line.substring(equalIndex + 1);
          
          console.log(`Processing key: ${key}, raw value: ${JSON.stringify(value)}`);
          
          // Handle multi-line values (quoted strings that don't end on the same line)
          if (value.startsWith('"') && !value.endsWith('"')) {
            console.log('Multi-line value detected');
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
            console.log(`Single line value, starts with quote: ${value.startsWith('"')}, ends with quote: ${value.endsWith('"')}`);
            // Single line value - remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
              console.log('Removing quotes');
              value = value.slice(1, -1);
            }
          }
          
          console.log(`Final value: ${JSON.stringify(value)}`);
          envVars[key] = value;
          
          if (key === 'GITHUB_APP_ID') {
            console.log(`GITHUB_APP_ID found: ${JSON.stringify(value)}`);
          }
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

console.log('Testing GitHub App ID parsing...');
const envVars = loadEnvFile('../apps/open-swe/.env');
console.log(`GITHUB_APP_ID in result: ${JSON.stringify(envVars.GITHUB_APP_ID)}`);
console.log(`Has GITHUB_APP_ID: ${!!envVars.GITHUB_APP_ID}`);
