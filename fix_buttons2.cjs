const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

file = file.replace(/<a\s+href="\/\?admin_login=true"[^>]*>([\s\S]*?)<\/a>/g, '<button onClick={() => window.open("?admin_login=true", "_blank")} className="flex-1 min-w-[140px] px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95">$1</button>');

file = file.replace(/<a\s+href="\/\?parent_login=true"[^>]*>([\s\S]*?)<\/a>/g, '<button onClick={() => window.open("?parent_login=true", "_blank")} className="w-full px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 border border-slate-200">$1</button>');

file = file.replace(/<a\s+href="\/\?student_exam=true"[^>]*>([\s\S]*?)<\/a>/g, '<button onClick={() => window.open("?student_exam=true", "_blank")} className="w-full px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95">$1</button>');

fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
console.log("Converted to window.open buttons.");
