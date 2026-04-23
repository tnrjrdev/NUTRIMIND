import express from 'express';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../auth.js';
import { prisma } from '../prisma.js';
import { mapUser } from '../users.js';

const router = express.Router();

async function createUser({ nome, email, senha, ativo = true }) {
  const existingUser = await prisma.usuario.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Ja existe um usuario com este email.');
    error.statusCode = 409;
    throw error;
  }

  return await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash: bcrypt.hashSync(senha, 8),
      ativo,
    },
  });
}

router.post('/registro', async (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, email e senha sao obrigatorios.' });
  }

  try {
    const usuario = await createUser({ nome, email, senha, ativo: true });
    return res.status(201).json(mapUser(usuario));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Erro ao cadastrar usuario.',
    });
  }
});

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const rows = await prisma.usuario.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(rows.map(mapUser));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuarios.', error: error.message });
  }
});

router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    return res.json(mapUser(usuario));
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao carregar usuario.', error: error.message });
  }
});

router.post('/', verifyToken, async (req, res, next) => {
  const { nome, email, senha, ativo } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, email e senha sao obrigatorios.' });
  }

  try {
    const usuario = await createUser({ nome, email, senha, ativo });
    return res.status(201).json(mapUser(usuario));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Erro ao cadastrar usuario.' });
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  const userId = Number(req.params.id);
  const { nome, email, senha, ativo } = req.body;

  try {
    const existingUser = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    if (email && email !== existingUser.email) {
      const emailInUse = await prisma.usuario.findUnique({
        where: { email },
      });

      if (emailInUse) {
        return res.status(409).json({ message: 'Ja existe um usuario com este email.' });
      }
    }

    const usuario = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nome: nome ?? existingUser.nome,
        email: email ?? existingUser.email,
        senhaHash: senha ? bcrypt.hashSync(senha, 8) : existingUser.senhaHash,
        ativo: ativo === undefined ? existingUser.ativo : Boolean(ativo),
      },
    });

    return res.json(mapUser(usuario));
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar usuario.', error: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(req.params.id) },
      data: { ativo: false },
    });
    res.json(mapUser(usuario));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao inativar usuario.', error: error.message });
  }
});

export default router;
