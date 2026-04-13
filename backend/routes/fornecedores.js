import express from 'express';
import { prisma } from '../prisma.js';
import { verifyToken } from '../auth.js';

const router = express.Router();
router.use(verifyToken);

router.get('/categorias', async (req, res) => {
  try {
    const categorias = await prisma.categoriaFornecedor.findMany({
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
    const { nome, descricao, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaFornecedor.create({
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

router.put('/categorias/:id', verifyToken, async (req, res) => {
  try {
    const { nome, descricao, ordemExibicao, ativo } = req.body;
    const categoria = await prisma.categoriaFornecedor.update({
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

router.delete('/categorias/:id', verifyToken, async (req, res) => {
  try {
    const categoria = await prisma.categoriaFornecedor.update({
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
    const fornecedores = await prisma.fornecedor.findMany({
      where: {
        ativo: true,
        categoriaId: req.query.categoriaId ? parseInt(req.query.categoriaId) : undefined
      },
      include: {
        categoria: true,
        cupons: {
          where: { ativo: true },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { ordemExibicao: 'asc' }
    });
    res.json(fornecedores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const fornecedor = await prisma.fornecedor.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        categoria: true,
        cupons: {
          where: { ativo: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!fornecedor || !fornecedor.ativo) {
      return res.status(404).json({ message: 'Fornecedor não encontrado.' });
    }
    res.json(fornecedor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const {
    categoriaId,
    nome,
    descricaoCurta,
    descricaoDetalhada,
    endereco,
    telefone,
    whatsapp,
    instagram,
    site,
    ordemExibicao,
    ativo,
    cupons
  } = req.body;

  if (!categoriaId) {
    return res.status(400).json({ message: 'Categoria é obrigatória.' });
  }

  try {
    const fornecedor = await prisma.fornecedor.create({
      data: {
        categoriaId: parseInt(categoriaId),
        nome,
        descricaoCurta,
        descricaoDetalhada,
        endereco,
        telefone,
        whatsapp,
        instagram,
        site,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : 0,
        ativo: ativo ?? true,
        cupons: {
          create: (cupons || []).map((cupom) => ({
            codigo: cupom.codigo,
            descricao: cupom.descricao,
            validade: cupom.validade ? new Date(cupom.validade) : null,
            ativo: cupom.ativo ?? true
          }))
        }
      },
      include: { categoria: true, cupons: true }
    });
    res.status(201).json(fornecedor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const fornecedorId = parseInt(req.params.id);
  const {
    categoriaId,
    nome,
    descricaoCurta,
    descricaoDetalhada,
    endereco,
    telefone,
    whatsapp,
    instagram,
    site,
    ordemExibicao,
    ativo,
    cupons
  } = req.body;

  try {
    await prisma.cupomDesconto.deleteMany({ where: { fornecedorId } });

    const fornecedor = await prisma.fornecedor.update({
      where: { id: fornecedorId },
      data: {
        categoriaId: categoriaId ? parseInt(categoriaId) : undefined,
        nome,
        descricaoCurta,
        descricaoDetalhada,
        endereco,
        telefone,
        whatsapp,
        instagram,
        site,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : undefined,
        ativo,
        cupons: {
          create: (cupons || []).map((cupom) => ({
            codigo: cupom.codigo,
            descricao: cupom.descricao,
            validade: cupom.validade ? new Date(cupom.validade) : null,
            ativo: cupom.ativo ?? true
          }))
        }
      },
      include: { categoria: true, cupons: true }
    });
    res.json(fornecedor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const fornecedor = await prisma.fornecedor.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json(fornecedor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
