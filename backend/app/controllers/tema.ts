import { HttpContext } from '@adonisjs/http-server'

import { ServicoTema } from '#services/index'

export default class ControleTema {
  constructor(private servicoUsuario = new ServicoTema()) {}

  public async listar({ response }: HttpContext) {
    const temas = await this.servicoUsuario.listar()

    return response.status(200).json({
      mensagem: 'Temas obtidos com sucesso',
      data: temas,
    })
  }
}
