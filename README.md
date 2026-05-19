Nexus Store — E-commerce Geek/Gamer
1. Objetivo
Desenvolver um MVP (Minimum Viable Product) de um sistema de e-commerce geek/gamer chamado Nexus Store, focado na venda de produtos para setup gamer, periféricos e acessórios.
O sistema possui:
Cadastro e login de usuários
Catálogo de produtos
Carrinho de compras
Checkout simulado
Painel administrativo simples
2. Tecnologias Utilizadas
Frontend
React
Vite
Tailwind CSS
Backend
Node.js
Express
Banco de Dados
PostgreSQL
3. Funcionalidades
Cadastro/Login
O usuário pode:
criar conta
fazer login
acessar o sistema
Dados:
nome
email
senha
CPF
endereço

Catálogo
O sistema exibe:
imagem
nome
descrição
preço
categoria
Categorias
Periféricos
Setup Gamer
RGB
Consoles
Action Figures

Carrinho
O usuário pode:
adicionar produtos
remover produtos
visualizar total
Frete
Frete simulado:
const frete = total > 200 ? 0 : 20;
Checkout
O sistema:
simula pagamento
gera ID do pedido
Exemplo:
const pedidoId = Math.floor(Math.random() * 100000);

Admin
Administrador pode:
adicionar produtos
editar produtos
excluir produtos

4. Banco de Dados
Usuários
CREATE TABLE usuarios (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100),
   email VARCHAR(100),
   senha TEXT,
   cpf VARCHAR(14),
   endereco TEXT
);


Produtos
CREATE TABLE produtos (
   id SERIAL PRIMARY KEY,
   nome VARCHAR(100),
   descricao TEXT,
   preco NUMERIC(10,2),
   categoria VARCHAR(50),
   imagem TEXT
);
Pedidos
CREATE TABLE pedidos (
   id SERIAL PRIMARY KEY,
   usuario_id INT,
   total NUMERIC(10,2)
);

5. Estrutura do Projeto
Frontend
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   └── App.jsx
Backend
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   └── server.js

6. Segurança
Senhas criptografadas com bcrypt
Login utilizando JWT
Proteção básica contra SQL Injection

7. Interface
O sistema utiliza:
tema escuro
layout responsivo
design gamer
feedback visual
Cores
preto
roxo
branco

8. Arquitetura
React Frontend
      ↓
API Express
      ↓
PostgreSQL

9. Rotas Principais
Usuários
POST /register
POST /login
Produtos
GET /produtos
POST /produtos
PUT /produtos/:id
DELETE /produtos/:id

10. Deploy
Frontend
Vercel
Backend
Render

11. Fluxo do Usuário
Usuário acessa o site
Faz login
Visualiza os produtos
Adiciona produtos ao carrinho
Finaliza pedido
Recebe ID do pedido

12. Produtos Exemplo
Produto
Preço
Headset Gamer RGB
R$ 249,90
Mouse Gamer
R$ 139,90
Teclado Mecânico
R$ 329,90
Controle Sem Fio
R$ 199,90


13. README
Executar frontend
npm install
npm run dev
Executar backend
npm install
node server.js

