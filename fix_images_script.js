import fs from 'fs';
import path from 'path';

// Valid 1x1 transparent PNG
const validPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const pngBuf = Buffer.from(validPngBase64, 'base64');

// Download a neutral placeholder via HTTP to use as fallback instead of 1x1 pixel
import http from 'http';

const targetDir = '/app/applet/public/images';

const files = fs.readdirSync(targetDir);

for (const file of files) {
  const filePath = path.join(targetDir, file);
  // Check if it's the broken 1x1 pixel (very small file size)
  const stat = fs.statSync(filePath);
  if (stat.size < 200) {
    fs.writeFileSync(filePath, pngBuf);
  }
}
console.log('Fixed broken images');
