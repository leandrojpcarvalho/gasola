import { EEstadoDeJogo, IJogo, IPalavra, RespostaTentativa, SessaoDeJogo } from 'jogodaforca-shared'
import { calcularPontuacaoMaxima } from '../utils.js'

export class AtualizadorDeJogo {
  public static pegarInstancia(jogo: IJogo, palavra: IPalavra) {
    const sessaoDeJogo: SessaoDeJogo = {
      idJogo: jogo.id,
      idUsuario: jogo.idUsuario,
      palavra: {
        id: palavra.id,
        valor: palavra.valor,
      },
      pontuacaoAtual: calcularPontuacaoMaxima(palavra.dificuldade, palavra.valor.length),
      estado: jogo.resultado,
      acertos: 0,
      dicasUtilizadas: 0,
      tentativasRestantes: 6,
      letrasUsadas: [],
    }
    return new AtualizadorDeJogo(sessaoDeJogo)
  }

  constructor(private _jogo: SessaoDeJogo) {}

  public get jogo(): SessaoDeJogo {
    return this._jogo
  }

  private verificaLetra(letra: string): boolean {
    return this._jogo.letrasUsadas.includes(letra)
  }

  public tentarLetra(letra: string): RespostaTentativa {
    this._jogo.letrasUsadas.push(letra)
    let correta = false
    if (this.verificaLetra(letra)) {
      this._jogo.acertos += 1
      correta = true
    } else {
      this._jogo.pontuacaoAtual -= 10
      this.subtrairTentativa()
    }
    if (this.checarVitoria()) this._jogo.estado = EEstadoDeJogo.VITORIA

    return {
      correta,
      mensagem: correta ? 'Letra correta!' : 'Letra incorreta!',
      pontuacao: this._jogo.pontuacaoAtual,
      estadoAtual: this._jogo.estado,
    }
  }

  private subtrairTentativa(): void {
    this._jogo.tentativasRestantes -= 1
    this._jogo.estado =
      this._jogo.tentativasRestantes === 0 ? EEstadoDeJogo.DERROTA : this._jogo.estado
  }

  private checarVitoria(): boolean {
    return this._jogo.acertos === this._jogo.palavra.valor.length
  }

  public usarDica(): void {
    this._jogo.dicasUtilizadas += 1
  }
}
