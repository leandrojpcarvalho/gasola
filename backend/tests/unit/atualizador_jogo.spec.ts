import { test } from '@japa/runner'
import { EDificuldade, EEstadoDeJogo, SessaoDeJogo } from 'jogodaforca-shared'
import { AtualizadorDeJogo } from '#services/Jogo/entities/atualizador_jogo'

test.group('AtualizadorDeJogo', () => {
  test('deve criar instância com sessão de jogo válida', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    assert.equal(atualizador.idJogo, 1)
    assert.equal(atualizador.idUsuario, 1)
    assert.equal(atualizador.idPalavra, 1)
    assert.equal(atualizador.maxTentativas, 8)
    assert.equal(atualizador.palavraDificuldade, EDificuldade.FACIL)
  })

  test('deve adicionar letra correta e revelar na palavra', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)
    atualizador.tentarLetra('G')

    const estado = atualizador.jogoEstado

    assert.include(estado.letrasCorretas, 'G')
    assert.equal(estado.palavra[0], 'G')
    assert.equal(estado.letrasErradas.length, 0)
  })

  test('deve adicionar letra errada nas letras erradas', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)
    atualizador.tentarLetra('Z')

    const estado = atualizador.jogoEstado

    assert.include(estado.letrasErradas, 'Z')
    assert.equal(estado.letrasCorretas.length, 0)
    assert.deepEqual(estado.palavra, ['_', '_', '_', '_'])
  })

  test('deve identificar vitória quando palavra completa', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    atualizador.tentarLetra('G')
    atualizador.tentarLetra('A')
    atualizador.tentarLetra('T')
    atualizador.tentarLetra('O')

    const estado = atualizador.jogoEstado

    assert.equal(estado.estado, EEstadoDeJogo.VITORIA)
    assert.deepEqual(estado.palavra, ['G', 'A', 'T', 'O'])
  })

  test('deve identificar derrota quando exceder tentativas', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 3,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    atualizador.tentarLetra('Z')
    atualizador.tentarLetra('X')
    atualizador.tentarLetra('W')

    const estado = atualizador.jogoEstado

    assert.equal(estado.estado, EEstadoDeJogo.DERROTA)
    assert.equal(estado.letrasErradas.length, 3)
  })

  test('deve revelar palavra na derrota', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 2,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    atualizador.tentarLetra('Z')
    atualizador.tentarLetra('X')

    const estado = atualizador.jogoEstado

    assert.equal(estado.estado, EEstadoDeJogo.DERROTA)
    assert.deepEqual(estado.palavra, ['G', 'A', 'T', 'O'])
  })

  test('deve adicionar dica utilizada', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)
    atualizador.usarDica('Animal doméstico')

    const estado = atualizador.jogoEstado

    assert.include(estado.dicasUtilizadas, 'Animal doméstico')
  })

  test('deve normalizar letras (acentos e case insensitive)', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'AVIÃO',
        replaced: ['_', '_', '_', '_', '_'],
        dificuldade: EDificuldade.MEDIO,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    atualizador.tentarLetra('a')

    const estado = atualizador.jogoEstado

    assert.include(estado.letrasCorretas, 'a')
  })

  test('deve calcular pontuação corretamente', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    const estadoInicial = atualizador.jogoEstado
    const pontuacaoInicial = estadoInicial.pontuacaoAtual

    atualizador.tentarLetra('Z')

    const estadoDepois = atualizador.jogoEstado
    const pontuacaoDepois = estadoDepois.pontuacaoAtual

    assert.isBelow(pontuacaoDepois, pontuacaoInicial)
  })

  test('pontuação deve ser zero na derrota', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 2,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    atualizador.tentarLetra('Z')
    atualizador.tentarLetra('X')

    const estado = atualizador.jogoEstado

    assert.equal(estado.estado, EEstadoDeJogo.DERROTA)
    assert.equal(estado.pontuacaoAtual, 0)
  })

  test('deve permitir forçar derrota', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    atualizador.derrota()

    const estado = atualizador.jogoEstado

    assert.equal(estado.estado, EEstadoDeJogo.DERROTA)
  })

  test('deve manter estado após carregar de sessão existente', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['G', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 95,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: ['Animal'],
      letrasCorretas: ['G'],
      letrasErradas: ['Z'],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    const estado = atualizador.jogoEstado

    assert.include(estado.letrasCorretas, 'G')
    assert.include(estado.letrasErradas, 'Z')
    assert.include(estado.dicasUtilizadas, 'Animal')
  })

  test('deve calcular tentativas corretas por dificuldade', async ({ assert }) => {
    assert.equal(AtualizadorDeJogo.tentativasPorDificuldade(EDificuldade.FACIL), 8)
    assert.equal(AtualizadorDeJogo.tentativasPorDificuldade(EDificuldade.MEDIO), 7)
    assert.equal(AtualizadorDeJogo.tentativasPorDificuldade(EDificuldade.DIFICIL), 6)
  })

  test('não deve contar letra repetida múltiplas vezes', async ({ assert }) => {
    const sessao: SessaoDeJogo = {
      idJogo: 1,
      idUsuario: 1,
      palavra: {
        id: 1,
        valor: 'GATO',
        replaced: ['_', '_', '_', '_'],
        dificuldade: EDificuldade.FACIL,
      },
      maxTentativas: 8,
      pontuacaoAtual: 100,
      estado: EEstadoDeJogo.ATIVO,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }

    const atualizador = new AtualizadorDeJogo(sessao)

    atualizador.tentarLetra('Z')
    atualizador.tentarLetra('Z')
    atualizador.tentarLetra('Z')

    const estado = atualizador.jogoEstado

    assert.lengthOf(estado.letrasErradas, 1)
  })
})
