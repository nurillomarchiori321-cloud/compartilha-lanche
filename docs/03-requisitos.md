# Requisitos - Compartilha Lanche

## Requisitos Funcionais
| ID | Descrição |
|----|-----------|
| RF01 | Cadastrar usuário com nome, email e senha |
| RF02 | Fazer login e logout |
| RF03 | Criar contribuição de lanche |
| RF04 | Listar todas as contribuições |
| RF05 | Editar própria contribuição |
| RF06 | Excluir própria contribuição |
| RF07 | Impedir contribuição com item vazio |
| RF08 | Impedir contribuição com data vazia |
| RF09 | Impedir duas contribuições mesmo usuário/mesma data |
| RF10 | Impedir edição de contribuição de outro |
| RF11 | Impedir exclusão de contribuição de outro |

## Requisitos Não Funcionais
| ID | Descrição |
|----|-----------|
| RNF01 | Testes automatizados com Vitest + Supertest |
| RNF02 | Cobertura de testes > 70% |
| RNF03 | Pipeline CI com GitHub Actions |
| RNF04 | URL pública para demonstração |
| RNF05 | Desenvolvimento com TDD |
| RNF06 | Persistência em SQLite |