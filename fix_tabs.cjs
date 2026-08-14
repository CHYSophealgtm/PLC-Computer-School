const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

file = file.replace(/href="\/\?admin_login=true"/g, 'href="/?admin_login=true" target="_blank" rel="noopener noreferrer"');
file = file.replace(/href="\/\?parent_login=true"/g, 'href="/?parent_login=true" target="_blank" rel="noopener noreferrer"');
file = file.replace(/href="\/\?student_exam=true"/g, 'href="/?student_exam=true" target="_blank" rel="noopener noreferrer"');

fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
console.log("Re-added target=_blank");
