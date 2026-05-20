const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()

app.use(cors())
app.use(express.json())

// BANCO DE DADOS

const isProd =
  process.env.DATABASE_URL

const pool = isProd
  ? new Pool({
      connectionString:
        process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'nexus_store',
      password: 'igor',
      port: 5432
    })

// JWT SECRET

const JWT_SECRET = 'nexus_secret'

// MIDDLEWARE TOKEN

function verificarToken(
  req,
  res,
  next
) {
  const authHeader =
    req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      erro: 'Token não enviado'
    })
  }

  const token =
    authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    )

    req.usuario = decoded

    next()
  } catch {
    return res.status(401).json({
      erro: 'Token inválido'
    })
  }
}

// MIDDLEWARE ADMIN

function verificarAdmin(
  req,
  res,
  next
) {
  if (!req.usuario.admin) {
    return res.status(403).json({
      erro:
        'Apenas administradores'
    })
  }

  next()
}

// LISTAR PRODUTOS

app.get('/produtos', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM produtos ORDER BY id'
    )

    res.json(resultado.rows)
  } catch (err) {
    console.log(err)

    res.status(500).json({
      erro: 'Erro ao buscar produtos'
    })
  }
})

// CADASTRO

app.post('/register', async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      cpf,
      endereco
    } = req.body

    const usuarioExiste =
      await pool.query(
        `
        SELECT * FROM usuarios
        WHERE email = $1
        `,
        [email]
      )

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({
        erro: 'Email já cadastrado'
      })
    }

    const senhaCriptografada =
      await bcrypt.hash(senha, 10)

    await pool.query(
      `
      INSERT INTO usuarios
      (
        nome,
        email,
        senha,
        cpf,
        endereco,
        admin
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        nome,
        email,
        senhaCriptografada,
        cpf,
        endereco,
        false
      ]
    )

    res.json({
      mensagem: 'Usuário cadastrado'
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      erro:
        'Erro ao cadastrar usuário'
    })
  }
})

// LOGIN

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    const resultado =
      await pool.query(
        `
        SELECT * FROM usuarios
        WHERE email = $1
        `,
        [email]
      )

    const usuario = resultado.rows[0]

    if (!usuario) {
      return res.status(400).json({
        erro:
          'Usuário não encontrado'
      })
    }

    const senhaCorreta =
      await bcrypt.compare(
        senha,
        usuario.senha
      )

    if (!senhaCorreta) {
      return res.status(400).json({
        erro: 'Senha inválida'
      })
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        admin: usuario.admin
      },
      JWT_SECRET,
      {
        expiresIn: '1d'
      }
    )

    res.json({
      mensagem: 'Login realizado',
      token,
      admin: usuario.admin
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      erro: 'Erro no login'
    })
  }
})

// CRIAR PEDIDO

app.post(
  '/pedidos',
  verificarToken,
  async (req, res) => {
    try {
      const {
        produtos,
        total
      } = req.body

      const usuarioId =
        req.usuario.id

      const pedido =
        await pool.query(
          `
          INSERT INTO pedidos
          (
            usuario_id,
            total
          )
          VALUES ($1, $2)
          RETURNING *
          `,
          [usuarioId, total]
        )

      res.json({
        mensagem:
          'Pedido realizado',
        pedido: pedido.rows[0]
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        erro:
          'Erro ao salvar pedido'
      })
    }
  }
)

// ADMIN - ADICIONAR PRODUTO

app.post(
  '/produtos',
  verificarToken,
  verificarAdmin,
  async (req, res) => {
    try {
      const {
        nome,
        descricao,
        preco,
        categoria,
        imagem
      } = req.body

      await pool.query(
        `
        INSERT INTO produtos
        (
          nome,
          descricao,
          preco,
          categoria,
          imagem
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          nome,
          descricao,
          preco,
          categoria,
          imagem
        ]
      )

      res.json({
        mensagem:
          'Produto adicionado'
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        erro:
          'Erro ao adicionar produto'
      })
    }
  }
)

// ADMIN - EDITAR PRODUTO

app.put(
  '/produtos/:id',
  verificarToken,
  verificarAdmin,
  async (req, res) => {
    try {
      const { id } = req.params

      const {
        nome,
        descricao,
        preco,
        categoria,
        imagem
      } = req.body

      await pool.query(
        `
        UPDATE produtos
        SET
          nome = $1,
          descricao = $2,
          preco = $3,
          categoria = $4,
          imagem = $5
        WHERE id = $6
        `,
        [
          nome,
          descricao,
          preco,
          categoria,
          imagem,
          id
        ]
      )

      res.json({
        mensagem:
          'Produto atualizado'
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        erro:
          'Erro ao atualizar produto'
      })
    }
  }
)

// ADMIN - DELETAR PRODUTO

app.delete(
  '/produtos/:id',
  verificarToken,
  verificarAdmin,
  async (req, res) => {
    try {
      const { id } = req.params

      await pool.query(
        `
        DELETE FROM produtos
        WHERE id = $1
        `,
        [id]
      )

      res.json({
        mensagem:
          'Produto deletado'
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        erro:
          'Erro ao deletar produto'
      })
    }
  }
)

// SERVIDOR

const PORT =
  process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(
    'Servidor rodando na porta ' +
      PORT
  )
})