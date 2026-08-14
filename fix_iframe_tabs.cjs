const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/SettingsTab.tsx', 'utf8');

const openInIframe = (urlQuery, title) => {
  return `onClick={() => {
                                  const newTab = window.open("", "_blank");
                                  if (newTab) {
                                    newTab.document.write(\`
                                      <!DOCTYPE html>
                                      <html>
                                        <head>
                                          <title>${title}</title>
                                          <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }</style>
                                        </head>
                                        <body>
                                          <iframe src="\${window.location.origin}/\${window.location.pathname}${urlQuery}" style="width:100%;height:100%;border:none;"></iframe>
                                        </body>
                                      </html>
                                    \`);
                                    newTab.document.close();
                                  }
                                }}`;
};

file = file.replace(/onClick=\{\(\) => window\.open\(window\.location\.origin \+ window\.location\.pathname \+ "\?admin_login=true", "_blank", "noopener,noreferrer"\)\}/g, openInIframe('?admin_login=true', 'Admin Login'));
file = file.replace(/onClick=\{\(\) => window\.open\(window\.location\.origin \+ window\.location\.pathname \+ "\?parent_login=true", "_blank", "noopener,noreferrer"\)\}/g, openInIframe('?parent_login=true', 'Guardian Portal'));
file = file.replace(/onClick=\{\(\) => window\.open\(window\.location\.origin \+ window\.location\.pathname \+ "\?student_exam=true", "_blank", "noopener,noreferrer"\)\}/g, openInIframe('?student_exam=true', 'Student Exam'));

fs.writeFileSync('src/components/tabs/SettingsTab.tsx', file);
console.log("Updated to iframe new tab workaround.");
