const API = import.meta.env.VITE_API_URL
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([])
  const [usuario, setUsuario] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [logado, setLogado] = useState(false)

  useEffect(() => {
    axios
      .get(`${API}/produtos`)
      .then(response => {
        setProdutos(response.data)
      })
  }, [])

  async function cadastrar() {
    try {
      await axios.post(`${API}/register`, {
        nome,
        email,
        senha
      })

      alert('Usuário cadastrado')
    } catch (error) {
      console.log(error.response?.data || error.message)
      alert('Erro no cadastro')
      console.log(error.response?.data)
    }
  }

  async function login() {
    try {
      await axios.post(
        `${API}/login`,
        {
          email,
          senha
        }
      )

      setLogado(true)
      setUsuario(email)
    } catch {
      alert('Login inválido')
    }
  }

  function adicionarCarrinho(produto) {
    setCarrinho([...carrinho, produto])
  }

  function finalizarCompra() {
    const pedidoId = Math.floor(
      Math.random() * 100000
    )

    alert(
      `Pedido realizado! ID: ${pedidoId}`
    )

    setCarrinho([])
  }

  const total = carrinho.reduce((acc, item) => {
    return acc + Number(item.preco)
  }, 0)

  return (
    <div
      style={{
        background: '#111',
        color: 'white',
        minHeight: '100vh',
        padding: 20,
        fontFamily: 'Arial'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#a855f7'
        }}
      >
        Nexus Store
      </h1>

      {!logado ? (
        <div
          style={{
            maxWidth: 400,
            margin: '0 auto',
            border: '1px solid purple',
            padding: 20,
            borderRadius: 10,
            marginBottom: 30
          }}
        >
          <h2 style={{ textAlign: 'center' }}>
            Login / Cadastro
          </h2>

          <input
            type='text'
            placeholder='Nome'
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            style={{
              width: 'calc(100% - 22px)',
              padding: 10,
              marginBottom: 10,
              boxSizing: 'border-box'
            }}
          />

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: 'calc(100% - 22px)',
              padding: 10,
              marginBottom: 10,
              boxSizing: 'border-box'
            }}
          />

          <input
            type='password'
            placeholder='Senha'
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            style={{
              width: 'calc(100% - 22px)',
              padding: 10,
              marginBottom: 10,
              boxSizing: 'border-box'
            }}
          />

          <button
            onClick={login}
            style={{
              padding: 10,
              marginRight: 10
            }}
          >
            Login
          </button>

          <button
            onClick={cadastrar}
            style={{
              padding: 10
            }}
          >
            Cadastrar
          </button>
        </div>
      ) : (
        <>
          <p
            style={{
              textAlign: 'center'
            }}
          >
            Usuário logado: {usuario}
          </p>

          <h2
            style={{
              textAlign: 'center'
            }}
          >
            Produtos
          </h2>

          <div
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {produtos.map(produto => (
              <div
                key={produto.id}
                style={{
                  border: '1px solid purple',
                  padding: 15,
                  width: 250,
                  borderRadius: 10
                }}
              >
                <img
                  src={produto.imagem}
                  width='100%'
                />

                <h3>{produto.nome}</h3>

                <p>
                  R$ {produto.preco}
                </p>

                <button
                  onClick={() =>
                    adicionarCarrinho(produto)
                  }
                >
                  Adicionar ao carrinho
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 40,
              textAlign: 'center'
            }}
          >
            <h2>Carrinho</h2>

            {carrinho.map((item, index) => (
              <p key={index}>
                {item.nome}
              </p>
            ))}

            <h3>
              Total: R$ {total.toFixed(2)}
            </h3>

            {carrinho.length > 0 && (
              <button onClick={finalizarCompra}>
                Finalizar Compra
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App