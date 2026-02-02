import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { EDificuldade, EEstadoDeJogo } from 'jogodaforca-shared'
import Usuario from '#models/usuario'
import Tema from '#models/tema'
import Palavra from '#models/palavra'
import Jogo from '#models/jogo'

test.group('Jogo - Ranking', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('deve retornar ranking ordenado por pontuação', async ({ client, assert }) => {
    const usuario1 = await Usuario.create({
      nome: 'Player 1',
      email: 'player1@ranking.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const usuario2 = await Usuario.create({
      nome: 'Player 2',
      email: 'player2@ranking.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const usuario3 = await Usuario.create({
      nome: 'Player 3',
      email: 'player3@ranking.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'TESTE',
      dicas: ['Teste'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    await Jogo.create({
      idUsuario: usuario1.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.FACIL,
      pontuacao: 50,
      resultado: EEstadoDeJogo.VITORIA,
    })

    await Jogo.create({
      idUsuario: usuario2.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.MEDIO,
      pontuacao: 100,
      resultado: EEstadoDeJogo.VITORIA,
    })

    await Jogo.create({
      idUsuario: usuario3.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.DIFICIL,
      pontuacao: 75,
      resultado: EEstadoDeJogo.VITORIA,
    })

    const token = await Usuario.accessTokens.create(usuario1)

    const response = await client.get('/jogo/ranking').bearerToken(token.value!.release())

    response.assertStatus(200)
    response.assertBodyContains({
      mensagem: 'Temas obtidos com sucesso',
    })

    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 3)

    const pontuacoes = response.body().data.map((r: any) => r.pontuacaoTotal)
    assert.equal(pontuacoes[0], 100)
    assert.equal(pontuacoes[1], 75)
    assert.equal(pontuacoes[2], 50)
  })

  test('deve retornar ranking vazio se não houver jogos', async ({ client, assert }) => {
    const usuario = await Usuario.create({
      nome: 'Player Solo',
      email: 'solo@ranking.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const token = await Usuario.accessTokens.create(usuario)

    const response = await client.get('/jogo/ranking').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 0)
  })

  test('deve retornar 401 se usuário não autenticado', async ({ client }) => {
    const response = await client.get('/jogo/ranking')

    response.assertStatus(401)
  })

  test('deve somar pontuações de múltiplos jogos do mesmo usuário', async ({ client, assert }) => {
    const usuario = await Usuario.create({
      nome: 'Player Multi',
      email: 'multi@ranking.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra1 = await Palavra.create({
      valor: 'TESTE1',
      dicas: ['Teste 1'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    const palavra2 = await Palavra.create({
      valor: 'TESTE2',
      dicas: ['Teste 2'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra1.id,
      dificuldade: EDificuldade.FACIL,
      pontuacao: 50,
      resultado: EEstadoDeJogo.VITORIA,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra2.id,
      dificuldade: EDificuldade.MEDIO,
      pontuacao: 75,
      resultado: EEstadoDeJogo.VITORIA,
    })

    const token = await Usuario.accessTokens.create(usuario)

    const response = await client.get('/jogo/ranking').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)

    const playerRanking = response.body().data.find((r: any) => r.nome === 'Player Multi')
    assert.exists(playerRanking)
    assert.equal(playerRanking.pontuacaoTotal, 125) // 50 + 75
  })

  test('deve incluir nome do usuário no ranking', async ({ client, assert }) => {
    const usuario = await Usuario.create({
      nome: 'Jogador Especial',
      email: 'especial@ranking.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'TESTE',
      dicas: ['Teste'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.FACIL,
      pontuacao: 100,
      resultado: EEstadoDeJogo.VITORIA,
    })

    const token = await Usuario.accessTokens.create(usuario)

    const response = await client.get('/jogo/ranking').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)

    const playerRanking = response.body().data[0]
    assert.properties(playerRanking, ['nome', 'pontuacaoTotal', 'posicao'])
    assert.equal(playerRanking.nome, 'Jogador Especial')
  })

  test('não deve incluir jogos ativos no ranking', async ({ client, assert }) => {
    const usuario = await Usuario.create({
      nome: 'Player Ativo',
      email: 'ativo@ranking.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'TESTE',
      dicas: ['Teste'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.FACIL,
      pontuacao: 0,
      resultado: EEstadoDeJogo.ATIVO,
    })

    await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.FACIL,
      pontuacao: 100,
      resultado: EEstadoDeJogo.VITORIA,
    })

    const token = await Usuario.accessTokens.create(usuario)

    const response = await client.get('/jogo/ranking').bearerToken(token.value!.release())

    response.assertStatus(200)
    assert.isArray(response.body().data)

    const playerRanking = response.body().data[0]
    assert.equal(playerRanking.pontuacaoTotal, 100)
  })
})
