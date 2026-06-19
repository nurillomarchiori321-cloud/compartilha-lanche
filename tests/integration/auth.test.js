import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import sequelize from '../../config/database.js';
import User from '../../models/User.js';

describe('Testes de Autenticação - Integração', () => {
  let agent;
beforeAll(async () => {
  await sequelize.sync({ force: true });
  agent = request.agent(app);
});

beforeEach(async () => {
  await User.destroy({ where: {} });
});

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve cadastrar um novo usuário', async () => {
    const response = await agent
      .post('/register')
      .send({
        name: 'Teste Integração',
        email: 'integracao@teste.com',
        password: 'senha123'
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  it('deve impedir cadastro com email duplicado', async () => {
    await agent
      .post('/register')
      .send({
        name: 'Usuário Duplicado',
        email: 'duplicado@teste.com',
        password: 'senha123'
      });

    const response = await agent
      .post('/register')
      .send({
        name: 'Outro Usuário',
        email: 'duplicado@teste.com',
        password: 'senha456'
      });

    expect(response.status).toBe(200);
    expect(response.text).toContain('Email já cadastrado');
  });

  it('deve fazer login com credenciais corretas', async () => {
    await agent
      .post('/register')
      .send({
        name: 'Login Teste',
        email: 'login@teste.com',
        password: 'senha123'
      });

    const response = await agent
      .post('/login')
      .send({
        email: 'login@teste.com',
        password: 'senha123'
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('deve rejeitar login com senha incorreta', async () => {
    await agent
      .post('/register')
      .send({
        name: 'Login Teste 2',
        email: 'login2@teste.com',
        password: 'senha123'
      });

    const response = await agent
      .post('/login')
      .send({
        email: 'login2@teste.com',
        password: 'senhaErrada'
      });

    expect(response.status).toBe(200);
    expect(response.text).toContain('Email ou senha inválidos');
  });
});