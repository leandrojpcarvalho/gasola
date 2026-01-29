import { Criacao, SessaoDeJogo } from 'jogodaforca-shared'
import { ServicoPalavra, ServicoTema, ServicoUsuario, Servico } from '#services/index'
import { ServicoJogo } from './jogo.js'

type NovoJogo = {
  tema: string
  idUsuario: number
}
export class OrquestradorJogo implements Servico<NovoJogo, SessaoDeJogo> {
  constructor(
    private servicoJogo = new ServicoJogo(),
    private sevicoUsuario = new ServicoUsuario(),
    private servicoPalavra = new ServicoPalavra(),
    private servicoTema = new ServicoTema()
  ) {}

  async pegarPorId(id: number) {
    return await this.servicoJogo.pegarPorId(id)
  }

  async criar(dado: Criacao<NovoJogo>) {
    const resposta = await this.sevicoUsuario.pegarPorId(dado.idUsuario)
    const usuarioRecuperado = resposta.data
    if (!usuarioRecuperado) {
      return resposta
    }

    const { data: tema } = await this.servicoTema.criar({ valor: dado.tema })
    const { data: palavra } = await this.servicoPalavra.pegarPalavraPorTema(tema.id)
    if (!palavra) {
      return {
        mensagem: 'Nenhuma palavra encontrada para o tema fornecido',
        codigoDeStatus: 404,
      }
    }
    return await this.servicoJogo.criar({
      idUsuario: usuarioRecuperado.id,
      idPalavra: palavra?.id,
    })
  }
}
