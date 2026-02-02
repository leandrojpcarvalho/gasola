import { IPalavra, CriacaoPalavra } from 'jogodaforca-shared'
import Palavra from '#models/palavra'
import { Atualizacao, Servico } from './interface.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class ServicoPalavra implements Servico<IPalavra> {
  constructor(private modelo = Palavra) {}

  async pegarPorId(id: number) {
    const palavra = await this.modelo.find(id)
    if (!palavra) {
      return { mensagem: 'Palavra não encontrada', codigoDeStatus: 404 }
    }
    return {
      mensagem: 'Palavra encontrada com sucesso',
      codigoDeStatus: 200,
      data: palavra,
    }
  }

  async criarMuitas(dados: CriacaoPalavra[], trx?: TransactionClientContract) {
    const palavras = await this.modelo.createMany(dados, { client: trx })
    return {
      mensagem: 'Palavras criadas com sucesso',
      codigoDeStatus: 201,
      data: palavras,
    }
  }

  async criar(dado: CriacaoPalavra & { trx?: TransactionClientContract }) {
    const palavraExistente = await this.verificarExistencia(dado.valor)

    if (palavraExistente) {
      return await this.atualiza(palavraExistente.id, {
        idTema: dado.idTema,
        dicas: dado.dicas,
        dificuldade: dado.dificuldade,
        dicaGeradaPorIA: dado.dicaGeradaPorIA,
      })
    }

    const palavra = await this.modelo.create(dado, { client: dado.trx })
    return {
      mensagem: 'Palavra criada com sucesso',
      codigoDeStatus: 201,
      data: palavra,
    }
  }

  async pegarPalavraPorTema(idTema: number) {
    const palavras = await this.modelo.query().where('id_tema', idTema)
    console.log('Palavras encontradas para o tema:', palavras)
    if (palavras.length === 0) {
      return { mensagem: 'Nenhuma palavra encontrada', codigoDeStatus: 404 }
    }
    const palavra = palavras[Math.floor(Math.random() * palavras.length)]
    return {
      mensagem: 'Palavras encontradas com sucesso',
      codigoDeStatus: 200,
      data: palavra,
    }
  }

  public async pegarDicaAleatoria(idPalavra: number, excluidas: string[] = []) {
    const temPalavra = await this.pegarPorId(idPalavra)
    if (temPalavra.data) {
      const { data } = temPalavra
      const dicasDisponiveis = data.dicas.filter((dica) => !excluidas.includes(dica))
      if (dicasDisponiveis.length === 0) {
        return {
          mensagem: 'Nenhuma dica disponível',
          codigoDeStatus: 404,
        }
      }
      const dicaAleatoria = dicasDisponiveis[Math.floor(Math.random() * dicasDisponiveis.length)]
      return {
        mensagem: 'Dica encontrada com sucesso',
        codigoDeStatus: 200,
        data: dicaAleatoria,
      }
    }
    return temPalavra
  }

  public async verificarExistencia(valor: string, trx?: TransactionClientContract) {
    return this.modelo.query({ client: trx }).where('valor', valor).first()
  }

  public async atualiza(
    id: number,
    dado: Atualizacao<IPalavra> & { trx?: TransactionClientContract }
  ) {
    const palavra = await this.modelo.find(id, { client: dado.trx })
    if (!palavra) {
      return { mensagem: 'Palavra não encontrada', codigoDeStatus: 404 }
    }

    palavra.merge(dado)
    await palavra.save()

    return {
      mensagem: 'Palavra atualizada com sucesso',
      codigoDeStatus: 200,
      data: palavra,
    }
  }
}
