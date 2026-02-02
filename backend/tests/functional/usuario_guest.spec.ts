import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Usuario - Guest', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('deve criar um usuário guest com UUID válido', async ({ client, assert }) => {
    const uuid = 'test-uuid-123'
    const response = await client.post('/usuario/guest').header('x-uuid', uuid)

    response.assertStatus(201)
    response.assertBodyContains({
      mensagem: 'Usuário criado com sucesso',
    })
    assert.properties(response.body(), ['mensagem', 'data'])
    assert.exists(response.body().data)
    assert.isString(response.body().data)
  })

  test('deve retornar erro ao criar guest sem UUID', async ({ client }) => {
    const response = await client.post('/usuario/guest')

    response.assertStatus(400)
    response.assertBodyContains({
      mensagem: 'UUID é obrigatório para criar um usuário guest',
    })
  })

  test('deve criar usuários guest diferentes para UUIDs diferentes', async ({ client, assert }) => {
    const uuid1 = 'uuid-teste-1'
    const uuid2 = 'uuid-teste-2'

    const response1 = await client.post('/usuario/guest').header('x-uuid', uuid1)
    const response2 = await client.post('/usuario/guest').header('x-uuid', uuid2)

    response1.assertStatus(201)
    response2.assertStatus(201)

    assert.notEqual(response1.body().data, response2.body().data)
  })

  test('deve criar guest com nome e email baseados no UUID', async ({ client, assert }) => {
    const uuid = 'my-special-uuid'
    const response = await client.post('/usuario/guest').header('x-uuid', uuid)

    response.assertStatus(201)

    const infoResponse = await client
      .get('/usuario/info')
      .bearerToken(response.body().data.replace('usrNQ.', ''))

    infoResponse.assertStatus(200)
    assert.include(infoResponse.body().data.nome, 'Guest')
    assert.include(infoResponse.body().data.email, '@guest.com')
  })
})
