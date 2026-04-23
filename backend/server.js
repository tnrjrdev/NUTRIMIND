import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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
import bemEstarRouter from './routes/bem-estar.js';
import dicasRouter from './routes/dicas.js';
import usuariosRouter from './routes/usuarios.js';

const app = express();
// Usa a porta do ambiente ou 3001 por padrão
const PORT = process.env.PORT || 3001;

// ==========================================
// MIDDLEWARES DE SEGURANÇA E ENGENHARIA
// ==========================================

// 1. Helmet: Adiciona headers HTTP de segurança (XSS, Clickjacking, etc)
app.use(helmet());

// 2. CORS Restrito: Permitir apenas origens confiáveis
// Em dev, permitimos localhost:5173. Em prod, deve ser o domínio final.
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelas políticas de CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' })); // Previne ataques de payload gigante

// 3. Rate Limiting Geral: Protege contra DDoS e excesso de requisições
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Limite de 1000 requisições por IP a cada 15 min
  message: { message: 'Muitas requisições deste IP. Tente novamente mais tarde.' }
});
app.use('/api', globalLimiter);

// 4. Rate Limiting Específico para Login (Previne Força Bruta)
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 15, // Máximo de 15 tentativas de login por IP por hora
  message: { message: 'Muitas tentativas de login. Conta temporariamente bloqueada por segurança.' }
});


// ==========================================
// ROTAS DO SISTEMA
// ==========================================

app.use('/api/receitas', receitasRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/fornecedores', fornecedoresRouter);
app.use('/api/ifood', ifoodRouter);
app.use('/api/chas', chasRouter);
app.use('/api/substituicoes', substituicoesRouter);
app.use('/api/bem-estar', bemEstarRouter);
app.use('/api/dicas', dicasRouter);
app.use('/api/usuarios', usuariosRouter);

// ROTA DE LOGIN (COM RATE LIMIT APLICADO)
app.post('/api/login', loginLimiter, async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { email: username },
    });

    if (!user || !user.ativo) {
      return res.status(401).json({ message: 'Credenciais inválidas' }); // Mensagem genérica por segurança
    }

    const passwordIsValid = bcrypt.compareSync(password, user.senhaHash);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' }); // Mensagem genérica por segurança
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: 86400 });

    return res.status(200).json({
      auth: true,
      token,
      user: mapUser(user),
    });
  } catch (error) {
    next(error); // Passa pro Error Handler Global (previne vazamento)
  }
});

app.get('/api/admin/me', verifyToken, async (req, res, next) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.userId },
    });

    if (!user || !user.ativo) {
      return res.status(404).json({ auth: false, message: 'Usuário não encontrado ou inativo.' });
    }

    return res.status(200).json({ auth: true, user: mapUser(user) });
  } catch (error) {
    next(error);
  }
});


// ==========================================
// MIDDLEWARE GLOBAL DE TRATAMENTO DE ERROS (Prevenção de Vazamento)
// ==========================================
app.use((err, req, res, next) => {
  // 1. Log interno para desenvolvedores (não vai pro usuário)
  console.error(`[CRITICAL ERROR] ${req.method} ${req.url}:`, err);

  // 2. Resposta sanitizada para o cliente (esconde detalhes do banco de dados/stack trace)
  res.status(500).json({ 
    message: 'Erro interno no servidor. Nossa equipe técnica já foi notificada.' 
  });
});


async function startServer() {
  try {
    await ensureAdminUser();

    app.listen(PORT, () => {
      console.log(`[Segurança Ativa] Servidor blindado rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha crítica ao iniciar o servidor:', error);
    process.exit(1);
  }
}

void startServer();
