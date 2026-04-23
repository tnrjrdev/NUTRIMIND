import express from 'express';
import { prisma } from '../prisma.js';
import { verifyToken } from '../auth.js';

const router = express.Router();
router.use(verifyToken);

router.get('/categorias', async (req, res, next) => {
  try {
    const categorias = await prisma.categoriaSubstituicao.findMany({
      where: { ativo: true },
      orderBy: { ordemExibicao: 'asc' }
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/categorias', verifyToken, async (req, res, next) => {
  try {
    const { nome, descricao, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaSubstituicao.create({
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

router.put('/categorias/:id', verifyToken, async (req, res, next) => {
  try {
    const { nome, descricao, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaSubstituicao.update({
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

router.delete('/categorias/:id', verifyToken, async (req, res, next) => {
  try {
    const categoria = await prisma.categoriaSubstituicao.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res, next) => {
  try {
    const itens = await prisma.itemSubstituicao.findMany({
      where: {
        ativo: true,
        categoriaId: req.query.categoriaId ? parseInt(req.query.categoriaId) : undefined
      },
      include: { categoria: true },
      orderBy: { ordemExibicao: 'asc' }
    });
    res.json(itens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.itemSubstituicao.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { categoria: true }
    });
    if (!item || !item.ativo) {
      return res.status(404).json({ message: 'Item de substituição não encontrado.' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res, next) => {
  const { categoriaId, nome, descricao, equivalencia, ordemExibicao, ativo } = req.body;
  if (!categoriaId) {
    return res.status(400).json({ message: 'Categoria é obrigatória.' });
  }

  try {
    const item = await prisma.itemSubstituicao.create({
      data: {
        categoriaId: parseInt(categoriaId),
        nome,
        descricao,
        equivalencia,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : 0,
        ativo: ativo ?? true
      },
      include: { categoria: true }
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  const { categoriaId, nome, descricao, equivalencia, ordemExibicao, ativo } = req.body;
  try {
    const item = await prisma.itemSubstituicao.update({
      where: { id: parseInt(req.params.id) },
      data: {
        categoriaId: categoriaId ? parseInt(categoriaId) : undefined,
        nome,
        descricao,
        equivalencia,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : undefined,
        ativo
      },
      include: { categoria: true }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const item = await prisma.itemSubstituicao.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
