import {
  AtualizarJogo,
  AtualizarPartidaFront,
  ErroRespostaApi,
  ESocketEventos,
  FinalizarJogo,
  GerarJogoPorIA,
  GerarJogos,
  RespostaCarregarJogo,
  RespostaConectar,
  RestaurarJogo,
  SolicitarDica,
  SolicitarNovoJogo,
  SucessoOuFalha,
} from 'jogodaforca-shared'
import { socketIo } from './ws.js'
import { Socket } from 'socket.io'
import { ServicoJogo } from '#services/Jogo/jogo'
import { AtualizadorDeJogo, OrquestradorJogo } from '#services/Jogo/index'
import { ServicoPalavra } from '#services/palavra'
import env from '#start/env'

type ExecutarResposta<T> = {
  fn: (param: HandlerParameters<T>) => Promise<void>
  param: HandlerParameters<T>
  evento: ESocketEventos
}

type HandlerParameters<T> = {
  socket: Socket
  data: T
}

export class WsService {
  constructor(
    private socket = socketIo,
    private servicoJogo = new ServicoJogo(),
    private orquestradorJogo = new OrquestradorJogo(),
    private servicoPalavra = new ServicoPalavra()
  ) {}

  public inicializar() {
    if (this.socket.io) {
      this.socket.io.on('connection', (socket: Socket) => {
        this.solicitarConexao(socket)
        this.solicitarNovoJogo(socket)
        this.solicitarAtualizar(socket)
      })
    }
  }
  private async gerenciadorDeErros<T>({ fn, evento, param }: ExecutarResposta<T>) {
    try {
      await fn(param)
    } catch (error) {
      const erro = JSON.stringify(error, null, 2)
      console.log(`[GerenciadorDeErros]${evento}`, erro)
      param.socket.emit(evento, {
        sucesso: false,
        mensagem: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
      })
    }
  }

  private solicitarConexao(socket: Socket) {
    const ia = env.get('OPENAI_API_KEY') ? true : false
    return socket.on(ESocketEventos.CONECTAR, () => {
      const resposta: RespostaConectar = {
        sucesso: true,
        dado: {
          ia,
          message: 'Conexão estabelecida com sucesso',
        },
      }
      socket.emit(ESocketEventos.CONECTAR, resposta)
    })
  }

  private solicitarAtualizar(socket: Socket) {
    socket.on(ESocketEventos.ATUALIZAR_PARTIDA, async (data: AtualizarPartidaFront) => {
      if ('letra' in data) {
        this.gerenciadorDeErros({
          param: { data, socket },
          evento: ESocketEventos.ATUALIZAR_PARTIDA,
          fn: this.emitirJogada.bind(this),
        })
        return
      }
      if (data.type === 'dica') {
        this.gerenciadorDeErros({
          param: { data, socket },
          evento: ESocketEventos.ATUALIZAR_PARTIDA,
          fn: this.emitirDica.bind(this),
        })
        return
      }

      if (data.type === 'restaurar') {
        this.gerenciadorDeErros({
          param: { data, socket },
          evento: ESocketEventos.ATUALIZAR_PARTIDA,
          fn: this.emitirJogoAtualizado.bind(this),
        })
        return
      }

      if (data.type === 'finalizar') {
        this.gerenciadorDeErros({
          param: { data, socket },
          evento: ESocketEventos.ATUALIZAR_PARTIDA,
          fn: this.emitirFinalizarPartida.bind(this),
        })
      }
    })
  }

  private async solicitarNovoJogo(socket: Socket) {
    return socket.on(ESocketEventos.NOVO_JOGO, async (data: GerarJogos) => {
      if ('type' in data && data.type === 'gerar') {
        this.gerenciadorDeErros({
          param: { data, socket },
          evento: ESocketEventos.NOVO_JOGO,
          fn: this.emitirNovoJogoGeradoPorIA.bind(this),
        })
        return
      }
      if ('temaId' in data) {
        await this.gerenciadorDeErros({
          param: { data, socket },
          evento: ESocketEventos.NOVO_JOGO,
          fn: this.emitirNovoJogo.bind(this),
        })
      }
    })
  }

  private gerarRespostaErro(resposta: SucessoOuFalha, socket: Socket, evento: ESocketEventos) {
    if (!('data' in resposta)) {
      const respostaErro: ErroRespostaApi = {
        sucesso: false,
        mensagem: resposta.mensagem,
      }
      socket.emit(evento, respostaErro)
      return true
    }
    return false
  }

  private async emitirJogoAtualizado({ data, socket }: HandlerParameters<RestaurarJogo>) {
    const jogoAtualizado = await this.orquestradorJogo.pegarPorId(data.jogoId)
    const { data: jogo } = jogoAtualizado
    if (jogo) {
      const atualizador = new AtualizadorDeJogo(jogo)

      const resposta: RespostaCarregarJogo = {
        sucesso: true,
        dado: atualizador.jogoEstado,
      }
      socket.emit(ESocketEventos.ATUALIZAR_PARTIDA, resposta)
      return
    }
    this.gerarRespostaErro(jogoAtualizado, socket, ESocketEventos.ATUALIZAR_PARTIDA)
  }

