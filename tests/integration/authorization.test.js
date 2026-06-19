import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import sequelize from '../../config/database.js';
import User from '../../models/User.js';
import SnackContribution from '../../models/SnackContribution.js';

describe('Testes de Autorização - Integração', () => {
  let agent1, agent2;
  let snackId;
beforeAll(async () => {
  await sequelize.sync({ force: true });
  agent1 = request.agent(app);
  agent2 = request.agent(app);
});

  beforeEach(async () => {
    
    await SnackContribution.destroy({ where: {} });
    await User.destroy({ where: {} });
    
    const user1 = await User.create({
      name: 'Usuário 1',
      email: 'auth1_' + Date.now() + '@teste.com',
      password: 'senha123'
    });

    const user2 = await User.create({
      name: 'Usuário 2',
      email: 'auth2_' + Date.now() + '@teste.com',
      password: 'senha123'
    });

    await agent1
      .post('/login')
      .send({
        email: user1.email,
        password: 'senha123'
      });

    await agent2
      .post('/login')
      .send({
        email: user2.email,
        password: 'senha123'
      });

    const snack = await SnackContribution.create({
      item: 'Lanche do User1',
      date: '2026-06-20',
      userId: user1.id
    });
    
    snackId = snack.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve impedir que usuário edite contribuição de outro', async () => {
    const response = await agent2
      .post(`/snacks/${snackId}/edit`)
      .send({
        item: 'Tentativa de edição',
        date: '2026-06-21'
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/snacks');
  });

  it('deve impedir que usuário exclua contribuição de outro', async () => {
    const response = await agent2
      .post(`/snacks/${snackId}/delete`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/snacks');

    const snack = await SnackContribution.findByPk(snackId);
    expect(snack).toBeDefined();
  });

  it('deve permitir que usuário edite sua própria contribuição', async () => {
    const response = await agent1
      .post(`/snacks/${snackId}/edit`)
      .send({
        item: 'Lanche Editado',
        date: '2026-06-20'
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/snacks');

    const snack = await SnackContribution.findByPk(snackId);
    expect(snack.item).toBe('Lanche Editado');
  });
});