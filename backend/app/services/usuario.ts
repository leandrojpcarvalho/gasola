import Usuario from '#models/usuario'
import { Servico } from './interface.js'
import {
  CriacaoUsuario,
  EDificuldade,
  EEstadoDeJogo,
  Historico,
  IUsuario,
  RespostaServico,
} from 'jogodaforca-shared'

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
      data: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    }
  }

  async criar(dado: CriacaoUsuario) {
    const usuarioExistente = await this.verificarExistencia(dado.email)

    if (usuarioExistente) {
      return usuarioExistente
    }

    const usuario = await this.modelo.create(dado)

    const token = await Usuario.accessTokens.create(usuario)

    return {
      mensagem: 'Usuário criado com sucesso',
      codigoDeStatus: 201,
      data: token.value?.release(),
    }
  }

  async criarGuest(uuid: string) {
    const nome = `Guest_${uuid}`
    const email = nome + '@guest.com'
    const usuarioExistente = await this.verificarExistencia(email)

    if (usuarioExistente) {
      return usuarioExistente
    }

    return this.criar({
      nome,
      email,
      senha: '',
      dificuldade: EDificuldade.FACIL,
    })
  }

  private async verificarExistencia(email: string) {
    const emailExistente = await this.modelo.query().where('email', email).first()
    if (!emailExistente) {
      return false
    }

    const data = await Usuario.accessTokens.create(emailExistente)
    return {
      mensagem: 'Usuário já existe',
      codigoDeStatus: 409,
      data: data.value?.release(),
    }
  }

  public async atualizarUsuario(id: number, dados: Partial<CriacaoUsuario>) {
    const usuario = await this.modelo.find(id)
    if (!usuario) {
      return { mensagem: 'Usuário não encontrado', codigoDeStatus: 404 }
    }
    usuario.merge(dados)
    await usuario.save()

    return {
      mensagem: 'Usuário atualizado com sucesso',
      codigoDeStatus: 200,
      data: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    }
  }

  public async obterHistorico(idUsuario: number): RespostaServico<Historico[]> {
    const jogos = await this.modelo
      .query()
      .select(
        'jogos.id as idJogo',
        'palavras.valor as palavra',
        'jogos.resultado as resultado',
        'jogos.pontuacao as pontuacao',
        'jogos.dificuldade as dificuldade',
        'jogos.criado_em as criadoEm'
      )
      .innerJoin('jogos', 'usuarios.id', 'jogos.id_usuario')
      .innerJoin('palavras', 'jogos.id_palavra', 'palavras.id')
      .where('usuarios.id', idUsuario)
      .orderBy('jogos.criado_em', 'desc')

    const data = jogos.map<Historico>((j) => ({
      idJogo: j.$extras.idJogo,
      palavra: j.$extras.resultado === EEstadoDeJogo.ATIVO ? '***' : j.$extras.palavra,
      criadoEm: j.$extras.criadoEm,
      dificuldade: j.$attributes.dificuldade,
      pontuacao: j.$extras.pontuacao,
      resultado: j.$extras.resultado,
    }))
    return {
      mensagem: 'Histórico obtido com sucesso',
      codigoDeStatus: 200,
      data,
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
