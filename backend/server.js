import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

import { verifyToken, SECRET_KEY } from './auth.js';
import { prisma } from './prisma.js';
import { ensureAdminUser, mapUser } from './users.js';
import receitasRouter from './routes/receitas.js';
import produtosRouter from './routes/produtos.js';
import fornecedoresRouter from './routes/fornecedores.js';
import ifoodRouter from './routes/ifood.js';
import chasRouter from './routes/chas.js';
import substituicoesRouter from './routes/substituicoes.js';
import bemEstarRouter from './routes/bemEstar.js';
import dicasRouter from './routes/dicas.js';
import usuariosRouter from './routes/usuarios.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/receitas', receitasRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/fornecedores', fornecedoresRouter);
app.use('/api/ifood', ifoodRouter);
app.use('/api/chas', chasRouter);
app.use('/api/substituicoes', substituicoesRouter);
app.use('/api/bem-estar', bemEstarRouter);
app.use('/api/dicas', dicasRouter);
app.use('/api/usuarios', usuariosRouter);

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { email: username },
    });

    if (!user || !user.ativo) {
      return res.status(401).json({ message: 'Usuario nao encontrado' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.senhaHash);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Senha invalida' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: 86400 });

    return res.status(200).json({
      auth: true,
      token,
      user: mapUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao autenticar usuario', error: error.message });
  }
});

app.get('/api/admin/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.ativo) {
      return res.status(404).json({ auth: false, message: 'Usuario nao encontrado.' });
    }

    return res.status(200).json({ auth: true, user: mapUser(user) });
  } catch (error) {
    return res.status(500).json({ auth: false, message: 'Erro ao carregar usuario.', error: error.message });
  }
});

async function startServer() {
  try {
    await ensureAdminUser();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

void startServer();
