const fs = require('fs');
const path = require('path');
const vm = require('vm');

const adminPath = path.join(__dirname, 'admin.html');
if (!fs.existsSync(adminPath)) {
  console.error("admin.html does not exist");
  process.exit(1);
}

const html = fs.readFileSync(adminPath, 'utf8');

// Regex to extract contents inside script tags
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 1;
let hasError = false;

// Mock DOM globals so compilation doesn't crash on standard variables
const sandbox = {
  window: {},
  document: {
    getElementById: () => ({ addEventListener: () => {} }),
    querySelectorAll: () => []
  },
  console: console,
  setTimeout: setTimeout,
  setInterval: setInterval,
  clearTimeout: clearTimeout,
  clearInterval: clearInterval,
  navigator: {},
  location: {}
};
sandbox.window.onload = null;

while ((match = scriptRegex.exec(html)) !== null) {
  const scriptContent = match[1].trim();
  if (scriptContent.length === 0) continue;
  
  // Skip external scripts imports
  if (match[0].includes('src=')) continue;

  console.log(`Compiling internal script block #${scriptIndex}...`);
  try {
    const script = new vm.Script(scriptContent, { filename: `admin.html#script[${scriptIndex}]` });
    // We only need to check syntax, vm.Script constructor does exactly that!
    console.log(`  ✓ Block #${scriptIndex} compiled successfully.`);
  } catch (err) {
    console.error(`❌ Syntax Error in internal script block #${scriptIndex}:`);
    console.error(err.stack || err.message);
    hasError = true;
  }
  scriptIndex++;
}

if (hasError) {
  console.error("\n💔 admin.html contains syntax errors.");
  process.exit(1);
} else {
  console.log("\n💚 admin.html internal scripts compiled successfully with no syntax errors.");
  process.exit(0);
}
