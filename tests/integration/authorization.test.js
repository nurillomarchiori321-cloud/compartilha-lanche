import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import SnackContribution from '../../models/SnackContribution.js';
import './setup.js';

describe('Testes de Autorização - Integração', () => {
  let agent1, agent2;
  let snackId;

  beforeAll(async () => {
    agent1 = request.agent(app);
    agent2 = request.agent(app);
  });

  beforeEach(async () => {
    await SnackContribution.destroy({ where: {} });
    await User.destroy({ where: {} });

    const user1 = await User.create({
      name: 'User1',
      email: 'u1_' + Date.now() + '@test.com',
      password: 'senha123'
    });
    const user2 = await User.create({
      name: 'User2',
      email: 'u2_' + Date.now() + '@test.com',
      password: 'senha123'
    });

    await agent1.post('/login').send({ email: user1.email, password: 'senha123' });
    await agent2.post('/login').send({ email: user2.email, password: 'senha123' });

    const snack = await SnackContribution.create({
      item: 'Lanche User1',
      date: '2026-06-20',
      userId: user1.id
    });
    snackId = snack.id;
  });

  it('User2 não pode editar lanche de User1', async () => {
    const response = await agent2.post(`/snacks/${snackId}/edit`).send({
      item: 'Tentativa',
      date: '2026-06-21'
    });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/snacks');
  });

  it('User2 não pode excluir lanche de User1', async () => {
    const response = await agent2.post(`/snacks/${snackId}/delete`);
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/snacks');
    const snack = await SnackContribution.findByPk(snackId);
    expect(snack).toBeDefined();
  });

  it('User1 pode editar seu próprio lanche', async () => {
    const response = await agent1.post(`/snacks/${snackId}/edit`).send({
      item: 'Editado',
      date: '2026-06-20'
    });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/snacks');
    const snack = await SnackContribution.findByPk(snackId);
    expect(snack.item).toBe('Editado');
  });
});
