import {
  Criacao,
  RespostaTentativa,
  SessaoDeJogo,
  Tentativa,
  EEstadoDeJogo,
  IJogo,
  Ranking,
} from 'jogodaforca-shared'
import Jogo from '#models/jogo'
import { RedisJogoModelo } from '#models/index'
import {
  Servico,
  RespostaServico,
  ServicoUsuario,
  ServicoPalavra,
  calcularPontuacaoMaxima,
} from '../index.js'
import { AtualizadorDeJogo } from './entities/atualizador_jogo.js'

type CriacaoDeJogo = Criacao<Omit<IJogo, 'pontuacao' | 'resultado'>>

export class ServicoJogo implements Servico<IJogo, SessaoDeJogo> {
  constructor(
    private modelo = Jogo,
    private servicoUsuario = new ServicoUsuario(),
    private servicoPalavra = new ServicoPalavra(),
    private modelRedis = new RedisJogoModelo()
  ) {}

  async pegarPorId(id: number) {
    const jogo = await this.modelo.find(id)
    if (!jogo) {
      return { mensagem: 'Jogo não encontrado', codigoDeStatus: 404 }
    }
    const data = await this.modelRedis.pegarJogo(jogo)

    return {
      mensagem: 'Jogo encontrado com sucesso',
      codigoDeStatus: 200,
      data,
    }
  }

  async criar(dado: CriacaoDeJogo) {
    const jogoExistente = await this.modelRedis.pegarJogo(dado)
    if (jogoExistente) {
      return {
        mensagem: 'Jogo já existe',
        codigoDeStatus: 200,
        data: jogoExistente,
      }
    }
    const resultadoUsuario = await this.servicoUsuario.pegarPorId(dado.idUsuario)

    const usuario = resultadoUsuario.data
    if (!usuario) {
      return resultadoUsuario
    }

    const resultadoPalavra = await this.servicoPalavra.pegarPorId(dado.idPalavra)

    const palavra = resultadoPalavra.data

    if (!palavra) {
      return resultadoPalavra
    }

    const jogo = await this.modelo.create({
      idPalavra: palavra.id,
      idUsuario: usuario.id,
      pontuacao: calcularPontuacaoMaxima(palavra.dificuldade, palavra.valor.length),
      resultado: EEstadoDeJogo.ATIVO,
    })

    const sessaoDeJogo = await this.modelRedis.cadastrarEAtualizarJogo(
      AtualizadorDeJogo.pegarInstancia(jogo, palavra).jogo
    )

    return {
      mensagem: 'Jogo criado com sucesso',
      codigoDeStatus: 201,
      data: sessaoDeJogo,
    }
  }

  async calcularNovaPontuacao(tentativa: Tentativa): RespostaServico<RespostaTentativa> {
    const jogo = await this.modelRedis.pegarJogo(tentativa)
    if (!jogo) {
      return { mensagem: 'Jogo não encontrado', codigoDeStatus: 404 }
    }

    const atualizadorDeJogo = new AtualizadorDeJogo(jogo)
    const estadoAtualizado = atualizadorDeJogo.tentarLetra(tentativa.letra)

    await this.modelRedis.cadastrarEAtualizarJogo(atualizadorDeJogo.jogo)

    if (estadoAtualizado.estadoAtual !== EEstadoDeJogo.ATIVO) {
      await this.finalizarJogo(atualizadorDeJogo)
    }

    return {
      mensagem: 'Tentativa processada com sucesso',
      codigoDeStatus: 200,
      data: estadoAtualizado,
    }
  }

  async deletar(id: number): RespostaServico<null> {
    const jogo = await this.modelo.find(id)
    if (!jogo) {
      return { mensagem: 'Jogo não encontrado', codigoDeStatus: 404 }
    }

    await this.modelRedis.deletarJogo(jogo)
    await jogo.delete()

    return {
      mensagem: 'Jogo deletado com sucesso',
      codigoDeStatus: 204,
      data: null,
    }
  }

  public async finalizarJogo(instancia: AtualizadorDeJogo) {
    if (instancia.jogo.estado !== EEstadoDeJogo.ATIVO) {
      return
    }
    await this.modelRedis.deletarJogo(instancia.jogo)
    await this.modelo.updateOrCreate(instancia.jogo, {
      pontuacao: instancia.jogo.pontuacaoAtual,
      resultado: instancia.jogo.estado,
    })
  }

  public async pegarRanking(): Promise<Ranking[]> {
    const ranking = await this.modelo
      .query()
      .join('usuarios', 'jogos.idUsuario', 'usuarios.id')
      .select('idUsuario')
      .sum('pontuacao as pontuacaoTotal')
      .groupBy('idUsuario')
      .orderBy('pontuacaoTotal', 'desc')
      .limit(10)

    return ranking.map((item, index) => ({
      posicao: index + 1,
      nome: item.usuario.nome,
      pontuacaoTotal: item.$extras.pontuacaoTotal,
    }))
  }
}
