import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'backend', 'routes');

// Lê todos os arquivos na pasta routes
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

let totalModified = 0;

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Substituir os métodos de rota para incluir 'next' se não existir
  // regex: procura por router.(get|post|put|delete)('/path', async (req, res) => {
  // e substitui por router.$1('/path', async (req, res, next) => {
  content = content.replace(/(router\.(get|post|put|delete)\([^,]+(?:,\s*verifyToken)?,\s*async\s*\(\s*req\s*,\s*res\s*)(\)\s*=>\s*\{)/g, '$1, next$3');

  // 2. Substituir os blocos catch (err) { res.status(500).json({ error: err.message }) } por next(err)
  // Expressão regular super abrangente para capturar variações de erro de 500
  content = content.replace(/catch\s*\(([^)]+)\)\s*\{[\s\S]*?res\.status\(500\)\.json\([\s\S]*?\}\s*;/g, 'catch ($1) {\n    next($1);\n  }');
  
  // Tratando casos onde não tem ponto e vírgula no final do json
  content = content.replace(/catch\s*\(([^)]+)\)\s*\{[\s\S]*?res\.status\(500\)\.json\([\s\S]*?\}\n/g, 'catch ($1) {\n    next($1);\n  }\n');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Refatorado: ${file}`);
    totalModified++;
  } else {
    console.log(`⏩ Sem mudanças: ${file}`);
  }
});

console.log(`\n🎉 Refatoração completa! ${totalModified} arquivos atualizados para usar next(err).`);
