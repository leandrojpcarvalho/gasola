import Usuario from '#models/usuario'
import { Servico } from './interface.js'
import { CriacaoUsuario, IUsuario } from 'jogodaforca-shared'

export class ServicoUsuario implements Servico<IUsuario, Omit<IUsuario, 'senha'>> {
  constructor(private modelo = Usuario) {}
  async pegarPorId(id: number) {
    const usuario = await this.modelo.find(id)
    if (!usuario) {
      return { mensagem: 'Usuário não encontrado', codigoDeStatus: 404 }
    }
    return {
      mensagem: 'Usuário encontrado com sucesso',
      codigoDeStatus: 200,
      data: usuario,
    }
  }

  async criar(dado: CriacaoUsuario) {
    const usuarioExistente = await this.verificarExistencia(dado.email)

    if (usuarioExistente) {
      return usuarioExistente
    }

    const usuario = await this.modelo.create(dado)

    return {
      mensagem: 'Usuário criado com sucesso',
      codigoDeStatus: 201,
      data: Usuario.accessTokens.create(usuario),
    }
  }

  private async verificarExistencia(email: string) {
    const emailExistente = await this.modelo.query().where('email', email).first()
    if (!emailExistente) {
      return false
    }
    return {
      mensagem: 'Usuário já existe',
      codigoDeStatus: 409,
    }
  }

  public async login({ email, senha }: { email: string; senha: string }) {
    const usuario = await this.modelo.query().where('email', email).first()

    if (!usuario) {
      return { mensagem: 'Usuário não encontrado', codigoDeStatus: 404 }
    }

    const senhaCorreta = await usuario.verifyPassword(senha)

    if (!senhaCorreta) {
      return {
        mensagem: 'Usuário e/ou Senha incorreto(s)',
        codigoDeStatus: 401,
      }
    }

    const tokenGerado = await Usuario.accessTokens.create(usuario)

    return {
      mensagem: `Bem-vindo de volta, ${usuario.nome}!`,
      codigoDeStatus: 200,
      data: tokenGerado.value?.release(),
    }
  }
}
