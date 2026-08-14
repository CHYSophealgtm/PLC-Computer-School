const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

file = file.replace(/href="\/\?admin_login=true"\s+target="_blank"\s+rel="noopener noreferrer"/g, 'href="/?admin_login=true"');
file = file.replace(/href="\/\?parent_login=true"\s+target="_blank"\s+rel="noopener noreferrer"/g, 'href="/?parent_login=true"');
file = file.replace(/href="\/\?student_exam=true"\s+target="_blank"\s+rel="noopener noreferrer"/g, 'href="/?student_exam=true"');

fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
console.log("Fixed links.");
