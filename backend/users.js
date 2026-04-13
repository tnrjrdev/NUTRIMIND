import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';

export function mapUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    ativo: user.ativo,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nutrimind.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  const adminName = process.env.ADMIN_NAME || 'Administrador Nutrimind';

  const existingUser = await prisma.usuario.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    return existingUser;
  }

  return await prisma.usuario.create({
    data: {
      nome: adminName,
      email: adminEmail,
      senhaHash: bcrypt.hashSync(adminPassword, 8),
      ativo: true,
    },
  });
}
