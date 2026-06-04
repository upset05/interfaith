const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const adminPath = path.join(__dirname, 'admin.html');
const html = fs.readFileSync(adminPath, 'utf8');

console.log('--- STARTING RUNTIME ENGINE SIMULATION ---');

// Set up virtual browser page
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost/admin.html"
});

const { window } = dom;

// Capture console messages and errors
window.console.error = (...args) => {
  console.error("❌ Console Error in Browser Context:", ...args);
};
window.console.warn = (...args) => {
  console.warn("⚠ Console Warning in Browser Context:", ...args);
};
window.console.log = (...args) => {
  console.log("ℹ Console Log in Browser Context:", ...args);
};

// Mock external global libraries
window.supabase = {
  createClient: () => ({
    from: (table) => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => Promise.resolve({ data: [], error: null }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) })
      })
    })
  })
};

window.lucide = {
  createIcons: () => {
    console.log("ℹ Mock Lucide: Icons created successfully.");
  }
};

// Listen for uncaught exceptions inside the virtual page
window.addEventListener('error', (event) => {
  console.error("❌ Uncaught Error on page:", event.error ? event.error.message : event.message);
});

// Trigger Page Loading Sequence
console.log('Triggering window.onload...');
try {
  if (typeof window.onload === 'function') {
    window.onload();
    console.log('window.onload executed successfully.');
    
    // Check if the skeleton overlay was successfully faded/removed
    const overlay = window.document.getElementById('skeletonOverlay');
    if (!overlay) {
      console.log('💚 SUCCESS: #skeletonOverlay was successfully removed from DOM!');
      process.exit(0);
    } else {
      console.log('ℹ Status: #skeletonOverlay is still in the DOM (waiting for transition/removal).');
      if (overlay.classList.contains('fade-out')) {
        console.log('💚 SUCCESS: #skeletonOverlay has class "fade-out" and is fading away.');
        process.exit(0);
      } else {
        console.error('❌ FAILURE: #skeletonOverlay is still visible (does not have "fade-out" class)!');
        process.exit(1);
      }
    }
  } else {
    console.error('❌ Failure: window.onload is not a function or was not bound.');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Exception thrown during window.onload execution:', err.message);
  console.error(err.stack);
  process.exit(1);
}
