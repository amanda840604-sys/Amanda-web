import fs from 'fs';

const appPath = '/app/applet/src/App.tsx';
let content = fs.readFileSync(appPath, 'utf8');

// Fix the syntax error from the previous script
content = content.replace(/\/ onError=/g, 'onError=');

fs.writeFileSync(appPath, content);
console.log('Fixed syntax error');
