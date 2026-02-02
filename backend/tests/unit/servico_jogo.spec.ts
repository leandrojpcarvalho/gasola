import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { EDificuldade, EEstadoDeJogo } from 'jogodaforca-shared'
import { ServicoJogo } from '#services/Jogo/jogo'
import Usuario from '#models/usuario'
import Tema from '#models/tema'
import Palavra from '#models/palavra'
import Jogo from '#models/jogo'

test.group('ServicoJogo', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('deve criar um novo jogo com sucesso', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste@jogo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'TESTE',
      dicas: ['Dica 1'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    const servico = new ServicoJogo()

    const resultado = await servico.criar(
      {
        idUsuario: usuario.id,
        dificuldade: EDificuldade.FACIL,
      },
      palavra.id
    )

    assert.equal(resultado.codigoDeStatus, 201)
    assert.equal(resultado.mensagem, 'Jogo criado com sucesso')
    assert.exists(resultado.data)
    assert.properties(resultado.data, [
      'idJogo',
      'palavra',
      'maxTentativas',
      'pontuacaoAtual',
      'estado',
      'dicasUtilizadas',
      'letrasCorretas',
      'letrasErradas',
    ])
    if ('data' in resultado && resultado.data) {
      assert.equal(resultado.data.estado, EEstadoDeJogo.ATIVO)
    }
  })

  test('deve retornar erro ao criar jogo com usuário inexistente', async ({ assert }) => {
    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'TESTE',
      dicas: ['Dica 1'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    const servico = new ServicoJogo()

    const resultado = await servico.criar(
      {
        idUsuario: 999999,
        dificuldade: EDificuldade.FACIL,
      },
      palavra.id
    )

    assert.equal(resultado.codigoDeStatus, 404)
    assert.include(resultado.mensagem.toLowerCase(), 'não encontrado')
  })

  test('deve retornar erro ao criar jogo com palavra inexistente', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste2@jogo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const servico = new ServicoJogo()

    const resultado = await servico.criar(
      {
        idUsuario: usuario.id,
        dificuldade: EDificuldade.FACIL,
      },
      999999
    )

    assert.equal(resultado.codigoDeStatus, 404)
    assert.equal(resultado.mensagem, 'Palavra não encontrada')
  })

  test('deve calcular nova pontuação após tentativa correta', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste3@jogo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'GATO',
      dicas: ['Animal'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    const servico = new ServicoJogo()

    const jogoResult = await servico.criar(
      {
        idUsuario: usuario.id,
        dificuldade: EDificuldade.FACIL,
      },
      palavra.id
    )

    assert.exists(jogoResult.data)

    const resultado = await servico.calcularNovaPontuacao({
      idJogo: jogoResult.data!.idJogo,
      letra: 'G',
    })

    assert.equal(resultado.codigoDeStatus, 200)
    if ('data' in resultado && resultado.data) {
      assert.include(resultado.data.letrasCorretas, 'G')
      assert.equal(resultado.data.letrasErradas.length, 0)
    }
  })

  test('deve calcular nova pontuação após tentativa incorreta', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste4@jogo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'GATO',
      dicas: ['Animal'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    const servico = new ServicoJogo()

    const jogoResult = await servico.criar(
      {
        idUsuario: usuario.id,
        dificuldade: EDificuldade.FACIL,
      },
      palavra.id
    )

    assert.exists(jogoResult.data)

    const resultado = await servico.calcularNovaPontuacao({
      idJogo: jogoResult.data!.idJogo,
      letra: 'Z',
    })

    assert.equal(resultado.codigoDeStatus, 200)
    if ('data' in resultado && resultado.data) {
      assert.include(resultado.data.letrasErradas, 'Z')
      assert.equal(resultado.data.letrasCorretas.length, 0)
    }
  })

  test('deve gerar ranking corretamente', async ({ assert }) => {
    const usuario1 = await Usuario.create({
      nome: 'Player 1',
      email: 'p1@jogo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const usuario2 = await Usuario.create({
      nome: 'Player 2',
      email: 'p2@jogo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'TESTE',
      dicas: ['Dica'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    await Jogo.create({
      idUsuario: usuario1.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.FACIL,
      pontuacao: 100,
      resultado: EEstadoDeJogo.VITORIA,
    })

    await Jogo.create({
      idUsuario: usuario2.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.MEDIO,
      pontuacao: 150,
      resultado: EEstadoDeJogo.VITORIA,
    })

    const servico = new ServicoJogo()
    const ranking = await servico.pegarRanking()

    assert.isArray(ranking)
    assert.lengthOf(ranking, 2)
    assert.equal(ranking[0].nome, 'Player 2')
    assert.equal(ranking[0].pontuacaoTotal, 150)
    assert.equal(ranking[0].posicao, 1)
    assert.equal(ranking[1].nome, 'Player 1')
    assert.equal(ranking[1].pontuacaoTotal, 100)
    assert.equal(ranking[1].posicao, 2)
  })

  test('deve deletar jogo com sucesso', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste5@jogo.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Teste' })
    const palavra = await Palavra.create({
      valor: 'TESTE',
      dicas: ['Dica'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    const jogo = await Jogo.create({
      idUsuario: usuario.id,
      idPalavra: palavra.id,
      dificuldade: EDificuldade.FACIL,
      pontuacao: 100,
      resultado: EEstadoDeJogo.VITORIA,
    })

    const servico = new ServicoJogo()
    const resultado = await servico.deletar(jogo.id)

    assert.equal(resultado.codigoDeStatus, 204)
    assert.equal(resultado.mensagem, 'Jogo deletado com sucesso')

    const jogoDeletado = await Jogo.find(jogo.id)
    assert.isNull(jogoDeletado)
  })

  test('deve retornar erro ao deletar jogo inexistente', async ({ assert }) => {
    const servico = new ServicoJogo()
    const resultado = await servico.deletar(999999)

    assert.equal(resultado.codigoDeStatus, 404)
    assert.equal(resultado.mensagem, 'Jogo não encontrado')
  })

  test('deve retornar erro ao tentar jogar em jogo inexistente', async ({ assert }) => {
    const servico = new ServicoJogo()

    const resultado = await servico.calcularNovaPontuacao({
      idJogo: 999999,
      letra: 'A',
    })

    assert.equal(resultado.codigoDeStatus, 404)
  })
})
