const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

const adminA = `<a
                                href="/?admin_login=true" target="_blank" rel="noopener noreferrer"
                                className="flex-1 min-w-[140px] px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>{idt("បើក Form Login Admin", "Open Admin Login", "打开管理员登录")}</span>
                              </a>`;
const adminBtn = `<button
                                onClick={() => window.open("?admin_login=true", "_blank")}
                                className="flex-1 min-w-[140px] px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>{idt("បើក Form Login Admin", "Open Admin Login", "打开管理员登录")}</span>
                              </button>`;

const parentA = `<a
                                href="/?parent_login=true" target="_blank" rel="noopener noreferrer"
                                className="w-full px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 border border-slate-200"
                              >
                                <ExternalLink className="w-4 h-4 text-slate-500" />
                                <span>{idt("បើក Form Login អាណាព្យាបាល", "Open Guardian Portal", "打开家长门户")}</span>
                              </a>`;
const parentBtn = `<button
                                onClick={() => window.open("?parent_login=true", "_blank")}
                                className="w-full px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 border border-slate-200"
                              >
                                <ExternalLink className="w-4 h-4 text-slate-500" />
                                <span>{idt("បើក Form Login អាណាព្យាបាល", "Open Guardian Portal", "打开家长门户")}</span>
                              </button>`;

const examA = `<a
                                href="/?student_exam=true" target="_blank" rel="noopener noreferrer"
                                className="w-full px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <GraduationCap className="w-4 h-4 text-amber-300" />
                                <span>{idt("បើក Form Login ចូលប្រឡងបញ្ចប់វគ្គ", "Open Exam Login Form", "打开结业考试登录")}</span>
                              </a>`;
const examBtn = `<button
                                onClick={() => window.open("?student_exam=true", "_blank")}
                                className="w-full px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
                              >
                                <GraduationCap className="w-4 h-4 text-amber-300" />
                                <span>{idt("បើក Form Login ចូលប្រឡងបញ្ចប់វគ្គ", "Open Exam Login Form", "打开结业考试登录")}</span>
                              </button>`;

if (file.includes(adminA)) file = file.replace(adminA, adminBtn);
else console.log("Admin A not found");

if (file.includes(parentA)) file = file.replace(parentA, parentBtn);
else console.log("Parent A not found");

if (file.includes(examA)) file = file.replace(examA, examBtn);
else console.log("Exam A not found");

fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
console.log("Converted to window.open buttons.");
