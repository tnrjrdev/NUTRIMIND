import 'dotenv/config';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';

const prisma = new PrismaClient();
const sqlitePath = process.env.SQLITE_DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.SQLITE_DATABASE_PATH)
  : path.resolve(process.cwd(), 'dev.db');
const forceReset = process.argv.includes('--force-reset');
const sqlite = new Database(sqlitePath, { readonly: true });

const destinationModels = [
  ['usuario', prisma.usuario],
  ['categoriaReceita', prisma.categoriaReceita],
  ['receita', prisma.receita],
  ['ingrediente', prisma.ingrediente],
  ['modoPreparo', prisma.modoPreparo],
  ['categoriaProduto', prisma.categoriaProduto],
  ['produto', prisma.produto],
  ['categoriaFornecedor', prisma.categoriaFornecedor],
  ['fornecedor', prisma.fornecedor],
  ['cupomDesconto', prisma.cupomDesconto],
  ['categoriaIfood', prisma.categoriaIfood],
  ['restauranteIfood', prisma.restauranteIfood],
  ['categoriaCha', prisma.categoriaCha],
  ['cha', prisma.cha],
  ['categoriaSubstituicao', prisma.categoriaSubstituicao],
  ['itemSubstituicao', prisma.itemSubstituicao],
  ['bemEstarItem', prisma.bemEstarItem],
  ['dica', prisma.dica],
];

const resetOrder = [
  prisma.modoPreparo,
  prisma.ingrediente,
  prisma.receita,
  prisma.produto,
  prisma.categoriaProduto,
  prisma.cupomDesconto,
  prisma.fornecedor,
  prisma.categoriaFornecedor,
  prisma.restauranteIfood,
  prisma.categoriaIfood,
  prisma.cha,
  prisma.categoriaCha,
  prisma.itemSubstituicao,
  prisma.categoriaSubstituicao,
  prisma.bemEstarItem,
  prisma.dica,
  prisma.usuario,
  prisma.categoriaReceita,
];

const sequenceTables = [
  'usuarios',
  'CategoriaReceita',
  'Receita',
  'Ingrediente',
  'ModoPreparo',
  'CategoriaProduto',
  'Produto',
  'CategoriaFornecedor',
  'Fornecedor',
  'CupomDesconto',
  'CategoriaIfood',
  'RestauranteIfood',
  'CategoriaCha',
  'Cha',
  'CategoriaSubstituicao',
  'ItemSubstituicao',
  'BemEstarItem',
  'Dica',
];

function tableExists(tableName) {
  return Boolean(
    sqlite.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)
  );
}

function getRows(tableName) {
  if (!tableExists(tableName)) {
    return [];
  }

  return sqlite.prepare(`SELECT * FROM "${tableName}"`).all();
}

function toDate(value) {
  return value ? new Date(value) : undefined;
}

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null) {
    return fallback;
  }

  return Boolean(value);
}

async function ensureDestinationIsReady() {
  const counts = await Promise.all(destinationModels.map(async ([name, model]) => [name, await model.count()]));
  const totalRows = counts.reduce((total, [, count]) => total + count, 0);

  if (totalRows > 0 && !forceReset) {
    const detail = counts
      .filter(([, count]) => count > 0)
      .map(([name, count]) => `${name}: ${count}`)
      .join(', ');

    throw new Error(
      `O Postgres ja possui dados (${detail}). Rode novamente com --force-reset para limpar o destino antes da migracao.`
    );
  }

  if (totalRows > 0 && forceReset) {
    for (const model of resetOrder) {
      await model.deleteMany();
    }
  }
}

async function importRows(label, rows, createMany) {
  if (!rows.length) {
    console.log(`- ${label}: sem dados para migrar`);
    return;
  }

  await createMany(rows);
  console.log(`- ${label}: ${rows.length} registro(s) migrado(s)`);
}

