const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

const oldBtn1 = `<div className="pt-1">
                              <a
                                href={\`\${window.location.origin}/?student_exam=true\`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <GraduationCap className="w-4 h-4 text-amber-300" />
                                <span>{idt("បើក Form Login ចូលប្រឡងបញ្ចប់វគ្គ", "Open Exam Login Form", "打开结业考试登录")}</span>
                              </a>
                            </div>`;

const newBtns1 = `<div className="pt-2 flex flex-col gap-2">
                              <a
                                href="/?parent_login=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 border border-slate-200"
                              >
                                <ExternalLink className="w-4 h-4 text-slate-500" />
                                <span>{idt("បើក Form Login អាណាព្យាបាល", "Open Guardian Portal", "打开家长门户")}</span>
                              </a>
                              <a
                                href="/?student_exam=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <GraduationCap className="w-4 h-4 text-amber-300" />
                                <span>{idt("បើក Form Login ចូលប្រឡងបញ្ចប់វគ្គ", "Open Exam Login Form", "打开结业考试登录")}</span>
                              </a>
                            </div>`;

if(file.includes(oldBtn1)) {
  file = file.replace(oldBtn1, newBtns1);
  fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
  console.log("Successfully replaced buttons in SettingsTab.tsx");
} else {
  console.log("Could not find the target string.");
}
