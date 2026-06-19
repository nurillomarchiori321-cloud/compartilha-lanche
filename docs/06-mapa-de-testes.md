# Mapa de Testes - Compartilha Lanche

## Testes Unitários
| Arquivo | Testes |
|---------|--------|
| `user.test.js` | Criar usuário, email duplicado, senha curta |
| `snack.test.js` | Criar contribuição, item vazio, data vazia |

## Testes de Integração
| Arquivo | Testes |
|---------|--------|
| `auth.test.js` | Cadastro, email duplicado, login correto, login incorreto |
| `snacks.test.js` | Criar lanche, item vazio, data vazia, duplicidade, ordenação |
| `authorization.test.js` | Editar de outro, excluir de outro, editar próprio |

## Casos de Teste
- ✅ Usuário logado cadastra lanche
- ✅ Usuário não logado NÃO cadastra
- ✅ Lanche sem nome é rejeitado
- ✅ Data vazia é rejeitada
- ✅ Usuário edita própria contribuição
- ✅ Usuário NÃO edita de outro
- ✅ Usuário NÃO exclui de outro
- ✅ Listagem mostra lanches por data