import express from 'express';
import { prisma } from '../prisma.js';
import { verifyToken } from '../auth.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const dicas = await prisma.dica.findMany({
      where: { ativo: true },
      orderBy: { ordemExibicao: 'asc' }
    });
    res.json(dicas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dica = await prisma.dica.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!dica || !dica.ativo) {
      return res.status(404).json({ message: 'Dica não encontrada.' });
    }
    res.json(dica);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const { texto, ordemExibicao, ativo } = req.body;
  try {
    const dica = await prisma.dica.create({
      data: {
        texto,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : 0,
        ativo: ativo ?? true
      }
    });
    res.status(201).json(dica);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { texto, ordemExibicao, ativo } = req.body;
  try {
    const dica = await prisma.dica.update({
      where: { id: parseInt(req.params.id) },
      data: {
        texto,
        ordemExibicao: ordemExibicao ? parseInt(ordemExibicao) : undefined,
        ativo
      }
    });
    res.json(dica);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const dica = await prisma.dica.update({
      where: { id: parseInt(req.params.id) },
      data: { ativo: false }
    });
    res.json(dica);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
