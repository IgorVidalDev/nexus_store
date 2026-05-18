const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nexus_store',
  password: 'igor',
  port: 5432
})

app.get('/produtos', async (req, res) => {
  const resultado = await pool.query(
    'SELECT * FROM produtos'
  )

  res.json(resultado.rows)
})

app.post('/register', async (req, res) => {
  const {
    nome,
    email,
    senha
  } = req.body

  await pool.query(
    `
    INSERT INTO usuarios
    (nome, email, senha)
    VALUES ($1, $2, $3)
    `,
    [nome, email, senha]
  )

  res.json({
    mensagem: 'Usuário cadastrado'
  })
})

app.post('/login', async (req, res) => {
  const {
    email,
    senha
  } = req.body

  const resultado = await pool.query(
    `
    SELECT * FROM usuarios
    WHERE email = $1
    `,
    [email]
  )

  const usuario = resultado.rows[0]

  if (!usuario) {
    return res.status(400).json({
      erro: 'Usuário não encontrado'
    })
  }

  if (usuario.senha !== senha) {
    return res.status(400).json({
      erro: 'Senha inválida'
    })
  }

  res.json({
    mensagem: 'Login realizado'
  })
})

app.listen(3000, () => {
  console.log('Servidor rodando')
})