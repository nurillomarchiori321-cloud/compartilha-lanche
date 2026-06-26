import sequelize from '../../config/database.js';
import app from '../../app.js';

beforeAll(async () => {
  // 🔥 Recria o banco APENAS UMA VEZ antes de todos os testes
  await app.ready;
  await sequelize.sync({ force: true });
});

