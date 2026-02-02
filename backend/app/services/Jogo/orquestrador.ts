import { Criacao, EDificuldade, SessaoDeJogo } from 'jogodaforca-shared'
import {
  ServicoPalavra,
  ServicoTema,
  ServicoUsuario,
  Servico,
  ServicoOpenAI,
} from '#services/index'
import { ServicoJogo } from './jogo.js'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

type NovoJogo = {
  temaId: number
  idUsuario: number
}

type CriacaoDeJogoComTema = Criacao<{
  tema: string
  idUsuario: number
}> & { trx?: TransactionClientContract }
export class OrquestradorJogo implements Servico<NovoJogo, SessaoDeJogo> {
  constructor(
    private servicoJogo = new ServicoJogo(),
    private sevicoUsuario = new ServicoUsuario(),
    private servicoPalavra = new ServicoPalavra(),
    private servicoTema = new ServicoTema(),
    public servicoOpenAI = ServicoOpenAI.getInstance()
  ) {}

  async pegarPorId(id: number) {
    return await this.servicoJogo.pegarPorId(id)
  }

  async criar(dado: Criacao<NovoJogo> & { trx?: TransactionClientContract }) {
    const resposta = await this.sevicoUsuario.pegarPorId(dado.idUsuario)
    const usuarioRecuperado = resposta.data
    if (!usuarioRecuperado) {
      return resposta
    }

    const { data: palavra } = await this.servicoPalavra.pegarPalavraPorTema(dado.temaId)
    if (!palavra) {
      return {
        mensagem: 'Nenhuma palavra encontrada para o tema fornecido',
        codigoDeStatus: 404,
      }
    }
    return await this.servicoJogo.criar(
      {
        dificuldade: palavra.dificuldade,
        idUsuario: usuarioRecuperado.id,
      },
      palavra.id
    )
  }

  public async criarTemaEPalavra(dado: Criacao<CriacaoDeJogoComTema>) {
    if (!env.get('OPENAI_API_KEY') || this.servicoOpenAI === null) {
      return {
        mensagem: 'Criação de tema dinâmico indisponível. Chave da API OpenAI não configurada.',
        codigoDeStatus: 503,
      }
    }
    try {
      const palavras = await this.servicoOpenAI.gerarPalavra(dado.tema)
      return db.transaction(async (trx) => {
        let tema = await this.servicoTema.pegarTemaPorValor(dado.tema)
        if (!tema) {
          const { data } = await this.servicoTema.criar({ valor: dado.tema })
          tema = data
        }

        const dbPalavra = await this.servicoPalavra.criarMuitas(
          palavras.map((palavra) => ({
            valor: palavra.valor,
            dicas: palavra.dicas,
            dificuldade: palavra.dificuldade as EDificuldade,
            idTema: tema.id,
            dicaGeradaPorIA: null,
          })),
          trx
        )

        if (!dbPalavra.data) {
          await trx.rollback()
          return dbPalavra
        }

        await trx.commit()
        return dbPalavra
      })
    } catch (error) {
      console.error('Erro ao criar tema e palavra via IA:', error)
      return {
        mensagem: 'Erro ao criar tema e palavra via IA',
        codigoDeStatus: 500,
      }
    }
  }
}
