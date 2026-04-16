import fs from 'fs';
import path from 'path';

function walk(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (file !== 'node_modules' && file !== '.git') {
            walk(fullPath);
          }
        } else {
          if (/[\u4e00-\u9fa5]/.test(file)) {
            console.log(fullPath);
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

walk('.');
