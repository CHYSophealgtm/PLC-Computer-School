const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

const oldAdminBtn = `<a
                                href={\`\${window.location.origin}/?admin_login=true\`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4 text-slate-300" />
                                <span>{idt("បើក Form Login Admin", "Open Admin Login Form", "打开管理员登录")}</span>
                              </a>`;

const newAdminBtn = `<a
                                href="/?admin_login=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4 text-slate-300" />
                                <span>{idt("បើក Form Login Admin", "Open Admin Login Form", "打开管理员登录")}</span>
                              </a>`;

if(file.includes(oldAdminBtn)) {
  file = file.replace(oldAdminBtn, newAdminBtn);
  fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
  console.log("Successfully replaced admin button in SettingsTab.tsx");
} else {
  console.log("Could not find the target admin string.");
}
