import sequelize from '../../config/database.js';
import app from '../../app.js';

beforeAll(async () => {

  await app.ready;
  await sequelize.sync({ force: true });
});

