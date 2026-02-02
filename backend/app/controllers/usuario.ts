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

  public async criarGuest({ request, response }: HttpContext) {
    const uuid = request.header('x-uuid')
    if (!uuid) {
      return response.status(400).json({
        mensagem: 'UUID é obrigatório para criar um usuário guest',
      })
    }

    const { codigoDeStatus, ...resto } = await this.servicoUsuario.criarGuest(uuid)
    return response.status(codigoDeStatus).json(resto)
  }

  public async obterInfo({ auth, response }: HttpContext) {
    const usuario = auth.user
    if (!usuario) {
      return response.status(401).json({
        mensagem: 'Usuário não autenticado',
      })
    }
    const { codigoDeStatus, mensagem, data } = await this.servicoUsuario.pegarPorId(usuario.id)

    return response.status(codigoDeStatus).json({
      mensagem,
      data,
    })
  }

  public async atualizarUsuario({ auth, request, response }: HttpContext) {
    const usuario = auth.user
    if (!usuario) {
      return response.status(401).json({
        mensagem: 'Usuário não autenticado',
      })
    }

    const dadosAtualizados = await this.servicoUsuario.atualizarUsuario(
      usuario.id,
      request.only(['nome', 'email', 'senha', 'dificuldade'])
    )

    const { codigoDeStatus, ...rest } = dadosAtualizados

    return response.status(codigoDeStatus).json(rest)
  }

  public async obterHistorico({ auth, response }: HttpContext) {
    const usuario = auth.user
    if (!usuario) {
      return response.status(401).json({
        mensagem: 'Usuário não autenticado',
      })
    }
    const { codigoDeStatus, ...rest } = await this.servicoUsuario.obterHistorico(usuario.id)

    return response.status(codigoDeStatus).json(rest)
  }
}
