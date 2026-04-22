import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categorias = [
  { nome: 'Bolos nutritivos', ordemExibicao: 1 },
  { nome: 'Crepes e panquecas', ordemExibicao: 2 },
  { nome: 'Jantar', ordemExibicao: 3 },
  { nome: 'Legumes', ordemExibicao: 4 },
  { nome: 'Receitas de proteínas', ordemExibicao: 5 },
  { nome: 'Receitas de sucos', ordemExibicao: 6 },
  { nome: 'Saladas', ordemExibicao: 7 },
  { nome: 'Pratos prontos práticos', ordemExibicao: 8 },
  { nome: 'Receitas com raízes', ordemExibicao: 9 },
];

async function main() {
  console.log('Seeding Categorias de Receitas...');
  for (const cat of categorias) {
    await prisma.categoriaReceita.create({
      data: cat,
    });
  }
  console.log('Done!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
