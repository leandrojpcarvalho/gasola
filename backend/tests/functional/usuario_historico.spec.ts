import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { EDificuldade, EEstadoDeJogo } from 'jogodaforca-shared'
import Usuario from '#models/usuario'
import Tema from '#models/tema'
import Palavra from '#models/palavra'
import Jogo from '#models/jogo'

test.group('Usuario - Histórico', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('deve retornar histórico de jogos do usuário autenticado', async ({ client, assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste User',
      email: 'teste@historico.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Animais' })
    const palavra = await Palavra.create({
      valor: 'GATO',
      dicas: ['Animal doméstico', 'Mia'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.MEDIO,
      pontuacao: 100,
      resultado: EEstadoDeJogo.VITORIA,
    })

    const token = await Usuario.accessTokens.create(usuario)

    const response = await client.get('/usuario/historico').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 1)
    assert.properties(response.body().data[0], [
      'idJogo',
      'pontuacao',
      'resultado',
      'palavra',
      'dificuldade',
      'criadoEm',
    ])
  })

  test('não deve revelar palavra de jogos ativos no histórico', async ({ client, assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste User',
      email: 'teste@historico2.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Frutas' })
    const palavra = await Palavra.create({
      valor: 'BANANA',
      dicas: ['Fruta amarela', 'Macaco gosta'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.MEDIO,
      pontuacao: 0,
      resultado: EEstadoDeJogo.ATIVO,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.MEDIO,
      pontuacao: 50,
      resultado: EEstadoDeJogo.DERROTA,
    })

    const token = await Usuario.accessTokens.create(usuario)

    const response = await client.get('/usuario/historico').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)

    const jogoAtivo = response.body().data.find((j: any) => j.resultado === EEstadoDeJogo.ATIVO)
    if (jogoAtivo) {
      assert.notEqual(jogoAtivo.palavra, 'BANANA')
      assert.equal(jogoAtivo.palavra, '***')
    }

    const jogoFinalizado = response
      .body()
      .data.find((j: any) => j.resultado === EEstadoDeJogo.DERROTA)
    assert.exists(jogoFinalizado)
    assert.equal(jogoFinalizado.palavra, 'BANANA')
  })

  test('deve retornar array vazio se usuário não tem jogos', async ({ client, assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste User Sem Jogos',
      email: 'semjogos@historico.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const token = await Usuario.accessTokens.create(usuario)

    const response = await client.get('/usuario/historico').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 0)
  })

  test('deve retornar 401 se usuário não autenticado', async ({ client }) => {
    const response = await client.get('/usuario/historico')

    response.assertStatus(401)
  })

  test('deve ordenar histórico por data (mais recente primeiro)', async ({ client, assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste User',
      email: 'teste@ordem.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Cores' })
    const palavra = await Palavra.create({
      valor: 'AZUL',
      dicas: ['Cor do céu'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.FACIL,
      pontuacao: 50,
      resultado: EEstadoDeJogo.VITORIA,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.MEDIO,
      pontuacao: 80,
      resultado: EEstadoDeJogo.VITORIA,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.DIFICIL,
      pontuacao: 100,
      resultado: EEstadoDeJogo.VITORIA,
    })

    const token = await Usuario.accessTokens.create(usuario)

    const response = await client.get('/usuario/historico').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 3)

    const ids = response.body().data.map((j: any) => j.idJogo)
    assert.equal(ids[0], Math.max(...ids))
  })
})
