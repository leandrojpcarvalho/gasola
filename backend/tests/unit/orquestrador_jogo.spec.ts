import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { EDificuldade } from 'jogodaforca-shared'
import { OrquestradorJogo } from '#services/Jogo/orquestrador'
import Usuario from '#models/usuario'
import Tema from '#models/tema'
import Palavra from '#models/palavra'
import type { ServiceIAInterface } from '#services/integrations/ia_service.interface'

test.group('OrquestradorJogo', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('deve criar jogo a partir de tema existente', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste@orq.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Animais' })
    await Palavra.create({
      valor: 'GATO',
      dicas: ['Animal'],
      dificuldade: EDificuldade.FACIL,
      idTema: tema.id,
    })

    const orquestrador = new OrquestradorJogo()

    const resultado = await orquestrador.criar({
      idUsuario: usuario.id,
      temaId: tema.id,
    })

    assert.equal(resultado.codigoDeStatus, 201)
    assert.exists(resultado.data)
    if (resultado.data) {
      assert.equal(resultado.data.estado, 'ativo')
    }
  })

  test('deve retornar erro ao criar jogo com tema sem palavras', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste2@orq.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const tema = await Tema.create({ valor: 'Vazio' })

    const orquestrador = new OrquestradorJogo()

    const resultado = await orquestrador.criar({
      idUsuario: usuario.id,
      temaId: tema.id,
    })

    assert.equal(resultado.codigoDeStatus, 404)
    assert.include(resultado.mensagem, 'Nenhuma palavra encontrada')
  })

  test('deve criar tema e palavra via IA com mock', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste3@orq.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const mockPalavras = [
      {
        valor: 'CACHORRO',
        dicas: ['Late', 'Melhor amigo do homem', 'Animal doméstico'],
        dificuldade: EDificuldade.MEDIO,
      },
      {
        valor: 'GATO',
        dicas: ['Mia', 'Independente', 'Felino'],
        dificuldade: EDificuldade.FACIL,
      },
      {
        valor: 'PASSARO',
        dicas: ['Voa', 'Tem penas', 'Canta'],
        dificuldade: EDificuldade.MEDIO,
      },
    ]

    const mockAIService: ServiceIAInterface = {
      gerarPalavras: async () => mockPalavras,
      gerarDica: async () => ({ dica: 'Teste' }),
      isAvailable: () => true,
      providerName: 'MockAI',
    }

    const orquestrador = new OrquestradorJogo()
    orquestrador.aiService = mockAIService

    const resultado = await orquestrador.criarTemaEPalavra({
      tema: 'Animais de Estimação',
      idUsuario: usuario.id,
    })

    assert.equal(resultado.codigoDeStatus, 201)
    if ('data' in resultado && resultado.data) {
      assert.isArray(resultado.data)
      assert.lengthOf(resultado.data, 3)
    }

    const temaCriado = await Tema.findBy('valor', 'Animais de Estimação')
    assert.exists(temaCriado)

    const palavras = await Palavra.query().where('id_tema', temaCriado!.id)
    assert.lengthOf(palavras, 3)
    assert.include(
      palavras.map((p) => p.valor),
      'CACHORRO'
    )
  })

  test('deve retornar erro ao tentar criar via IA sem serviço disponível', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste4@orq.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const orquestrador = new OrquestradorJogo()
    orquestrador.aiService = null

    const resultado = await orquestrador.criarTemaEPalavra({
      tema: 'Qualquer Tema',
      idUsuario: usuario.id,
    })

    assert.equal(resultado.codigoDeStatus, 503)
    assert.include(resultado.mensagem, 'indisponível')
  })

  test('deve retornar erro quando IA não gera palavras', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste5@orq.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const mockAIService: ServiceIAInterface = {
      gerarPalavras: async () => null,
      gerarDica: async () => ({ dica: 'Teste' }),
      isAvailable: () => true,
      providerName: 'MockAI',
    }

    const orquestrador = new OrquestradorJogo()
    orquestrador.aiService = mockAIService
    const resultado = await orquestrador.criarTemaEPalavra({
      tema: 'Tema Impossível',
      idUsuario: usuario.id,
    })

    assert.equal(resultado.codigoDeStatus, 500)
    assert.include(resultado.mensagem, 'Não foi possível gerar palavras')
  })

  test('deve retornar erro quando IA gera array vazio', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste6@orq.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const mockAIService: ServiceIAInterface = {
      gerarPalavras: async () => [],
      gerarDica: async () => ({ dica: 'Teste' }),
      isAvailable: () => true,
      providerName: 'MockAI',
    }

    const orquestrador = new OrquestradorJogo()
    orquestrador.aiService = mockAIService
    const resultado = await orquestrador.criarTemaEPalavra({
      tema: 'Tema Vazio',
      idUsuario: usuario.id,
    })

    assert.equal(resultado.codigoDeStatus, 500)
    assert.include(resultado.mensagem, 'Não foi possível gerar palavras')
  })

  test('deve reutilizar tema existente ao criar via IA', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste7@orq.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const temaExistente = await Tema.create({ valor: 'Frutas' })

    const mockPalavras = [
      {
        valor: 'BANANA',
        dicas: ['Amarela', 'Doce'],
        dificuldade: EDificuldade.FACIL,
      },
    ]

    const mockAIService: ServiceIAInterface = {
      gerarPalavras: async () => mockPalavras,
      gerarDica: async () => ({ dica: 'Teste' }),
      isAvailable: () => true,
      providerName: 'MockAI',
    }

    const orquestrador = new OrquestradorJogo()
    orquestrador.aiService = mockAIService
    await orquestrador.criarTemaEPalavra({
      tema: 'Frutas',
      idUsuario: usuario.id,
    })

    const temas = await Tema.query().where('valor', 'Frutas')
    assert.lengthOf(temas, 1)
    assert.equal(temas[0].id, temaExistente.id)
  })

  test('deve fazer rollback em caso de erro ao criar palavras', async ({ assert }) => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste8@orq.com',
      senha: 'senha123',
      dificuldade: EDificuldade.MEDIO,
    })

    const mockAIService: ServiceIAInterface = {
      gerarPalavras: async () => {
        throw new Error('Erro de rede')
      },
      gerarDica: async () => ({ dica: 'Teste' }),
      isAvailable: () => true,
      providerName: 'MockAI',
    }

    const orquestrador = new OrquestradorJogo()
    orquestrador.aiService = mockAIService
    const resultado = await orquestrador.criarTemaEPalavra({
      tema: 'Teste Erro',
      idUsuario: usuario.id,
    })

    assert.equal(resultado.codigoDeStatus, 500)
    assert.include(resultado.mensagem, 'Erro ao criar tema e palavra via IA')
  })
})
