import { EDificuldade, RespostaServico } from 'jogodaforca-shared'
import Palavra from '#models/palavra'
import { Dicionario, ServicoPalavra, ServicoTema } from '#services/index'
import { AIServiceFactory } from '#services/integrations/ai_service_factory'

export class ServicoDica {
  constructor(
    private servicoPalavra = new ServicoPalavra(),
    private servicoTema = new ServicoTema(),
    private aiService = AIServiceFactory.getInstance(),
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

    if (!this.aiService?.isAvailable()) {
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
    if (!this.aiService?.isAvailable()) {
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

    const respostaIA = await this.aiService.gerarDica(palavraStr)
    if (!respostaIA) {
      return {
        mensagem: 'Não foi possível gerar dica pela IA.',
        codigoDeStatus: 500,
      }
    }

    const { dica } = respostaIA

    // Buscar informações adicionais da palavra (tema e dificuldade)
    const palavrasGeradas = await this.aiService.gerarPalavras(palavraStr, 1)
    const palavraInfo = palavrasGeradas?.[0]

    const { data: mTema } = await this.servicoTema.criar({
      valor: palavraInfo?.dicas?.[0] ?? 'Geral',
    })

    const { data: mPalavra } = await this.servicoPalavra.criar({
      valor: palavraStr,
      idTema: mTema.id,
      dificuldade: palavraInfo?.dificuldade ?? ServicoDica.dificuldadePorTamanho(palavraStr),
      dicas: palavraInfo?.dicas ?? ['Sem dica disponível'],
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
    const letrasRepetidas = new Set(str.toLowerCase().split('')).size

    if (len < 5 && letrasRepetidas <= 3) {
      return EDificuldade.FACIL
    } else if (len <= 8 && letrasRepetidas <= 5) {
      return EDificuldade.MEDIO
    } else {
      return EDificuldade.DIFICIL
    }
  }
}