  private async emitirJogada({ data, socket }: HandlerParameters<AtualizarJogo>) {
    const dado = await this.servicoJogo.calcularNovaPontuacao(data)
    if ('data' in dado) {
      if (!dado.data) {
        this.gerarRespostaErro(dado, socket, ESocketEventos.ATUALIZAR_PARTIDA)
        return
      }
      const resposta: RespostaCarregarJogo = {
        sucesso: true,
        dado: dado.data,
      }
      socket.emit(ESocketEventos.ATUALIZAR_PARTIDA, resposta)
      return
    }
    this.gerarRespostaErro(dado, socket, ESocketEventos.ATUALIZAR_PARTIDA)
  }

  private async emitirNovoJogo({ data, socket }: HandlerParameters<SolicitarNovoJogo>) {
    const novoJogo = await this.orquestradorJogo.criar(data)
    if (novoJogo.data) {
      const resposta: RespostaCarregarJogo = {
        sucesso: true,
        dado: novoJogo.data,
      }
      socket.emit(ESocketEventos.NOVO_JOGO, resposta)
      return
    }
    this.gerarRespostaErro(novoJogo, socket, ESocketEventos.NOVO_JOGO)
  }

  private async emitirDica({ data, socket }: HandlerParameters<SolicitarDica>) {
    const resposta = await this.orquestradorJogo.pegarPorId(data.idJogo)
    if (!resposta.data) {
      this.gerarRespostaErro(resposta, socket, ESocketEventos.ATUALIZAR_PARTIDA)
      return
    }
    const atualizador = new AtualizadorDeJogo(resposta.data)

    let dica: { data?: string; mensagem: string; codigoDeStatus: number }

    // Se deve gerar dica por IA e já usou todas as 3 dicas do array
    if (data.geradaPorIa && atualizador.dicasUtilizadas.length >= 3) {
      // Busca a palavra para pegar o valor
      const palavraResult = await this.servicoPalavra.pegarPorId(atualizador.idPalavra)
      if (!palavraResult.data) {
        this.gerarRespostaErro(palavraResult, socket, ESocketEventos.ATUALIZAR_PARTIDA)
        return
      }

      // Verifica se já tem dica gerada por IA na palavra
      if (palavraResult.data.dicaGeradaPorIA) {
        dica = {
          data: palavraResult.data.dicaGeradaPorIA,
          mensagem: 'Dica gerada por IA',
          codigoDeStatus: 200,
        }
      } else {
        // Gera nova dica via OpenAI
        const servicoOpenAI = this.orquestradorJogo.servicoOpenAI
        if (!servicoOpenAI) {
          this.gerarRespostaErro(
            { mensagem: 'Serviço de IA não disponível', codigoDeStatus: 503 },
            socket,
            ESocketEventos.ATUALIZAR_PARTIDA
          )
          return
        }

        const dicaIA = await servicoOpenAI.gerarDica(palavraResult.data.valor)
        if (!dicaIA) {
          this.gerarRespostaErro(
            { mensagem: 'Erro ao gerar dica via IA', codigoDeStatus: 500 },
            socket,
            ESocketEventos.ATUALIZAR_PARTIDA
          )
          return
        }

        // Salva a dica gerada na palavra para uso futuro
        await this.servicoPalavra.atualiza(palavraResult.data.id, {
          dicaGeradaPorIA: dicaIA.dica,
        })

        dica = {
          data: dicaIA.dica,
          mensagem: 'Dica gerada por IA',
          codigoDeStatus: 200,
        }
      }
    } else {
      // Pega dica normal do array
      dica = await this.servicoPalavra.pegarDicaAleatoria(
        atualizador.idPalavra,
        atualizador.dicasUtilizadas
      )
    }

    if (!dica.data) {
      this.gerarRespostaErro(dica, socket, ESocketEventos.ATUALIZAR_PARTIDA)
      return
    }

    atualizador.usarDica(dica.data)
    await this.servicoJogo.persistirJogo(atualizador)

    const dado: RespostaCarregarJogo = {
      sucesso: true,
      dado: atualizador.jogoEstado,
    }

    socket.emit(ESocketEventos.ATUALIZAR_PARTIDA, dado)
  }

  private async emitirFinalizarPartida({ data, socket }: HandlerParameters<FinalizarJogo>) {
    const instancia = await this.orquestradorJogo.pegarPorId(data.idJogo)
    if (!instancia.data) {
      this.gerarRespostaErro(instancia, socket, ESocketEventos.ATUALIZAR_PARTIDA)
      return
    }
    const jogo = new AtualizadorDeJogo(instancia.data)
    jogo.derrota()
    await this.servicoJogo.persistirJogo(jogo)
    socket.emit(ESocketEventos.ATUALIZAR_PARTIDA, {
      sucesso: true,
      dado: {
        type: 'finalizado',
        idJogo: data.idJogo,
      },
    })
  }

  private async emitirNovoJogoGeradoPorIA({ data, socket }: HandlerParameters<GerarJogoPorIA>) {
    const palavras = await this.orquestradorJogo.criarTemaEPalavra(data)
    if ('data' in palavras) {
      const novoJogo = await this.orquestradorJogo.criar({
        idUsuario: data.idUsuario,
        temaId: palavras.data[0].idTema,
      })
      if (novoJogo.data) {
        const resposta: RespostaCarregarJogo = {
          sucesso: true,
          dado: novoJogo.data,
        }
        socket.emit(ESocketEventos.NOVO_JOGO, resposta)
        return
      }
      this.gerarRespostaErro(novoJogo, socket, ESocketEventos.NOVO_JOGO)
      return
    }
    this.gerarRespostaErro(palavras, socket, ESocketEventos.NOVO_JOGO)
  }
}

export const wsService = new WsService()
