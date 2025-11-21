const bcrypt = require('bcryptjs');
const { query } = require('./src/database/db');

const updatePassword = async () => {
  try {
    console.log('🔐 Atualizando senha do administrador...');
    
    const newPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email, name, role',
      [hashedPassword, 'admin@cyberhouse.com.br']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Senha atualizada com sucesso!');
      console.log('📧 Email: admin@cyberhouse.com.br');
      console.log('🔑 Senha: admin123456');
      console.log('👤 Usuário:', result.rows[0]);
    } else {
      console.log('❌ Usuário não encontrado');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error);
    process.exit(1);
  }
};

updatePassword();
