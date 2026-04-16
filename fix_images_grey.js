import fs from 'fs';
import path from 'path';

// A valid 1x1 grey PNG base64
const validPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
const pngBuf = Buffer.from(validPngBase64, 'base64');

const targetDir = '/app/applet/public/images';
const files = fs.readdirSync(targetDir);

let fixed = 0;
for (const file of files) {
  const filePath = path.join(targetDir, file);
  const stat = fs.statSync(filePath);
  if (stat.size < 200) { // Fix the 64-byte ones
    fs.writeFileSync(filePath, pngBuf);
    fixed++;
  }
}
console.log('Fixed ' + fixed + ' broken placeholder images');
