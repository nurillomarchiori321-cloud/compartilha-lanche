# Plano de Teste - Compartilha Lanche

## Estratégia
- **TDD**: Testes escritos antes da implementação
- **Shift-left**: Qualidade desde o início
- **Testes unitários**: Para funções e serviços
- **Testes de integração**: Para rotas e API

## Pirâmide de Testes
- Base: testes unitários (validações, funções)
- Meio: testes de integração (API, rotas)
- Topo: testes E2E (futuramente)

## Ambientes
- Local: `npm test`
- CI: GitHub Actions
- Produção: Demonstração manual

## Ferramentas
- **Vitest**: Test runner
- **Supertest**: Testes de API
- **SQLite**: Banco de dados de teste