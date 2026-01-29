import { HttpContext } from '@adonisjs/http-server'

import { criarUsuarioSchema, loginUsuarioSchema } from '#validators/usuarios'
import { ServicoUsuario } from '#services/index'

export default class ControleUsuario {
  constructor(private servicoUsuario = new ServicoUsuario()) {}

  public async criar({ request, response }: HttpContext) {
    const [errors, schema] = await criarUsuarioSchema.tryValidate(request.body())
    if (errors) {
      return response.status(400).json({
        mensagem: 'Dados inválidos',
        erros: errors,
      })
    }

    const { codigoDeStatus, ...resto } = await this.servicoUsuario.criar(schema)

    return response.status(codigoDeStatus).json(resto)
  }

  public async login({ request, response }: HttpContext) {
    const [errors, schema] = await loginUsuarioSchema.tryValidate(request.body())
    if (errors) {
      return response.status(400).json({
        mensagem: 'Dados inválidos',
        erros: errors,
      })
    }

    const { codigoDeStatus, ...resto } = await this.servicoUsuario.login(schema)

    return response.status(codigoDeStatus).json(resto)
  }
}
