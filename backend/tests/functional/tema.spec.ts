import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { EDificuldade } from 'jogodaforca-shared'
import Usuario from '#models/usuario'
import Tema from '#models/tema'

test.group('Tema - Listar', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('deve listar todos os temas para usuário autenticado', async ({ client, assert }) => {
    // Criar usuário
    const usuario = await Usuario.create({
      nome: 'Teste User',
      email: 'teste@tema.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    // Criar temas
    await Tema.create({ valor: 'Animais' })
    await Tema.create({ valor: 'Cores' })
    await Tema.create({ valor: 'Frutas' })

    // Fazer login
    const token = await Usuario.accessTokens.create(usuario)

    // Listar temas
    const response = await client.get('/tema/listar').bearerToken(token.value!.release())

    response.assertStatus(200)
    response.assertBodyContains({
      mensagem: 'Temas obtidos com sucesso',
    })
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 3)
    assert.properties(response.body().data[0], ['id', 'valor'])
  })

  test('deve retornar array vazio se não houver temas', async ({ client, assert }) => {
    // Criar usuário
    const usuario = await Usuario.create({
      nome: 'Teste User',
      email: 'teste@semtemas.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    // Fazer login
    const token = await Usuario.accessTokens.create(usuario)

    // Listar temas (banco vazio)
    const response = await client.get('/tema/listar').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 0)
  })

  test('deve retornar 401 se usuário não autenticado', async ({ client }) => {
    const response = await client.get('/tema/listar')

    response.assertStatus(401)
  })

  test('deve retornar temas únicos (sem duplicatas)', async ({ client, assert }) => {
    // Criar usuário
    const usuario = await Usuario.create({
      nome: 'Teste User',
      email: 'teste@unicos.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    // Criar temas (tentando duplicar)
    await Tema.create({ valor: 'Esportes' })
    // Não deveria permitir duplicatas devido à constraint unique no banco
    try {
      await Tema.create({ valor: 'Esportes' })
    } catch (error) {
      // Esperado: erro de constraint unique
    }

    // Fazer login
    const token = await Usuario.accessTokens.create(usuario)

    // Listar temas
    const response = await client.get('/tema/listar').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)

    // Verificar que não há duplicatas
    const valores = response.body().data.map((t: any) => t.valor)
    const valoresUnicos = [...new Set(valores)]
    assert.lengthOf(valores, valoresUnicos.length)
  })

  test('deve retornar temas ordenados alfabeticamente', async ({ client, assert }) => {
    // Criar usuário
    const usuario = await Usuario.create({
      nome: 'Teste User',
      email: 'teste@ordem.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    // Criar temas em ordem aleatória
    await Tema.create({ valor: 'Zebras' })
    await Tema.create({ valor: 'Aves' })
    await Tema.create({ valor: 'Mamíferos' })

    // Fazer login
    const token = await Usuario.accessTokens.create(usuario)

    // Listar temas
    const response = await client.get('/tema/listar').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)

    const valores = response.body().data.map((t: any) => t.valor)
    const valoresOrdenados = [...valores].sort()

    assert.deepEqual(valores, valoresOrdenados)
  })
})
