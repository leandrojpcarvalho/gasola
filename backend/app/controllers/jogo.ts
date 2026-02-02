import { HttpContext } from '@adonisjs/http-server'

import { ServicoJogo } from '#services/Jogo/jogo'

export default class ControleJogo {
  constructor(private servicoJogo = new ServicoJogo()) {}

  public async ranking({ response }: HttpContext) {
    const ranking = await this.servicoJogo.pegarRanking()

    return response.status(200).json({
      mensagem: 'Temas obtidos com sucesso',
      data: ranking,
    })
  }
}
