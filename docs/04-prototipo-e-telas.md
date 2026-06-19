# Protótipo das Telas

## Tela 1 - Página Inicial (/)
- Lista de contribuições ordenadas por data
- Botão "Novo Lanche" (se logado)
- Links "Login" e "Cadastrar" (se não logado)

## Tela 2 - Cadastro (/register)
- Campos: Nome, Email, Senha
- Botão "Cadastrar"

## Tela 3 - Login (/login)
- Campos: Email, Senha
- Botão "Entrar"

## Tela 4 - Nova Contribuição (/snacks/new)
- Campos: Item, Data
- Botão "Salvar"

## Tela 5 - Editar Contribuição (/snacks/:id/edit)
- Campos: Item, Data (preenchidos)
- Botão "Atualizar"

## Rotas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Página inicial |
| GET | `/register` | Formulário de cadastro |
| POST | `/register` | Processa cadastro |
| GET | `/login` | Formulário de login |
| POST | `/login` | Processa login |
| POST | `/logout` | Logout |
| GET | `/snacks` | Lista de lanches |
| GET | `/snacks/new` | Formulário novo lanche |
| POST | `/snacks` | Cria novo lanche |
| GET | `/snacks/:id/edit` | Formulário edição |
| POST | `/snacks/:id/edit` | Processa edição |
| POST | `/snacks/:id/delete` | Processa exclusão |