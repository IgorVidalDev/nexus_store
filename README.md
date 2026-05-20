# Nexus Store — E-commerce Geek/Gamer

Projeto desenvolvido para a disciplina de Comércio Eletrônico do curso de Engenharia de Software da UTFPR.

## Objetivo

Desenvolver um MVP (Minimum Viable Product) de um sistema de e-commerce geek/gamer chamado Nexus Store, focado na venda de produtos para setup gamer, periféricos e acessórios.

O sistema possui:

- Cadastro e login de usuários
- Catálogo de produtos
- Carrinho de compras
- Checkout simulado
- Painel administrativo simples

---

# Tecnologias Utilizadas

## Frontend
- React
- Vite
- Tailwind CSS

## Backend
- Node.js
- Express

## Banco de Dados
- PostgreSQL

---

# Funcionalidades

## Cadastro/Login

O usuário pode:

- Criar conta
- Fazer login
- Acessar o sistema

Dados cadastrados:

- Nome
- Email
- Senha
- CPF
- Endereço

---

## Catálogo de Produtos

O sistema exibe:

- Imagem
- Nome
- Descrição
- Preço
- Categoria

### Categorias

- Periféricos
- Setup Gamer
- RGB
- Consoles
- Action Figures

---

## Carrinho de Compras

O usuário pode:

- Adicionar produtos
- Remover produtos
- Visualizar total da compra

### Frete Simulado

```js
const frete = total > 200 ? 0 : 20;
```

---

## Checkout

O sistema:

- Simula pagamento
- Gera ID de pedido

Exemplo:

```js
const pedidoId = Math.floor(Math.random() * 100000);
```

---

## Painel Administrativo

O administrador pode:

- Adicionar produtos
- Editar produtos
- Excluir produtos

---

# Banco de Dados

## Tabela: usuarios

```sql
CREATE TABLE usuarios (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100),
   email VARCHAR(100),
   senha TEXT,
   cpf VARCHAR(14),
   endereco TEXT,
   admin BOOLEAN DEFAULT FALSE
);
```

---

## Tabela: produtos

```sql
CREATE TABLE produtos (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100),
   descricao TEXT,
   preco NUMERIC(10,2),
   categoria VARCHAR(50),
   imagem TEXT
);
```

---

## Tabela: pedidos

```sql
CREATE TABLE pedidos (
   id SERIAL PRIMARY KEY,
   usuario_id INT,
   total NUMERIC(10,2)
);
```

---

# Estrutura do Projeto

## Frontend

```bash
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   └── App.jsx
```

## Backend

```bash
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   └── server.js
```

---

# Segurança

O sistema utiliza:

- Senhas criptografadas com bcrypt
- Autenticação com JWT
- Proteção básica contra SQL Injection

---

# Interface

Características da interface:

- Tema escuro
- Layout responsivo
- Design gamer
- Feedback visual para ações

### Cores principais

- Preto
- Roxo
- Branco

---

# Arquitetura

```text
React Frontend
      ↓
API Express
      ↓
PostgreSQL
```

---

# Rotas Principais

## Usuários

```http
POST /register
POST /login
```

## Produtos

```http
GET /produtos
POST /produtos
PUT /produtos/:id
DELETE /produtos/:id
```

---

# Deploy

## Frontend
- Vercel

## Backend
- Render

---

# Fluxo do Usuário

1. Usuário acessa o site
2. Faz login
3. Visualiza os produtos
4. Adiciona produtos ao carrinho
5. Finaliza pedido
6. Recebe ID do pedido

---

# Produtos Exemplo

| Produto | Preço |
|---|---|
| Headset Gamer RGB | R$ 249,90 |
| Mouse Gamer | R$ 139,90 |
| Teclado Mecânico | R$ 329,90 |
| Controle Sem Fio | R$ 199,90 |

---

# Como Executar o Projeto

## Frontend

```bash
npm install
npm run dev
```

---

## Backend

```bash
npm install
node server.js
```
