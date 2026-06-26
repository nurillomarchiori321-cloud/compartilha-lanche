import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import SnackContribution from '../../models/SnackContribution.js';
import './setup.js';

describe('Testes de Lanches - Integração', () => {
  let agent;
  let user;

  beforeAll(async () => {
    agent = request.agent(app);
  });

  beforeEach(async () => {
  
    await SnackContribution.destroy({ where: {} });
    await User.destroy({ where: {} });
    
    user = await User.create({
      name: 'Teste Lanches',
      email: 'lanches_' + Date.now() + '@teste.com',
      password: 'senha123'
    });
    const login = await agent.post('/login').send({
      email: user.email,
      password: 'senha123'
    });
    expect(login.status).toBe(302);
  });

  it('deve permitir usuário logado cadastrar lanche', async () => {
    const response = await agent.post('/snacks').send({
      item: 'Pizza',
      date: '2026-06-25'
    });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/snacks');

    const snack = await SnackContribution.findOne({ where: { item: 'Pizza' } });
    expect(snack).toBeDefined();
    expect(snack.userId).toBe(user.id);
  });

  it('deve impedir lanche com item vazio', async () => {
    const response = await agent.post('/snacks').send({
      item: '',
      date: '2026-06-25'
    });
    expect(response.status).toBe(200);
    expect(response.text).toContain('Item do lanche não pode estar vazio');
  });

  it('deve impedir lanche com data vazia', async () => {
    const response = await agent.post('/snacks').send({
      item: 'Bolo',
      date: ''
    });
    expect(response.status).toBe(200);
    expect(response.text).toContain('Data não pode estar vazia');
  });

  it('deve impedir contribuição duplicada', async () => {
    await agent.post('/snacks').send({ item: 'Refri', date: '2026-06-30' });
    const response = await agent.post('/snacks').send({ item: 'Refri', date: '2026-06-30' });
    expect(response.status).toBe(200);
    expect(response.text).toContain('Você já tem uma contribuição para esta data!');
  });

  it('deve listar contribuições ordenadas por data', async () => {
    await agent.post('/snacks').send({ item: 'Suco', date: '2026-06-15' });
    await agent.post('/snacks').send({ item: 'Salada', date: '2026-06-20' });

    const response = await agent.get('/snacks');
    expect(response.status).toBe(200);
    const text = response.text;
    expect(text).toContain('Suco');
    expect(text).toContain('Salada');
    expect(text.indexOf('Suco')).toBeLessThan(text.indexOf('Salada'));
  });
});
