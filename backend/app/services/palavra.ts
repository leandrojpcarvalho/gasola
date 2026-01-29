import { IPalavra, CriacaoPalavra } from 'jogodaforca-shared'
import Palavra from '#models/palavra'
import { Atualizacao, Servico } from './interface.js'

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

  async criar(dado: CriacaoPalavra) {
    const palavraExistente = await this.verificarExistencia(dado.valor)

    if (palavraExistente) {
      return await this.atualiza(palavraExistente.id, {
        idTema: dado.idTema,
        dicas: dado.dicas,
        dificuldade: dado.dificuldade,
        dicaGeradaPorIA: dado.dicaGeradaPorIA,
      })
    }

    const palavra = await this.modelo.create(dado)
    return {
      mensagem: 'Palavra criada com sucesso',
      codigoDeStatus: 201,
      data: palavra,
    }
  }

  async pegarPalavraPorTema(idTema: number) {
    const palavras = await this.modelo.query().where('idTema', idTema)
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

  public async verificarExistencia(valor: string) {
    return this.modelo.query().where('valor', valor).first()
  }

  public async atualiza(id: number, dado: Atualizacao<IPalavra>) {
    const palavra = await this.modelo.find(id)
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
