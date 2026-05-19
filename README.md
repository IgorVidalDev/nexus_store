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
