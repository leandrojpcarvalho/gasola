import { ITema, CriacaoTema } from 'jogodaforca-shared'
import Tema from '#models/tema'

import { Servico } from './interface.js'

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

  async criar(dado: CriacaoTema) {
    const temaExistente = await this.verificarExistencia(dado.valor)

    if (temaExistente) {
      return {
        mensagem: 'Tema já existe',
        codigoDeStatus: 200,
        data: temaExistente,
      }
    }

    const tema = await this.modelo.create(dado)
    return {
      mensagem: 'Tema criado com sucesso',
      codigoDeStatus: 201,
      data: tema,
    }
  }

  private async verificarExistencia(nome: string) {
    return this.modelo.query().where('nome', nome).first()
  }
}
