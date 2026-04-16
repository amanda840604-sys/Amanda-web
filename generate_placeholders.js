import fs from 'fs';
import path from 'path';

const appTsx = fs.readFileSync('/app/applet/src/App.tsx', 'utf8');
const regex = /['"](\/(?:assets_img|static)\/images\/[^'"]+)['"]/g;
const matches = [...appTsx.matchAll(regex)].map(m => m[1]);

const baseDir = '/app/applet/public';

// Small 1x1 gray pixel base64
// We'll write it as a binary buffer
const jpegBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const jpegBuffer = Buffer.from(jpegBase64, 'base64');
const pngBuffer = Buffer.from(pngBase64, 'base64');

let created = 0;

for (const imagePath of matches) {
  const fullPath = path.join(baseDir, imagePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    const isPng = imagePath.toLowerCase().endsWith('.png');
    fs.writeFileSync(fullPath, isPng ? pngBuffer : jpegBuffer);
    created++;
  }
}

console.log(`Created ${created} placeholder images.`);
