const API = import.meta.env.VITE_API_URL

import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [produtos, setProdutos] = useState([])
  const [carrinho, setCarrinho] = useState([])

  const [usuario, setUsuario] = useState('')
  const [isAdmin, setIsAdmin] =
    useState(false)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cpf, setCpf] = useState('')
  const [endereco, setEndereco] =
    useState('')

  // PAGAMENTO
  const [numeroCartao, setNumeroCartao] =
    useState('')
  const [nomeCartao, setNomeCartao] =
    useState('')
  const [cvv, setCvv] = useState('')

  // ADMIN
  const [novoNome, setNovoNome] =
    useState('')
  const [novaDescricao, setNovaDescricao] =
    useState('')
  const [novoPreco, setNovoPreco] =
    useState('')
  const [novaCategoria, setNovaCategoria] =
    useState('')
  const [novaImagem, setNovaImagem] =
    useState('')

  // EDITAR
  const [editandoId, setEditandoId] =
    useState(null)

  const [logado, setLogado] =
    useState(false)

  const [modoCadastro, setModoCadastro] =
    useState(false)

  const [
    categoriaSelecionada,
    setCategoriaSelecionada
  ] = useState('Todos')

  useEffect(() => {
    buscarProdutos()
  }, [])

  async function buscarProdutos() {
    try {
      const response = await axios.get(
        `${API}/produtos`
      )

      setProdutos(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function cadastrar() {
    try {
      await axios.post(`${API}/register`, {
        nome,
        email,
        senha,
        cpf,
        endereco
      })

      alert('Usuário cadastrado')

      setModoCadastro(false)

      setNome('')
      setEmail('')
      setSenha('')
      setCpf('')
      setEndereco('')
    } catch (error) {
      console.log(error)

      alert('Erro no cadastro')
    }
  }

  async function login() {
    try {
      const response = await axios.post(
        `${API}/login`,
        {
          email,
          senha
        }
      )

      localStorage.setItem(
        'token',
        response.data.token
      )

      setLogado(true)
      setUsuario(email)

      setIsAdmin(response.data.admin)

      alert('Login realizado')
    } catch (error) {
      console.log(error)

      alert('Login inválido')
    }
  }

  function logout() {
    localStorage.removeItem('token')

    setLogado(false)
    setUsuario('')
    setIsAdmin(false)
  }

  function adicionarCarrinho(produto) {
    setCarrinho([...carrinho, produto])

    alert('Produto adicionado')
  }

  function removerCarrinho(index) {
    const novoCarrinho = carrinho.filter(
      (_, i) => i !== index
    )

    setCarrinho(novoCarrinho)
  }

async function finalizarCompra() {
  if (
    !numeroCartao ||
    !nomeCartao ||
    !cvv
  ) {
    alert(
      'Preencha os dados do pagamento'
    )

    return
  }

  try {
    const token =
      localStorage.getItem('token')

    const response = await axios.post(
      `${API}/pedidos`,
      {
        total: totalFinal
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const pedidoId =
      response.data.pedido.id

    alert(
      `Pagamento aprovado!\nPedido #${pedidoId} realizado com sucesso`
    )

    setCarrinho([])

    setNumeroCartao('')
    setNomeCartao('')
    setCvv('')
  } catch (error) {
    console.log(error)

    alert(
      'Erro ao finalizar compra'
    )
  }
}


  // ADMIN - ADICIONAR


  async function adicionarProduto() {
    try {
      const token =
        localStorage.getItem('token')

      await axios.post(
        `${API}/produtos`,
        {
          nome: novoNome,
          descricao: novaDescricao,
          preco: novoPreco,
          categoria: novaCategoria,
          imagem: novaImagem
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('Produto adicionado')

      limparFormulario()

      buscarProdutos()
    } catch (error) {
      console.log(error)

      alert('Erro ao adicionar produto')
    }
  }


  // ADMIN - EDITAR

  function carregarEdicao(produto) {
    setEditandoId(produto.id)

    setNovoNome(produto.nome)
    setNovaDescricao(produto.descricao)
    setNovoPreco(produto.preco)
    setNovaCategoria(produto.categoria)
    setNovaImagem(produto.imagem)

    window.scrollTo(0, 0)
  }

  async function salvarEdicao() {
    try {
      const token =
        localStorage.getItem('token')

      await axios.put(
        `${API}/produtos/${editandoId}`,
        {
          nome: novoNome,
          descricao: novaDescricao,
          preco: novoPreco,
          categoria: novaCategoria,
          imagem: novaImagem
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('Produto atualizado')

      setEditandoId(null)

      limparFormulario()

      buscarProdutos()
    } catch (error) {
      console.log(error)

      alert('Erro ao editar produto')
    }
  }

  // =========================
  // ADMIN - DELETAR
  // =========================

  async function deletarProduto(id) {
    try {
      const token =
        localStorage.getItem('token')

      await axios.delete(
        `${API}/produtos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('Produto deletado')

      buscarProdutos()
    } catch (error) {
      console.log(error)

      alert('Erro ao deletar produto')
    }
  }

  function limparFormulario() {
    setNovoNome('')
    setNovaDescricao('')
    setNovoPreco('')
    setNovaCategoria('')
    setNovaImagem('')
  }

  const total = carrinho.reduce(
    (acc, item) => {
      return acc + Number(item.preco)
    },
    0
  )

  const frete = total > 200 ? 0 : 20

  const totalFinal = total + frete

  const produtosFiltrados =
    categoriaSelecionada === 'Todos'
      ? produtos
      : produtos.filter(
          produto =>
            produto.categoria ===
            categoriaSelecionada
        )

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
          color: '#a855f7',
          marginBottom: 30
        }}
      >
        Nexus Store
      </h1>

      {!logado ? (
        <div
          style={{
            maxWidth: 400,
            margin: '0 auto',
            border: '1px solid white',
            padding: 20,
            borderRadius: 10,
            background: '#1a1a1a'
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              marginBottom: 20
            }}
          >
            {modoCadastro
              ? 'Cadastro'
              : 'Login'}
          </h2>

          {modoCadastro && (
            <>
              <input
                type='text'
                placeholder='Nome'
                value={nome}
                onChange={e =>
                  setNome(e.target.value)
                }
                style={inputStyle}
              />

              <input
                type='text'
                placeholder='CPF'
                value={cpf}
                onChange={e =>
                  setCpf(e.target.value)
                }
                style={inputStyle}
              />

              <input
                type='text'
                placeholder='Endereço'
                value={endereco}
                onChange={e =>
                  setEndereco(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </>
          )}

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type='password'
            placeholder='Senha'
            value={senha}
            onChange={e =>
              setSenha(e.target.value)
            }
            style={inputStyle}
          />

          {modoCadastro ? (
            <>
              <button
                onClick={cadastrar}
                style={buttonStyle}
              >
                Cadastrar
              </button>

              <button
                onClick={() =>
                  setModoCadastro(false)
                }
                style={buttonStyle}
              >
                Já tenho conta
              </button>
            </>
          ) : (
            <>
              <button
                onClick={login}
                style={buttonStyle}
              >
                Login
              </button>

              <button
                onClick={() =>
                  setModoCadastro(true)
                }
                style={buttonStyle}
              >
                Criar conta
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              marginBottom: 30
            }}
          >
            <p>
              Usuário logado:{' '}
              {usuario}
            </p>

            <button
              onClick={logout}
              style={buttonStyle}
            >
              Logout
            </button>
          </div>

          {/* ADMIN CRUD */}
          {isAdmin && (
            <div
              style={{
                border:
                  '1px solid white',
                padding: 20,
                borderRadius: 10,
                marginBottom: 40,
                background: '#1a1a1a'
              }}
            >
              <h2>
                {editandoId
                  ? 'Editar Produto'
                  : 'Painel Admin'}
              </h2>

              <input
                type='text'
                placeholder='Nome'
                value={novoNome}
                onChange={e =>
                  setNovoNome(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                type='text'
                placeholder='Descrição'
                value={novaDescricao}
                onChange={e =>
                  setNovaDescricao(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                type='number'
                placeholder='Preço'
                value={novoPreco}
                onChange={e =>
                  setNovoPreco(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                type='text'
                placeholder='Categoria'
                value={novaCategoria}
                onChange={e =>
                  setNovaCategoria(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                type='text'
                placeholder='Imagem URL'
                value={novaImagem}
                onChange={e =>
                  setNovaImagem(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              {editandoId ? (
                <>
                  <button
                    onClick={
                      salvarEdicao
                    }
                    style={buttonStyle}
                  >
                    Salvar Alterações
                  </button>

                  <button
                    onClick={() => {
                      setEditandoId(
                        null
                      )

                      limparFormulario()
                    }}
                    style={
                      deleteButtonStyle
                    }
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={
                    adicionarProduto
                  }
                  style={buttonStyle}
                >
                  Adicionar Produto
                </button>
              )}
            </div>
          )}

          {/* FILTRO */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 30
            }}
          >
            <select
              value={
                categoriaSelecionada
              }
              onChange={e =>
                setCategoriaSelecionada(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option>Todos</option>

              <option>
                Periféricos
              </option>

              <option>
                Setup Gamer
              </option>

              <option>
                RGB
              </option>

              <option>
                Consoles
              </option>

              <option>
                Action Figures
              </option>
            </select>
          </div>

          {/* PRODUTOS */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              justifyContent:
                'center'
            }}
          >
            {produtosFiltrados.map(
              produto => (
                <div
                  key={produto.id}
                  style={{
                    border:
                      '1px solid white',
                    padding: 15,
                    width: 250,
                    borderRadius: 10,
                    background:
                      '#1a1a1a'
                  }}
                >
                  <img
                    src={
                      produto.imagem
                    }
                    width='100%'
                    style={{
                      borderRadius: 10,
                      marginBottom: 10
                    }}
                  />

                  <h3>
                    {produto.nome}
                  </h3>

                  <p>
                    {
                      produto.descricao
                    }
                  </p>

                  <p>
                    Categoria:{' '}
                    {
                      produto.categoria
                    }
                  </p>

                  <h3>
                    R$ {produto.preco}
                  </h3>

                  <button
                    onClick={() =>
                      adicionarCarrinho(
                        produto
                      )
                    }
                    style={buttonStyle}
                  >
                    Adicionar
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() =>
                          carregarEdicao(
                            produto
                          )
                        }
                        style={buttonStyle}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          deletarProduto(
                            produto.id
                          )
                        }
                        style={
                          deleteButtonStyle
                        }
                      >
                        Deletar
                      </button>
                    </>
                  )}
                </div>
              )
            )}
          </div>

          {/* CARRINHO */}
          <div
            style={{
              marginTop: 50,
              textAlign: 'center'
            }}
          >
            <h2>Carrinho</h2>

            {carrinho.length ===
              0 && (
              <p>
                Carrinho vazio
              </p>
            )}

            {carrinho.map(
              (item, index) => (
                <div key={index}>
                  <p>
                    {item.nome} - R${' '}
                    {item.preco}
                  </p>

                  <button
                    onClick={() =>
                      removerCarrinho(
                        index
                      )
                    }
                    style={buttonStyle}
                  >
                    Remover
                  </button>
                </div>
              )
            )}

            <h3>
              Subtotal: R${' '}
              {total.toFixed(2)}
            </h3>

            <h3>
              Frete: R${' '}
              {frete.toFixed(2)}
            </h3>

            <h2>
              Total: R${' '}
              {totalFinal.toFixed(2)}
            </h2>

            {carrinho.length > 0 && (
              <div
                style={{
                  maxWidth: 400,
                  margin:
                    '20px auto'
                }}
              >
                <h2>Pagamento</h2>

                <input
                  type='text'
                  placeholder='Número do cartão'
                  value={
                    numeroCartao
                  }
                  onChange={e =>
                    setNumeroCartao(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <input
                  type='text'
                  placeholder='Nome no cartão'
                  value={nomeCartao}
                  onChange={e =>
                    setNomeCartao(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <input
                  type='text'
                  placeholder='CVV'
                  value={cvv}
                  onChange={e =>
                    setCvv(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <button
                  onClick={
                    finalizarCompra
                  }
                  style={buttonStyle}
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
  border: '1px solid white',
  background: '#222',
  color: 'white',
  boxSizing: 'border-box'
}

const buttonStyle = {
  padding: 10,
  marginRight: 10,
  marginTop: 10,
  borderRadius: 5,
  border: '1px solid white',
  background: '#a855f7',
  color: 'white',
  cursor: 'pointer'
}

const deleteButtonStyle = {
  padding: 10,
  marginRight: 10,
  marginTop: 10,
  borderRadius: 5,
  border: '1px solid white',
  background: '#dc2626',
  color: 'white',
  cursor: 'pointer'
}

export default App