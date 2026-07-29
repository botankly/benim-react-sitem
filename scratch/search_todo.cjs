const fs = require('fs');
const path = require('path');

const targetStr = "to do app";
const startDir = "C:\\Users\\KLAY\\Desktop";

function searchDir(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      if (stat.isDirectory()) {
        if (item === 'node_modules' || item === '.git' || item === '.vercel' || item === 'dist' || item === 'build' || item === '.next') {
          continue;
        }
        searchDir(fullPath);
      } else {
        const ext = path.extname(fullPath).toLowerCase();
        if (['.js', '.jsx', '.html', '.css', '.json', '.ts', '.tsx', '.vue', '.txt'].includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.toLowerCase().includes(targetStr)) {
              console.log(`Buldum: ${fullPath}`);
            }
          } catch (e) {
            // ignore read errors
          }
        }
      }
    }
  } catch (e) {
    // ignore read errors
  }
}

searchDir(startDir);
console.log("Arama bitti.");
