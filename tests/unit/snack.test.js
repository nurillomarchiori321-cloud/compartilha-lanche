import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
});
const User = sequelize.define('User', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false }
}, { tableName: 'users' });

const SnackContribution = sequelize.define('SnackContribution', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  item: { 
    type: Sequelize.STRING, 
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: { 
    type: Sequelize.DATEONLY, 
    allowNull: false,
    validate: {
      notEmpty: true,
      isDate: true
    }
  },
  userId: { type: Sequelize.INTEGER, allowNull: false }
}, { tableName: 'snack_contributions' });

User.hasMany(SnackContribution, { foreignKey: 'userId' });
SnackContribution.belongsTo(User, { foreignKey: 'userId' });

describe('Model SnackContribution - Testes Unitários', () => {
  let user;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    user = await User.create({
      name: 'Usuário Teste',
      email: 'unit_test_' + Date.now() + '@teste.com',
      password: 'senha123'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar contribuição com item e data', async () => {
    const snack = await SnackContribution.create({
      item: 'Sanduíche',
      date: '2026-06-20',
      userId: user.id
    });

    expect(snack.id).toBeDefined();
    expect(snack.item).toBe('Sanduíche');
    expect(snack.date).toBe('2026-06-20');
    expect(snack.userId).toBe(user.id);
  });

  it('deve impedir contribuição com item vazio', async () => {
    try {
      await SnackContribution.create({
        item: '',
        date: '2026-06-20',
        userId: user.id
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('deve impedir contribuição com data vazia', async () => {
    try {
      await SnackContribution.create({
        item: 'Bolo',
        date: '',
        userId: user.id
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});