import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');
const prismaDirectory = path.join(workspaceRoot, 'prisma');

function resolveDatabasePath(databaseUrl) {
  const normalizedUrl = (databaseUrl || 'file:./dev.db').replace(/^file:/, '');

  if (path.isAbsolute(normalizedUrl)) {
    return normalizedUrl;
  }

  return path.resolve(prismaDirectory, normalizedUrl);
}

const databasePath = resolveDatabasePath(process.env.DATABASE_URL);

export const db = new Database(databasePath);

export function initializeUsersTable() {
  db.prepare(
    `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        ativo INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `
  ).run();
}

export function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nutrimind.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  const adminName = process.env.ADMIN_NAME || 'Administrador Nutrimind';
  const existingUser = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(adminEmail);

  if (existingUser) {
    return;
  }

  const now = new Date().toISOString();
  db.prepare(
    `
      INSERT INTO usuarios (nome, email, senha_hash, ativo, created_at, updated_at)
      VALUES (?, ?, ?, 1, ?, ?)
    `
  ).run(adminName, adminEmail, bcrypt.hashSync(adminPassword, 8), now, now);
}

export function mapUserRow(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    ativo: Boolean(user.ativo),
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
