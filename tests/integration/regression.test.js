import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import sequelize from '../../config/database.js';
import User from '../../models/User.js';
import SnackContribution from '../../models/SnackContribution.js';

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
      name: 'Teste Regressão',
      email: 'regressao_' + Date.now() + '@teste.com',
      password: 'senha123'
    });

    await agent
      .post('/login')
      .send({
        email: user.email,
        password: 'senha123'
      });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve manter a lista de lanches após criar um novo lanche', async () => {
    // 1. Verifica lista vazia
    const listaVazia = await agent.get('/snacks');
    expect(listaVazia.text).toContain('Nenhuma contribuição ainda');
    
    // 2. Cria um lanche
    await agent.post('/snacks').send({
      item: 'Pizza',
      date: '2026-06-25'
    });
    
    // 3. Verifica que a lista atualizou
    const listaAtualizada = await agent.get('/snacks');
    expect(listaAtualizada.text).toContain('Pizza');
    expect(listaAtualizada.text).not.toContain('Nenhuma contribuição ainda');
  });

  it('deve manter a lista de lanches após editar um lanche', async () => {
    // 1. Cria um lanche
    await agent.post('/snacks').send({
      item: 'Pizza',
      date: '2026-06-25'
    });
    
    // 2. Busca o ID do lanche criado
    const snack = await SnackContribution.findOne({ where: { item: 'Pizza' } });
    
    // 3. Edita o lanche
    await agent.post(`/snacks/${snack.id}/edit`).send({
      item: 'Pizza Grande',
      date: '2026-06-25'
    });
    
    // 4. Verifica que a lista mostrou a atualização
    const lista = await agent.get('/snacks');
    const snackAntigo = await SnackContribution.findOne({ where: { item: 'Pizza' } });

    expect(lista.text).toContain('Pizza Grande');
    expect(snackAntigo).toBeNull();
  });
});
