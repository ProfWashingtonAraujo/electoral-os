import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma.js';

async function main() {
  const email = 'admin@electoralos.com.br';
  const hashedPassword = await bcrypt.hash('Admin@2025', 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { 
        password: hashedPassword, 
        role: 'admin', 
        active: true 
    },
    create: {
      name: 'Administrador do Sistema',
      email: email,
      password: hashedPassword,
      role: 'admin',
      active: true
    }
  });
  
  console.log('✅ Usuário admin restaurado/atualizado com sucesso: ' + user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
