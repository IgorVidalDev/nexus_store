const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()

app.use(cors())
app.use(express.json())

// Detecta ambiente (produção ou local)
const isProd = !!process.env.DATABASE_URL

// Banco de dados (auto)
const pool = isProd
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'nexus_store',
      password: 'igor',
      port: 5432
    })

// 📦 Listar produtos
app.get('/produtos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM produtos')
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produtos' })
  }
})

// Cadastro
app.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body

    await pool.query(
      `
      INSERT INTO usuarios (nome, email, senha)
      VALUES ($1, $2, $3)
      `,
      [nome, email, senha]
    )

    res.json({ mensagem: 'Usuário cadastrado' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' })
  }
})

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    const resultado = await pool.query(
      `
      SELECT * FROM usuarios
      WHERE email = $1
      `,
      [email]
    )

    const usuario = resultado.rows[0]

    if (!usuario) {
      return res.status(400).json({ erro: 'Usuário não encontrado' })
    }

    if (usuario.senha !== senha) {
      return res.status(400).json({ erro: 'Senha inválida' })
    }

    res.json({ mensagem: 'Login realizado' })
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login' })
  }
})

//  (Render ou local)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT)
})