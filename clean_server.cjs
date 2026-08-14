const fs = require('fs');
let file = fs.readFileSync('server.ts', 'utf8');

// Remove the whole SQLite auto-recovery block
file = file.replace(/if \([\s\S]*?CRITICAL: SQLite database file is malformed[\s\S]*?\}\s*\}\s*\} catch \(error\) \{[\s\S]*?auto-recovery/g, '');

fs.writeFileSync('server.ts', file);
