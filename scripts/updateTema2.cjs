const fs = require('fs');
const path = require('path');

const dirToProcess = path.join(__dirname, '../src');

const replacements = [
  { p: /border-\[#ddcf9f\]/g, r: 'border-slate-200' },
  { p: /bg-\[#fffdf8\]/g, r: 'bg-white' },
  { p: /border-\[#caaa42\]/g, r: 'border-emerald-400' },
  { p: /ring-\[#e8d48d\]/g, r: 'ring-emerald-200' },
  { p: /bg-\[#b89614\]/g, r: 'bg-emerald-500' },
  { p: /shadow-\[0_12px_26px_rgba\(146,112,11,0\.2\)\]/g, r: 'shadow-lg shadow-emerald-500/20' },
  { p: /hover:bg-\[#a58409\]/g, r: 'hover:bg-emerald-600' },
  { p: /bg-\[#f3e6bb\]/g, r: 'bg-emerald-50' },
  { p: /border-\[#d4c27b\]/g, r: 'border-emerald-200' },
  { p: /bg-\[#fbf6e4\]/g, r: 'bg-slate-50' },
  { p: /text-\[#836509\]/g, r: 'text-emerald-600' },
  { p: /hover:bg-\[#f5ebc6\]/g, r: 'hover:bg-emerald-100' },
  { p: /text-\[#a4810d\]/g, r: 'text-emerald-600' },
  { p: /border-\[#dccd98\]/g, r: 'border-slate-200' },
  { p: /text-\[#2b2b2b\]/g, r: 'text-slate-800' },
  { p: /border-\[#c7a43b\]/g, r: 'border-emerald-400' },
  { p: /ring-\[#ead58d\]/g, r: 'ring-emerald-200' },
  { p: /shadow-\[0_14px_28px_rgba\(145,112,11,0\.18\)\]/g, r: 'shadow-xl shadow-emerald-500/20' },
  { p: /hover:bg-\[#a88709\]/g, r: 'hover:bg-emerald-600' },
  { p: /text-\[#6d665a\]/g, r: 'text-slate-500' },
  { p: /text-\[#7b620c\]/g, r: 'text-emerald-700' },
  { p: /text-\[#a77f14\]/g, r: 'text-emerald-600' }
];

function processPath(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    for (const child of fs.readdirSync(targetPath)) {
      processPath(path.join(targetPath, child));
    }
  } else if (targetPath.endsWith('.tsx') || targetPath.endsWith('.ts')) {
    let content = fs.readFileSync(targetPath, 'utf8');
    let original = content;
    for (const map of replacements) {
      content = content.replace(map.p, map.r);
    }
    if (content !== original) {
      fs.writeFileSync(targetPath, content, 'utf8');
      console.log(`Updated: ${targetPath}`);
    }
  }
}

processPath(dirToProcess);
console.log("Done phase 2");
