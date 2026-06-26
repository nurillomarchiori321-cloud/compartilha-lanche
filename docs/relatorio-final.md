# Relatório Final - Compartilha Lanche

## Identificação da Equipe
- [Murillo]
- [Vitor]
- [Ricardo]

## Link do Repositório
https://github.com/nurillomarchiori321-cloud/compartilha-lanche

## Link da Aplicação em Produção
https://compartilha-lanche.up.railway.app

## Resumo do Projeto
Sistema para organização de lanches coletivos, com cadastro, login e CRUD de contribuições.

## Tecnologias Utilizadas
- Node.js, Express, Sequelize, SQLite, EJS, Bootstrap
- Vitest, Supertest

## Testes Implementados
- 26 testes (unitários, integração, regressão)
- Cobertura: 81,81%
- Todos os testes passando

## TDD Aplicado
Foram documentados 3 ciclos TDD no diário (docs/07-diario-tdd.md):
1. Cadastro de usuário
2. Criar contribuição
3. Autorização (editar/excluir próprio lanche)

## Perguntas Obrigatórias

### 1. Qual teste protege o sistema contra regressão?
Os testes de regressão em `tests/integration/regression.test.js` garantem que:
- A lista de lanches continua funcionando após criar um novo lanche
- A lista de lanches continua funcionando após editar um lanche

### 2. Qual funcionalidade já possui evidência clara de TDD?
A funcionalidade de **criar contribuição** (lanche) tem evidência clara de TDD:
- **RED:** Teste `deve permitir usuário logado cadastrar lanche` falhou inicialmente
- **GREEN:** Implementação da rota `POST /snacks` fez o teste passar
- **REFACTOR:** Adição de validações e verificação de duplicidade

## Conclusão
O projeto foi desenvolvido com sucesso, aplicando TDD, testes automatizados e boas práticas de desenvolvimento. O deploy está funcionando em produção e a cobertura de testes está acima dos 70% exigidos.