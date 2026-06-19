# Diário TDD – Compartilha Lanche

## Ciclo 1 – Cadastro de Usuário
**Data:** 18/06/2026

**História:** Como visitante, quero criar uma conta.

**Critério de Aceite:** Usuário preenche nome, email e senha → sistema cadastra.

**Teste (escrito antes):**
```javascript
test('deve cadastrar um novo usuário', async () => {
  const response = await request(app)
    .post('/register')
    .send({ name: 'Teste', email: 'teste@email.com', password: 'senha123' });
  expect(response.status).toBe(302);
});