const bcrypt = require('bcryptjs');

const testPassword = async () => {
  const password = 'admin123456';
  const hash = '$2a$10$inhtd4fl2YASPR8NCmtfcOz1CqpZSos21jBV80Xc5Vsq/poXjAgCm';
  
  console.log('Testing password:', password);
  console.log('Against hash:', hash);
  
  const isMatch = await bcrypt.compare(password, hash);
  console.log('Match:', isMatch);
  
  const newHash = await bcrypt.hash(password, 10);
  console.log('\nNew hash for same password:', newHash);
  
  const newIsMatch = await bcrypt.compare(password, newHash);
  console.log('Match with new hash:', newIsMatch);
};

testPassword().catch(console.error);
