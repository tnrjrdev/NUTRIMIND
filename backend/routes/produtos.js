import express from 'express';
import { verifyToken } from '../auth.js';
import { prisma } from '../prisma.js';

const router = express.Router();
router.use(verifyToken);

router.get('/categorias', async (req, res, next) => {
  try {
    const categorias = await prisma.categoriaProduto.findMany({
      where: { ativo: true },
      orderBy: { ordemExibicao: 'asc' },
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/categorias', async (req, res, next) => {
  try {
    const { nome, descricao, imagem, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaProduto.create({
      data: {
        nome,
        descricao: descricao ?? null,
        imagem: imagem ?? null,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : 0,
        ativo: ativo ?? true,
      },
    });
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/categorias/:id', async (req, res, next) => {
  try {
    const { nome, descricao, imagem, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaProduto.update({
      where: { id: parseInt(req.params.id) },
      data: {
        nome,
        descricao: descricao ?? undefined,
        imagem: imagem ?? undefined,
        ordemExibicao: ordemExibicao !== undefined ? parseInt(ordemExibicao) : undefined,
        ativo,
      },
    });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/categorias/:id', async (req, res, next) => {
  try {
    const categoria = await prisma.categoriaProduto.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false },
    });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res, next) => {
  try {
    const categoriaId = req.query.categoriaId ? parseInt(req.query.categoriaId) : undefined;
    const produtos = await prisma.produto.findMany({
      where: {
        ativo: true,
        categoriaId,
      },
      include: {
        categoria: true,
      },
      orderBy: [{ ordemExibicao: 'asc' }, { id: 'desc' }],
    });

    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { categoria: true },
    });

    if (!produto || !produto.ativo) {
      return res.status(404).json({ message: 'Produto nao encontrado.' });
    }

    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res, next) => {
  const {
    categoriaId,
    nome,
    marca,
    descricao,
    imagem,
    recomendado,
    semAcucar,
    semGluten,
    semLactose,
    fonteProteina,
    fonteGorduraBoa,
    fonteFibra,
    observacao,
    ordemExibicao,
    ativo,
  } = req.body;

  if (!categoriaId) {
    return res.status(400).json({ message: 'Categoria obrigatoria.' });
  }

  try {
    const produto = await prisma.produto.create({
      data: {
        categoriaId: parseInt(categoriaId),
        nome,
        marca: marca ?? null,
        descricao: descricao ?? null,
        imagem: imagem ?? null,
        recomendado: recomendado ?? false,
        semAcucar: semAcucar ?? false,
        semGluten: semGluten ?? false,
        semLactose: semLactose ?? false,
        fonteProteina: fonteProteina ?? false,
        fonteGorduraBoa: fonteGorduraBoa ?? false,
        fonteFibra: fonteFibra ?? false,
        observacao: observacao ?? null,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : 0,
        ativo: ativo ?? true,
      },
      include: { categoria: true },
    });
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res, next) => {
  const {
    categoriaId,
    nome,
    marca,
    descricao,
    imagem,
    recomendado,
    semAcucar,
    semGluten,
    semLactose,
    fonteProteina,
    fonteGorduraBoa,
    fonteFibra,
    observacao,
    ordemExibicao,
    ativo,
  } = req.body;

  try {
    const produto = await prisma.produto.update({
      where: { id: parseInt(req.params.id) },
      data: {
        categoriaId: categoriaId !== undefined ? parseInt(categoriaId) : undefined,
        nome,
        marca: marca ?? undefined,
        descricao: descricao ?? undefined,
        imagem: imagem ?? undefined,
        recomendado,
        semAcucar,
        semGluten,
        semLactose,
        fonteProteina,
        fonteGorduraBoa,
        fonteFibra,
        observacao: observacao ?? undefined,
        ordemExibicao: ordemExibicao !== undefined ? parseInt(ordemExibicao) : undefined,
        ativo,
      },
      include: { categoria: true },
    });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const produto = await prisma.produto.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false },
      include: { categoria: true },
    });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
