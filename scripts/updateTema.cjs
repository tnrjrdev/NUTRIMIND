const fs = require('fs');
const path = require('path');

const dirToProcess = path.join(__dirname, '../src');

const replacements = [
  { p: /bg-\[linear-gradient\(135deg,#c6ab34_0%,#b89615_100%\)\]/g, r: 'bg-gradient-to-r from-emerald-500 to-teal-400' },
  { p: /bg-\[linear-gradient\(180deg,#fffdfa_0%,#f8f1df_100%\)\]/g, r: 'bg-slate-50' },
  { p: /bg-\[linear-gradient\(180deg,#fffdfa_0%,#faf4e4_100%\)\]/g, r: 'bg-slate-50' },
  { p: /border-\[#eadfbf\]/g, r: 'border-slate-200' },
  { p: /border-\[#eadfbe\]/g, r: 'border-slate-200' },
  { p: /border-\[#dcc77c\]/g, r: 'border-emerald-200' },
  { p: /border-\[#d4af37\]/g, r: 'border-emerald-300' },
  { p: /border-\[#efe4c6\]/g, r: 'border-slate-200' },
  { p: /border-\[#d9c16a\]/g, r: 'border-emerald-300' },
  { p: /border-\[#e7d8a8\]/g, r: 'border-slate-200' },
  { p: /border-\[#ebe1c2\]/g, r: 'border-slate-200' },
  { p: /bg-\[#fff8e9\]/g, r: 'bg-white' },
  { p: /bg-\[#f6ead2\]/g, r: 'bg-emerald-50' },
  { p: /bg-\[#fffdfa\]/g, r: 'bg-white' },
  { p: /bg-\[#f8f1df\]/g, r: 'bg-slate-50' },
  { p: /bg-\[#faf4e4\]/g, r: 'bg-slate-50' },
  { p: /bg-\[#fcfaf4\]/g, r: 'bg-slate-50/50' },
  { p: /bg-\[#f2e8c3\]/g, r: 'bg-emerald-100' },
  { p: /bg-\[#fbf6e2\]/g, r: 'bg-slate-50' },
  { p: /bg-\[#fffbf2\]/g, r: 'bg-emerald-50/50' },
  { p: /bg-\[#fbf3d7\]/g, r: 'bg-emerald-100' },
  { p: /bg-\[#efe4ba\]/g, r: 'bg-emerald-50' },
  { p: /bg-\[#f4ecd0\]/g, r: 'bg-emerald-100' },
  { p: /bg-\[#fbf8ef\]/g, r: 'bg-slate-50' },
  { p: /bg-\[#b89a1c\]/g, r: 'bg-emerald-500' },
  { p: /bg-\[#b89615\]/g, r: 'bg-emerald-500' },
  { p: /bg-\[#f3e7bd\]/g, r: 'bg-orange-50' },
  { p: /text-\[#d4af37\]/g, r: 'text-emerald-600' },
  { p: /text-\[#a4810d\]\/80/g, r: 'text-emerald-700/80' },
  { p: /text-\[#1f2531\]/g, r: 'text-slate-800' },
  { p: /text-\[#6e685b\]/g, r: 'text-slate-500' },
  { p: /text-\[#272727\]/g, r: 'text-slate-800' },
  { p: /text-\[#756f61\]/g, r: 'text-slate-500' },
  { p: /text-\[#a77f14\]/g, r: 'text-emerald-600' },
  { p: /text-\[#5d4b2f\]/g, r: 'text-slate-600' },
  { p: /text-\[#8d6b18\]/g, r: 'text-emerald-800' },
  { p: /text-\[#b78b03\]/g, r: 'text-emerald-500' },
  { p: /text-\[#2c2c2c\]/g, r: 'text-slate-800' },
  { p: /text-\[#7c620a\]/g, r: 'text-emerald-700' },
  { p: /text-\[#9d7c10\]/g, r: 'text-emerald-600' },
  { p: /text-\[#8b6909\]/g, r: 'text-emerald-500' },
  { p: /text-\[#9b7a0f\]/g, r: 'text-emerald-600' },
  { p: /text-\[#7c6108\]/g, r: 'text-emerald-700' },
  { p: /text-\[#7c7566\]/g, r: 'text-slate-500' },
  { p: /text-\[#8e6c09\]/g, r: 'text-orange-500' },
  { p: /text-\[#886808\]/g, r: 'text-emerald-700' },
  { p: /text-\[#2d2d2d\]/g, r: 'text-slate-800' },
  { p: /shadow-\[0_14px_36px_rgba\(92,68,11,0\.06\)\]/g, r: 'shadow-xl shadow-slate-200/50' },
  { p: /shadow-\[0_14px_36px_rgba\(92,68,11,0\.05\)\]/g, r: 'shadow-lg shadow-slate-200/50' },
  { p: /shadow-\[0_28px_80px_rgba\(53,40,10,0\.18\)\]/g, r: 'shadow-2xl shadow-emerald-900/5' },
  { p: /shadow-\[0_12px_28px_rgba\(98,74,13,0\.05\)\]/g, r: 'shadow-md shadow-slate-200/50' },
  { p: /shadow-\[0_8px_24px_rgba\(72,58,17,0\.05\)\]/g, r: 'shadow-md shadow-slate-200/30' },
  { p: /shadow-\[0_12px_28px_rgba\(72,58,17,0\.1\)\]/g, r: 'shadow-xl shadow-slate-200/50' },
  { p: /border-t-\[#b78b03\]/g, r: 'border-t-emerald-500' }
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
console.log("Done");
