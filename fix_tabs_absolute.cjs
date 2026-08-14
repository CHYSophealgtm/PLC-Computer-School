const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

file = file.replace(/onClick=\{\(\) => window\.location\.href = "\/\?admin_login=true"\}/g, 'onClick={() => window.open(window.location.origin + window.location.pathname + "?admin_login=true", "_blank", "noopener,noreferrer")}');
file = file.replace(/onClick=\{\(\) => window\.location\.href = "\/\?parent_login=true"\}/g, 'onClick={() => window.open(window.location.origin + window.location.pathname + "?parent_login=true", "_blank", "noopener,noreferrer")}');
file = file.replace(/onClick=\{\(\) => window\.location\.href = "\/\?student_exam=true"\}/g, 'onClick={() => window.open(window.location.origin + window.location.pathname + "?student_exam=true", "_blank", "noopener,noreferrer")}');

fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
console.log("Updated to absolute window.open");
