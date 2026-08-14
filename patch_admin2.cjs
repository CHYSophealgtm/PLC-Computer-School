const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

const oldBtn = `<a
                                href={\`\${window.location.origin}/?admin_login=true\`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[140px] px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>{idt("បើក Form Login Admin", "Open Admin Login", "打开管理员登录")}</span>
                              </a>`;
const newBtn = `<a
                                href="/?admin_login=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[140px] px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>{idt("បើក Form Login Admin", "Open Admin Login", "打开管理员登录")}</span>
                              </a>`;

if(file.includes(oldBtn)) {
  file = file.replace(oldBtn, newBtn);
  fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
  console.log("Successfully replaced admin button");
} else {
  console.log("Could not find the target admin string.");
}
