import { EDificuldade } from 'jogodaforca-shared'
import Palavra from '#models/palavra'
import {
  Dicionario,
  ServicoOpenAI,
  ServicoPalavra,
  ServicoTema,
  RespostaServico,
} from '#services/index'

export class ServicoDica {
  constructor(
    private servicoPalavra = new ServicoPalavra(),
    private servicoTema = new ServicoTema(),
    private servicoOpenAI = ServicoOpenAI.getInstance(),
    private servicoDicionario = new Dicionario()
  ) {}

  async cadastrarPalavraAleatoria(): RespostaServico<Palavra> {
    const palavra = await this.servicoDicionario.buscarPalavraAleatoria()
    if (!palavra) {
      return {
        mensagem: 'Não foi possível buscar uma nova palavra no momento.',
        codigoDeStatus: 500,
      }
    }

    if (!this.servicoOpenAI) {
      const { data: mTema } = await this.servicoTema.criar({
        valor: 'Geral',
      })

      const dicas =
        palavra.definitions.length > 0
          ? palavra.definitions.map((def) => def.split(palavra.word).join('____'))
          : ['Sem dica disponível']

      return await this.servicoPalavra.criar({
        valor: palavra.word,
        idTema: mTema.id,
        dicaGeradaPorIA: null,
        dicas,
        dificuldade: ServicoDica.dificuldadePorTamanho(palavra.word),
      })
    }

    return this.cadastrarPalavraGeradaPorIA(palavra.word)
  }

  public async pedirNovoHint(idPalavra: number) {
    const palavraResponse = await this.servicoPalavra.pegarPorId(idPalavra)
    if (palavraResponse.codigoDeStatus !== 200 || !palavraResponse.data) {
      return palavraResponse
    }

    const palavra = palavraResponse.data

    return this.cadastrarPalavraGeradaPorIA(palavra.valor)
  }

  private async cadastrarPalavraGeradaPorIA(palavraStr: string): RespostaServico<Palavra> {
    if (!this.servicoOpenAI) {
      return {
        mensagem: 'Serviço de IA não está disponível.',
        codigoDeStatus: 503,
      }
    }

    const existeAPalavra = await this.servicoPalavra.verificarExistencia(palavraStr)

    if (existeAPalavra && existeAPalavra.dicaGeradaPorIA) {
      return {
        mensagem: 'A palavra já existe e sua dica foi gerada por IA anteriormente.',
        codigoDeStatus: 400,
      }
    }

    const respostaIA = await this.servicoOpenAI.gerarDica(palavraStr)
    if (!respostaIA) {
      return {
        mensagem: 'Não foi possível gerar dica pela IA.',
        codigoDeStatus: 500,
      }
    }

    const { dica, dificuldade, tema } = respostaIA
    const { data: mTema } = await this.servicoTema.criar({
      valor: tema,
    })

    const { data: mPalavra } = await this.servicoPalavra.criar({
      valor: palavraStr,
      idTema: mTema.id,
      dificuldade,
      dicas: ['Sem dica disponível'],
      dicaGeradaPorIA: dica,
    })

    return {
      mensagem: 'Palavra criada com dica gerada por IA com sucesso.',
      codigoDeStatus: 201,
      data: mPalavra,
    }
  }

  private static dificuldadePorTamanho(str: string): EDificuldade {
    const len = str.trim().length

    if (len < 5) {
      return EDificuldade.FACIL
    } else if (len <= 8) {
      return EDificuldade.MEDIO
    } else {
      return EDificuldade.DIFICIL
    }
  }
}