async function syncSequences() {
  for (const tableName of sequenceTables) {
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"${tableName}"', 'id'),
        COALESCE((SELECT MAX(id) FROM "${tableName}"), 1),
        (SELECT MAX(id) IS NOT NULL FROM "${tableName}")
      );
    `);
  }
}

async function main() {
  console.log(`Migrando dados do SQLite em ${sqlitePath} para o Postgres configurado em DATABASE_URL...`);

  await ensureDestinationIsReady();

  const usuarios = getRows('usuarios');
  const categoriasReceita = getRows('CategoriaReceita');
  const receitas = getRows('Receita');
  const ingredientes = getRows('Ingrediente');
  const modosPreparo = getRows('ModoPreparo');
  const categoriasProduto = getRows('CategoriaProduto');
  const produtos = getRows('Produto');
  const categoriasFornecedor = getRows('CategoriaFornecedor');
  const fornecedores = getRows('Fornecedor');
  const cupons = getRows('CupomDesconto');
  const categoriasIfood = getRows('CategoriaIfood');
  const restaurantes = getRows('RestauranteIfood');
  const categoriasCha = getRows('CategoriaCha');
  const chas = getRows('Cha');
  const categoriasSubstituicao = getRows('CategoriaSubstituicao');
  const itensSubstituicao = getRows('ItemSubstituicao');
  const bemEstarItens = getRows('BemEstarItem');
  const dicas = getRows('Dica');

  await importRows('usuarios', usuarios, async (rows) => {
    await prisma.usuario.createMany({
      data: rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        email: row.email,
        senhaHash: row.senha_hash,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.created_at) ?? new Date(),
        updatedAt: toDate(row.updated_at) ?? new Date(),
      })),
    });
  });

  await importRows('categorias de receita', categoriasReceita, async (rows) => {
    await prisma.categoriaReceita.createMany({
      data: rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('receitas', receitas, async (rows) => {
    await prisma.receita.createMany({
      data: rows.map((row) => ({
        id: row.id,
        categoriaId: row.categoriaId,
        nome: row.nome,
        descricao: row.descricao ?? null,
        imagem: row.imagem ?? null,
        tempoPreparo: row.tempoPreparo ?? null,
        destaque: toBoolean(row.destaque),
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('ingredientes', ingredientes, async (rows) => {
    await prisma.ingrediente.createMany({
      data: rows.map((row) => ({
        id: row.id,
        receitaId: row.receitaId,
        descricao: row.descricao,
        ordemExibicao: row.ordemExibicao ?? 0,
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('modos de preparo', modosPreparo, async (rows) => {
    await prisma.modoPreparo.createMany({
      data: rows.map((row) => ({
        id: row.id,
        receitaId: row.receitaId,
        numeroPasso: row.numeroPasso,
        descricao: row.descricao,
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('categorias de produto', categoriasProduto, async (rows) => {
    await prisma.categoriaProduto.createMany({
      data: rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao ?? null,
        imagem: row.imagem ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('produtos', produtos, async (rows) => {
    await prisma.produto.createMany({
      data: rows.map((row) => ({
        id: row.id,
        categoriaId: row.categoriaId,
        nome: row.nome,
        marca: row.marca ?? null,
        descricao: row.descricao ?? null,
        imagem: row.imagem ?? null,
        recomendado: toBoolean(row.recomendado),
        semAcucar: toBoolean(row.semAcucar),
        semGluten: toBoolean(row.semGluten),
        semLactose: toBoolean(row.semLactose),
        fonteProteina: toBoolean(row.fonteProteina),
        fonteGorduraBoa: toBoolean(row.fonteGorduraBoa),
        fonteFibra: toBoolean(row.fonteFibra),
        observacao: row.observacao ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('categorias de fornecedor', categoriasFornecedor, async (rows) => {
    await prisma.categoriaFornecedor.createMany({
      data: rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('fornecedores', fornecedores, async (rows) => {
    await prisma.fornecedor.createMany({
      data: rows.map((row) => ({
        id: row.id,
        categoriaId: row.categoriaId,
        nome: row.nome,
        descricaoCurta: row.descricaoCurta ?? null,
        descricaoDetalhada: row.descricaoDetalhada ?? null,
        endereco: row.endereco ?? null,
        telefone: row.telefone ?? null,
        whatsapp: row.whatsapp ?? null,
        instagram: row.instagram ?? null,
        site: row.site ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('cupons de desconto', cupons, async (rows) => {
    await prisma.cupomDesconto.createMany({
      data: rows.map((row) => ({
        id: row.id,
        fornecedorId: row.fornecedorId,
        codigo: row.codigo,
        descricao: row.descricao ?? null,
        validade: toDate(row.validade) ?? null,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('categorias do ifood', categoriasIfood, async (rows) => {
    await prisma.categoriaIfood.createMany({
      data: rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('restaurantes ifood', restaurantes, async (rows) => {
    await prisma.restauranteIfood.createMany({
      data: rows.map((row) => ({
        id: row.id,
        categoriaId: row.categoriaId,
        nome: row.nome,
        descricao: row.descricao ?? null,
        telefone: row.telefone ?? null,
        linkExterno: row.linkExterno ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('categorias de cha', categoriasCha, async (rows) => {
    await prisma.categoriaCha.createMany({
      data: rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao ?? null,
        imagem: row.imagem ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('chas', chas, async (rows) => {
    await prisma.cha.createMany({
      data: rows.map((row) => ({
        id: row.id,
        categoriaId: row.categoriaId,
        nome: row.nome,
        formaUtilizacao: row.formaUtilizacao ?? row.descricao ?? null,
        posologia: row.posologia ?? row.preparo ?? null,
        contraindicacoes: row.contraindicacoes ?? null,
        observacoes: row.observacoes ?? null,
        usoAdulto: toBoolean(row.usoAdulto),
        usoInfantil: toBoolean(row.usoInfantil),
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('categorias de substituicao', categoriasSubstituicao, async (rows) => {
    await prisma.categoriaSubstituicao.createMany({
      data: rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        descricao: row.descricao ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('itens de substituicao', itensSubstituicao, async (rows) => {
    await prisma.itemSubstituicao.createMany({
      data: rows.map((row) => ({
        id: row.id,
        categoriaId: row.categoriaId,
        nome: row.nome,
        descricao: row.descricao ?? null,
        equivalencia: row.equivalencia ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('itens de bem-estar', bemEstarItens, async (rows) => {
    await prisma.bemEstarItem.createMany({
      data: rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        descricaoCurta: row.descricaoCurta ?? null,
        descricaoDetalhada: row.descricaoDetalhada ?? null,
        telefone: row.telefone ?? null,
        whatsapp: toBoolean(row.whatsapp),
        instagram: row.instagram ?? null,
        site: row.site ?? null,
        midiaUrl: row.midiaUrl ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await importRows('dicas', dicas, async (rows) => {
    await prisma.dica.createMany({
      data: rows.map((row) => ({
        id: row.id,
        texto: row.texto,
        icone: row.icone ?? null,
        ordemExibicao: row.ordemExibicao ?? 0,
        ativo: toBoolean(row.ativo, true),
        createdAt: toDate(row.createdAt) ?? new Date(),
        updatedAt: toDate(row.updatedAt) ?? new Date(),
      })),
    });
  });

  await syncSequences();
  console.log('Migracao concluida com sucesso.');
}

main()
  .catch((error) => {
    console.error('Falha na migracao:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    sqlite.close();
  });
