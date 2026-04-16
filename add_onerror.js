import fs from 'fs';

const appPath = '/app/applet/src/App.tsx';
let content = fs.readFileSync(appPath, 'utf8');

const fallbackSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=";

// Replace <img ... > to include onError, avoiding those that already have it
content = content.replace(/<img([^>]*)>/g, (match, attrs) => {
  if (attrs.includes('onError')) return match; // already handled
  return `<img${attrs} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '${fallbackSrc}' }} />`;
});

fs.writeFileSync(appPath, content);
console.log('App.tsx wrapped with strict onError handlers.');
