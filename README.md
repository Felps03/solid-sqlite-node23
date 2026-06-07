# Node.js 23 SQLite PoC

Prova de conceito (PoC) que demonstra recursos experimentais do Node.js 23, em especial a API nativa e síncrona de SQLite (`DatabaseSync`). O projeto implementa uma pequena API REST de gerenciamento de usuários, organizada seguindo os princípios **SOLID**, e inclui:

- **SQLite nativo e síncrono:** usa `DatabaseSync` do módulo `node:sqlite` para acessar o banco sem depender de pacotes externos de SQLite (como `better-sqlite3` ou `sqlite3`).
- **Arquitetura modular:** código dividido em configuração, modelos, validadores, repositórios, controllers, rotas e middlewares, conectados por um pequeno container de injeção de dependências.
- **Configuração via variáveis de ambiente:** uso do `dotenv` para gerenciar configurações como porta e caminho do banco.
- **Logging estruturado:** logs centralizados com Winston (inclui timestamp e nível do log).
- **Testes nativos:** uso do módulo `node:test` (test runner nativo do Node.js) e da `fetch` global para testar os endpoints de ponta a ponta.

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Executando o projeto](#executando-o-projeto)
- [Executando os testes](#executando-os-testes)
- [Endpoints da API](#endpoints-da-api)
- [Tratamento de erros](#tratamento-de-erros)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Princípios SOLID aplicados](#princípios-solid-aplicados)
- [Licença](#licença)

## Pré-requisitos

- **Node.js 23** ou superior (o módulo `node:sqlite` é experimental nessa versão e pode exigir a flag `--experimental-sqlite` dependendo da subversão do Node).
- `npm` para instalar as dependências.

## Instalação

Clone o repositório, acesse a pasta do projeto e instale as dependências:

```bash
git clone <url-do-repositorio>
cd solid-sqlite-node23
npm install
```

## Variáveis de ambiente

A configuração é carregada via `dotenv` (veja `src/config/config.js`). Crie um arquivo `.env` na raiz do projeto caso queira sobrescrever os valores padrão:

| Variável   | Descrição                                         | Padrão              |
|------------|---------------------------------------------------|---------------------|
| `PORT`     | Porta em que o servidor HTTP é executado          | `3000`              |
| `DB_FILE`  | Caminho do arquivo do banco de dados SQLite       | `database.sqlite`   |
| `NODE_ENV` | Ambiente de execução (`development`/`production`) | `development`       |

Exemplo de `.env`:

```env
PORT=3000
DB_FILE=database.sqlite
NODE_ENV=development
```

## Executando o projeto

Inicie o servidor com:

```bash
npm start
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`). Na inicialização, a conexão com o SQLite é aberta e a tabela `users` é criada automaticamente caso não exista (veja `src/config/database.js`):

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
) STRICT
```

## Executando os testes

Os testes usam o test runner nativo do Node.js (`node:test`) e sobem o servidor na porta `3001` para testar os endpoints via `fetch`:

```bash
npm test
```

Os cenários cobertos em `src/app.test.js` incluem: listagem de usuários, criação, atualização, exclusão e a verificação de que um usuário deletado retorna `404` em consultas seguintes.

## Endpoints da API

Todas as rotas têm o prefixo `/users` (definidas em `src/routes/userRoutes.js` e implementadas em `src/controllers/UserController.js`).

| Método | Rota          | Descrição                          | Status de sucesso |
|--------|---------------|------------------------------------|-------------------|
| POST   | `/users`      | Cria um novo usuário               | `201 Created`     |
| GET    | `/users`      | Lista todos os usuários            | `200 OK`          |
| GET    | `/users/:id`  | Busca um usuário pelo `id`         | `200 OK` / `404 Not Found` |
| PUT    | `/users/:id`  | Atualiza um usuário existente      | `200 OK`          |
| DELETE | `/users/:id`  | Remove um usuário                  | `200 OK` / `404 Not Found` |

Um usuário tem o formato `{ id, name, email }`. Os campos `name` e `email` são validados e normalizados (trim e e-mail em minúsculo) por `src/validators/userValidator.js` — requisições inválidas retornam erro `400` com a mensagem `Nome inválido.` ou `Email inválido.`.

### Exemplos de requisição

```bash
# Criar um usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'
# -> 201 { "id": 1, "name": "Jane Doe", "email": "jane@example.com" }

# Listar usuários
curl http://localhost:3000/users
# -> 200 [ { "id": 1, "name": "Jane Doe", "email": "jane@example.com" }, ... ]

# Buscar um usuário pelo id
curl http://localhost:3000/users/1
# -> 200 { "id": 1, "name": "Jane Doe", "email": "jane@example.com" }
# -> 404 { "error": "User not found." }

# Atualizar um usuário
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith", "email": "jane.smith@example.com"}'
# -> 200 { "id": "1", "name": "Jane Smith", "email": "jane.smith@example.com" }

# Remover um usuário
curl -X DELETE http://localhost:3000/users/1
# -> 200 { "message": "User removed." }
# -> 404 { "error": "User not found." }
```

## Tratamento de erros

Todas as rotas delegam erros para o middleware central `src/middlewares/errorHandler.js`, que:

- registra o erro (mensagem e stack trace) usando o logger Winston;
- responde com o `status` do erro (ou `500` por padrão) e um corpo `{ message }`;
- inclui o `stack` na resposta apenas quando `NODE_ENV` é diferente de `production`, evitando vazar detalhes internos em produção.

## Estrutura do projeto

```
src/
├── app.js                      # Configura o Express e inicializa o servidor
├── app.test.js                 # Testes de integração dos endpoints (node:test + fetch)
├── dependencyInjection.js      # Monta e injeta as dependências (db, repository, controller)
├── logger.js                   # Configuração do logger Winston
├── config/
│   ├── config.js               # Lê as variáveis de ambiente (dotenv)
│   └── database.js             # Conecta ao SQLite e garante a criação da tabela users
├── controllers/
│   └── UserController.js       # Recebe as requisições HTTP e orquestra a resposta
├── middlewares/
│   └── errorHandler.js         # Middleware central de tratamento de erros
├── models/
│   └── User.js                 # Entidade User
├── repositories/
│   └── UserRepository.js       # Acesso a dados (consultas SQL de CRUD de usuários)
├── routes/
│   └── userRoutes.js           # Definição das rotas /users
└── validators/
    └── userValidator.js        # Validação e normalização dos dados de entrada
```

## Princípios SOLID aplicados

- **S — Single Responsibility:** cada camada tem uma responsabilidade única (rotas tratam de roteamento, controllers de orquestração HTTP, repositórios de acesso a dados, validadores de validação de entrada, etc.).
- **O — Open/Closed:** novas entidades podem ser adicionadas criando novos models/repositories/controllers/rotas sem alterar o código existente.
- **L — Liskov Substitution:** o `UserController` depende de um repositório com uma interface previsível (`create`, `getById`, `getAll`, `update`, `delete`), podendo ser substituído por outra implementação compatível.
- **I — Interface Segregation:** os módulos expõem apenas os métodos que seus consumidores realmente usam (ex.: rotas só conhecem os métodos do controller que utilizam).
- **D — Dependency Inversion:** `src/dependencyInjection.js` monta as dependências (banco, repositório, controller) e as injeta via construtor, evitando que as camadas superiores dependam de implementações concretas das inferiores.

## Licença

ISC
