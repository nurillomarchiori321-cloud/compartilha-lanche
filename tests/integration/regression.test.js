import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import SnackContribution from '../../models/SnackContribution.js';
import './setup.js';

describe('Testes de Regressão', () => {
  let agent;
  let user;

  beforeAll(async () => {
    agent = request.agent(app);
  });

  beforeEach(async () => {
    await SnackContribution.destroy({ where: {} });
    await User.destroy({ where: {} });

    user = await User.create({
      name: 'Regressão',
      email: 'reg_' + Date.now() + '@test.com',
      password: 'senha123'
    });

    await agent.post('/login').send({ email: user.email, password: 'senha123' });
  });

  it('deve manter a lista após criar lanche', async () => {
    await agent.post('/snacks').send({ item: 'Pizza', date: '2026-06-25' });
    const response = await agent.get('/snacks');
    expect(response.text).toContain('Pizza');
  });

  it('deve manter a lista após editar lanche', async () => {
    await agent.post('/snacks').send({ item: 'Pizza', date: '2026-06-25' });
    const snack = await SnackContribution.findOne({ where: { item: 'Pizza' } });
    await agent.post(`/snacks/${snack.id}/edit`).send({ item: 'Pizza Grande', date: '2026-06-25' });
    const response = await agent.get('/snacks');
    const oldSnack = await SnackContribution.findOne({ where: { item: 'Pizza' } });

    expect(response.text).toContain('Pizza Grande');
    expect(oldSnack).toBeNull();
  });
});
