const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

file = file.replace(/onClick=\{\(\) => window\.open\("\?admin_login=true", "_blank"\)\}/g, 'onClick={() => window.location.href = "/?admin_login=true"}');
file = file.replace(/onClick=\{\(\) => window\.open\("\?parent_login=true", "_blank"\)\}/g, 'onClick={() => window.location.href = "/?parent_login=true"}');
file = file.replace(/onClick=\{\(\) => window\.open\("\?student_exam=true", "_blank"\)\}/g, 'onClick={() => window.location.href = "/?student_exam=true"}');

fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
console.log("Converted back to same tab navigation.");
