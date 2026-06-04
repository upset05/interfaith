const fs = require('fs');
let script = fs.readFileSync('script.js', 'utf8');

const tables = ['hero_content', 'posts', 'event_heroes', 'gallery', 'videos'];
tables.forEach(table => {
  const findRegex = new RegExp(`(return supabaseClient\\.from\\('${table}'\\)[\\s\\S]*?\\.then\\(\\(.*?\\) => \\{[\\s\\S]*?return data \\|\\| \\[\\];\\s*\\})`, 'g');
  script = script.replace(findRegex, (match) => {
    return match + `\n    }).catch(err => {\n      console.warn('Supabase ${table} query rejected:', err);\n      return JSON.parse(sysStorage.getItem('ippad_${table}') || '[]');`;
  });
});

const newsletterFind = `statusDiv.textContent = 'Successfully subscribed!';`;
const newsletterReplace = `// Send background email notification via FormSubmit.co\n          fetch("https://formsubmit.co/ajax/imamsandpastorsforum@gmail.com", {\n            method: "POST",\n            headers: {\n              "Content-Type": "application/json",\n              "Accept": "application/json"\n            },\n            body: JSON.stringify({\n              "Email": email,\n              "_subject": "IPPAD Forum: New Newsletter Subscription"\n            })\n          }).catch(err => console.warn("Email notification forward failed:", err));\n\n          statusDiv.textContent = 'Successfully subscribed!';`;

if (!script.includes("formsubmit.co/ajax/imamsandpastorsforum@gmail.com\", {\n            method: \"POST\"") || !script.includes("New Newsletter Subscription")) {
    script = script.replace(newsletterFind, newsletterReplace);
}

fs.writeFileSync('script.js', script);
