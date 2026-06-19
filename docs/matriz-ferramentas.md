# Matriz Comparativa de Ferramentas de Teste

## Vitest + Supertest
| Atributo | Descrição |
|----------|-----------|
| **Para que serve?** | Testes unitários e de integração para Node.js |
| **Tipo de teste** | Unitário e Integração (API) |
| **Camada** | Base e Meio da pirâmide |
| **Testa** | Backend, funções, serviços e rotas HTTP |
| **Substitui?** | Base do projeto |
| **Exige mudança?** | Não |
| **Instalação** | `npm install -D vitest @vitest/coverage-v8 supertest` |
| **Exemplo** | `test('GET /snacks retorna 200', async () => { ... })` |
| **Evidência** | Relatório de cobertura, logs de execução |
| **Vantagens** | Rápido, fácil de configurar, boa integração com projetos Node |
| **Desvantagens** | Não testa frontend ou interface visual |

## Jest
| Atributo | Descrição |
|----------|-----------|
| **Para que serve?** | Testes unitários e integração |
| **Tipo de teste** | Unitário e Integração |
| **Camada** | Base e Meio |
| **Testa** | Funções, serviços e integração |
| **Substitui?** | Substitui parcialmente o Vitest |
| **Exige mudança?** | Não |
| **Instalação** | `npm install -D jest` |
| **Exemplo** | `test('soma 1+1 = 2', () => { ... })` |
| **Evidência** | Relatório de cobertura |
| **Vantagens** | Muito usado, grande comunidade |
| **Desvantagens** | Mais pesado, menos específico para Express |

## Playwright
| Atributo | Descrição |
|----------|-----------|
| **Para que serve?** | Testes end-to-end em navegadores |
| **Tipo de teste** | E2E/Interface |
| **Camada** | Topo da pirâmide |
| **Testa** | Fluxos reais no navegador |
| **Substitui?** | Complementa o Vitest/Supertest |
| **Exige mudança?** | Não |
| **Instalação** | `npm install -D @playwright/test` |
| **Exemplo** | `test('login', async ({ page }) => { ... })` |
| **Evidência** | Vídeos, screenshots, relatórios |
| **Vantagens** | Testa experiência real do usuário |
| **Desvantagens** | Mais lento, mais complexo |

## Cypress
| Atributo | Descrição |
|----------|-----------|
| **Para que serve?** | Testes E2E em navegadores |
| **Tipo de teste** | E2E/Interface |
| **Camada** | Topo da pirâmide |
| **Testa** | Interface web e ações do usuário |
| **Substitui?** | Complementa |
| **Exige mudança?** | Não |
| **Instalação** | `npm install -D cypress` |
| **Exemplo** | `cy.visit('/login').type('email@email.com')` |
| **Evidência** | Vídeos, screenshots |
| **Vantagens** | Interface amigável, bom para frontend |
| **Desvantagens** | Não é específico para Node/API |

## Postman + Newman
| Atributo | Descrição |
|----------|-----------|
| **Para que serve?** | Testes de API |
| **Tipo de teste** | Integração (API) |
| **Camada** | Meio da pirâmide |
| **Testa** | Rotas HTTP, coleções de requisições |
| **Substitui?** | Substitui parcialmente o Supertest |
| **Exige mudança?** | Não |
| **Instalação** | `npm install -D newman` |
| **Exemplo** | Collection JSON com requisições |
| **Evidência** | Relatórios de execução |
| **Vantagens** | Visual, fácil de criar testes |
| **Desvantagens** | Não faz parte da suite de testes automatizados do projeto |

## k6
| Atributo | Descrição |
|----------|-----------|
| **Para que serve?** | Testes de carga/performance |
| **Tipo de teste** | Performance |
| **Camada** | Topo (performance) |
| **Testa** | Volume, latência, estabilidade sob carga |
| **Substitui?** | Não |
| **Exige mudança?** | Não |
| **Instalação** | Baixar executável ou `docker run` |
| **Exemplo** | `http.get('http://localhost:3000')` |
| **Evidência** | Relatórios de performance |
| **Vantagens** | Identifica gargalos |
| **Desvantagens** | Foco em performance, não em funcionalidade |

## OWASP ZAP
| Atributo | Descrição |
|----------|-----------|
| **Para que serve?** | Testes de segurança |
| **Tipo de teste** | Segurança |
| **Camada** | Topo (segurança) |
| **Testa** | Vulnerabilidades web básicas |
| **Substitui?** | Complementa |
| **Exige mudança?** | Não |
| **Instalação** | Baixar executável |
| **Exemplo** | Proxy com varredura automática |
| **Evidência** | Relatórios de vulnerabilidades |
| **Vantagens** | Identifica falhas de segurança |
| **Desvantagens** | Não prova correção funcional |

## GitHub Actions
| Atributo | Descrição |
|----------|-----------|
| **Para que serve?** | CI/CD |
| **Tipo de teste** | Pipeline |
| **Camada** | Automação |
| **Testa** | Execução automatizada da suite |
| **Substitui?** | Complementa |
| **Exige mudança?** | Não |
| **Instalação** | Configurar `.github/workflows` |
| **Exemplo** | YAML com `npm test` |
| **Evidência** | Status do workflow no GitHub |
| **Vantagens** | Executa testes em cada push, gratuito para público |
| **Desvantagens** | Configuração adicional |

## Resumo da Matriz

| Ferramenta | Camada | Testa | Substitui? | Melhor uso |
|------------|--------|-------|------------|------------|
| Vitest + Supertest | Unitário/API | Funções, serviços, rotas HTTP | Base do projeto | APIs Node/Express |
| Jest | Unitário/Integração | Funções, serviços, integração | Substitui parcialmente | Projetos JS/TS tradicionais |
| Playwright | E2E | Fluxos reais no navegador | Complementa | Login, cadastro, jornadas |
| Cypress | E2E | Interface web | Complementa | Testes visuais |
| Postman/Newman | API | Coleções HTTP | Substitui parcialmente | Testes de API independentes |
| k6 | Performance | Volume, latência | Complementa | Testes de desempenho |
| OWASP ZAP | Segurança | Vulnerabilidades | Complementa | Segurança em ambiente autorizado |
| GitHub Actions | Pipeline | Automação | Complementa | Integração contínua |

## Conclusão

Para o projeto **Compartilha Lanche**, a combinação **Vitest + Supertest** é suficiente para atender aos requisitos de testes unitários e de integração. As outras ferramentas complementariam o projeto em diferentes camadas, mas não são obrigatórias para o escopo atual.