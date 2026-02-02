import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { EDificuldade } from 'jogodaforca-shared'

test.group('Usuario - Criar', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('deve criar um novo usuário com dados válidos', async ({ client, assert }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(201)
    response.assertBodyContains({
      mensagem: 'Usuário criado com sucesso',
    })
    assert.properties(response.body(), ['mensagem', 'data'])
    assert.exists(response.body().data)
  })

  test('deve retornar erro ao criar usuário com email inválido', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'email-invalido',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário sem email', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'João Silva',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário com nome muito curto', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'Jo',
      email: 'joao@exemplo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário com nome muito longo', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'a'.repeat(101),
      email: 'joao@exemplo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário sem nome', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      email: 'joao@exemplo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário com senha muito curta', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: '12345',
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário com senha muito longa', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: 'a'.repeat(101),
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário sem senha', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      dificuldade: EDificuldade.FACIL,
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário com dificuldade inválida', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: 'senha123',
      dificuldade: 'impossivel',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao criar usuário sem dificuldade', async ({ client }) => {
    const response = await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: 'senha123',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao tentar criar usuário com email já existente', async ({ client }) => {
    await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    const response = await client.post('/usuario/criar').json({
      nome: 'Maria Silva',
      email: 'joao@exemplo.com',
      senha: 'outrasenha123',
      dificuldade: EDificuldade.MEDIO,
    })

    response.assertStatus(409)
    response.assertBodyContains({
      mensagem: 'Usuário já existe',
    })
  })

  test('deve criar usuários com diferentes dificuldades', async ({ client, assert }) => {
    const dificuldades = [EDificuldade.FACIL, EDificuldade.MEDIO, EDificuldade.DIFICIL]

    for (const [index, dificuldade] of dificuldades.entries()) {
      const response = await client.post('/usuario/criar').json({
        nome: `Usuário ${index}`,
        email: `usuario${index}@exemplo.com`,
        senha: 'senha123',
        dificuldade,
      })

      response.assertStatus(201)
      response.assertBodyContains({
        mensagem: 'Usuário criado com sucesso',
      })
      assert.exists(response.body().data)
    }
  })
})

test.group('Usuario - Login', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('deve fazer login com credenciais válidas', async ({ client, assert }) => {
    await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    const response = await client.post('/usuario/login').json({
      email: 'joao@exemplo.com',
      senha: 'senha123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      mensagem: 'Bem-vindo de volta, João Silva!',
    })
    assert.properties(response.body(), ['mensagem', 'data'])
    assert.exists(response.body().data)
  })

  test('deve retornar erro ao fazer login com email inexistente', async ({ client }) => {
    const response = await client.post('/usuario/login').json({
      email: 'naoexiste@exemplo.com',
      senha: 'senha123',
    })

    response.assertStatus(404)
    response.assertBodyContains({
      mensagem: 'Usuário não encontrado',
    })
  })

  test('deve retornar erro ao fazer login com senha incorreta', async ({ client }) => {
    await client.post('/usuario/criar').json({
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.FACIL,
    })

    const response = await client.post('/usuario/login').json({
      email: 'joao@exemplo.com',
      senha: 'senhaerrada',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      mensagem: 'Usuário e/ou Senha incorreto(s)',
    })
  })

  test('deve retornar erro ao fazer login com email inválido', async ({ client }) => {
    const response = await client.post('/usuario/login').json({
      email: 'email-invalido',
      senha: 'senha123',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao fazer login sem email', async ({ client }) => {
    const response = await client.post('/usuario/login').json({
      senha: 'senha123',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao fazer login sem senha', async ({ client }) => {
    const response = await client.post('/usuario/login').json({
      email: 'joao@exemplo.com',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao fazer login com senha muito curta', async ({ client }) => {
    const response = await client.post('/usuario/login').json({
      email: 'joao@exemplo.com',
      senha: '12345',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve retornar erro ao fazer login com senha muito longa', async ({ client }) => {
    const response = await client.post('/usuario/login').json({
      email: 'joao@exemplo.com',
      senha: 'a'.repeat(101),
    })

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'Dados inválidos',
    })
  })

  test('deve fazer login com diferentes usuários', async ({ client, assert }) => {
    const usuarios = [
      {
        nome: 'Usuário 1',
        email: 'usuario1@exemplo.com',
        senha: 'senha123',
        dificuldade: EDificuldade.FACIL,
      },
      {
        nome: 'Usuário 2',
        email: 'usuario2@exemplo.com',
        senha: 'senha456',
        dificuldade: EDificuldade.MEDIO,
      },
      {
        nome: 'Usuário 3',
        email: 'usuario3@exemplo.com',
        senha: 'senha789',
        dificuldade: EDificuldade.DIFICIL,
      },
    ]

    for (const usuario of usuarios) {
      await client.post('/usuario/criar').json(usuario)
    }

    for (const usuario of usuarios) {
      const response = await client.post('/usuario/login').json({
        email: usuario.email,
        senha: usuario.senha,
      })

      response.assertStatus(200)
      response.assertBodyContains({
        mensagem: `Bem-vindo de volta, ${usuario.nome}!`,
      })
      assert.exists(response.body().data)
    }
  })
})
