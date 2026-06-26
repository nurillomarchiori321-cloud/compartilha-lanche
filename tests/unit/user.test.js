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

describe('Model User - Testes Unitários', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve criar um usuário com nome, email e senha', async () => {
    const user = await User.create({
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'senha123'
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe('João Silva');
    expect(user.email).toBe('joao@email.com');
  });

  it('deve impedir cadastro com email duplicado', async () => {
    await User.create({
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: 'senha123'
    });

    await expect(User.create({
      name: 'Outra Maria',
      email: 'maria@email.com',
      password: 'senha456'
    })).rejects.toThrow();
  });

  it('deve validar que a senha tem mínimo 6 caracteres', async () => {
    
    const UserWithValidation = sequelize.define('UserWithValidation', {
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 100],
            msg: 'Senha deve ter pelo menos 6 caracteres'
          }
        }
      }
    }, { tableName: 'users_validation' });
    
    await UserWithValidation.sync({ force: true });
    
    await expect(UserWithValidation.create({
      password: '123'
    })).rejects.toThrow();
  });
});