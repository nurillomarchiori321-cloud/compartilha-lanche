import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import SnackContribution from '../../models/SnackContribution.js';
import './setup.js';

describe('Navegacao e rotas auxiliares - Integracao', () => {
  let agent;

  beforeAll(async () => {
    agent = request.agent(app);
  });

  beforeEach(async () => {
    await SnackContribution.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  async function login(name = 'Usuario Teste') {
    const user = await User.create({
      name,
      email: `${Date.now()}_${Math.random()}@teste.com`,
      password: 'senha123'
    });

    await agent.post('/login').send({
      email: user.email,
      password: 'senha123'
    });

    return user;
  }

  it('deve renderizar paginas publicas principais', async () => {
    const home = await agent.get('/');
    const register = await agent.get('/register');
    const loginPage = await agent.get('/login');
    const snacks = await agent.get('/snacks');

    expect(home.status).toBe(200);
    expect(register.status).toBe(200);
    expect(loginPage.status).toBe(200);
    expect(snacks.status).toBe(200);
  });

  it('deve redirecionar usuario nao logado das rotas protegidas', async () => {
    const newSnack = await agent.get('/snacks/new');
    const editSnack = await agent.get('/snacks/999/edit');
    const createSnack = await agent.post('/snacks').send({
      item: 'Bolo',
      date: '2026-07-01'
    });

    expect(newSnack.status).toBe(302);
    expect(newSnack.headers.location).toBe('/login');
    expect(editSnack.status).toBe(302);
    expect(editSnack.headers.location).toBe('/login');
    expect(createSnack.status).toBe(302);
    expect(createSnack.headers.location).toBe('/login');
  });

  it('deve permitir abrir formulario de novo lanche e fazer logout', async () => {
    await login();

    const newSnack = await agent.get('/snacks/new');
    const logout = await agent.get('/logout');
    const protectedAfterLogout = await agent.get('/snacks/new');

    expect(newSnack.status).toBe(200);
    expect(logout.status).toBe(302);
    expect(logout.headers.location).toBe('/');
    expect(protectedAfterLogout.headers.location).toBe('/login');
  });

  it('deve renderizar formulario de edicao do proprio lanche', async () => {
    const user = await login('Dono do Lanche');
    const snack = await SnackContribution.create({
      item: 'Torta',
      date: '2026-07-02',
      userId: user.id
    });

    const response = await agent.get(`/snacks/${snack.id}/edit`);

    expect(response.status).toBe(200);
    expect(response.text).toContain('Torta');
  });

  it('deve validar campos vazios ao editar lanche', async () => {
    const user = await login();
    const snack = await SnackContribution.create({
      item: 'Suco',
      date: '2026-07-03',
      userId: user.id
    });

    const emptyItem = await agent.post(`/snacks/${snack.id}/edit`).send({
      item: '',
      date: '2026-07-03'
    });
    const emptyDate = await agent.post(`/snacks/${snack.id}/edit`).send({
      item: 'Suco',
      date: ''
    });

    expect(emptyItem.status).toBe(200);
    expect(emptyItem.text).toContain('Item do lanche');
    expect(emptyDate.status).toBe(200);
    expect(emptyDate.text).toContain('Data');
  });

  it('deve permitir excluir o proprio lanche', async () => {
    const user = await login();
    const snack = await SnackContribution.create({
      item: 'Cafe',
      date: '2026-07-04',
      userId: user.id
    });

    const response = await agent.post(`/snacks/${snack.id}/delete`);
    const deletedSnack = await SnackContribution.findByPk(snack.id);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/snacks');
    expect(deletedSnack).toBeNull();
  });
});
