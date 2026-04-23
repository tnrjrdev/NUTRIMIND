import express from 'express';
import { prisma } from '../prisma.js';
import { verifyToken } from '../auth.js';

const router = express.Router();
router.use(verifyToken);

// ==========================================
// ROTAS DE CATEGORIAS DE RECEITA
// ==========================================

// PÚBLICA: Lista categorias ativas
router.get('/categorias', async (req, res, next) => {
  try {
    const categorias = await prisma.categoriaReceita.findMany({
      where: { ativo: true },
      orderBy: { ordemExibicao: 'asc' }
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Cria nova categoria
router.post('/categorias', verifyToken, async (req, res, next) => {
  try {
    const { nome, descricao, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaReceita.create({
      data: {
        nome,
        descricao,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : 0,
        ativo: ativo ?? true
      }
    });
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Atualiza categoria
router.put('/categorias/:id', verifyToken, async (req, res, next) => {
  try {
    const { nome, descricao, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaReceita.update({
      where: { id: parseInt(req.params.id) },
      data: {
        nome,
        descricao,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : undefined,
        ativo
      }
    });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Inativa (Soft Delete) categoria
router.delete('/categorias/:id', verifyToken, async (req, res, next) => {
  try {
    const categoria = await prisma.categoriaReceita.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json({ message: 'Categoria inativada com sucesso.', categoria });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// ROTAS DE RECEITAS
// ==========================================

// PÚBLICA: Lista receitas ativas e seus dados filhos
router.get('/', async (req, res, next) => {
  try {
    const receitas = await prisma.receita.findMany({
      where: {
        ativo: true,
        categoriaId: req.query.categoriaId ? parseInt(req.query.categoriaId) : undefined
      },
      include: {
        categoria: true,
        ingredientes: { orderBy: { ordemExibicao: 'asc' } },
        modosPreparo: { orderBy: { numeroPasso: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(receitas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PÚBLICA: Pega detalhes completos de uma receita
router.get('/:id', async (req, res, next) => {
  try {
    const receita = await prisma.receita.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        categoria: true,
        ingredientes: { orderBy: { ordemExibicao: 'asc' } },
        modosPreparo: { orderBy: { numeroPasso: 'asc' } }
      }
    });
    if (!receita) return res.status(404).json({ message: 'Receita não encontrada.' });
    res.json(receita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Cria receita (junto com os filhos na mesma transação)
router.post('/', verifyToken, async (req, res, next) => {
  const { nome, descricao, imagem, tempoPreparo, categoriaId, ingredientes, modosPreparo, ativo, destaque } = req.body;
  
  if (!categoriaId) return res.status(400).json({ message: 'Categoria é obrigatória.' });

  try {
    const receita = await prisma.receita.create({
      data: {
        nome,
        descricao,
        imagem,
        tempoPreparo,
        categoriaId: parseInt(categoriaId),
        destaque: destaque ?? false,
        ativo: ativo ?? true,
        // Cria em cascata
        ingredientes: {
          create: (ingredientes || []).map((ing, i) => ({
            descricao: ing.descricao,
            ordemExibicao: ing.ordemExibicao ?? i
          }))
        },
        modosPreparo: {
          create: (modosPreparo || []).map((mod, i) => ({
            descricao: mod.descricao,
            numeroPasso: mod.numeroPasso ?? (i + 1)
          }))
        }
      },
      include: { ingredientes: true, modosPreparo: true }
    });
    res.status(201).json(receita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Atualiza receita
router.put('/:id', verifyToken, async (req, res, next) => {
  const recipeId = parseInt(req.params.id);
  const { nome, descricao, imagem, tempoPreparo, categoriaId, ingredientes, modosPreparo, ativo, destaque } = req.body;

  try {
    // 1. O Prisma permite atualizar filhos, mas as vezes é mais limpo apagar os antigos 
    // e recriar, já que ingredientes não guardam relações complexas com outras tabelas independentes.
    await prisma.ingrediente.deleteMany({ where: { receitaId: recipeId } });
    await prisma.modoPreparo.deleteMany({ where: { receitaId: recipeId } });

    // 2. Atualiza a receita mãe e já cria os novos (Update atômico)
    const receita = await prisma.receita.update({
      where: { id: recipeId },
      data: {
        nome,
        descricao,
        imagem,
        tempoPreparo,
        categoriaId: categoriaId ? parseInt(categoriaId) : undefined,
        destaque,
        ativo,
        ingredientes: {
          create: (ingredientes || []).map((ing, i) => ({
            descricao: ing.descricao,
            ordemExibicao: ing.ordemExibicao ?? i
          }))
        },
        modosPreparo: {
          create: (modosPreparo || []).map((mod, i) => ({
            descricao: mod.descricao,
            numeroPasso: mod.numeroPasso ?? (i + 1)
          }))
        }
      },
      include: { ingredientes: true, modosPreparo: true }
    });
    res.json(receita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Inativa receita
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const receita = await prisma.receita.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json({ message: 'Receita inativada.', receita });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
