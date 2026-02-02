import { ITema, CriacaoTema } from 'jogodaforca-shared'
import Tema from '#models/tema'

import { Servico } from './interface.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class ServicoTema implements Servico<ITema> {
  constructor(private modelo = Tema) {}

  async pegarPorId(id: number) {
    const tema = await this.modelo.find(id)
    if (!tema) {
      return { mensagem: 'Tema não encontrado', codigoDeStatus: 404 }
    }
    return {
      mensagem: 'Tema encontrado com sucesso',
      codigoDeStatus: 200,
      data: tema,
    }
  }

  async pegarTemaPorValor(dado: string, trx?: TransactionClientContract) {
    return this.modelo.query({ client: trx }).where('valor', dado).first()
  }

  async criar(dado: CriacaoTema & { trx?: TransactionClientContract }) {
    const temaExistente = await this.pegarTemaPorValor(dado.valor, dado.trx)

    if (temaExistente) {
      return {
        mensagem: 'Tema já existe',
        codigoDeStatus: 200,
        data: temaExistente,
      }
    }

    const tema = await this.modelo.create(dado, { client: dado.trx })
    return {
      mensagem: 'Tema criado com sucesso',
      codigoDeStatus: 201,
      data: tema,
    }
  }

  async listar() {
    const temas = await this.modelo.query().orderBy('valor', 'asc')
    return temas
  }
}
