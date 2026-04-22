const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, '../src/features/admin'),
];

const replacements = [
  // Botões dourados → emerald
  { p: /bg-\[#b78b03\]/g, r: 'bg-emerald-500' },
  { p: /hover:bg-\[#a17802\]/g, r: 'hover:bg-emerald-600' },
  { p: /hover:bg-\[#a88709\]/g, r: 'hover:bg-emerald-600' },
  { p: /bg-\[#b89614\]/g, r: 'bg-emerald-500' },
  // AdminLayout active nav
  { p: /bg-\[#b78b03\] text-white font-medium shadow-md shadow-amber-900\/20/g, r: 'bg-emerald-500 text-white font-medium shadow-md shadow-emerald-900/20' },
  // backgrounds admin
  { p: /bg-\[#f8f5ef\]\/50/g, r: 'bg-slate-50/50' },
  { p: /bg-\[#f8f5ef\]/g, r: 'bg-slate-50' },
  // AdminCategoryManager old classes
  { p: /bg-\[#efe3b6\]/g, r: 'bg-emerald-50' },
  { p: /text-\[#9a790c\]/g, r: 'text-emerald-700' },
  { p: /border-\[#ece2c8\]/g, r: 'border-slate-200' },
  { p: /border-\[#e8dcc0\]/g, r: 'border-slate-200' },
  { p: /bg-\[linear-gradient\(180deg,#fffdf8_0%,#f8f2e4_100%\)\]/g, r: 'bg-white' },
  { p: /shadow-\[0_18px_45px_rgba\(70,54,15,0\.06\)\]/g, r: 'shadow-lg shadow-slate-200/50' },
  { p: /text-\[#9a9384\]/g, r: 'text-slate-400' },
  { p: /text-\[#726b5c\]/g, r: 'text-slate-500' },
  { p: /text-\[#8a6a08\]/g, r: 'text-emerald-600' },
  { p: /border-\[#dfd0a0\]/g, r: 'border-slate-200' },
  { p: /border-\[#c9ab42\]/g, r: 'border-emerald-400' },
  { p: /text-\[#a48411\]/g, r: 'text-emerald-600' },
  { p: /hover:border-\[#d8c270\]/g, r: 'hover:border-emerald-200' },
  { p: /hover:shadow-\[0_16px_34px_rgba\(79,62,16,0\.07\)\]/g, r: 'hover:shadow-lg' },
  { p: /shadow-\[0_10px_28px_rgba\(79,62,16,0\.04\)\]/g, r: 'shadow-sm' },
  { p: /text-\[#695617\]/g, r: 'text-emerald-800' },
  { p: /text-\[#7d7667\]/g, r: 'text-slate-500' },
  { p: /bg-\[#fffdf7\]/g, r: 'bg-emerald-50/30' },
  { p: /border-\[#d9c583\]/g, r: 'border-emerald-200' },
  { p: /text-\[#2a2a2a\]/g, r: 'text-slate-800' },
  { p: /text-\[#736c5d\]/g, r: 'text-slate-500' },
  { p: /border-\[#dbc46e\]/g, r: 'border-emerald-200' },
  { p: /text-\[#896908\]/g, r: 'text-emerald-700' },
  { p: /text-\[#817661\]/g, r: 'text-slate-500' },
  { p: /border-\[#e7d9aa\]/g, r: 'border-slate-200' },
  { p: /text-\[#4f493e\]/g, r: 'text-slate-700' },
  { p: /border-\[#d8c98f\]/g, r: 'border-slate-200' },
  { p: /text-\[#7a6e50\]/g, r: 'text-slate-600' },
  // AdminDashboardPage icon bg
  { p: /bg-\[#fbf2d5\]/g, r: 'bg-emerald-50' },
  // amber color in receitas admin
  { p: /bg-amber-50\/50/g, r: 'bg-emerald-50/50' },
  { p: /text-amber-900/g, r: 'text-emerald-800' },
  { p: /bg-amber-200/g, r: 'bg-emerald-200' },
  { p: /text-amber-800/g, r: 'text-emerald-700' },
  { p: /text-amber-700\/50/g, r: 'text-emerald-600/50' },
  { p: /bg-amber-50 text-amber-700 rounded text-xs border border-amber-100/g, r: 'bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-100' },
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

for (const t of targets) {
  processPath(t);
}
console.log('Done admin colors fix');
