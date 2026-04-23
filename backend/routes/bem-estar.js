import express from 'express';
import { prisma } from '../prisma.js';
import { verifyToken } from '../auth.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const itens = await prisma.bemEstarItem.findMany({
      where: { ativo: true },
      orderBy: { ordemExibicao: 'asc' }
    });
    res.json(itens);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.bemEstarItem.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!item || !item.ativo) {
      return res.status(404).json({ message: 'Item de bem-estar não encontrado.' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', verifyToken, async (req, res, next) => {
  const {
    nome,
    descricaoCurta,
    descricaoDetalhada,
    telefone,
    whatsapp,
    instagram,
    site,
    midiaUrl,
    ordemExibicao,
    ativo
  } = req.body;

  try {
    const item = await prisma.bemEstarItem.create({
      data: {
        nome,
        descricaoCurta,
        descricaoDetalhada,
        telefone,
        whatsapp: whatsapp ?? false,
        instagram,
        site,
        midiaUrl,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : 0,
        ativo: ativo ?? true
      }
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  const {
    nome,
    descricaoCurta,
    descricaoDetalhada,
    telefone,
    whatsapp,
    instagram,
    site,
    midiaUrl,
    ordemExibicao,
    ativo
  } = req.body;

  try {
    const item = await prisma.bemEstarItem.update({
      where: { id: parseInt(req.params.id) },
      data: {
        nome,
        descricaoCurta,
        descricaoDetalhada,
        telefone,
        whatsapp,
        instagram,
        site,
        midiaUrl,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : undefined,
        ativo
      }
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const item = await prisma.bemEstarItem.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
