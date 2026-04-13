import express from 'express';
import { prisma } from '../prisma.js';
import { verifyToken } from '../auth.js';

const router = express.Router();
router.use(verifyToken);

router.get('/categorias', async (req, res) => {
  try {
    const categorias = await prisma.categoriaCha.findMany({
      where: { ativo: true },
      orderBy: { ordemExibicao: 'asc' }
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/categorias', verifyToken, async (req, res) => {
  try {
    const { nome, descricao, imagem, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaCha.create({
      data: {
        nome,
        descricao,
        imagem,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : 0,
        ativo: ativo ?? true
      }
    });
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/categorias/:id', verifyToken, async (req, res) => {
  try {
    const { nome, descricao, imagem, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaCha.update({
      where: { id: parseInt(req.params.id) },
      data: {
        nome,
        descricao,
        imagem,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : undefined,
        ativo
      }
    });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/categorias/:id', verifyToken, async (req, res) => {
  try {
    const categoria = await prisma.categoriaCha.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const itens = await prisma.cha.findMany({
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

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.cha.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { categoria: true }
    });
    if (!item || !item.ativo) {
      return res.status(404).json({ message: 'Chá não encontrado.' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const {
    categoriaId,
    nome,
    formaUtilizacao,
    posologia,
    contraindicacoes,
    observacoes,
    usoAdulto,
    usoInfantil,
    ordemExibicao,
    ativo
  } = req.body;

  if (!categoriaId) {
    return res.status(400).json({ message: 'Categoria é obrigatória.' });
  }

  try {
    const item = await prisma.cha.create({
      data: {
        categoriaId: parseInt(categoriaId),
        nome,
        formaUtilizacao,
        posologia,
        contraindicacoes,
        observacoes,
        usoAdulto: usoAdulto ?? false,
        usoInfantil: usoInfantil ?? false,
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

router.put('/:id', verifyToken, async (req, res) => {
  const {
    categoriaId,
    nome,
    formaUtilizacao,
    posologia,
    contraindicacoes,
    observacoes,
    usoAdulto,
    usoInfantil,
    ordemExibicao,
    ativo
  } = req.body;

  try {
    const item = await prisma.cha.update({
      where: { id: parseInt(req.params.id) },
      data: {
        categoriaId: categoriaId ? parseInt(categoriaId) : undefined,
        nome,
        formaUtilizacao,
        posologia,
        contraindicacoes,
        observacoes,
        usoAdulto,
        usoInfantil,
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

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const item = await prisma.cha.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
