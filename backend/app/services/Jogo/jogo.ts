import {
  Criacao,
  SessaoDeJogo,
  Tentativa,
  EEstadoDeJogo,
  IJogo,
  Ranking,
  RespostaServico,
  Estado,
} from 'jogodaforca-shared'
import Jogo from '#models/jogo'
import { RedisJogoModelo } from '#models/index'
import { Servico, ServicoUsuario, ServicoPalavra, calcularPontuacaoMaxima } from '../index.js'
import { AtualizadorDeJogo } from './entities/atualizador_jogo.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

type CriacaoDeJogo = Criacao<Omit<IJogo, 'pontuacao' | 'resultado' | 'idPalavra'>> & {
  trx?: TransactionClientContract
}

export class ServicoJogo implements Servico<IJogo, SessaoDeJogo> {
  constructor(
    private modelo = Jogo,
    private servicoUsuario = new ServicoUsuario(),
    private servicoPalavra = new ServicoPalavra(),
    private modelRedis = new RedisJogoModelo()
  ) {}

  async pegarPorId(id: number) {
    const data = await this.modelRedis.pegarJogo(id)
    if (data) {
      return {
        mensagem: 'Jogo encontrado com sucesso',
        codigoDeStatus: 200,
        data,
      }
    }

    const jogo = await this.modelo.find(id)
    if (!jogo) {
      return { mensagem: 'Jogo não encontrado', codigoDeStatus: 404 }
    }

    return {
      mensagem: 'Jogo encontrado com sucesso',
      codigoDeStatus: 200,
      data,
    }
  }

  async criar(dado: CriacaoDeJogo, idPalavra: number) {
    const resultadoUsuario = await this.servicoUsuario.pegarPorId(dado.idUsuario)

    const usuario = resultadoUsuario.data
    if (!usuario) {
      return resultadoUsuario
    }

    const resultadoPalavra = await this.servicoPalavra.pegarPorId(idPalavra)

    const palavra = resultadoPalavra.data

    if (!palavra) {
      return resultadoPalavra
    }

    const jogo = await this.modelo.create({
      idPalavra: palavra.id,
      idUsuario: usuario.id,
      dificuldade: palavra.dificuldade,
      pontuacao: calcularPontuacaoMaxima(palavra.dificuldade, palavra.valor),
      resultado: EEstadoDeJogo.ATIVO,
    })

    const sessaoDeJogo = AtualizadorDeJogo.pegarInstancia(jogo, palavra)
    await this.modelRedis.cadastrarEAtualizarJogo(sessaoDeJogo.jogo)

    return {
      mensagem: 'Jogo criado com sucesso',
      codigoDeStatus: 201,
      data: sessaoDeJogo.jogoEstado,
    }
  }

  async calcularNovaPontuacao(tentaiva: Tentativa): RespostaServico<Estado> {
    const jogo = await this.modelRedis.pegarJogo(tentaiva.idJogo)
    if (!jogo) {
      const resposta = await this.pegarPorId(tentaiva.idJogo)
      if (!resposta.data) {
        return resposta
      }
      return {
        mensagem: 'Jogo não está ativo no momento',
        codigoDeStatus: 400,
      }
    }
    const atualizador = new AtualizadorDeJogo(jogo)
    atualizador.tentarLetra(tentaiva.letra)
    await this.persistirJogo(atualizador)

    return {
      mensagem: 'Tentativa processada com sucesso',
      codigoDeStatus: 200,
      data: atualizador.jogoEstado,
    }
  }

  async deletar(id: number): RespostaServico<null> {
    const jogo = await this.modelo.find(id)
    if (!jogo) {
      return { mensagem: 'Jogo não encontrado', codigoDeStatus: 404 }
    }

    await this.modelRedis.deletarJogo(jogo.id)
    await jogo.delete()

    return {
      mensagem: 'Jogo deletado com sucesso',
      codigoDeStatus: 204,
      data: null,
    }
  }

  public async persistirJogo(instancia: AtualizadorDeJogo) {
    if (instancia.jogo.estado !== EEstadoDeJogo.ATIVO) {
      const instanciaDb = await this.modelo.find(instancia.jogo.idJogo)
      if (!instanciaDb) {
        await this.modelRedis.deletarJogo(instancia.jogo)
        return
      }
      await this.modelRedis.deletarJogo(instancia.jogo)
      instanciaDb.pontuacao = instancia.jogo.pontuacaoAtual
      instanciaDb.resultado = instancia.jogo.estado
      await instanciaDb.save()
      return
    }
    await this.modelRedis.cadastrarEAtualizarJogo(instancia.jogo)
  }

  public async pegarRanking(): Promise<Ranking[]> {
    const ranking = await this.modelo
      .query()
      .where('resultado', EEstadoDeJogo.VITORIA)
      .join('usuarios', 'jogos.id_usuario', 'usuarios.id')
      .select('usuarios.nome', 'jogos.id_usuario')
      .sum('pontuacao as pontuacao_total')
      .groupBy('jogos.id_usuario', 'usuarios.nome')
      .orderBy('pontuacao_total', 'desc')
      .limit(10)

    return ranking.map((item, index) => ({
      posicao: index + 1,
      nome: item.$extras.nome,
      pontuacaoTotal: Number(item.$extras.pontuacao_total),
    }))
  }
}
